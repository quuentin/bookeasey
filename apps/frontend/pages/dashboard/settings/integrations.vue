<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const route = useRoute()

const loading = ref(false)
const syncing = ref(false)
const disconnecting = ref(false)
const message = ref('')
const errorMsg = ref('')

const { data: status, refresh } = useAsyncData('gcal-status', () =>
  $api<any>('/gcal/status').catch(() => ({ connected: false }))
)

// Handle callback params
onMounted(() => {
  if (route.query.connected === 'true') {
    message.value = 'Google Calendar connecté avec succès !'
    refresh()
    setTimeout(() => { message.value = '' }, 5000)
  }
  if (route.query.error === 'true') {
    errorMsg.value = 'Erreur lors de la connexion à Google Calendar.'
    setTimeout(() => { errorMsg.value = '' }, 5000)
  }
})

async function connectGoogle() {
  loading.value = true
  try {
    const data = await $api<{ url: string }>('/gcal/auth-url')
    window.location.href = data.url
  } catch (e: any) {
    errorMsg.value = e.data?.message || 'Erreur'
    loading.value = false
  }
}

async function syncNow() {
  syncing.value = true
  errorMsg.value = ''
  message.value = ''
  try {
    const result = await $api<{ imported: number }>('/gcal/sync', { method: 'POST' })
    message.value = `Synchronisation terminée : ${result.imported} événement(s) importé(s)`
    refresh()
    setTimeout(() => { message.value = '' }, 5000)
  } catch (e: any) {
    errorMsg.value = e.data?.message || 'Erreur lors de la synchronisation'
  } finally {
    syncing.value = false
  }
}

async function disconnectGoogle() {
  disconnecting.value = true
  try {
    await $api('/gcal/disconnect', { method: 'DELETE' })
    message.value = 'Google Calendar déconnecté'
    refresh()
    setTimeout(() => { message.value = '' }, 5000)
  } catch (e: any) {
    errorMsg.value = e.data?.message || 'Erreur'
  } finally {
    disconnecting.value = false
  }
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-heading-1 text-slate-900">Intégrations</h2>
      <p class="text-sm text-slate-500 mt-1">Connectez vos outils externes</p>
    </div>

    <div v-if="message" class="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-body-sm text-emerald-700">{{ message }}</div>
    <div v-if="errorMsg" class="p-3 rounded-lg bg-red-50 border border-red-100 text-body-sm text-red-600">{{ errorMsg }}</div>

    <!-- Google Calendar Card -->
    <div class="card p-6">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zM8 17.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0-5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0-5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 8H5V5.5h14V8z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-base font-semibold text-slate-900">Google Calendar</h3>
            <AppBadge v-if="status?.connected" variant="success" size="sm">Connecté</AppBadge>
            <AppBadge v-else variant="neutral" size="sm">Non connecté</AppBadge>
          </div>
          <p class="text-sm text-slate-500 mb-4">Synchronisez vos rendez-vous avec Google Calendar pour éviter les conflits d'agenda.</p>

          <template v-if="!authStore.isPremium">
            <div class="p-4 rounded-xl bg-brand-50 border border-brand-100">
              <p class="text-sm text-brand-700 font-medium mb-2">Fonctionnalité Premium</p>
              <p class="text-xs text-brand-600 mb-3">Passez Premium pour connecter Google Calendar.</p>
              <NuxtLink to="/dashboard/upgrade" class="btn-primary btn-sm">Passer Premium</NuxtLink>
            </div>
          </template>

          <template v-else-if="status?.connected">
            <div class="space-y-3 p-4 bg-slate-50 rounded-xl">
              <div class="flex items-center gap-2 text-sm">
                <span class="text-slate-500">Compte :</span>
                <span class="font-medium text-slate-900">{{ status.email }}</span>
              </div>
              <div v-if="status.lastSyncAt" class="flex items-center gap-2 text-sm">
                <span class="text-slate-500">Dernière synchro :</span>
                <span class="font-medium text-slate-900">{{ fmtDate(status.lastSyncAt) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3 mt-4">
              <AppButton size="sm" :loading="syncing" @click="syncNow">
                <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Synchroniser
              </AppButton>
              <AppButton variant="danger" size="sm" :loading="disconnecting" @click="disconnectGoogle">Déconnecter</AppButton>
            </div>
          </template>

          <template v-else>
            <AppButton :loading="loading" @click="connectGoogle">
              <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              Connecter Google Calendar
            </AppButton>
          </template>
        </div>
      </div>
    </div>

    <!-- Back link -->
    <div>
      <NuxtLink to="/dashboard/settings" class="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Retour aux paramètres
      </NuxtLink>
    </div>
  </div>
</template>
