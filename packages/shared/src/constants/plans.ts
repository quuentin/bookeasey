export const PLAN_LIMITS = {
  FREE: {
    maxServices: 5,
    maxCalendars: 1,
    smsReminders: false,
    payments: false,
    googleSync: false,
    customForms: false,
    customDomain: false,
    detailedStats: false,
  },
  PREMIUM: {
    maxServices: Infinity,
    maxCalendars: Infinity,
    smsReminders: true,
    payments: true,
    googleSync: true,
    customForms: true,
    customDomain: true,
    detailedStats: true,
  },
} as const

export const PREMIUM_PRICE = 12 // €/month
