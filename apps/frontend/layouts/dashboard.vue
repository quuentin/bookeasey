<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)
const userMenuOpen = ref(false)

const mainNav = [
  { label: 'Tableau de bord', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', to: '/dashboard' },
  { label: 'Calendrier', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', to: '/dashboard/calendar' },
  { label: 'Rendez-vous', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', to: '/dashboard/appointments' },
  { label: 'Services', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', to: '/dashboard/services' },
  { label: 'Disponibilités', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', to: '/dashboard/availability' },
  { label: 'Statistiques', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z', to: '/dashboard/stats' },
]

const premiumNav = [
  { label: 'Google Calendar', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', to: '/dashboard/settings/integrations', premium: true },
  { label: 'Employés', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', to: '/dashboard/employees', premium: true },
  { label: 'Formulaires', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', to: '/dashboard/forms', premium: true },
]

const settingsIcon = 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z'

function isActive(to: string) {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to)
}

// Close menus on route change
watch(() => route.path, () => { sidebarOpen.value = false; userMenuOpen.value = false })

if (import.meta.client) {
  document.addEventListener('click', (e) => {
    if (userMenuOpen.value && !(e.target as Element)?.closest?.('.user-menu-container')) {
      userMenuOpen.value = false
    }
  })
}

function handleLogout() {
  authStore.logout()
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-black/20 lg:hidden" @click="sidebarOpen = false" />

    <!-- Sidebar -->
    <aside :class="['fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-slate-100 transition-transform duration-200 flex flex-col', sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
      <!-- Logo -->
      <div class="flex items-center gap-2.5 px-5 h-14 border-b border-slate-100 shrink-0">
        <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
          <span class="text-white font-bold text-sm">B</span>
        </div>
        <span class="font-bold text-slate-900">BookEasy</span>
        <AppBadge v-if="authStore.isPremium" variant="brand" size="sm" class="ml-auto">PRO</AppBadge>
      </div>

      <!-- Main nav -->
      <nav class="flex-1 overflow-y-auto py-3 px-3">
        <p class="px-3 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Principal</p>
        <div class="space-y-0.5">
          <NuxtLink v-for="item in mainNav" :key="item.to" :to="item.to"
            :class="['flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all',
              isActive(item.to) ? 'bg-brand-50 text-brand-700 shadow-xs shadow-brand-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50']">
            <svg class="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" /></svg>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>

        <!-- Premium features -->
        <div class="mt-5">
          <p class="px-3 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Premium</p>
          <div class="space-y-0.5">
            <NuxtLink v-for="item in premiumNav" :key="item.to" :to="item.to"
              :class="['flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all',
                isActive(item.to) ? 'bg-brand-50 text-brand-700 shadow-xs shadow-brand-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50']">
              <svg class="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" /></svg>
              <span>{{ item.label }}</span>
              <span v-if="!authStore.isPremium" class="ml-auto">
                <svg class="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- Bottom -->
      <div class="shrink-0 p-3 border-t border-slate-100 space-y-1">
        <!-- Upgrade CTA -->
        <NuxtLink v-if="!authStore.isPremium" to="/dashboard/upgrade"
          class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white mb-2 transition-all hover:opacity-90"
          style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)">
          <svg class="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
          Passer Premium
        </NuxtLink>

        <NuxtLink to="/dashboard/settings"
          :class="['flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors',
            isActive('/dashboard/settings') ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50']">
          <svg class="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" :d="settingsIcon" /></svg>
          Paramètres
        </NuxtLink>
      </div>
    </aside>

    <!-- Main -->
    <main class="lg:ml-64 min-h-screen transition-all duration-200">
      <!-- Header -->
      <header class="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button class="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 transition-colors lg:hidden" @click="sidebarOpen = true">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
          <h1 class="text-sm sm:text-base font-semibold text-slate-900">
            {{ [...mainNav, ...premiumNav].find(i => isActive(i.to))?.label || 'Dashboard' }}
          </h1>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Plan badge -->
          <span v-if="authStore.isPremium" class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-50 text-brand-600 border border-brand-100">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
            Premium
          </span>

          <!-- User menu -->
          <div class="relative user-menu-container">
            <button class="flex items-center gap-2 py-1 pl-1 pr-2 rounded-lg hover:bg-slate-50 transition-colors" @click="userMenuOpen = !userMenuOpen">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <span class="text-white font-semibold text-xs">{{ authStore.user?.email?.charAt(0).toUpperCase() || 'U' }}</span>
              </div>
              <div class="hidden sm:block text-left">
                <p class="text-xs font-medium text-slate-900 leading-none">{{ authStore.professional?.businessName }}</p>
                <p class="text-[10px] text-slate-400 leading-none mt-0.5">{{ authStore.user?.email }}</p>
              </div>
              <svg class="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>

            <!-- Dropdown -->
            <Transition name="dropdown">
              <div v-if="userMenuOpen" class="absolute right-0 mt-1.5 w-60 bg-white rounded-xl border border-slate-100 shadow-elevated py-1 z-50">
                <div class="px-3 py-2.5 border-b border-slate-100">
                  <p class="text-sm font-semibold text-slate-900 truncate">{{ authStore.professional?.businessName }}</p>
                  <p class="text-xs text-slate-400 truncate mt-0.5">{{ authStore.user?.email }}</p>
                  <div class="mt-2">
                    <AppBadge :variant="authStore.isPremium ? 'brand' : 'neutral'" size="sm">{{ authStore.isPremium ? 'Premium' : 'Gratuit' }}</AppBadge>
                  </div>
                </div>
                <div class="py-1">
                  <NuxtLink to="/dashboard/settings" class="flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors" @click="userMenuOpen = false">
                    <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" :d="settingsIcon" /></svg>
                    Paramètres
                  </NuxtLink>
                  <NuxtLink to="/dashboard/settings/integrations" class="flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors" @click="userMenuOpen = false">
                    <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    Intégrations
                  </NuxtLink>
                  <NuxtLink v-if="!authStore.isPremium" to="/dashboard/upgrade" class="flex items-center gap-2.5 px-3 py-2 text-[13px] text-brand-600 hover:bg-brand-50 transition-colors" @click="userMenuOpen = false">
                    <svg class="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    Passer Premium
                  </NuxtLink>
                </div>
                <div class="border-t border-slate-100 py-1">
                  <button class="flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors w-full text-left" @click="handleLogout">
                    <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                    Se déconnecter
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="p-4 sm:p-6 lg:p-8 w-full min-w-0">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.dropdown-enter-active { transition: all 0.15s ease-out; }
.dropdown-leave-active { transition: all 0.1s ease-in; }
.dropdown-enter-from { opacity: 0; transform: translateY(-4px) scale(0.97); }
.dropdown-leave-to { opacity: 0; transform: translateY(-4px) scale(0.97); }
</style>
