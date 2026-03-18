export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  authStore.initFromStorage()

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Fetch user data if not loaded yet (e.g. after page refresh or back navigation)
  if (!authStore.user) {
    try {
      await authStore.fetchMe()
    } catch {
      authStore.logout()
      return navigateTo('/login')
    }
  }
})
