<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const statusFilter = ref('all')
const page = ref(1)

const { data: appointments, refresh } = useAsyncData('appointments', () =>
  $api<any>('/appointments', { query: { status: statusFilter.value === 'all' ? undefined : statusFilter.value, page: page.value, limit: 20 } }),
  { watch: [statusFilter, page] }
)

function fmtDate(d: string) { return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) }
function fmtTime(d: string) { return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
const sLabels: Record<string, string> = { CONFIRMED: 'Confirmé', CANCELLED: 'Annulé', COMPLETED: 'Terminé', NO_SHOW: 'Absent' }
const sVariants: Record<string, string> = { CONFIRMED: 'success', CANCELLED: 'danger', COMPLETED: 'neutral', NO_SHOW: 'warning' }
async function updateStatus(id: string, status: string) { await $api(`/appointments/${id}/status`, { method: 'PUT', body: { status } }); refresh() }
const showCreateModal = ref(false)
function onCreated() { refresh() }
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Rendez-vous</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{{ appointments?.total ?? 0 }} rendez-vous au total</p>
      </div>
      <div class="flex items-center gap-3 self-start">
        <button class="btn-primary btn-sm flex items-center gap-1.5" @click="showCreateModal = true">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Nouveau RDV
        </button>
      </div>
      <div class="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start">
        <button v-for="f in ['all', 'CONFIRMED', 'COMPLETED', 'CANCELLED']" :key="f"
          :class="['px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all',
            statusFilter === f ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200']"
          @click="statusFilter = f">
          {{ f === 'all' ? 'Tous' : sLabels[f] }}
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs overflow-hidden">
      <div v-if="appointments?.data?.length" class="divide-y divide-slate-50 dark:divide-slate-700">
        <NuxtLink v-for="apt in appointments.data" :key="apt.id" :to="`/dashboard/appointments/${apt.id}`" class="flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors block">
          <div class="flex items-center gap-3 sm:gap-4 min-w-0">
            <div class="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex flex-col items-center justify-center shrink-0 border border-slate-100 dark:border-slate-600">
              <p class="text-[10px] text-slate-400 leading-none">{{ fmtDate(apt.startTime).split(' ')[0] }}</p>
              <p class="text-sm font-bold text-slate-900 dark:text-white leading-none mt-0.5">{{ fmtDate(apt.startTime).split(' ')[1] }}</p>
              <p class="text-[10px] text-slate-400 leading-none">{{ fmtDate(apt.startTime).split(' ')[2] }}</p>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ apt.clientName }}</p>
              <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {{ fmtTime(apt.startTime) }}
                </span>
                <span class="hidden sm:inline">{{ apt.service?.name }}</span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
            <AppBadge :variant="(sVariants[apt.status] as any)" size="sm">{{ sLabels[apt.status] }}</AppBadge>
            <div v-if="apt.status === 'CONFIRMED'" class="hidden sm:flex gap-1">
              <button class="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-600 transition-colors" title="Terminer" @click.prevent.stop="updateStatus(apt.id, 'COMPLETED')">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              </button>
              <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-600 transition-colors" title="Annuler" @click.prevent.stop="updateStatus(apt.id, 'CANCELLED')">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="px-6 py-14 text-center">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Aucun rendez-vous</p>
        <p class="text-xs text-slate-400">Les réservations de vos clients apparaîtront ici</p>
      </div>
    </div>

    <CreateAppointmentModal v-model="showCreateModal" @created="onCreated" />
  </div>
</template>
