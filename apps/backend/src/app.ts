import express from 'express'
import cors from 'cors'
import { config } from './config/index.js'
import { errorHandler } from './middleware/errorHandler.js'

// Routes
import authRoutes from './modules/auth/auth.routes.js'
import professionalRoutes from './modules/professional/professional.routes.js'
import serviceRoutes from './modules/service/service.routes.js'
import calendarRoutes from './modules/calendar/calendar.routes.js'
import appointmentRoutes from './modules/appointment/appointment.routes.js'
import bookingRoutes from './modules/booking/booking.routes.js'
import notificationRoutes from './modules/notification/notification.routes.js'
import subscriptionRoutes from './modules/subscription/subscription.routes.js'
import employeeRoutes from './modules/employee/employee.routes.js'
import statsRoutes from './modules/stats/stats.routes.js'
import formRoutes from './modules/custom-form/form.routes.js'

export function createApp() {
  const app = express()

  // Stripe webhook needs raw body
  app.use('/api/v1/subscription/webhook', express.raw({ type: 'application/json' }))

  // Middleware
  app.use(cors({ origin: config.frontendUrl, credentials: true }))
  app.use(express.json())

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // API routes
  app.use('/api/v1/auth', authRoutes)
  app.use('/api/v1/professional', professionalRoutes)
  app.use('/api/v1/services', serviceRoutes)
  app.use('/api/v1/calendars', calendarRoutes)
  app.use('/api/v1/appointments', appointmentRoutes)
  app.use('/api/v1/booking', bookingRoutes)
  app.use('/api/v1/notifications', notificationRoutes)
  app.use('/api/v1/subscription', subscriptionRoutes)
  app.use('/api/v1/employees', employeeRoutes)
  app.use('/api/v1/stats', statsRoutes)
  app.use('/api/v1/forms', formRoutes)

  // Error handler
  app.use(errorHandler)

  return app
}
