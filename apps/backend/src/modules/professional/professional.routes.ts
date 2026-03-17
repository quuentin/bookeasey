import { Router, Request, Response } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import * as professionalService from './professional.service.js'

const router = Router()

router.get('/profile', authenticate, async (req: Request, res: Response) => {
  const profile = await professionalService.getProfile(req.user!.professionalId)
  res.json(profile)
})

router.put('/profile', authenticate, async (req: Request, res: Response) => {
  const profile = await professionalService.updateProfile(req.user!.professionalId, req.body)
  res.json(profile)
})

router.put('/onboarding', authenticate, async (req: Request, res: Response) => {
  await professionalService.completeOnboarding(req.user!.professionalId, req.body)
  res.json({ message: 'Onboarding terminé' })
})

export default router
