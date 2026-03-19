<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp(); const authStore = useAuthStore()
const { data: employees, refresh } = useAsyncData('employees', () => $api<any[]>('/employees').catch(() => []))
const showForm = ref(false); const form = reactive({ name: '', email: '' }); const loading = ref(false)
async function add() { loading.value = true; await $api('/employees', { method: 'POST', body: form }); form.name = ''; form.email = ''; showForm.value = false; loading.value = false; refresh() }
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
              <svg class="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Gestion multi-employés</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">Ajoutez vos collaborateurs, chacun avec son propre agenda et ses disponibilités. Vos clients choisissent avec qui réserver.</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
              <div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-left">
                <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="text-xs text-slate-700 dark:text-slate-200">1 agenda par employé</span>
              </div>
              <div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-left">
                <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="text-xs text-slate-700 dark:text-slate-200">Horaires individuels</span>
              </div>
              <div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-left">
                <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span class="text-xs text-slate-700 dark:text-slate-200">Choix à la réservation</span>
              </div>
            </div>
            <NuxtLink to="/dashboard/upgrade" class="btn-primary">Débloquer avec Premium</NuxtLink>
            <p class="text-xs text-slate-400 mt-3">A partir de 12€ HT/mois, sans engagement</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Premium content -->
    <template v-else>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Employés</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{{ employees?.length || 0 }} employé(s) actif(s)</p>
        </div>
        <button class="btn-primary btn-sm flex items-center gap-1.5" @click="showForm = !showForm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Ajouter
        </button>
      </div>

      <div v-if="showForm" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs p-5 sm:p-6">
        <h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-4">Nouvel employé</h3>
        <form class="space-y-4" @submit.prevent="add">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppInput v-model="form.name" label="Nom" placeholder="Prénom Nom" required />
            <AppInput v-model="form.email" type="email" label="Email (optionnel)" placeholder="employe@email.com" />
          </div>
          <div class="flex justify-end gap-2">
            <AppButton variant="ghost" size="sm" @click="showForm = false">Annuler</AppButton>
            <AppButton type="submit" size="sm" :loading="loading">Ajouter</AppButton>
          </div>
        </form>
      </div>

      <div v-if="employees?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="emp in employees" :key="emp.id" class="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-xs p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0">
            <span class="text-brand-700 font-semibold text-sm">{{ emp.name?.charAt(0) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ emp.name }}</h3>
            <p v-if="emp.email" class="text-xs text-slate-400 truncate">{{ emp.email }}</p>
          </div>
          <AppBadge variant="success" size="sm">Actif</AppBadge>
        </div>
      </div>
      <div v-else-if="!showForm" class="text-center py-12">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
        </div>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Aucun employé</p>
        <p class="text-xs text-slate-400 mb-4">Ajoutez votre premier collaborateur</p>
        <button class="btn-primary btn-sm" @click="showForm = true">Ajouter un employé</button>
      </div>
    </template>
  </div>
</template>
