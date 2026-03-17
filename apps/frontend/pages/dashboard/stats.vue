<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const { data: stats } = useAsyncData('stats-full', () => $api<any>('/stats/overview'))
const cards = computed(() => [
  { label: 'RDV total', value: stats.value?.totalAppointments ?? 0 }, { label: 'Cette semaine', value: stats.value?.weekCount ?? 0 },
  { label: 'Revenus total', value: `${stats.value?.totalRevenue ?? 0}€` }, { label: 'Taux annulation', value: `${stats.value?.cancellationRate ?? 0}%` },
  { label: 'Clients uniques', value: stats.value?.uniqueClients ?? 0 }, { label: 'Service populaire', value: stats.value?.topService ?? '-' },
])
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-heading-1 text-slate-900">Statistiques</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="s in cards" :key="s.label" class="card p-5"><p class="text-body-sm text-slate-500 mb-2">{{ s.label }}</p><p class="text-heading-1 text-slate-900">{{ s.value }}</p></div>
    </div>
  </div>
</template>
