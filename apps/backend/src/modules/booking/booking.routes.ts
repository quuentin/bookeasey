import { Router, Request, Response } from 'express'
import * as bookingService from './booking.service.js'
import { prisma } from '../../config/database.js'
import { NotFoundError } from '../../utils/errors.js'

const router = Router()

router.get('/:slug', async (req: Request, res: Response) => {
  const profile = await bookingService.getPublicProfile(req.params.slug)
  res.json(profile)
})

router.get('/:slug/slots', async (req: Request, res: Response) => {
  const { serviceId, date, calendarId } = req.query as Record<string, string>
  const result = await bookingService.getSlots(req.params.slug, serviceId, date, calendarId)
  res.json(result)
})

router.get('/:slug/form/:formId', async (req: Request, res: Response) => {
  const form = await prisma.customForm.findUnique({ where: { id: req.params.formId } })
  if (!form || !form.isActive) throw new NotFoundError('Formulaire introuvable')
  res.json({ id: form.id, name: form.name, fields: form.fields })
})

router.post('/:slug/book', async (req: Request, res: Response) => {
  const result = await bookingService.createBooking(req.params.slug, req.body)
  res.status(201).json(result)
})

export default router
