<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { data: todayAppointments } = useAsyncData('today', () => $api<any[]>('/appointments/today'))
const { data: stats } = useAsyncData('stats', () => $api<any>('/stats/overview'))

const statCards = computed(() => [
  { label: "Aujourd'hui", value: stats.value?.todayCount ?? 0, color: 'bg-brand-50 text-brand-700' },
  { label: 'Cette semaine', value: stats.value?.weekCount ?? 0, color: 'bg-blue-50 text-blue-700' },
  { label: 'À venir', value: stats.value?.totalUpcoming ?? 0, color: 'bg-emerald-50 text-emerald-700' },
  { label: 'Taux annulation', value: `${stats.value?.cancellationRate ?? 0}%`, color: 'bg-amber-50 text-amber-700' },
])
function formatTime(d: string) { return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
const statusLabels: Record<string, string> = { CONFIRMED: 'Confirmé', CANCELLED: 'Annulé', COMPLETED: 'Terminé', NO_SHOW: 'Absent' }
const statusVariants: Record<string, string> = { CONFIRMED: 'success', CANCELLED: 'danger', COMPLETED: 'neutral', NO_SHOW: 'warning' }
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-heading-1 text-slate-900">Bonjour{{ authStore.professional?.businessName ? `, ${authStore.professional.businessName}` : '' }}</h2>
      <p class="text-body text-slate-500 mt-1">
        Lien de réservation :
        <a :href="`${$config.public.appUrl}/${authStore.professional?.slug}`" class="text-brand-600 hover:underline font-medium" target="_blank">bookeasey.fr/{{ authStore.professional?.slug }}</a>
      </p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in statCards" :key="s.label" class="card p-5">
        <p class="text-body-sm text-slate-500 mb-2">{{ s.label }}</p>
        <p class="text-heading-1 text-slate-900">{{ s.value }}</p>
      </div>
    </div>
    <div class="card p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-heading-2 text-slate-900">Rendez-vous du jour</h3>
        <NuxtLink to="/dashboard/appointments" class="text-body-sm text-brand-600 hover:text-brand-700 font-medium">Voir tout</NuxtLink>
      </div>
      <div v-if="todayAppointments?.length" class="space-y-2">
        <div v-for="apt in todayAppointments" :key="apt.id" class="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
          <div class="flex items-center gap-4">
            <div class="text-center min-w-[60px]">
              <p class="text-heading-3 text-slate-900">{{ formatTime(apt.startTime) }}</p>
              <p class="text-caption text-slate-400">{{ formatTime(apt.endTime) }}</p>
            </div>
            <div class="w-px h-8 bg-slate-200" />
            <div>
              <p class="font-medium text-slate-800">{{ apt.clientName }}</p>
              <p class="text-body-sm text-slate-500">{{ apt.service?.name }}</p>
            </div>
          </div>
          <AppBadge :variant="(statusVariants[apt.status] as any)" size="sm">{{ statusLabels[apt.status] }}</AppBadge>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-slate-400">Aucun rendez-vous aujourd'hui</p>
      </div>
    </div>
  </div>
</template>
