import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  professional?: {
    id: string
    businessName: string
    slug: string
    sector: string
    onboardingDone: boolean
    subscription?: {
      plan: 'FREE' | 'PREMIUM'
    }
  }
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isPremium: (state) => state.user?.professional?.subscription?.plan === 'PREMIUM',
    professional: (state) => state.user?.professional,
    onboardingDone: (state) => state.user?.professional?.onboardingDone ?? false,
  },

  actions: {
    setTokens(access: string, refresh: string) {
      this.accessToken = access
      this.refreshToken = refresh
      if (import.meta.client) {
        localStorage.setItem('accessToken', access)
        localStorage.setItem('refreshToken', refresh)
      }
    },

    async login(email: string, password: string) {
      const { $api } = useNuxtApp()
      const data = await $api<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      this.user = data.user
      this.setTokens(data.accessToken, data.refreshToken)
    },

    async register(email: string, password: string, businessName: string, sector: string) {
      const { $api } = useNuxtApp()
      const data = await $api<{ user: User; accessToken: string; refreshToken: string }>('/auth/register', {
        method: 'POST',
        body: { email, password, businessName, sector },
      })
      this.user = data.user
      this.setTokens(data.accessToken, data.refreshToken)
    },

    async refresh() {
      const config = useRuntimeConfig()
      const data = await $fetch<{ accessToken: string; refreshToken: string }>(`${config.public.apiUrl}/auth/refresh`, {
        method: 'POST',
        body: { refreshToken: this.refreshToken },
      })
      this.setTokens(data.accessToken, data.refreshToken)
    },

    async fetchMe() {
      const { $api } = useNuxtApp()
      this.user = await $api<User>('/auth/me')
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      if (import.meta.client) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    },

    initFromStorage() {
      if (import.meta.client) {
        this.accessToken = localStorage.getItem('accessToken')
        this.refreshToken = localStorage.getItem('refreshToken')
      }
    },
  },
})
