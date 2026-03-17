import { Router, Request, Response } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import * as appointmentService from './appointment.service.js'

const router = Router()

router.get('/', authenticate, async (req: Request, res: Response) => {
  const result = await appointmentService.listAppointments(req.user!.professionalId, {
    status: req.query.status as string,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  })
  res.json(result)
})

router.get('/today', authenticate, async (req: Request, res: Response) => {
  const appointments = await appointmentService.getTodayAppointments(req.user!.professionalId)
  res.json(appointments)
})

router.get('/upcoming', authenticate, async (req: Request, res: Response) => {
  const appointments = await appointmentService.getUpcomingAppointments(req.user!.professionalId)
  res.json(appointments)
})

router.put('/:id/status', authenticate, async (req: Request, res: Response) => {
  const appointment = await appointmentService.updateStatus(
    req.user!.professionalId,
    req.params.id,
    req.body.status,
  )
  res.json(appointment)
})

router.put('/:id/reschedule', authenticate, async (req: Request, res: Response) => {
  const appointment = await appointmentService.reschedule(
    req.user!.professionalId,
    req.params.id,
    req.body.startTime,
  )
  res.json(appointment)
})

export default router
