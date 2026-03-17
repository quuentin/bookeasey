<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp(); const statusFilter = ref('all'); const page = ref(1)
const { data: appointments, refresh } = useAsyncData('appointments', () => $api<any>('/appointments', { query: { status: statusFilter.value === 'all' ? undefined : statusFilter.value, page: page.value, limit: 20 } }), { watch: [statusFilter, page] })
function fmtDate(d: string) { return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) }
function fmtTime(d: string) { return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
const sLabels: Record<string,string> = { CONFIRMED:'Confirmé', CANCELLED:'Annulé', COMPLETED:'Terminé', NO_SHOW:'Absent' }
const sVariants: Record<string,string> = { CONFIRMED:'success', CANCELLED:'danger', COMPLETED:'neutral', NO_SHOW:'warning' }
async function updateStatus(id: string, status: string) { await $api(`/appointments/${id}/status`, { method: 'PUT', body: { status } }); refresh() }
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-heading-1 text-slate-900">Rendez-vous</h2>
      <div class="flex gap-1 p-1 bg-slate-100 rounded-xl">
        <button v-for="f in ['all','CONFIRMED','COMPLETED','CANCELLED']" :key="f"
          :class="['px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors', statusFilter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700']"
          @click="statusFilter = f">{{ f === 'all' ? 'Tous' : sLabels[f] }}</button>
      </div>
    </div>
    <div class="card">
      <div v-if="appointments?.data?.length" class="divide-y divide-slate-100">
        <div v-for="apt in appointments.data" :key="apt.id" class="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
          <div class="flex items-center gap-4">
            <div class="text-center min-w-[70px]"><p class="text-body-sm text-slate-400">{{ fmtDate(apt.startTime) }}</p><p class="text-heading-3 text-slate-900">{{ fmtTime(apt.startTime) }}</p></div>
            <div class="w-px h-8 bg-slate-150" />
            <div><p class="font-medium text-slate-800">{{ apt.clientName }}</p><p class="text-body-sm text-slate-400">{{ apt.service?.name }} · {{ apt.clientEmail }}</p></div>
          </div>
          <div class="flex items-center gap-3">
            <AppBadge :variant="(sVariants[apt.status] as any)" size="sm">{{ sLabels[apt.status] }}</AppBadge>
            <div v-if="apt.status === 'CONFIRMED'" class="flex gap-2 text-body-sm">
              <button class="text-emerald-600 hover:underline" @click="updateStatus(apt.id, 'COMPLETED')">Terminer</button>
              <button class="text-red-500 hover:underline" @click="updateStatus(apt.id, 'CANCELLED')">Annuler</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-16"><p class="text-slate-400">Aucun rendez-vous trouvé</p></div>
    </div>
  </div>
</template>
