<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
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
    })
  } catch (e: any) {
    error.value = e.data?.message || 'Service introuvable'
  } finally {
    fetching.value = false
  }
})

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await $api(`/services/${route.params.id}`, {
      method: 'PUT',
      body: {
        name: form.name,
        description: form.description || undefined,
        durationMinutes: Number(form.durationMinutes),
        price: Number(form.price),
        color: form.color,
      },
    })
    navigateTo('/dashboard/services')
  } catch (e: any) {
    error.value = e.data?.message || 'Erreur lors de la mise à jour'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <h2 class="text-heading-1 text-slate-900 mb-6">Modifier le service</h2>

    <div v-if="fetching" class="card p-6 flex items-center justify-center py-12">
      <AppSpinner />
    </div>

    <div v-else class="card p-6">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <AppInput v-model="form.name" label="Nom du service" placeholder="Ex: Coupe femme" required />
        <AppInput v-model="form.description" label="Description (optionnel)" placeholder="Détails" />
        <div class="grid grid-cols-2 gap-4">
          <AppSelect
            v-model="form.durationMinutes"
            :options="[
              { value: 15, label: '15 min' },
              { value: 30, label: '30 min' },
              { value: 45, label: '45 min' },
              { value: 60, label: '1h' },
              { value: 90, label: '1h30' },
              { value: 120, label: '2h' },
            ]"
            label="Durée"
          />
          <AppInput v-model="form.price" type="number" label="Prix (EUR)" placeholder="35" required />
        </div>
        <div class="space-y-1.5">
          <label class="block text-body-sm font-medium text-slate-700">Couleur</label>
          <input v-model="form.color" type="color" class="w-10 h-9 rounded-lg cursor-pointer border border-slate-200" />
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
