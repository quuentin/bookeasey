import { Router, Request, Response } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { prisma } from '../../config/database.js'

const router = Router()

router.get('/overview', authenticate, async (req: Request, res: Response) => {
  const proId = req.user!.professionalId
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const weekStart = new Date(today)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const [totalAppointments, todayCount, weekCount, totalUpcoming, cancelledCount, uniqueClients, topServiceResult, totalRevenueResult] = await Promise.all([
    prisma.appointment.count({ where: { professionalId: proId } }),
    prisma.appointment.count({
      where: { professionalId: proId, startTime: { gte: today, lt: tomorrow }, status: { in: ['CONFIRMED', 'COMPLETED'] } },
    }),
    prisma.appointment.count({
      where: { professionalId: proId, startTime: { gte: weekStart, lt: weekEnd }, status: { in: ['CONFIRMED', 'COMPLETED'] } },
    }),
    prisma.appointment.count({
      where: { professionalId: proId, startTime: { gte: now }, status: 'CONFIRMED' },
    }),
    prisma.appointment.count({
      where: { professionalId: proId, status: 'CANCELLED' },
    }),
    prisma.appointment.groupBy({
      by: ['clientEmail'],
      where: { professionalId: proId },
    }),
    prisma.appointment.groupBy({
      by: ['serviceId'],
      where: { professionalId: proId, status: { in: ['CONFIRMED', 'COMPLETED'] } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1,
    }),
    prisma.appointment.aggregate({
      where: { professionalId: proId, status: 'COMPLETED', paymentStatus: { in: ['FULLY_PAID', 'DEPOSIT_PAID'] } },
      _sum: { paymentAmount: true },
    }),
  ])

  const cancellationRate = totalAppointments > 0
    ? Math.round((cancelledCount / totalAppointments) * 100)
    : 0

  let topService = '-'
  if (topServiceResult.length > 0) {
    const svc = await prisma.service.findUnique({ where: { id: topServiceResult[0].serviceId } })
    if (svc) topService = svc.name
  }

  res.json({
    totalAppointments,
    todayCount,
    weekCount,
    totalUpcoming,
    cancellationRate,
    uniqueClients: uniqueClients.length,
    topService,
    totalRevenue: Number(totalRevenueResult._sum.paymentAmount || 0),
  })
})

export default router
