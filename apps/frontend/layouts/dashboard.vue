<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const navItems = [
  { label: 'Tableau de bord', icon: 'home', to: '/dashboard' },
  { label: 'Calendrier', icon: 'calendar', to: '/dashboard/calendar' },
  { label: 'Rendez-vous', icon: 'clock', to: '/dashboard/appointments' },
  { label: 'Services', icon: 'briefcase', to: '/dashboard/services' },
  { label: 'Disponibilités', icon: 'settings', to: '/dashboard/availability' },
  { label: 'Employés', icon: 'users', to: '/dashboard/employees', premium: true },
  { label: 'Formulaires', icon: 'file', to: '/dashboard/forms', premium: true },
  { label: 'Statistiques', icon: 'chart', to: '/dashboard/stats' },
]

const iconPaths: Record<string, string> = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
  file: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
}

const userMenuOpen = ref(false)

// Close menus on route change
watch(() => route.path, () => { sidebarOpen.value = false; userMenuOpen.value = false })

// Close user menu on click outside
if (import.meta.client) {
  document.addEventListener('click', (e) => {
    if (userMenuOpen.value && !(e.target as Element)?.closest?.('.relative')) {
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
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/20 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 z-40 h-full w-60 bg-white border-r border-slate-100 transition-transform duration-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <div class="flex items-center gap-2.5 px-5 h-14 border-b border-slate-100">
        <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
          <span class="text-white font-bold text-sm">B</span>
        </div>
        <span class="font-bold text-slate-900">BookEasy</span>
      </div>

      <nav class="mt-3 px-3 space-y-0.5">
        <NuxtLink
          v-for="item in navItems" :key="item.to" :to="item.to"
          :class="['flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            route.path === item.to
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50']"
        >
          <svg class="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
            <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[item.icon]" />
          </svg>
          <span>{{ item.label }}</span>
          <span v-if="item.premium" class="ml-auto text-[10px] font-semibold text-brand-500 bg-brand-50 px-1.5 py-0.5 rounded">PRO</span>
        </NuxtLink>
      </nav>

      <div class="absolute bottom-3 left-0 right-0 px-3 space-y-1">
        <!-- Upgrade CTA -->
        <NuxtLink v-if="!authStore.isPremium" to="/dashboard/upgrade"
          class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors mb-1">
          <svg class="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
          <span>Passer Premium</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/settings"
          :class="['flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            route.path === '/dashboard/settings' ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50']"
        >
          <svg class="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
            <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths.settings" />
          </svg>
          <span>Paramètres</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/settings/integrations"
          :class="['flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            route.path === '/dashboard/settings/integrations' ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50']"
        >
          <svg class="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span>Intégrations</span>
        </NuxtLink>
      </div>
    </aside>

    <!-- Main -->
    <main class="lg:ml-60 transition-all duration-200">
      <header class="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button class="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 transition-colors lg:hidden" @click="sidebarOpen = true">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-base sm:text-heading-3 font-semibold text-slate-900">
            {{ navItems.find(i => i.to === route.path)?.label || 'Dashboard' }}
          </h1>
        </div>
        <div class="relative">
          <button class="flex items-center gap-2 p-1 pr-2.5 rounded-lg hover:bg-slate-50 transition-colors" @click="userMenuOpen = !userMenuOpen">
            <div class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
              <span class="text-brand-700 font-semibold text-sm">{{ authStore.user?.email?.charAt(0).toUpperCase() || 'U' }}</span>
            </div>
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <!-- User dropdown -->
          <div v-if="userMenuOpen" class="absolute right-0 mt-1 w-56 bg-white rounded-xl border border-slate-100 shadow-elevated py-1.5 z-50">
            <div class="px-3 py-2 border-b border-slate-100 mb-1">
              <p class="text-sm font-medium text-slate-900 truncate">{{ authStore.professional?.businessName }}</p>
              <p class="text-xs text-slate-400 truncate">{{ authStore.user?.email }}</p>
            </div>
            <NuxtLink to="/dashboard/settings" class="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors" @click="userMenuOpen = false">
              <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths.settings" /></svg>
              Paramètres
            </NuxtLink>
            <NuxtLink v-if="!authStore.isPremium" to="/dashboard/upgrade" class="flex items-center gap-2.5 px-3 py-2 text-sm text-brand-600 hover:bg-brand-50 transition-colors" @click="userMenuOpen = false">
              <svg class="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
              Passer Premium
            </NuxtLink>
            <div class="border-t border-slate-100 mt-1 pt-1">
              <button class="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left" @click="handleLogout">
                <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </header>
      <div class="p-4 sm:p-6 lg:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>
