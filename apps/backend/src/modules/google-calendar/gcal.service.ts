import { config } from '../../config/index.js'
import { prisma } from '../../config/database.js'
import { NotFoundError } from '../../utils/errors.js'

const SCOPES = ['https://www.googleapis.com/auth/calendar']

export function generateAuthUrl(professionalId: string): string {
  const params = new URLSearchParams({
    client_id: config.google.clientId,
    redirect_uri: config.google.redirectUri,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state: professionalId,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export async function handleCallback(code: string, professionalId: string): Promise<void> {
  // Exchange code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.google.clientId,
      client_secret: config.google.clientSecret,
      redirect_uri: config.google.redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const tokens = await tokenResponse.json() as {
    access_token: string
    refresh_token: string
    expires_in: number
    error?: string
  }

  if (tokens.error) {
    throw new Error(`Google OAuth error: ${tokens.error}`)
  }

  // Get user info to get email
  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  const userInfo = await userInfoResponse.json() as { email: string }

  const tokenExpiry = new Date()
  tokenExpiry.setSeconds(tokenExpiry.getSeconds() + tokens.expires_in)

  // Upsert the sync record
  await prisma.googleCalendarSync.upsert({
    where: { professionalId },
    create: {
      professionalId,
      googleAccountEmail: userInfo.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiry,
    },
    update: {
      googleAccountEmail: userInfo.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiry,
      isActive: true,
    },
  })
}

async function getValidAccessToken(sync: {
  id: string
  accessToken: string
  refreshToken: string
  tokenExpiry: Date
}): Promise<string> {
  if (sync.tokenExpiry > new Date()) {
    return sync.accessToken
  }

  // Refresh the token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.google.clientId,
      client_secret: config.google.clientSecret,
      refresh_token: sync.refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  const data = await response.json() as {
    access_token: string
    expires_in: number
  }

  const tokenExpiry = new Date()
  tokenExpiry.setSeconds(tokenExpiry.getSeconds() + data.expires_in)

  await prisma.googleCalendarSync.update({
    where: { id: sync.id },
    data: { accessToken: data.access_token, tokenExpiry },
  })

  return data.access_token
}

export async function pushEvent(appointment: {
  id: string
  professionalId: string
  clientName: string
  clientEmail: string
  startTime: Date
  endTime: Date
  service: { name: string }
  googleEventId?: string | null
}): Promise<void> {
  const sync = await prisma.googleCalendarSync.findUnique({
    where: { professionalId: appointment.professionalId },
  })

  if (!sync || !sync.isActive) return

  const accessToken = await getValidAccessToken(sync)

  const event = {
    summary: `${appointment.service.name} — ${appointment.clientName}`,
    start: {
      dateTime: appointment.startTime.toISOString(),
      timeZone: 'Europe/Paris',
    },
    end: {
      dateTime: appointment.endTime.toISOString(),
      timeZone: 'Europe/Paris',
    },
    attendees: [{ email: appointment.clientEmail }],
    description: `Rendez-vous BookEasy\nClient: ${appointment.clientName}\nService: ${appointment.service.name}`,
  }

  let googleEventId = appointment.googleEventId

  if (googleEventId) {
    // Update existing event
    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${sync.calendarId}/events/${googleEventId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )
  } else {
    // Create new event
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${sync.calendarId}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )
    const created = await response.json() as { id: string }
    googleEventId = created.id

    // Store Google event ID on appointment
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { googleEventId },
    })
  }
}

export async function pullEvents(professionalId: string): Promise<{ imported: number }> {
  const sync = await prisma.googleCalendarSync.findUnique({
    where: { professionalId },
  })

  if (!sync || !sync.isActive) {
    throw new NotFoundError('Google Calendar non connecté')
  }

  const accessToken = await getValidAccessToken(sync)

  // Fetch events from now to 30 days ahead
  const timeMin = new Date().toISOString()
  const timeMax = new Date()
  timeMax.setDate(timeMax.getDate() + 30)

  const params = new URLSearchParams({
    timeMin,
    timeMax: timeMax.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
  })

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${sync.calendarId}/events?${params}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )

  const data = await response.json() as {
    items: Array<{
      id: string
      summary?: string
      start: { dateTime?: string; date?: string }
      end: { dateTime?: string; date?: string }
    }>
  }

  // Get the default calendar for this professional
  const calendar = await prisma.calendar.findFirst({
    where: { professionalId, isDefault: true },
  })

  if (!calendar) {
    throw new NotFoundError('Calendrier par défaut introuvable')
  }

  let imported = 0

  for (const event of data.items || []) {
    if (!event.start?.dateTime || !event.end?.dateTime) continue

    const eventDate = new Date(event.start.dateTime)
    const dateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())

    // Create a date override to block this time slot
    try {
      await prisma.dateOverride.upsert({
        where: {
          calendarId_date: {
            calendarId: calendar.id,
            date: dateOnly,
          },
        },
        create: {
          calendarId: calendar.id,
          date: dateOnly,
          isBlocked: true,
          reason: `Google Calendar: ${event.summary || 'Événement'}`,
        },
        update: {
          isBlocked: true,
          reason: `Google Calendar: ${event.summary || 'Événement'}`,
        },
      })
      imported++
    } catch {
      // Skip duplicates or errors
    }
  }

  // Update last sync date
  await prisma.googleCalendarSync.update({
    where: { professionalId },
    data: { lastSyncAt: new Date() },
  })

  return { imported }
}

export async function getStatus(professionalId: string) {
  const sync = await prisma.googleCalendarSync.findUnique({
    where: { professionalId },
  })

  if (!sync) {
    return { connected: false }
  }

  return {
    connected: sync.isActive,
    email: sync.googleAccountEmail,
    lastSyncAt: sync.lastSyncAt,
    calendarId: sync.calendarId,
  }
}

export async function disconnect(professionalId: string): Promise<void> {
  const sync = await prisma.googleCalendarSync.findUnique({
    where: { professionalId },
  })

  if (!sync) {
    throw new NotFoundError('Aucune connexion Google Calendar trouvée')
  }

  await prisma.googleCalendarSync.delete({
    where: { professionalId },
  })
}
