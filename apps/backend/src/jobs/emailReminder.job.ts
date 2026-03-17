import { prisma } from '../config/database.js'
import { sendEmail, buildReminderEmail } from '../modules/notification/email.provider.js'

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
      professional: true,
    },
  })

  console.log(`[EmailReminder] Found ${appointments.length} appointments for tomorrow`)

  for (const apt of appointments) {
    try {
      const { subject, html } = buildReminderEmail({
        clientName: apt.clientName,
        serviceName: apt.service.name,
        date: apt.startTime.toLocaleDateString('fr-FR', {
          weekday: 'long', day: 'numeric', month: 'long',
        }),
        time: apt.startTime.toLocaleTimeString('fr-FR', {
          hour: '2-digit', minute: '2-digit',
        }),
        professionalName: apt.professional.businessName,
      })

      await sendEmail({ to: apt.clientEmail, subject, html })

      await prisma.appointment.update({
        where: { id: apt.id },
        data: { emailReminderSent: true },
      })

      console.log(`[EmailReminder] Sent to ${apt.clientEmail}`)
    } catch (err) {
      console.error(`[EmailReminder] Failed for ${apt.clientEmail}:`, err)
    }
  }
}
