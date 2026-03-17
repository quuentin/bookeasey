import { prisma } from '../../config/database.js'
import { ForbiddenError, NotFoundError } from '../../utils/errors.js'

export async function listCalendars(professionalId: string) {
  return prisma.calendar.findMany({
    where: { professionalId },
    include: { employee: true },
    orderBy: { createdAt: 'asc' },
  })
}

export async function createCalendar(professionalId: string, plan: string, data: { name: string; employeeId?: string }) {
  if (plan !== 'PREMIUM') {
    const count = await prisma.calendar.count({ where: { professionalId } })
    if (count >= 1) {
      throw new ForbiddenError('Le plan gratuit est limité à 1 calendrier. Passez Premium.')
    }
  }

  return prisma.calendar.create({
    data: {
      professionalId,
      name: data.name,
      employeeId: data.employeeId,
    },
  })
}

export async function getSchedule(professionalId: string, calendarId: string) {
  const calendar = await prisma.calendar.findFirst({
    where: { id: calendarId, professionalId },
  })
  if (!calendar) throw new NotFoundError('Calendrier introuvable')

  return prisma.weeklySchedule.findMany({
    where: { calendarId },
    orderBy: { dayOfWeek: 'asc' },
  })
}

export async function updateSchedule(professionalId: string, calendarId: string, data: {
  schedule: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[]
  bufferMinutes?: number
}) {
  const calendar = await prisma.calendar.findFirst({
    where: { id: calendarId, professionalId },
  })
  if (!calendar) throw new NotFoundError('Calendrier introuvable')

  await prisma.$transaction(async (tx) => {
    for (const day of data.schedule) {
      await tx.weeklySchedule.upsert({
        where: {
          calendarId_dayOfWeek: { calendarId, dayOfWeek: day.dayOfWeek },
        },
        create: {
          calendarId,
          dayOfWeek: day.dayOfWeek,
          startTime: day.startTime,
          endTime: day.endTime,
          isActive: day.isActive,
        },
        update: {
          startTime: day.startTime,
          endTime: day.endTime,
          isActive: day.isActive,
        },
      })
    }

    if (data.bufferMinutes !== undefined) {
      await tx.professional.update({
        where: { id: professionalId },
        data: { bufferMinutes: data.bufferMinutes },
      })
    }
  })
}

export async function listOverrides(professionalId: string, calendarId: string) {
  const calendar = await prisma.calendar.findFirst({
    where: { id: calendarId, professionalId },
  })
  if (!calendar) throw new NotFoundError('Calendrier introuvable')

  return prisma.dateOverride.findMany({
    where: { calendarId },
    orderBy: { date: 'asc' },
  })
}

export async function addOverride(professionalId: string, calendarId: string, data: {
  date: string
  isBlocked: boolean
  startTime?: string
  endTime?: string
  reason?: string
}) {
  const calendar = await prisma.calendar.findFirst({
    where: { id: calendarId, professionalId },
  })
  if (!calendar) throw new NotFoundError('Calendrier introuvable')

  return prisma.dateOverride.create({
    data: {
      calendarId,
      date: new Date(data.date),
      isBlocked: data.isBlocked,
      startTime: data.startTime,
      endTime: data.endTime,
      reason: data.reason,
    },
  })
}

export async function removeOverride(professionalId: string, calendarId: string, overrideId: string) {
  const calendar = await prisma.calendar.findFirst({
    where: { id: calendarId, professionalId },
  })
  if (!calendar) throw new NotFoundError('Calendrier introuvable')

  await prisma.dateOverride.delete({ where: { id: overrideId } })
}
