<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const copied = ref(false)

const { data: todayAppointments } = useAsyncData('today', () => $api<any[]>('/appointments/today'))
const { data: stats } = useAsyncData('stats', () => $api<any>('/stats/overview'))

const statCards = computed(() => [
  { label: "Aujourd'hui", value: stats.value?.todayCount ?? 0, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', bg: 'bg-brand-50', iconColor: 'text-brand-500', valueColor: 'text-brand-700' },
  { label: 'Cette semaine', value: stats.value?.weekCount ?? 0, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', bg: 'bg-blue-50', iconColor: 'text-blue-500', valueColor: 'text-blue-700' },
  { label: 'À venir', value: stats.value?.totalUpcoming ?? 0, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'bg-emerald-50', iconColor: 'text-emerald-500', valueColor: 'text-emerald-700' },
  { label: 'Annulations', value: `${stats.value?.cancellationRate ?? 0}%`, icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', bg: 'bg-amber-50', iconColor: 'text-amber-500', valueColor: 'text-amber-700' },
])

function formatTime(d: string) { return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
const statusLabels: Record<string, string> = { CONFIRMED: 'Confirmé', CANCELLED: 'Annulé', COMPLETED: 'Terminé', NO_SHOW: 'Absent' }
const statusVariants: Record<string, string> = { CONFIRMED: 'success', CANCELLED: 'danger', COMPLETED: 'neutral', NO_SHOW: 'warning' }

function copyLink() {
  navigator.clipboard.writeText(`${config.public.appUrl}/${authStore.professional?.slug}`)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome banner -->
    <div class="rounded-2xl p-5 sm:p-6 relative overflow-hidden" style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)">
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 20px 20px;" />
      <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-white mb-1">
            Bonjour{{ authStore.professional?.businessName ? `, ${authStore.professional.businessName}` : '' }} 👋
          </h2>
          <p class="text-sm text-white/60">Voici le résumé de votre activité</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-sm backdrop-blur-sm">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span class="text-white/60">bookeasey.fr/</span>
            <span class="text-white font-medium">{{ authStore.professional?.slug }}</span>
          </div>
          <button
            class="px-3 py-2 rounded-lg text-sm font-medium transition-all"
            :class="copied ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'"
            @click="copyLink"
          >
            {{ copied ? '✓ Copié' : 'Copier' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div v-for="s in statCards" :key="s.label" class="bg-white rounded-xl border border-slate-100 p-4 sm:p-5 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs sm:text-sm text-slate-500">{{ s.label }}</p>
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', s.bg]">
            <svg :class="['w-4 h-4', s.iconColor]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" :d="s.icon" />
            </svg>
          </div>
        </div>
        <p :class="['text-2xl sm:text-3xl font-bold', s.valueColor]">{{ s.value }}</p>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <NuxtLink to="/dashboard/services/new" class="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-xs hover:border-brand-200 hover:shadow-card transition-all group">
        <div class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
          <svg class="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-900">Nouveau service</p>
          <p class="text-xs text-slate-400">Ajouter une prestation</p>
        </div>
      </NuxtLink>
      <NuxtLink to="/dashboard/availability" class="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-xs hover:border-brand-200 hover:shadow-card transition-all group">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
          <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-900">Disponibilités</p>
          <p class="text-xs text-slate-400">Gérer vos horaires</p>
        </div>
      </NuxtLink>
      <NuxtLink to="/dashboard/stats" class="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-xs hover:border-brand-200 hover:shadow-card transition-all group">
        <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
          <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-900">Statistiques</p>
          <p class="text-xs text-slate-400">Voir vos performances</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Today's appointments -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div class="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h3 class="text-base font-semibold text-slate-900">Rendez-vous du jour</h3>
        </div>
        <NuxtLink to="/dashboard/appointments" class="text-xs sm:text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
          Voir tout
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
        </NuxtLink>
      </div>

      <div v-if="todayAppointments?.length" class="divide-y divide-slate-50">
        <div v-for="apt in todayAppointments" :key="apt.id" class="flex items-center justify-between px-5 sm:px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="w-12 h-12 rounded-xl bg-brand-50 flex flex-col items-center justify-center shrink-0">
              <p class="text-sm font-bold text-brand-700 leading-none">{{ formatTime(apt.startTime) }}</p>
              <p class="text-[10px] text-brand-400 mt-0.5">{{ formatTime(apt.endTime) }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-900">{{ apt.clientName }}</p>
              <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: apt.service?.color || '#7c3aed' }" />
                {{ apt.service?.name }}
              </p>
            </div>
          </div>
          <AppBadge :variant="(statusVariants[apt.status] as any)" size="sm">{{ statusLabels[apt.status] }}</AppBadge>
        </div>
      </div>

      <div v-else class="px-6 py-14 text-center">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
        </div>
        <p class="text-sm font-medium text-slate-500 mb-1">Aucun rendez-vous aujourd'hui</p>
        <p class="text-xs text-slate-400">Vos prochains rendez-vous apparaîtront ici</p>
      </div>
    </div>
  </div>
</template>
