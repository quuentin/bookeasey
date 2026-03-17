import { Router, Request, Response } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { prisma } from '../../config/database.js'
import { NotFoundError } from '../../utils/errors.js'

const router = Router()

router.get('/', authenticate, authorize('PREMIUM'), async (req: Request, res: Response) => {
  const forms = await prisma.customForm.findMany({
    where: { professionalId: req.user!.professionalId },
    orderBy: { createdAt: 'desc' },
  })
  res.json(forms)
})

router.post('/', authenticate, authorize('PREMIUM'), async (req: Request, res: Response) => {
  const form = await prisma.customForm.create({
    data: {
      professionalId: req.user!.professionalId,
      name: req.body.name,
      fields: req.body.fields,
    },
  })
  res.status(201).json(form)
})

router.get('/:id', authenticate, async (req: Request, res: Response) => {
  const form = await prisma.customForm.findFirst({
    where: { id: req.params.id, professionalId: req.user!.professionalId },
  })
  if (!form) throw new NotFoundError('Formulaire introuvable')
  res.json(form)
})

router.put('/:id', authenticate, authorize('PREMIUM'), async (req: Request, res: Response) => {
  const form = await prisma.customForm.findFirst({
    where: { id: req.params.id, professionalId: req.user!.professionalId },
  })
  if (!form) throw new NotFoundError('Formulaire introuvable')

  const updated = await prisma.customForm.update({
    where: { id: req.params.id },
    data: { name: req.body.name, fields: req.body.fields, isActive: req.body.isActive },
  })
  res.json(updated)
})

router.delete('/:id', authenticate, authorize('PREMIUM'), async (req: Request, res: Response) => {
  await prisma.customForm.delete({ where: { id: req.params.id } })
  res.json({ message: 'Formulaire supprimé' })
})

export default router
