<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const route = useRoute()

const { data: appointment, refresh } = useAsyncData('appointment-detail', () =>
  $api<any>(`/appointments/${route.params.id}`)
)

const loading = ref('')
const error = ref('')
const showRescheduleModal = ref(false)
const rescheduleDate = ref('')
const rescheduleTime = ref('')

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtTime(d: string) {
  return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const sLabels: Record<string, string> = { CONFIRMED: 'Confirmé', CANCELLED: 'Annulé', COMPLETED: 'Terminé', NO_SHOW: 'Absent' }
const sVariants: Record<string, string> = { CONFIRMED: 'success', CANCELLED: 'danger', COMPLETED: 'neutral', NO_SHOW: 'warning' }
const payLabels: Record<string, string> = { NONE: 'Aucun', PENDING: 'En attente', DEPOSIT_PAID: 'Acompte payé', FULLY_PAID: 'Payé', REFUNDED: 'Remboursé' }

async function updateStatus(status: string) {
  loading.value = status
  error.value = ''
  try {
    await $api(`/appointments/${route.params.id}/status`, { method: 'PUT', body: { status } })
    refresh()
  } catch (e: any) {
    error.value = e.data?.message || 'Erreur'
  } finally {
    loading.value = ''
  }
}

async function handleReschedule() {
  if (!rescheduleDate.value || !rescheduleTime.value) return
  loading.value = 'reschedule'
  error.value = ''
  try {
    const [h, m] = rescheduleTime.value.split(':').map(Number)
    const newStart = new Date(rescheduleDate.value + 'T00:00:00')
    newStart.setHours(h, m, 0, 0)
    await $api(`/appointments/${route.params.id}/reschedule`, { method: 'PUT', body: { startTime: newStart.toISOString() } })
    showRescheduleModal.value = false
    refresh()
  } catch (e: any) {
    error.value = e.data?.message || 'Erreur lors du report'
  } finally {
    loading.value = ''
  }
}
</script>

<template>
  <div class="space-y-6">
    <NuxtLink to="/dashboard/appointments" class="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
      Retour aux rendez-vous
    </NuxtLink>

    <div v-if="!appointment" class="card p-6 flex items-center justify-center py-12">
      <AppSpinner />
    </div>

    <template v-else>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-slate-900">{{ appointment.clientName }}</h2>
          <p class="text-sm text-slate-500 mt-0.5">{{ appointment.service?.name }}</p>
        </div>
        <AppBadge :variant="(sVariants[appointment.status] as any)" size="sm">{{ sLabels[appointment.status] }}</AppBadge>
      </div>

      <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-100 text-body-sm text-red-600">{{ error }}</div>

      <!-- Details Card -->
      <div class="card p-6 space-y-5">
        <h3 class="text-base font-semibold text-slate-900">Détails du rendez-vous</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Date</p>
            <p class="text-sm text-slate-900 font-medium">{{ fmtDate(appointment.startTime) }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Horaire</p>
            <p class="text-sm text-slate-900 font-medium">{{ fmtTime(appointment.startTime) }} — {{ fmtTime(appointment.endTime) }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Service</p>
            <p class="text-sm text-slate-900 font-medium">{{ appointment.service?.name }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Durée</p>
            <p class="text-sm text-slate-900 font-medium">{{ appointment.service?.durationMinutes }} min</p>
          </div>
          <div v-if="appointment.employee" class="space-y-1">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Employé</p>
            <p class="text-sm text-slate-900 font-medium">{{ appointment.employee.name }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Calendrier</p>
            <p class="text-sm text-slate-900 font-medium">{{ appointment.calendar?.name }}</p>
          </div>
        </div>
      </div>

      <!-- Client Info Card -->
      <div class="card p-6 space-y-5">
        <h3 class="text-base font-semibold text-slate-900">Informations client</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Nom</p>
            <p class="text-sm text-slate-900 font-medium">{{ appointment.clientName }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Email</p>
            <a :href="`mailto:${appointment.clientEmail}`" class="text-sm text-brand-600 hover:text-brand-700 font-medium">{{ appointment.clientEmail }}</a>
          </div>
          <div v-if="appointment.clientPhone" class="space-y-1">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Téléphone</p>
            <a :href="`tel:${appointment.clientPhone}`" class="text-sm text-brand-600 hover:text-brand-700 font-medium">{{ appointment.clientPhone }}</a>
          </div>
          <div v-if="appointment.clientNotes" class="space-y-1 sm:col-span-2">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Notes</p>
            <p class="text-sm text-slate-700">{{ appointment.clientNotes }}</p>
          </div>
        </div>
      </div>

      <!-- Payment Card -->
      <div class="card p-6 space-y-3">
        <h3 class="text-base font-semibold text-slate-900">Paiement</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Statut</p>
            <p class="text-sm text-slate-900 font-medium">{{ payLabels[appointment.paymentStatus] || appointment.paymentStatus }}</p>
          </div>
          <div v-if="appointment.paymentAmount" class="space-y-1">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Montant</p>
            <p class="text-sm text-slate-900 font-medium">{{ Number(appointment.paymentAmount).toFixed(2) }} EUR</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Prix du service</p>
            <p class="text-sm text-slate-900 font-medium">{{ Number(appointment.service?.price || 0).toFixed(2) }} EUR</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="appointment.status === 'CONFIRMED'" class="card p-6">
        <h3 class="text-base font-semibold text-slate-900 mb-4">Actions</h3>
        <div class="flex flex-wrap gap-3">
          <AppButton size="sm" @click="updateStatus('COMPLETED')" :loading="loading === 'COMPLETED'">
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            Terminer
          </AppButton>
          <AppButton variant="secondary" size="sm" @click="showRescheduleModal = true">
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Reporter
          </AppButton>
          <AppButton variant="ghost" size="sm" @click="updateStatus('NO_SHOW')" :loading="loading === 'NO_SHOW'">
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            Absent
          </AppButton>
          <AppButton variant="danger" size="sm" @click="updateStatus('CANCELLED')" :loading="loading === 'CANCELLED'">
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            Annuler
          </AppButton>
        </div>
      </div>

      <!-- Metadata -->
      <div class="text-xs text-slate-400 flex items-center gap-4">
        <span>Créé le {{ fmtDate(appointment.createdAt) }}</span>
        <span v-if="appointment.cancelledAt">Annulé le {{ fmtDate(appointment.cancelledAt) }}</span>
      </div>
    </template>

    <!-- Reschedule Modal -->
    <GlassModal v-model="showRescheduleModal" title="Reporter le rendez-vous" size="sm">
      <form class="space-y-4" @submit.prevent="handleReschedule">
        <AppInput v-model="rescheduleDate" type="date" label="Nouvelle date" required />
        <AppInput v-model="rescheduleTime" type="time" label="Nouvelle heure" required />
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="btn-ghost" @click="showRescheduleModal = false">Annuler</button>
          <AppButton type="submit" :loading="loading === 'reschedule'">Confirmer</AppButton>
        </div>
      </form>
    </GlassModal>
  </div>
</template>
