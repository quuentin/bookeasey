<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp(); const authStore = useAuthStore()
const { data: employees, refresh } = useAsyncData('employees', () => $api<any[]>('/employees').catch(() => []))
const showForm = ref(false); const form = reactive({ name: '', email: '' }); const loading = ref(false)
async function add() { loading.value = true; await $api('/employees', { method: 'POST', body: form }); form.name = ''; form.email = ''; showForm.value = false; loading.value = false; refresh() }
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <div class="flex items-center justify-between">
      <div><h2 class="text-heading-1 text-slate-900">Employés</h2><p class="text-body text-slate-500 mt-1">Gérez vos employés et leurs calendriers</p></div>
      <AppButton v-if="authStore.isPremium" @click="showForm = !showForm">+ Ajouter</AppButton>
    </div>
    <div v-if="!authStore.isPremium" class="card p-8 text-center"><h3 class="text-heading-2 text-slate-900 mb-2">Fonctionnalité Premium</h3><p class="text-slate-500 mb-4">Ajoutez des employés avec leur propre calendrier.</p><NuxtLink to="/pricing" class="btn-primary">Passer Premium</NuxtLink></div>
    <template v-else>
      <div v-if="showForm" class="card p-6"><form class="space-y-4" @submit.prevent="add"><AppInput v-model="form.name" label="Nom" placeholder="Prénom Nom" required /><AppInput v-model="form.email" type="email" label="Email (optionnel)" /><div class="flex justify-end gap-3"><AppButton variant="ghost" @click="showForm = false">Annuler</AppButton><AppButton type="submit" :loading="loading">Ajouter</AppButton></div></form></div>
      <div v-if="employees?.length" class="space-y-2"><div v-for="emp in employees" :key="emp.id" class="card p-4 flex items-center justify-between"><div><h3 class="font-semibold text-slate-900">{{ emp.name }}</h3><p v-if="emp.email" class="text-body-sm text-slate-500">{{ emp.email }}</p></div><AppBadge variant="success" size="sm">Actif</AppBadge></div></div>
      <p v-else-if="!showForm" class="text-slate-400 text-center py-8">Aucun employé</p>
    </template>
  </div>
</template>
