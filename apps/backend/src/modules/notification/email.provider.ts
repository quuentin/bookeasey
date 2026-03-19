import { config } from '../../config/index.js'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!config.email.resendApiKey) {
    console.log(`[Email Mock] To: ${options.to}, Subject: ${options.subject}`)
    return
  }

  const { Resend } = await import('resend')
  const resend = new Resend(config.email.resendApiKey)

  await resend.emails.send({
    from: config.email.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}

export function buildBookingConfirmationEmail(data: {
  clientName: string
  serviceName: string
  date: string
  time: string
  professionalName: string
}): { subject: string; html: string } {
  return {
    subject: `Confirmation de votre RDV — ${data.professionalName}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #1e293b; font-size: 24px;">Rendez-vous confirmé !</h1>
        <p style="color: #475569;">Bonjour ${data.clientName},</p>
        <p style="color: #475569;">Votre rendez-vous a bien été enregistré :</p>
        <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Service :</strong> ${data.serviceName}</p>
          <p style="margin: 4px 0;"><strong>Date :</strong> ${data.date}</p>
          <p style="margin: 4px 0;"><strong>Heure :</strong> ${data.time}</p>
          <p style="margin: 4px 0;"><strong>Chez :</strong> ${data.professionalName}</p>
        </div>
        <p style="color: #94a3b8; font-size: 14px;">Propulsé par SlotyBook</p>
      </div>
    `,
  }
}

export function buildReminderEmail(data: {
  clientName: string
  serviceName: string
  date: string
  time: string
  professionalName: string
}): { subject: string; html: string } {
  return {
    subject: `Rappel : votre RDV demain — ${data.professionalName}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #1e293b; font-size: 24px;">Rappel de votre rendez-vous</h1>
        <p style="color: #475569;">Bonjour ${data.clientName},</p>
        <p style="color: #475569;">Nous vous rappelons votre rendez-vous de demain :</p>
        <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Service :</strong> ${data.serviceName}</p>
          <p style="margin: 4px 0;"><strong>Date :</strong> ${data.date}</p>
          <p style="margin: 4px 0;"><strong>Heure :</strong> ${data.time}</p>
          <p style="margin: 4px 0;"><strong>Chez :</strong> ${data.professionalName}</p>
        </div>
        <p style="color: #94a3b8; font-size: 14px;">Propulsé par SlotyBook</p>
      </div>
    `,
  }
}
