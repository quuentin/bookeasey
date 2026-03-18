import { config } from '../../config/index.js'

export async function sendSMS(to: string, message: string): Promise<void> {
  if (!config.sms.twilioSid || !config.sms.twilioToken) {
    console.log(`[SMS Mock] To: ${to}, Message: ${message}`)
    return
  }

  try {
    // @ts-ignore - twilio is optional, only loaded when credentials are set
    const { default: twilio } = await import('twilio')
    const client = twilio(config.sms.twilioSid, config.sms.twilioToken)
    await client.messages.create({
      body: message,
      from: config.sms.twilioPhone,
      to: to,
    })
  } catch (err) {
    console.error('[SMS] Failed to send:', err)
  }
}
