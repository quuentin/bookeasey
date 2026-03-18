<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const premiumFeatures = [
  { icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z', title: 'Services et calendriers illimités', desc: 'Plus de limite à 5 services. Ajoutez des employés avec leur propre agenda.' },
  { icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z', title: 'Paiement en ligne', desc: 'Encaissez un acompte ou le total à la réservation via Stripe. Réduisez vos no-shows de 80%.' },
  { icon: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z', title: 'Rappels SMS', desc: 'En plus des emails, envoyez un SMS de rappel la veille. Vos clients n\'oublient plus jamais.' },
  { icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5', title: 'Google Calendar sync', desc: 'Synchronisation bidirectionnelle avec votre Google Calendar. Plus de conflits.' },
  { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Formulaires pré-RDV', desc: 'Posez des questions à vos clients avant leur rendez-vous. Gagnez du temps sur place.' },
  { icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z', title: 'Stats détaillées + export', desc: 'Analysez vos performances : revenus, services populaires, taux d\'annulation. Export CSV.' },
]

async function handleUpgrade() {
  loading.value = true
  error.value = ''
  try {
    const { url } = await $api<{ url: string }>('/subscription/checkout', { method: 'POST' })
    if (url) window.location.href = url
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors de la redirection vers le paiement.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-8 sm:mb-10">
      <div class="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Passez à Premium</h1>
      <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400">Débloquez tout le potentiel de BookEasy pour développer votre activité.</p>
    </div>

    <!-- Price card -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden mb-8">
      <div class="p-6 sm:p-8 text-center" style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)">
        <p class="text-white/70 text-sm font-medium mb-2">Premium</p>
        <div class="flex items-baseline justify-center gap-1 mb-2">
          <span class="text-4xl sm:text-5xl font-extrabold text-white">12€</span>
          <span class="text-white/60 text-base"> HT/mois</span>
        </div>
        <p class="text-white/50 text-sm">Sans engagement, annulez à tout moment</p>
      </div>

      <div class="p-6 sm:p-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div v-for="(f, i) in premiumFeatures" :key="i" class="flex gap-3">
            <div class="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0">
              <svg class="w-4.5 h-4.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" :d="f.icon" /></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ f.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 sm:px-8 pb-6 sm:pb-8">
        <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 mb-4">{{ error }}</div>

        <button
          class="w-full py-3.5 rounded-xl font-semibold text-white text-base transition-all"
          style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)"
          :class="loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'"
          :disabled="loading"
          @click="handleUpgrade"
        >
          <svg v-if="loading" class="animate-spin inline -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? 'Redirection...' : 'Souscrire à Premium' }}
        </button>

        <div class="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-slate-400 dark:text-slate-500">
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            Sans engagement
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            Paiement sécurisé Stripe
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            Annulable en 1 clic
          </span>
        </div>
      </div>
    </div>

    <!-- Already premium -->
    <div v-if="authStore.isPremium" class="text-center p-6 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
      <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h3 class="text-base font-semibold text-emerald-900 mb-1">Vous êtes déjà Premium !</h3>
      <p class="text-sm text-emerald-700">Vous avez accès à toutes les fonctionnalités.</p>
    </div>
  </div>
</template>
