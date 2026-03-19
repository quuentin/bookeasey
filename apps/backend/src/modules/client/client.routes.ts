import { Router, Request, Response } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { listClients, getClient, updateClient } from './client.service.js'

const router = Router()

// GET / - list clients (with ?search= query)
router.get('/', authenticate, async (req: Request, res: Response) => {
  const proId = req.user!.professionalId
  const search = req.query.search as string | undefined
  const clients = await listClients(proId, search)
  res.json(clients)
})

// GET /:id - get client detail with appointments
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  const proId = req.user!.professionalId
  const client = await getClient(proId, req.params.id)
  res.json(client)
})

// PUT /:id - update notes/tags
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  const proId = req.user!.professionalId
  const { notes, tags } = req.body
  const client = await updateClient(proId, req.params.id, { notes, tags })
  res.json(client)
})

export default router
