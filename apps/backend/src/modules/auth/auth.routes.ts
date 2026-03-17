import { Router, Request, Response } from 'express'
import { validate } from '../../middleware/validate.js'
import { authenticate } from '../../middleware/authenticate.js'
import { registerSchema, loginSchema, refreshSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validation.js'
import * as authService from './auth.service.js'

const router = Router()

router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  const { email, password, businessName, sector } = req.body
  const result = await authService.register(email, password, businessName, sector)
  res.status(201).json(result)
})

router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body
  const result = await authService.login(email, password)
  res.json(result)
})

router.post('/refresh', validate(refreshSchema), async (req: Request, res: Response) => {
  const result = await authService.refresh(req.body.refreshToken)
  res.json(result)
})

router.post('/logout', authenticate, async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken)
  res.json({ message: 'Déconnecté' })
})

router.get('/me', authenticate, async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.userId)
  res.json(user)
})

router.post('/forgot-password', validate(forgotPasswordSchema), async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email)
  res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' })
})

router.post('/reset-password', validate(resetPasswordSchema), async (req: Request, res: Response) => {
  await authService.resetPassword(req.body.token, req.body.password)
  res.json({ message: 'Mot de passe réinitialisé avec succès' })
})

export default router
