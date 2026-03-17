import { Router, Request, Response } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { prisma } from '../../config/database.js'
import { config } from '../../config/index.js'

const router = Router()

router.get('/', authenticate, async (req: Request, res: Response) => {
  const sub = await prisma.subscription.findUnique({
    where: { professionalId: req.user!.professionalId },
  })
  res.json(sub)
})

router.post('/checkout', authenticate, async (req: Request, res: Response) => {
  if (!config.stripe.secretKey) {
    res.status(503).json({ message: 'Stripe non configuré' })
    return
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(config.stripe.secretKey)

  const pro = await prisma.professional.findUnique({
    where: { id: req.user!.professionalId },
    include: { user: true, subscription: true },
  })

  if (!pro) {
    res.status(404).json({ message: 'Profil introuvable' })
    return
  }

  // Create or retrieve Stripe customer
  let customerId = pro.subscription?.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: pro.user.email,
      metadata: { professionalId: pro.id },
    })
    customerId = customer.id
    await prisma.subscription.update({
      where: { professionalId: pro.id },
      data: { stripeCustomerId: customerId },
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: config.stripe.premiumPriceId, quantity: 1 }],
    success_url: `${config.frontendUrl}/dashboard/settings?upgraded=true`,
    cancel_url: `${config.frontendUrl}/pricing`,
  })

  res.json({ url: session.url })
})

router.post('/portal', authenticate, async (req: Request, res: Response) => {
  if (!config.stripe.secretKey) {
    res.status(503).json({ message: 'Stripe non configuré' })
    return
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(config.stripe.secretKey)

  const sub = await prisma.subscription.findUnique({
    where: { professionalId: req.user!.professionalId },
  })

  if (!sub?.stripeCustomerId) {
    res.status(400).json({ message: 'Pas d\'abonnement Stripe' })
    return
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${config.frontendUrl}/dashboard/settings`,
  })

  res.json({ url: session.url })
})

router.post('/cancel', authenticate, async (req: Request, res: Response) => {
  if (!config.stripe.secretKey) {
    res.status(503).json({ message: 'Stripe non configuré' })
    return
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(config.stripe.secretKey)

  const sub = await prisma.subscription.findUnique({
    where: { professionalId: req.user!.professionalId },
  })

  if (!sub?.stripeSubId) {
    res.status(400).json({ message: 'Pas d\'abonnement actif' })
    return
  }

  await stripe.subscriptions.update(sub.stripeSubId, {
    cancel_at_period_end: true,
  })

  await prisma.subscription.update({
    where: { professionalId: req.user!.professionalId },
    data: { cancelAtPeriodEnd: true },
  })

  res.json({ message: 'Abonnement sera annulé à la fin de la période' })
})

// Stripe webhook
router.post('/webhook', async (req: Request, res: Response) => {
  if (!config.stripe.secretKey || !config.stripe.webhookSecret) {
    res.status(503).json({ message: 'Stripe non configuré' })
    return
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(config.stripe.secretKey)

  const sig = req.headers['stripe-signature'] as string
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret)
  } catch {
    res.status(400).json({ message: 'Signature invalide' })
    return
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      if (session.mode === 'subscription') {
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: session.customer as string },
          data: {
            plan: 'PREMIUM',
            stripeSubId: session.subscription as string,
            status: 'ACTIVE',
          },
        })
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as any
      await prisma.subscription.updateMany({
        where: { stripeSubId: sub.id },
        data: { plan: 'FREE', status: 'CANCELLED' },
      })
      break
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as any
      await prisma.subscription.updateMany({
        where: { stripeCustomerId: invoice.customer as string },
        data: { status: 'PAST_DUE' },
      })
      break
    }
  }

  res.json({ received: true })
})

export default router
