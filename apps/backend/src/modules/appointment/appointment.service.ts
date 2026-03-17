import { prisma } from '../../config/database.js'
import { NotFoundError } from '../../utils/errors.js'

export async function listAppointments(professionalId: string, filters: {
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}) {
  const where: any = { professionalId }

  if (filters.status) {
    where.status = filters.status
  }

  if (filters.startDate || filters.endDate) {
    where.startTime = {}
    if (filters.startDate) where.startTime.gte = new Date(filters.startDate)
    if (filters.endDate) where.startTime.lte = new Date(filters.endDate + 'T23:59:59')
  }

  const page = filters.page || 1
  const limit = filters.limit || 20

  const [data, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: { service: true, employee: true },
      orderBy: { startTime: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ])

  return { data, total, page, limit }
}

export async function getTodayAppointments(professionalId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return prisma.appointment.findMany({
    where: {
      professionalId,
      startTime: { gte: today, lt: tomorrow },
      status: { in: ['CONFIRMED', 'COMPLETED'] },
    },
    include: { service: true, employee: true },
    orderBy: { startTime: 'asc' },
  })
}

export async function getUpcomingAppointments(professionalId: string) {
  const now = new Date()
  const weekLater = new Date(now)
  weekLater.setDate(weekLater.getDate() + 7)

  return prisma.appointment.findMany({
    where: {
      professionalId,
      startTime: { gte: now, lte: weekLater },
      status: 'CONFIRMED',
    },
    include: { service: true, employee: true },
    orderBy: { startTime: 'asc' },
  })
}

export async function updateStatus(professionalId: string, appointmentId: string, status: string) {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, professionalId },
  })
  if (!appointment) throw new NotFoundError('Rendez-vous introuvable')

  const data: any = { status }
  if (status === 'CANCELLED') {
    data.cancelledAt = new Date()
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data,
    include: { service: true },
  })
}

export async function reschedule(professionalId: string, appointmentId: string, newStartTime: string) {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, professionalId },
    include: { service: true },
  })
  if (!appointment) throw new NotFoundError('Rendez-vous introuvable')

  const startTime = new Date(newStartTime)
  const endTime = new Date(startTime)
  endTime.setMinutes(endTime.getMinutes() + appointment.service.durationMinutes)

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { startTime, endTime },
    include: { service: true },
  })
}
