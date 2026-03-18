import { Router, Request, Response } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { config } from '../../config/index.js'
import * as gcalService from './gcal.service.js'

const router = Router()

// GET /gcal/auth-url - Returns Google OAuth URL
router.get('/auth-url', authenticate, authorize('PREMIUM'), async (req: Request, res: Response) => {
  const url = gcalService.generateAuthUrl(req.user!.professionalId)
  res.json({ url })
})

// GET /gcal/callback - OAuth callback, stores tokens
router.get('/callback', async (req: Request, res: Response) => {
  const { code, state: professionalId } = req.query as { code: string; state: string }

  try {
    await gcalService.handleCallback(code, professionalId)
    // Redirect to frontend integrations page
    res.redirect(`${config.frontendUrl}/dashboard/settings/integrations?connected=true`)
  } catch (err) {
    console.error('[GCal] Callback error:', err)
    res.redirect(`${config.frontendUrl}/dashboard/settings/integrations?error=true`)
  }
})

// POST /gcal/sync - Manual sync trigger
router.post('/sync', authenticate, authorize('PREMIUM'), async (req: Request, res: Response) => {
  const result = await gcalService.pullEvents(req.user!.professionalId)
  res.json(result)
})

// GET /gcal/status - Check sync status
router.get('/status', authenticate, async (req: Request, res: Response) => {
  const status = await gcalService.getStatus(req.user!.professionalId)
  res.json(status)
})

// DELETE /gcal/disconnect - Remove sync
router.delete('/disconnect', authenticate, async (req: Request, res: Response) => {
  await gcalService.disconnect(req.user!.professionalId)
  res.json({ message: 'Google Calendar déconnecté' })
})

export default router
