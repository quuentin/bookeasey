import { prisma } from '../../config/database.js'
import { NotFoundError, ConflictError, ValidationError } from '../../utils/errors.js'
import { getAvailableSlots } from '../availability/availability.service.js'
import { hasOverlap } from '../../utils/time.js'

export async function getPublicProfile(slug: string) {
  const pro = await prisma.professional.findUnique({
    where: { slug },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
      subscription: true,
      calendars: {
        include: { employee: true },
      },
    },
  })

  if (!pro) throw new NotFoundError('Page introuvable')

  return {
    businessName: pro.businessName,
    slug: pro.slug,
    sector: pro.sector,
    description: pro.description,
    phone: pro.phone,
    address: pro.address,
    city: pro.city,
    postalCode: pro.postalCode,
    logoUrl: pro.logoUrl,
    coverImageUrl: pro.coverImageUrl,
    services: pro.services.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      durationMinutes: s.durationMinutes,
      price: Number(s.price),
      color: s.color,
      customFormId: s.customFormId,
    })),
    calendars: pro.calendars.map(c => ({
      id: c.id,
      name: c.name,
      employee: c.employee ? { id: c.employee.id, name: c.employee.name } : null,
    })),
    subscription: pro.subscription ? { plan: pro.subscription.plan } : null,
  }
}

export async function getSlots(slug: string, serviceId: string, date: string, calendarId?: string) {
  const pro = await prisma.professional.findUnique({
    where: { slug },
    include: { calendars: true },
  })
  if (!pro) throw new NotFoundError('Page introuvable')

  const calendar = calendarId
    ? pro.calendars.find(c => c.id === calendarId)
    : pro.calendars.find(c => c.isDefault) || pro.calendars[0]

  if (!calendar) throw new NotFoundError('Calendrier introuvable')

  const slots = await getAvailableSlots(calendar.id, serviceId, date)
  return { slots }
}

export async function createBooking(slug: string, data: {
  serviceId: string
  date: string
  time: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientNotes?: string
  calendarId?: string
  formResponses?: any
}) {
  const pro = await prisma.professional.findUnique({
    where: { slug },
    include: { calendars: true, subscription: true },
  })
  if (!pro) throw new NotFoundError('Page introuvable')

  const service = await prisma.service.findFirst({
    where: { id: data.serviceId, professionalId: pro.id, isActive: true },
  })
  if (!service) throw new ValidationError('Service invalide')

  const calendar = data.calendarId
    ? pro.calendars.find(c => c.id === data.calendarId)
    : pro.calendars.find(c => c.isDefault) || pro.calendars[0]

  if (!calendar) throw new NotFoundError('Calendrier introuvable')

  // Compute start/end times
  const [h, m] = data.time.split(':').map(Number)
  const startTime = new Date(data.date + 'T00:00:00')
  startTime.setHours(h, m, 0, 0)

  const endTime = new Date(startTime)
  endTime.setMinutes(endTime.getMinutes() + service.durationMinutes)

  // Race-condition protection: use transaction with conflict check
  const appointment = await prisma.$transaction(async (tx) => {
    // Check for overlapping appointments
    const conflicting = await tx.appointment.findFirst({
      where: {
        calendarId: calendar.id,
        status: 'CONFIRMED',
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
      },
    })

    if (conflicting) {
      throw new ConflictError('Ce créneau vient d\'être réservé. Veuillez en choisir un autre.')
    }

    // Create appointment
    const apt = await tx.appointment.create({
      data: {
        professionalId: pro.id,
        calendarId: calendar.id,
        serviceId: service.id,
        employeeId: calendar.employeeId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientNotes: data.clientNotes,
        startTime,
        endTime,
        formResponses: data.formResponses,
      },
      include: { service: true },
    })

    // Create notification for professional
    await tx.notification.create({
      data: {
        professionalId: pro.id,
        type: 'NEW_APPOINTMENT',
        title: 'Nouveau rendez-vous',
        body: `${data.clientName} a réservé ${service.name} le ${startTime.toLocaleDateString('fr-FR')} à ${data.time}`,
        metadata: {
          appointmentId: apt.id,
          clientName: data.clientName,
          serviceName: service.name,
        },
      },
    })

    return apt
  })

  // TODO: Send confirmation emails (async, outside transaction)

  return {
    id: appointment.id,
    service: service.name,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    clientName: appointment.clientName,
  }
}
