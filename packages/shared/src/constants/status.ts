export const APPOINTMENT_STATUS = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW',
} as const

export const PAYMENT_STATUS = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  DEPOSIT_PAID: 'DEPOSIT_PAID',
  FULLY_PAID: 'FULLY_PAID',
  REFUNDED: 'REFUNDED',
} as const

export const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: 'Confirmé',
  CANCELLED: 'Annulé',
  COMPLETED: 'Terminé',
  NO_SHOW: 'Absent',
}
