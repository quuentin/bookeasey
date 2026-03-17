export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiUrl as string,
    onRequest({ options }) {
      const token = authStore.accessToken
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401 && authStore.refreshToken) {
        try {
          await authStore.refresh()
        } catch {
          authStore.logout()
          navigateTo('/login')
        }
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
