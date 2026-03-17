import { Router, Request, Response } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { prisma } from '../../config/database.js'

const router = Router()

router.get('/', authenticate, async (req: Request, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { professionalId: req.user!.professionalId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  res.json(notifications)
})

router.get('/unread-count', authenticate, async (req: Request, res: Response) => {
  const count = await prisma.notification.count({
    where: { professionalId: req.user!.professionalId, isRead: false },
  })
  res.json({ count })
})

router.put('/:id/read', authenticate, async (req: Request, res: Response) => {
  await prisma.notification.update({
    where: { id: req.params.id },
    data: { isRead: true },
  })
  res.json({ message: 'Marquée comme lue' })
})

router.put('/read-all', authenticate, async (req: Request, res: Response) => {
  await prisma.notification.updateMany({
    where: { professionalId: req.user!.professionalId, isRead: false },
    data: { isRead: true },
  })
  res.json({ message: 'Toutes marquées comme lues' })
})

export default router
