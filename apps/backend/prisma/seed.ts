import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const passwordHash = await bcrypt.hash('password123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'marie@example.com' },
    update: {},
    create: {
      email: 'marie@example.com',
      passwordHash,
      emailVerified: true,
      professional: {
        create: {
          businessName: 'Salon Marie',
          slug: 'salon-marie',
          sector: 'coiffure',
          description: 'Salon de coiffure chaleureux au cœur du 11e. Spécialisé coupes tendances, colorations naturelles et soins capillaires bio. Ambiance zen, café offert.',
          phone: '06 12 34 56 78',
          address: '42 rue de la Roquette',
          city: 'Paris',
          postalCode: '75011',
          onboardingDone: true,
          bufferMinutes: 15,
          calendars: {
            create: {
              name: 'Mon agenda',
              isDefault: true,
              weeklySchedule: {
                createMany: {
                  data: [
                    { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isActive: true },
                    { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isActive: true },
                    { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isActive: true },
                    { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isActive: true },
                    { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isActive: true },
                    { dayOfWeek: 6, startTime: '09:00', endTime: '13:00', isActive: true },
                    { dayOfWeek: 0, startTime: '09:00', endTime: '18:00', isActive: false },
                  ],
                },
              },
            },
          },
          subscription: {
            create: {
              plan: 'FREE',
            },
          },
        },
      },
    },
    include: { professional: { include: { calendars: true } } },
  })

  const proId = user.professional!.id

  // Create services
  await prisma.service.createMany({
    data: [
      { professionalId: proId, name: 'Coupe homme', durationMinutes: 30, price: 25, color: '#6366f1', sortOrder: 0 },
      { professionalId: proId, name: 'Coupe femme', durationMinutes: 45, price: 35, color: '#8b5cf6', sortOrder: 1 },
      { professionalId: proId, name: 'Coloration', durationMinutes: 90, price: 80, color: '#ec4899', sortOrder: 2 },
      { professionalId: proId, name: 'Brushing', durationMinutes: 30, price: 20, color: '#f59e0b', sortOrder: 3 },
      { professionalId: proId, name: 'Soin capillaire', durationMinutes: 60, price: 45, color: '#22c55e', sortOrder: 4 },
    ],
    skipDuplicates: true,
  })

  console.log('Seed completed!')
  console.log(`Demo account: marie@example.com / password123`)
  console.log(`Public page: http://localhost:3000/salon-marie`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
