<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const { data: stats } = useAsyncData('stats-full', () => $api<any>('/stats/overview'))

const cards = computed(() => [
  { label: 'RDV total', value: stats.value?.totalAppointments ?? 0, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', bg: 'bg-brand-50', iconColor: 'text-brand-500', valueColor: 'text-brand-700' },
  { label: 'Cette semaine', value: stats.value?.weekCount ?? 0, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', bg: 'bg-blue-50', iconColor: 'text-blue-500', valueColor: 'text-blue-700' },
  { label: 'Revenus', value: `${stats.value?.totalRevenue ?? 0}€`, icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'bg-emerald-50', iconColor: 'text-emerald-500', valueColor: 'text-emerald-700' },
  { label: 'Annulations', value: `${stats.value?.cancellationRate ?? 0}%`, icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', bg: 'bg-amber-50', iconColor: 'text-amber-500', valueColor: 'text-amber-700' },
  { label: 'Clients uniques', value: stats.value?.uniqueClients ?? 0, icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', bg: 'bg-violet-50', iconColor: 'text-violet-500', valueColor: 'text-violet-700' },
  { label: 'Top service', value: stats.value?.topService ?? '-', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z', bg: 'bg-rose-50', iconColor: 'text-rose-500', valueColor: 'text-rose-700' },
])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg sm:text-xl font-bold text-slate-900">Statistiques</h2>
      <p class="text-sm text-slate-500 mt-0.5">Vue d'ensemble de votre activité</p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <div v-for="s in cards" :key="s.label" class="bg-white rounded-xl border border-slate-100 shadow-xs p-4 sm:p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs sm:text-sm text-slate-500">{{ s.label }}</p>
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', s.bg]">
            <svg :class="['w-4 h-4', s.iconColor]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" :d="s.icon" /></svg>
          </div>
        </div>
        <p :class="['text-xl sm:text-2xl font-bold', s.valueColor]">{{ s.value }}</p>
      </div>
    </div>
  </div>
</template>
