<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp(); const authStore = useAuthStore()
const { data: forms } = useAsyncData('forms', () => $api<any[]>('/forms').catch(() => []))
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <h2 class="text-heading-1 text-slate-900">Formulaires pré-RDV</h2>
    <div v-if="!authStore.isPremium" class="card p-8 text-center"><h3 class="text-heading-2 text-slate-900 mb-2">Fonctionnalité Premium</h3><p class="text-slate-500 mb-4">Créez des formulaires personnalisés avant chaque RDV.</p><NuxtLink to="/pricing" class="btn-primary">Passer Premium</NuxtLink></div>
    <template v-else>
      <div v-if="forms?.length" class="space-y-2"><GlassCard v-for="f in forms" :key="f.id" hover padding="md"><div class="flex items-center justify-between"><div><h3 class="font-semibold text-slate-900">{{ f.name }}</h3><p class="text-body-sm text-slate-500">{{ f.fields?.length || 0 }} question(s)</p></div><AppBadge :variant="f.isActive ? 'success' : 'neutral'" size="sm">{{ f.isActive ? 'Actif' : 'Inactif' }}</AppBadge></div></GlassCard></div>
      <p v-else class="text-slate-400 text-center py-8">Aucun formulaire créé</p>
    </template>
  </div>
</template>
