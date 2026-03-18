import { prisma } from '../config/database.js'
import { sendEmail, buildReminderEmail } from '../modules/notification/email.provider.js'
import { sendSMS } from '../modules/notification/sms.provider.js'

export async function processEmailReminders(): Promise<void> {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const dayAfterTomorrow = new Date(tomorrow)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

  const appointments = await prisma.appointment.findMany({
    where: {
      startTime: { gte: tomorrow, lt: dayAfterTomorrow },
      status: 'CONFIRMED',
      emailReminderSent: false,
    },
    include: {
      service: true,
      professional: {
        include: { subscription: true },
      },
    },
  })

  console.log(`[EmailReminder] Found ${appointments.length} appointments for tomorrow`)

  for (const apt of appointments) {
    try {
      const dateStr = apt.startTime.toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long',
      })
      const timeStr = apt.startTime.toLocaleTimeString('fr-FR', {
        hour: '2-digit', minute: '2-digit',
      })

      const { subject, html } = buildReminderEmail({
        clientName: apt.clientName,
        serviceName: apt.service.name,
        date: dateStr,
        time: timeStr,
        professionalName: apt.professional.businessName,
      })

      await sendEmail({ to: apt.clientEmail, subject, html })

      await prisma.appointment.update({
        where: { id: apt.id },
        data: { emailReminderSent: true },
      })

      console.log(`[EmailReminder] Sent to ${apt.clientEmail}`)

      // Send SMS reminder for premium users
      const isPremium = apt.professional.subscription?.plan === 'PREMIUM'
      if (isPremium && apt.clientPhone && !apt.smsReminderSent) {
        try {
          const smsMessage = `Rappel : RDV "${apt.service.name}" demain à ${timeStr} chez ${apt.professional.businessName}. — BookEasy`
          await sendSMS(apt.clientPhone, smsMessage)

          await prisma.appointment.update({
            where: { id: apt.id },
            data: { smsReminderSent: true },
          })

          console.log(`[SMSReminder] Sent to ${apt.clientPhone}`)
        } catch (smsErr) {
          console.error(`[SMSReminder] Failed for ${apt.clientPhone}:`, smsErr)
        }
      }
    } catch (err) {
      console.error(`[EmailReminder] Failed for ${apt.clientEmail}:`, err)
    }
  }
}
