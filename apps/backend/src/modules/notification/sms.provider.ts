import { config } from '../../config/index.js'

export async function sendSMS(to: string, message: string): Promise<void> {
  if (!config.sms.twilioSid || !config.sms.twilioToken) {
    console.log(`[SMS Mock] To: ${to}, Message: ${message}`)
    return
  }
  // Twilio implementation
  const twilio = await import('twilio')
  const client = twilio.default(config.sms.twilioSid, config.sms.twilioToken)
  await client.messages.create({
    body: message,
    from: config.sms.twilioPhone,
    to: to,
  })
}
