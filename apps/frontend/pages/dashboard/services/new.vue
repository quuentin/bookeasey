<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp(); const loading = ref(false); const error = ref('')
const form = reactive({ name: '', description: '', durationMinutes: 30, price: 0, color: '#7c3aed' })
async function handleSubmit() {
  error.value = ''; loading.value = true
  try { await $api('/services', { method: 'POST', body: form }); navigateTo('/dashboard/services') }
  catch (e: any) { error.value = e.data?.message || 'Erreur' } finally { loading.value = false }
}
</script>

<template>
  <div class="max-w-xl">
    <h2 class="text-heading-1 text-slate-900 mb-6">Nouveau service</h2>
    <div class="card p-6">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <AppInput v-model="form.name" label="Nom du service" placeholder="Ex: Coupe femme" required />
        <AppInput v-model="form.description" label="Description (optionnel)" placeholder="Détails" />
        <div class="grid grid-cols-2 gap-4">
          <AppSelect v-model="form.durationMinutes" :options="[{value:15,label:'15 min'},{value:30,label:'30 min'},{value:45,label:'45 min'},{value:60,label:'1h'},{value:90,label:'1h30'},{value:120,label:'2h'}]" label="Durée" />
          <AppInput v-model="form.price" type="number" label="Prix (€)" placeholder="35" required />
        </div>
        <div class="space-y-1.5"><label class="block text-body-sm font-medium text-slate-700">Couleur</label><input v-model="form.color" type="color" class="w-10 h-9 rounded-lg cursor-pointer border border-slate-200" /></div>
        <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-100 text-body-sm text-red-600">{{ error }}</div>
        <div class="flex justify-end gap-3 pt-2"><NuxtLink to="/dashboard/services" class="btn-ghost">Annuler</NuxtLink><AppButton type="submit" :loading="loading">Créer</AppButton></div>
      </form>
    </div>
  </div>
</template>
