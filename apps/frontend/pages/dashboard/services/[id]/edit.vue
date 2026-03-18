<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const route = useRoute()
const loading = ref(false)
const error = ref('')
const fetching = ref(true)

const form = reactive({
  name: '',
  description: '',
  durationMinutes: 30,
  price: 0,
  color: '#7c3aed',
  customFormId: '',
})

const { data: forms } = useAsyncData('forms-list', () =>
  authStore.isPremium ? $api<any[]>('/forms').catch(() => []) : Promise.resolve([])
)

const formOptions = computed(() => {
  const opts = [{ value: '', label: 'Aucun (pas de formulaire)' }]
  if (forms.value) {
    for (const f of forms.value) {
      opts.push({ value: f.id, label: `${f.name} (${f.fields?.length || 0} questions)` })
    }
  }
  return opts
})

onMounted(async () => {
  try {
    const service = await $api<any>(`/services/${route.params.id}`)
    Object.assign(form, {
      name: service.name,
      description: service.description || '',
      durationMinutes: service.durationMinutes,
      price: Number(service.price),
      color: service.color || '#7c3aed',
      customFormId: service.customFormId || '',
    })
  } catch (e: any) {
    error.value = e.data?.message || 'Service introuvable'
  } finally {
    fetching.value = false
  }
})

async function handleSubmit() {
  error.value = ''; loading.value = true
  try {
    await $api(`/services/${route.params.id}`, {
      method: 'PUT',
      body: {
        name: form.name,
        description: form.description || undefined,
        durationMinutes: Number(form.durationMinutes),
        price: Number(form.price),
        color: form.color,
        customFormId: form.customFormId || null,
      },
    })
    navigateTo('/dashboard/services')
  } catch (e: any) {
    error.value = e.data?.message || 'Erreur lors de la mise à jour'
  } finally { loading.value = false }
}
</script>

<template>
  <div class="max-w-2xl">
    <h2 class="text-lg font-bold text-slate-900 mb-6">Modifier le service</h2>

    <div v-if="fetching" class="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex items-center justify-center py-12">
      <AppSpinner />
    </div>

    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 sm:p-6">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <AppInput v-model="form.name" label="Nom du service" placeholder="Ex: Coupe femme" required />
        <AppInput v-model="form.description" label="Description (optionnel)" placeholder="Détails sur la prestation" />
        <div class="grid grid-cols-2 gap-4">
          <AppSelect v-model="form.durationMinutes" :options="[{value:15,label:'15 min'},{value:30,label:'30 min'},{value:45,label:'45 min'},{value:60,label:'1h'},{value:90,label:'1h30'},{value:120,label:'2h'}]" label="Durée" />
          <AppInput v-model="form.price" type="number" label="Prix (€)" placeholder="35" required />
        </div>
        <div class="space-y-1.5">
          <label class="block text-body-sm font-medium text-slate-700">Couleur</label>
          <input v-model="form.color" type="color" class="w-10 h-9 rounded-lg cursor-pointer border border-slate-200" />
        </div>

        <!-- Form link (premium) -->
        <div v-if="authStore.isPremium && forms?.length" class="pt-2 border-t border-slate-100">
          <AppSelect v-model="form.customFormId" :options="formOptions" label="Formulaire pré-RDV" />
          <p class="text-xs text-slate-400 mt-1">Le client devra remplir ce formulaire avant de confirmer sa réservation.</p>
        </div>
        <div v-else-if="authStore.isPremium" class="pt-2 border-t border-slate-100">
          <div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 text-xs text-slate-500">
            <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>Aucun formulaire créé. <NuxtLink to="/dashboard/forms/new" class="text-brand-600 hover:underline">Créer un formulaire</NuxtLink></span>
          </div>
        </div>

        <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-100 text-body-sm text-red-600">{{ error }}</div>
        <div class="flex justify-end gap-3 pt-2">
          <NuxtLink to="/dashboard/services" class="btn-ghost">Annuler</NuxtLink>
          <AppButton type="submit" :loading="loading">Enregistrer</AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
