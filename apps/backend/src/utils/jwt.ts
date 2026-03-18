import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

export interface TokenPayload {
  userId: string
  professionalId: string
  plan: string
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload as object, config.jwt.secret, { expiresIn: config.jwt.accessExpiry as any })
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload as object, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiry as any })
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.secret) as TokenPayload
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload
}
