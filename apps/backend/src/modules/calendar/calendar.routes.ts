import { Router, Request, Response } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import * as calendarService from './calendar.service.js'

const router = Router()

router.get('/', authenticate, async (req: Request, res: Response) => {
  const calendars = await calendarService.listCalendars(req.user!.professionalId)
  res.json(calendars)
})

router.post('/', authenticate, async (req: Request, res: Response) => {
  const calendar = await calendarService.createCalendar(req.user!.professionalId, req.user!.plan, req.body)
  res.status(201).json(calendar)
})

router.get('/:id/schedule', authenticate, async (req: Request, res: Response) => {
  const schedule = await calendarService.getSchedule(req.user!.professionalId, req.params.id)
  res.json(schedule)
})

router.put('/:id/schedule', authenticate, async (req: Request, res: Response) => {
  // Parse all values to correct types to avoid Prisma type errors
  const schedule = Array.isArray(req.body.schedule) ? req.body.schedule.map((d: any) => ({
    dayOfWeek: Number(d.dayOfWeek),
    startTime: String(d.startTime),
    endTime: String(d.endTime),
    isActive: d.isActive === true || d.isActive === 'true',
  })) : []

  let bufferMinutes: number | undefined = undefined
  if (req.body.bufferMinutes !== undefined && req.body.bufferMinutes !== null && req.body.bufferMinutes !== '') {
    bufferMinutes = Number(req.body.bufferMinutes)
    if (isNaN(bufferMinutes)) bufferMinutes = 0
  }

  await calendarService.updateSchedule(req.user!.professionalId, req.params.id, { schedule, bufferMinutes })
  res.json({ message: 'Horaires mis à jour' })
})

router.get('/:id/overrides', authenticate, async (req: Request, res: Response) => {
  const overrides = await calendarService.listOverrides(req.user!.professionalId, req.params.id)
  res.json(overrides)
})

router.post('/:id/overrides', authenticate, async (req: Request, res: Response) => {
  const override = await calendarService.addOverride(req.user!.professionalId, req.params.id, req.body)
  res.status(201).json(override)
})

router.delete('/:id/overrides/:overrideId', authenticate, async (req: Request, res: Response) => {
  await calendarService.removeOverride(req.user!.professionalId, req.params.id, req.params.overrideId)
  res.json({ message: 'Override supprimé' })
})

export default router
