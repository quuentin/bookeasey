import { prisma } from '../../config/database.js'
import { NotFoundError } from '../../utils/errors.js'

export async function getProfile(professionalId: string) {
  const pro = await prisma.professional.findUnique({
    where: { id: professionalId },
    include: { subscription: true },
  })
  if (!pro) throw new NotFoundError('Profil introuvable')
  return pro
}

export async function updateProfile(professionalId: string, data: {
  businessName?: string
  description?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
}) {
  return prisma.professional.update({
    where: { id: professionalId },
    data,
  })
}

export async function completeOnboarding(professionalId: string, data: {
  weeklySchedule: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[]
  bufferMinutes: number
  services: { name: string; durationMinutes: number; price: number }[]
}) {
  const pro = await prisma.professional.findUnique({
    where: { id: professionalId },
    include: { calendars: true },
  })
  if (!pro) throw new NotFoundError('Profil introuvable')

  const defaultCalendar = pro.calendars.find(c => c.isDefault) || pro.calendars[0]

  await prisma.$transaction(async (tx) => {
    // Set weekly schedule
    for (const day of data.weeklySchedule) {
      await tx.weeklySchedule.upsert({
        where: {
          calendarId_dayOfWeek: {
            calendarId: defaultCalendar.id,
            dayOfWeek: day.dayOfWeek,
          },
        },
        create: {
          calendarId: defaultCalendar.id,
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

    // Create services
    for (const service of data.services) {
      await tx.service.create({
        data: {
          professionalId,
          name: service.name,
          durationMinutes: service.durationMinutes,
          price: service.price,
        },
      })
    }

    // Update buffer and mark onboarding done
    await tx.professional.update({
      where: { id: professionalId },
      data: {
        bufferMinutes: data.bufferMinutes,
        onboardingDone: true,
      },
    })
  })
}
