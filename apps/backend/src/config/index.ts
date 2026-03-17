import 'dotenv/config'

export const config = {
  port: parseInt(process.env.PORT || '4000'),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  database: {
    url: process.env.DATABASE_URL || 'postgresql://bookeasey:bookeasey_dev@localhost:5432/bookeasey',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    premiumPriceId: process.env.STRIPE_PREMIUM_PRICE_ID || '',
  },

  email: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    from: process.env.EMAIL_FROM || 'BookEasy <noreply@bookeasey.fr>',
  },

  sms: {
    twilioSid: process.env.TWILIO_ACCOUNT_SID || '',
    twilioToken: process.env.TWILIO_AUTH_TOKEN || '',
    twilioPhone: process.env.TWILIO_PHONE_NUMBER || '',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/api/v1/gcal/callback',
  },
}
