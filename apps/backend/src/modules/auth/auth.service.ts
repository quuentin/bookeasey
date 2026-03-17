import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '../../config/database.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js'
import { generateUniqueSlug } from '../../utils/slug.js'
import { ConflictError, UnauthorizedError, NotFoundError } from '../../utils/errors.js'

export async function register(email: string, password: string, businessName: string, sector: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new ConflictError('Un compte existe déjà avec cet email')

  const passwordHash = await bcrypt.hash(password, 12)
  const slug = await generateUniqueSlug(businessName)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      professional: {
        create: {
          businessName,
          slug,
          sector,
          calendars: {
            create: {
              name: 'Mon agenda',
              isDefault: true,
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
    include: {
      professional: {
        include: { subscription: true },
      },
    },
  })

  const tokens = await generateTokens(user)
  return { user: formatUser(user), ...tokens }
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      professional: {
        include: { subscription: true },
      },
    },
  })
  if (!user) throw new UnauthorizedError('Email ou mot de passe incorrect')

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new UnauthorizedError('Email ou mot de passe incorrect')

  const tokens = await generateTokens(user)
  return { user: formatUser(user), ...tokens }
}

export async function refresh(refreshToken: string) {
  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
  if (!stored || stored.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token invalide ou expiré')
  }

  // Delete old token (rotation)
  await prisma.refreshToken.delete({ where: { id: stored.id } })

  const user = await prisma.user.findUnique({
    where: { id: stored.userId },
    include: { professional: { include: { subscription: true } } },
  })
  if (!user) throw new UnauthorizedError('Utilisateur introuvable')

  return generateTokens(user)
}

export async function logout(refreshToken: string) {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      professional: {
        include: { subscription: true },
      },
    },
  })
  if (!user) throw new NotFoundError('Utilisateur introuvable')
  return formatUser(user)
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return // Don't reveal if email exists

  const resetToken = crypto.randomBytes(32).toString('hex')
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour
    },
  })

  // TODO: Send reset email
  console.log(`Reset token for ${email}: ${resetToken}`)
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  })
  if (!user) throw new UnauthorizedError('Token invalide ou expiré')

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    },
  })

  // Invalidate all refresh tokens
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } })
}

// ─── Helpers ─────────────────────────────────────────────

async function generateTokens(user: any) {
  const payload = {
    userId: user.id,
    professionalId: user.professional?.id || '',
    plan: user.professional?.subscription?.plan || 'FREE',
  }

  const accessToken = signAccessToken(payload)
  const refreshTokenStr = signRefreshToken(payload)

  await prisma.refreshToken.create({
    data: {
      token: refreshTokenStr,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  })

  return { accessToken, refreshToken: refreshTokenStr }
}

function formatUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    professional: user.professional ? {
      id: user.professional.id,
      businessName: user.professional.businessName,
      slug: user.professional.slug,
      sector: user.professional.sector,
      onboardingDone: user.professional.onboardingDone,
      subscription: user.professional.subscription ? {
        plan: user.professional.subscription.plan,
      } : undefined,
    } : undefined,
  }
}
