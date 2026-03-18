<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp(); const authStore = useAuthStore()
const { data: forms } = useAsyncData('forms', () => $api<any[]>('/forms').catch(() => []))
</script>

<template>
  <div class="space-y-6">
    <!-- Premium gate -->
    <div v-if="!authStore.isPremium">
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs overflow-hidden">
        <div class="p-8 sm:p-12 text-center relative">
          <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(#7c3aed 1px, transparent 1px); background-size: 20px 20px;" />
          <div class="relative">
            <div class="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mx-auto mb-5">
              <svg class="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Formulaires pré-rendez-vous</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">Posez des questions à vos clients avant leur rendez-vous. Gagnez du temps, personnalisez chaque séance, et arrivez préparé.</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
              <div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-left">
                <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="text-xs text-slate-700 dark:text-slate-200">Questions libres</span>
              </div>
              <div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-left">
                <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="text-xs text-slate-700 dark:text-slate-200">Listes déroulantes</span>
              </div>
              <div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-left">
                <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="text-xs text-slate-700 dark:text-slate-200">Liés aux services</span>
              </div>
            </div>
            <NuxtLink to="/dashboard/upgrade" class="btn-primary">Débloquer avec Premium</NuxtLink>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-3">A partir de 12€ HT/mois, sans engagement</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Premium content -->
    <template v-else>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Formulaires pré-RDV</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{{ forms?.length || 0 }} formulaire(s)</p>
        </div>
        <NuxtLink to="/dashboard/forms/new" class="btn-primary btn-sm flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Nouveau
        </NuxtLink>
      </div>

      <div v-if="forms?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div v-for="f in forms" :key="f.id" class="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-xs p-4 sm:p-5 flex items-center justify-between hover:shadow-card hover:border-slate-200 dark:hover:border-slate-600 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{{ f.name }}</h3>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{{ f.fields?.length || 0 }} question(s)</p>
            </div>
          </div>
          <AppBadge :variant="f.isActive ? 'success' : 'neutral'" size="sm">{{ f.isActive ? 'Actif' : 'Inactif' }}</AppBadge>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Aucun formulaire</p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mb-4">Créez votre premier formulaire pré-rendez-vous</p>
        <NuxtLink to="/dashboard/forms/new" class="btn-primary btn-sm">Créer un formulaire</NuxtLink>
      </div>
    </template>
  </div>
</template>
