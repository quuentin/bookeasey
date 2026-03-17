import { prisma } from '../config/database.js'

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function generateUniqueSlug(businessName: string): Promise<string> {
  let slug = slugify(businessName)
  let existing = await prisma.professional.findUnique({ where: { slug } })

  if (!existing) return slug

  let counter = 2
  while (existing) {
    const candidate = `${slug}-${counter}`
    existing = await prisma.professional.findUnique({ where: { slug: candidate } })
    if (!existing) return candidate
    counter++
  }

  return slug
}
