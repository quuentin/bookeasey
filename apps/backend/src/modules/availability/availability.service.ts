import { prisma } from '../../config/database.js'
import { generateTimeSlots, hasOverlap } from '../../utils/time.js'

export async function getAvailableSlots(
  calendarId: string,
  serviceId: string,
  date: string,
): Promise<string[]> {
  const dateObj = new Date(date)
  const dayOfWeek = dateObj.getDay()

  // 1. Get the service for duration
  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service || !service.isActive) return []

  // 2. Get the calendar's professional for buffer
  const calendar = await prisma.calendar.findUnique({
    where: { id: calendarId },
    include: { professional: true },
  })
  if (!calendar) return []

  const bufferMinutes = calendar.professional.bufferMinutes

  // 3. Check for date override
  const override = await prisma.dateOverride.findFirst({
    where: {
      calendarId,
      date: dateObj,
    },
  })

  if (override?.isBlocked) return []

  // 4. Get weekly schedule for this day
  const weeklySchedule = await prisma.weeklySchedule.findUnique({
    where: {
      calendarId_dayOfWeek: { calendarId, dayOfWeek },
    },
  })

  if (!weeklySchedule?.isActive && !override) return []

  // Determine working hours (override takes precedence)
  const startTime = override?.startTime || weeklySchedule?.startTime
  const endTime = override?.endTime || weeklySchedule?.endTime

  if (!startTime || !endTime) return []

  // 5. Generate all possible slots
  const allSlots = generateTimeSlots(
    startTime,
    endTime,
    service.durationMinutes,
    bufferMinutes,
  )

  // 6. Get existing appointments for this date + calendar
  const dayStart = new Date(date + 'T00:00:00')
  const dayEnd = new Date(date + 'T23:59:59')

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      calendarId,
      status: { in: ['CONFIRMED'] },
      startTime: { gte: dayStart },
      endTime: { lte: dayEnd },
    },
  })

  // 7. Filter out slots that overlap with existing appointments
  const availableSlots = allSlots.filter(slotTime => {
    const [h, m] = slotTime.split(':').map(Number)
    const slotStart = new Date(date + 'T00:00:00')
    slotStart.setHours(h, m, 0, 0)

    const slotEnd = new Date(slotStart)
    slotEnd.setMinutes(slotEnd.getMinutes() + service.durationMinutes)

    return !existingAppointments.some(apt =>
      hasOverlap(slotStart, slotEnd, new Date(apt.startTime), new Date(apt.endTime))
    )
  })

  return availableSlots
}
