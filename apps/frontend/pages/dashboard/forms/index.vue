<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp(); const authStore = useAuthStore()
const { data: forms } = useAsyncData('forms', () => $api<any[]>('/forms').catch(() => []))
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <div class="flex items-center justify-between">
      <h2 class="text-heading-1 text-slate-900">Formulaires pré-RDV</h2>
      <NuxtLink v-if="authStore.isPremium" to="/dashboard/forms/new" class="btn-primary btn-sm flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        Nouveau formulaire
      </NuxtLink>
    </div>
    <div v-if="!authStore.isPremium" class="card p-8 text-center"><h3 class="text-heading-2 text-slate-900 mb-2">Fonctionnalité Premium</h3><p class="text-slate-500 mb-4">Créez des formulaires personnalisés avant chaque RDV.</p><NuxtLink to="/pricing" class="btn-primary">Passer Premium</NuxtLink></div>
    <template v-else>
      <div v-if="forms?.length" class="space-y-2"><GlassCard v-for="f in forms" :key="f.id" hover padding="md"><div class="flex items-center justify-between"><div><h3 class="font-semibold text-slate-900">{{ f.name }}</h3><p class="text-body-sm text-slate-500">{{ f.fields?.length || 0 }} question(s)</p></div><AppBadge :variant="f.isActive ? 'success' : 'neutral'" size="sm">{{ f.isActive ? 'Actif' : 'Inactif' }}</AppBadge></div></GlassCard></div>
      <div v-else class="text-center py-16">
        <div class="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <h3 class="text-base font-semibold text-slate-900 mb-1">Aucun formulaire</h3>
        <p class="text-sm text-slate-500 mb-5">Créez votre premier formulaire pré-rendez-vous</p>
        <NuxtLink to="/dashboard/forms/new" class="btn-primary btn-sm">Créer un formulaire</NuxtLink>
      </div>
    </template>
  </div>
</template>
