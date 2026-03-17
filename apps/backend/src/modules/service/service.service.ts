import { prisma } from '../../config/database.js'
import { ForbiddenError, NotFoundError } from '../../utils/errors.js'

export async function listServices(professionalId: string) {
  return prisma.service.findMany({
    where: { professionalId, isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function createService(professionalId: string, plan: string, data: {
  name: string
  description?: string
  durationMinutes: number
  price: number
  color?: string
}) {
  // Check limit for free plan
  if (plan !== 'PREMIUM') {
    const count = await prisma.service.count({
      where: { professionalId, isActive: true },
    })
    if (count >= 5) {
      throw new ForbiddenError('Le plan gratuit est limité à 5 services. Passez Premium pour en ajouter davantage.')
    }
  }

  return prisma.service.create({
    data: {
      professionalId,
      ...data,
    },
  })
}

export async function getService(professionalId: string, serviceId: string) {
  const service = await prisma.service.findFirst({
    where: { id: serviceId, professionalId },
  })
  if (!service) throw new NotFoundError('Service introuvable')
  return service
}

export async function updateService(professionalId: string, serviceId: string, data: {
  name?: string
  description?: string
  durationMinutes?: number
  price?: number
  color?: string
}) {
  const service = await prisma.service.findFirst({
    where: { id: serviceId, professionalId },
  })
  if (!service) throw new NotFoundError('Service introuvable')

  return prisma.service.update({
    where: { id: serviceId },
    data,
  })
}

export async function deleteService(professionalId: string, serviceId: string) {
  const service = await prisma.service.findFirst({
    where: { id: serviceId, professionalId },
  })
  if (!service) throw new NotFoundError('Service introuvable')

  return prisma.service.update({
    where: { id: serviceId },
    data: { isActive: false },
  })
}

export async function reorderServices(professionalId: string, items: { id: string; sortOrder: number }[]) {
  await prisma.$transaction(
    items.map(item =>
      prisma.service.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  )
}
