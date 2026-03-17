import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '../utils/errors.js'

export function authorize(requiredPlan: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenError('Authentication required')
    }

    if (requiredPlan === 'PREMIUM' && req.user.plan !== 'PREMIUM') {
      throw new ForbiddenError('This feature requires a Premium subscription')
    }

    next()
  }
}
