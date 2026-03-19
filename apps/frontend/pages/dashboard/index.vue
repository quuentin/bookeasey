<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const copied = ref(false)

const { data: todayAppointments } = useAsyncData('today', () => $api<any[]>('/appointments/today'))
const { data: upcomingAppointments } = useAsyncData('upcoming', () => $api<any[]>('/appointments/upcoming'))
const { data: stats } = useAsyncData('stats', () => $api<any>('/stats/overview'))

const statCards = computed(() => [
  { label: "Aujourd'hui", value: stats.value?.todayCount ?? 0, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', bg: 'bg-brand-50 dark:bg-brand-500/10', iconBg: 'bg-brand-100 dark:bg-brand-500/20', iconColor: 'text-brand-600', valueColor: 'text-brand-700' },
  { label: 'Cette semaine', value: stats.value?.weekCount ?? 0, icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z', bg: 'bg-blue-50 dark:bg-blue-500/10', iconBg: 'bg-blue-100 dark:bg-blue-500/20', iconColor: 'text-blue-600', valueColor: 'text-blue-700' },
  { label: 'Total à venir', value: stats.value?.totalUpcoming ?? 0, icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'bg-emerald-50 dark:bg-emerald-500/10', iconBg: 'bg-emerald-100 dark:bg-emerald-500/20', iconColor: 'text-emerald-600', valueColor: 'text-emerald-700' },
  { label: 'Annulations', value: `${stats.value?.cancellationRate ?? 0}%`, icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', bg: 'bg-amber-50 dark:bg-amber-500/10', iconBg: 'bg-amber-100 dark:bg-amber-500/20', iconColor: 'text-amber-600', valueColor: 'text-amber-700' },
])

function formatTime(d: string) { return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
function formatDate(d: string) { return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) }
const statusLabels: Record<string, string> = { CONFIRMED: 'Confirmé', CANCELLED: 'Annulé', COMPLETED: 'Terminé', NO_SHOW: 'Absent' }
const statusVariants: Record<string, string> = { CONFIRMED: 'success', CANCELLED: 'danger', COMPLETED: 'neutral', NO_SHOW: 'warning' }

function copyLink() {
  navigator.clipboard.writeText(`${config.public.appUrl}/${authStore.professional?.slug}`)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const showCreateModal = ref(false)
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome banner -->
    <div class="rounded-2xl overflow-hidden relative" style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)">
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 20px 20px;" />
      <div class="relative p-5 sm:p-7">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <h2 class="text-lg sm:text-xl font-bold text-white">
                Bonjour{{ authStore.professional?.businessName ? `, ${authStore.professional.businessName}` : '' }}
              </h2>
              <span class="text-xl">👋</span>
            </div>
            <p class="text-sm text-white/60 max-w-md">Voici un aperçu de votre activité. Partagez votre lien pour recevoir des réservations.</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <div class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <div class="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <code class="text-sm text-white/70">bookeasey.fr/<span class="text-white font-medium">{{ authStore.professional?.slug }}</span></code>
            </div>
            <button
              :class="['px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0', copied ? 'bg-emerald-400 text-emerald-900' : 'bg-white text-brand-700 hover:bg-white/90']"
              @click="copyLink"
            >{{ copied ? '✓' : 'Copier' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div v-for="s in statCards" :key="s.label" :class="['rounded-xl border p-4 sm:p-5', s.bg, 'border-transparent']">
        <div class="flex items-center justify-between mb-3">
          <div :class="['w-9 h-9 rounded-lg flex items-center justify-center', s.iconBg]">
            <svg :class="['w-[18px] h-[18px]', s.iconColor]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" :d="s.icon" /></svg>
          </div>
        </div>
        <p :class="['text-2xl sm:text-3xl font-bold', s.valueColor]">{{ s.value }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ s.label }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Today's appointments (2/3) -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs overflow-hidden">
        <div class="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Aujourd'hui</h3>
            <span class="text-xs text-slate-400">{{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors" @click="showCreateModal = true">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Nouveau
            </button>
            <NuxtLink to="/dashboard/appointments" class="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Tout voir
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </NuxtLink>
          </div>
        </div>

        <div v-if="todayAppointments?.length" class="divide-y divide-slate-50 dark:divide-slate-700">
          <NuxtLink v-for="apt in todayAppointments" :key="apt.id" :to="`/dashboard/appointments/${apt.id}`"
            class="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
            <div class="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex flex-col items-center justify-center shrink-0">
              <p class="text-xs font-bold text-brand-700 leading-none">{{ formatTime(apt.startTime) }}</p>
              <p class="text-[9px] text-brand-400 mt-0.5">{{ formatTime(apt.endTime) }}</p>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ apt.clientName }}</p>
              <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ backgroundColor: apt.service?.color || '#7c3aed' }" />
                {{ apt.service?.name }}
              </p>
            </div>
            <AppBadge :variant="(statusVariants[apt.status] as any)" size="sm">{{ statusLabels[apt.status] }}</AppBadge>
          </NuxtLink>
        </div>
        <div v-else class="px-6 py-12 text-center">
          <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
            <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-1">Aucun rendez-vous aujourd'hui</p>
          <p class="text-xs text-slate-400">Vos prochains RDV apparaîtront ici</p>
        </div>
      </div>

      <!-- Right column -->
      <div class="space-y-4 sm:space-y-5">
        <!-- Upcoming next -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs overflow-hidden">
          <div class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Prochains rendez-vous</h3>
          </div>
          <div v-if="upcomingAppointments?.length" class="divide-y divide-slate-50 dark:divide-slate-700">
            <NuxtLink v-for="apt in upcomingAppointments.slice(0, 5)" :key="apt.id" :to="`/dashboard/appointments/${apt.id}`"
              class="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-slate-900 dark:text-white truncate">{{ apt.clientName }}</p>
                <p class="text-[11px] text-slate-400">{{ formatDate(apt.startTime) }} · {{ formatTime(apt.startTime) }}</p>
              </div>
              <span class="text-[11px] font-medium text-brand-600">{{ apt.service?.name }}</span>
            </NuxtLink>
          </div>
          <div v-else class="px-5 py-6 text-center">
            <p class="text-xs text-slate-400">Rien de prévu</p>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs overflow-hidden">
          <div class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Actions rapides</h3>
          </div>
          <div class="p-2">
            <NuxtLink to="/dashboard/services/new" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
              <div class="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0 group-hover:bg-brand-100 dark:group-hover:bg-brand-500/20 transition-colors">
                <svg class="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </div>
              <div><p class="text-xs font-medium text-slate-900 dark:text-white">Nouveau service</p><p class="text-[11px] text-slate-400">Ajouter une prestation</p></div>
            </NuxtLink>
            <NuxtLink to="/dashboard/availability" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div><p class="text-xs font-medium text-slate-900 dark:text-white">Disponibilités</p><p class="text-[11px] text-slate-400">Gérer vos horaires</p></div>
            </NuxtLink>
            <NuxtLink to="/dashboard/settings/integrations" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
              <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              </div>
              <div><p class="text-xs font-medium text-slate-900 dark:text-white">Google Calendar</p><p class="text-[11px] text-slate-400">Synchroniser votre agenda</p></div>
            </NuxtLink>
          </div>
        </div>

        <!-- Premium upsell (if free) -->
        <div v-if="!authStore.isPremium" class="rounded-2xl border border-brand-100 overflow-hidden" style="background: linear-gradient(135deg, #f3f0ff, #ede9fe)">
          <div class="p-5">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
              <h3 class="text-sm font-semibold text-brand-900">Passez Premium</h3>
            </div>
            <p class="text-xs text-brand-700/70 mb-3 leading-relaxed">Paiement en ligne, SMS, Google Calendar, services illimités</p>
            <NuxtLink to="/dashboard/upgrade" class="block w-full text-center py-2 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors">
              12€ HT/mois
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <CreateAppointmentModal v-model="showCreateModal" @created="() => { todayAppointments = null; upcomingAppointments = null }" />
  </div>
</template>
