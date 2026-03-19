import { prisma } from '../../config/database.js'
import { NotFoundError } from '../../utils/errors.js'

export async function listClients(professionalId: string, search?: string) {
  const where: any = { professionalId }

  if (search && search.trim()) {
    const term = search.trim()
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { email: { contains: term, mode: 'insensitive' } },
    ]
  }

  const clients = await prisma.client.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
  })

  return clients.map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    notes: c.notes,
    tags: c.tags,
    totalVisits: c.totalVisits,
    totalSpent: Number(c.totalSpent),
    lastVisitAt: c.lastVisitAt,
    createdAt: c.createdAt,
  }))
}

export async function getClient(professionalId: string, clientId: string) {
  const client = await prisma.client.findFirst({
    where: { id: clientId, professionalId },
  })

  if (!client) throw new NotFoundError('Client introuvable')

  // Get appointment history for this client
  const appointments = await prisma.appointment.findMany({
    where: {
      professionalId,
      clientEmail: client.email,
    },
    include: {
      service: { select: { name: true, color: true } },
    },
    orderBy: { startTime: 'desc' },
  })

  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    notes: client.notes,
    tags: client.tags,
    totalVisits: client.totalVisits,
    totalSpent: Number(client.totalSpent),
    lastVisitAt: client.lastVisitAt,
    createdAt: client.createdAt,
    appointments: appointments.map(a => ({
      id: a.id,
      serviceName: a.service.name,
      serviceColor: a.service.color,
      startTime: a.startTime,
      endTime: a.endTime,
      status: a.status,
      paymentStatus: a.paymentStatus,
      paymentAmount: a.paymentAmount ? Number(a.paymentAmount) : null,
    })),
  }
}

export async function updateClient(
  professionalId: string,
  clientId: string,
  data: { notes?: string; tags?: string[] },
) {
  const client = await prisma.client.findFirst({
    where: { id: clientId, professionalId },
  })

  if (!client) throw new NotFoundError('Client introuvable')

  const updated = await prisma.client.update({
    where: { id: clientId },
    data: {
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.tags !== undefined && { tags: data.tags }),
    },
  })

  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    phone: updated.phone,
    notes: updated.notes,
    tags: updated.tags,
    totalVisits: updated.totalVisits,
    totalSpent: Number(updated.totalSpent),
    lastVisitAt: updated.lastVisitAt,
  }
}

export async function getOrCreateClient(
  professionalId: string,
  name: string,
  email: string,
  phone?: string,
  servicePrice?: number,
) {
  const existing = await prisma.client.findUnique({
    where: {
      professionalId_email: { professionalId, email },
    },
  })

  if (existing) {
    // Update: increment visits, update last visit, add to total spent
    const updated = await prisma.client.update({
      where: { id: existing.id },
      data: {
        name, // update name in case it changed
        phone: phone || existing.phone,
        totalVisits: { increment: 1 },
        lastVisitAt: new Date(),
        ...(servicePrice !== undefined && servicePrice > 0 && {
          totalSpent: { increment: servicePrice },
        }),
      },
    })
    return updated
  }

  // Create new client
  const client = await prisma.client.create({
    data: {
      professionalId,
      name,
      email,
      phone,
      totalVisits: 1,
      lastVisitAt: new Date(),
      totalSpent: servicePrice || 0,
    },
  })

  return client
}
