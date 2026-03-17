import { Router, Request, Response } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import * as serviceService from './service.service.js'

const router = Router()

router.get('/', authenticate, async (req: Request, res: Response) => {
  const services = await serviceService.listServices(req.user!.professionalId)
  res.json(services)
})

router.post('/', authenticate, async (req: Request, res: Response) => {
  const service = await serviceService.createService(req.user!.professionalId, req.user!.plan, req.body)
  res.status(201).json(service)
})

router.get('/:id', authenticate, async (req: Request, res: Response) => {
  const service = await serviceService.getService(req.user!.professionalId, req.params.id)
  res.json(service)
})

router.put('/:id', authenticate, async (req: Request, res: Response) => {
  const service = await serviceService.updateService(req.user!.professionalId, req.params.id, req.body)
  res.json(service)
})

router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  await serviceService.deleteService(req.user!.professionalId, req.params.id)
  res.json({ message: 'Service supprimé' })
})

router.put('/reorder', authenticate, async (req: Request, res: Response) => {
  await serviceService.reorderServices(req.user!.professionalId, req.body.items)
  res.json({ message: 'Ordre mis à jour' })
})

export default router
