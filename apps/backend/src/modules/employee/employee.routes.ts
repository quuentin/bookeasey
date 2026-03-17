import { Router, Request, Response } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { prisma } from '../../config/database.js'
import { NotFoundError } from '../../utils/errors.js'

const router = Router()

router.get('/', authenticate, authorize('PREMIUM'), async (req: Request, res: Response) => {
  const employees = await prisma.employee.findMany({
    where: { professionalId: req.user!.professionalId, isActive: true },
    include: { calendar: true },
  })
  res.json(employees)
})

router.post('/', authenticate, authorize('PREMIUM'), async (req: Request, res: Response) => {
  const { name, email } = req.body
  const employee = await prisma.employee.create({
    data: {
      professionalId: req.user!.professionalId,
      name,
      email,
      calendar: {
        create: {
          professionalId: req.user!.professionalId,
          name: `Agenda de ${name}`,
        },
      },
    },
    include: { calendar: true },
  })
  res.status(201).json(employee)
})

router.get('/:id', authenticate, authorize('PREMIUM'), async (req: Request, res: Response) => {
  const employee = await prisma.employee.findFirst({
    where: { id: req.params.id, professionalId: req.user!.professionalId },
    include: { calendar: true },
  })
  if (!employee) throw new NotFoundError('Employé introuvable')
  res.json(employee)
})

router.put('/:id', authenticate, authorize('PREMIUM'), async (req: Request, res: Response) => {
  const employee = await prisma.employee.findFirst({
    where: { id: req.params.id, professionalId: req.user!.professionalId },
  })
  if (!employee) throw new NotFoundError('Employé introuvable')

  const updated = await prisma.employee.update({
    where: { id: req.params.id },
    data: req.body,
  })
  res.json(updated)
})

router.delete('/:id', authenticate, authorize('PREMIUM'), async (req: Request, res: Response) => {
  const employee = await prisma.employee.findFirst({
    where: { id: req.params.id, professionalId: req.user!.professionalId },
  })
  if (!employee) throw new NotFoundError('Employé introuvable')

  await prisma.employee.update({
    where: { id: req.params.id },
    data: { isActive: false },
  })
  res.json({ message: 'Employé désactivé' })
})

export default router
