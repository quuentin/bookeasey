<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { $api } = useNuxtApp()
const clientId = route.params.id as string

const client = ref<any>(null)
const loading = ref(true)
const saving = ref(false)
const saveSuccess = ref(false)
const editNotes = ref('')
const editTags = ref<string[]>([])
const newTag = ref('')

async function fetchClient() {
  loading.value = true
  try {
    client.value = await $api<any>(`/clients/${clientId}`)
    editNotes.value = client.value.notes || ''
    editTags.value = [...(client.value.tags || [])]
  } catch {
    client.value = null
  } finally {
    loading.value = false
  }
}

async function saveClient() {
  saving.value = true
  saveSuccess.value = false
  try {
    const updated = await $api<any>(`/clients/${clientId}`, {
      method: 'PUT',
      body: { notes: editNotes.value, tags: editTags.value },
    })
    client.value = { ...client.value, ...updated }
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 2500)
  } catch {
    alert('Erreur lors de la sauvegarde')
  } finally {
    saving.value = false
  }
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !editTags.value.includes(tag)) {
    editTags.value.push(tag)
  }
  newTag.value = ''
}

function removeTag(tag: string) {
  editTags.value = editTags.value.filter(t => t !== tag)
}

const suggestedTags = ['VIP', 'Nouveau', 'Fidèle', 'Allergie', 'Rappel', 'En attente']

function formatDate(d: string | null) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const statusLabels: Record<string, string> = {
  CONFIRMED: 'Confirmé',
  CANCELLED: 'Annulé',
  COMPLETED: 'Terminé',
  NO_SHOW: 'Absent',
}

const statusClasses: Record<string, string> = {
  CONFIRMED: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  CANCELLED: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400',
  COMPLETED: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
  NO_SHOW: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
}

const upcomingAppointments = computed(() =>
  (client.value?.appointments || []).filter((a: any) => new Date(a.startTime) >= new Date() && a.status === 'CONFIRMED')
)

const pastAppointments = computed(() =>
  (client.value?.appointments || []).filter((a: any) => new Date(a.startTime) < new Date() || a.status !== 'CONFIRMED')
)

onMounted(() => fetchClient())
</script>

<template>
  <div>
    <!-- Back button -->
    <NuxtLink to="/dashboard/clients" class="inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium mb-5 transition-colors">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      Retour aux clients
    </NuxtLink>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <AppSpinner size="lg" />
    </div>

    <!-- Not found -->
    <div v-else-if="!client" class="text-center py-16">
      <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-1">Client introuvable</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400">Ce client n'existe pas ou a été supprimé.</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Client header card -->
      <div class="card p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row items-start gap-4">
          <!-- Avatar -->
          <div class="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0">
            <span class="text-xl font-bold text-brand-600 dark:text-brand-400">{{ client.name?.charAt(0)?.toUpperCase() }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-heading-2 text-slate-900 dark:text-white">{{ client.name }}</h1>
            <div class="flex flex-wrap items-center gap-3 mt-1.5">
              <span class="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                {{ client.email }}
              </span>
              <span v-if="client.phone" class="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                {{ client.phone }}
              </span>
            </div>

            <!-- Stats row -->
            <div class="flex flex-wrap gap-5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div>
                <p class="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Visites</p>
                <p class="text-lg font-bold text-slate-900 dark:text-white">{{ client.totalVisits }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Total dépensé</p>
                <p class="text-lg font-bold text-brand-600 dark:text-brand-400">{{ client.totalSpent }}€</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Dernière visite</p>
                <p class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ formatDate(client.lastVisitAt) }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Client depuis</p>
                <p class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ formatDate(client.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes & Tags section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Internal notes -->
        <div class="card p-5 sm:p-6">
          <h2 class="text-base font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
            Notes internes
          </h2>
          <textarea
            v-model="editNotes"
            class="input-field resize-none"
            rows="5"
            placeholder="Allergies, préférences, informations importantes..."
          />
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">Ces notes sont privées et ne sont pas visibles par le client.</p>
        </div>

        <!-- Tags -->
        <div class="card p-5 sm:p-6">
          <h2 class="text-base font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
            Étiquettes
          </h2>

          <!-- Current tags -->
          <div class="flex flex-wrap gap-2 mb-3 min-h-[32px]">
            <span
              v-for="tag in editTags"
              :key="tag"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400"
            >
              {{ tag }}
              <button @click="removeTag(tag)" class="ml-0.5 hover:text-red-500 transition-colors">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
            <span v-if="editTags.length === 0" class="text-xs text-slate-400 dark:text-slate-500 py-1">Aucune étiquette</span>
          </div>

          <!-- Add tag input -->
          <div class="flex items-center gap-2 mb-3">
            <input
              v-model="newTag"
              type="text"
              class="input-field flex-1"
              placeholder="Nouvelle étiquette..."
              @keydown.enter.prevent="addTag"
            />
            <button @click="addTag" class="btn-secondary btn-sm shrink-0">Ajouter</button>
          </div>

          <!-- Suggested tags -->
          <div>
            <p class="text-xs text-slate-400 dark:text-slate-500 mb-1.5">Suggestions :</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="tag in suggestedTags.filter(t => !editTags.includes(t))"
                :key="tag"
                @click="editTags.push(tag)"
                class="px-2 py-0.5 rounded-full text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                + {{ tag }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Save button -->
      <div class="flex items-center gap-3">
        <AppButton :loading="saving" @click="saveClient">
          Enregistrer les modifications
        </AppButton>
        <Transition name="fade">
          <span v-if="saveSuccess" class="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            Enregistré
          </span>
        </Transition>
      </div>

      <!-- Appointment history -->
      <div class="card p-5 sm:p-6">
        <h2 class="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Historique des rendez-vous
          <span class="text-xs text-slate-400 dark:text-slate-500 font-normal">({{ client.appointments?.length || 0 }})</span>
        </h2>

        <!-- Upcoming -->
        <div v-if="upcomingAppointments.length > 0" class="mb-5">
          <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">À venir</p>
          <div class="space-y-2">
            <div
              v-for="apt in upcomingAppointments"
              :key="apt.id"
              class="flex items-center justify-between p-3 rounded-xl bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: apt.serviceColor || '#7c3aed' }" />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ apt.serviceName }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatDateTime(apt.startTime) }}</p>
                </div>
              </div>
              <span :class="['px-2 py-0.5 rounded-full text-[10px] font-medium', statusClasses[apt.status]]">
                {{ statusLabels[apt.status] || apt.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Past -->
        <div v-if="pastAppointments.length > 0">
          <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Passés</p>
          <div class="space-y-2">
            <div
              v-for="apt in pastAppointments"
              :key="apt.id"
              class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: apt.serviceColor || '#7c3aed' }" />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ apt.serviceName }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatDateTime(apt.startTime) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span v-if="apt.paymentAmount" class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ apt.paymentAmount }}€</span>
                <span :class="['px-2 py-0.5 rounded-full text-[10px] font-medium', statusClasses[apt.status]]">
                  {{ statusLabels[apt.status] || apt.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- No appointments -->
        <div v-if="!client.appointments?.length" class="text-center py-8">
          <p class="text-sm text-slate-400 dark:text-slate-500">Aucun rendez-vous pour ce client.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active { transition: opacity 0.3s ease; }
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
