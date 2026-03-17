<script setup lang="ts">
definePageMeta({ layout: 'default' })
const mobileMenu = ref(false)

const plans = [
  { name: 'Gratuit', price: '0€', period: 'pour toujours', highlighted: false,
    features: ['1 calendrier', '5 services max', 'Page publique de réservation', 'Rappels email automatiques', 'Statistiques basiques'],
    cta: 'Commencer gratuitement', to: '/register' },
  { name: 'Premium', price: '12€', period: '/ mois', highlighted: true,
    features: ['Calendriers illimités (1 par employé)', 'Services illimités', 'Page sans branding BookEasy', 'Rappels SMS', 'Paiement en ligne (Stripe)', 'Synchro Google Calendar', 'Formulaire pré-RDV personnalisé', 'Domaine personnalisé', 'Stats détaillées + export'],
    cta: 'Passer Premium', to: '/register' },
]
</script>

<template>
  <div>
    <!-- Navbar -->
    <nav class="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span class="text-white font-bold text-sm">B</span>
          </div>
          <span class="font-bold text-lg text-slate-900">BookEasy</span>
        </NuxtLink>
        <!-- Desktop nav -->
        <div class="hidden sm:flex items-center gap-2">
          <NuxtLink to="/login" class="btn-ghost text-body-sm">Connexion</NuxtLink>
          <NuxtLink to="/register" class="btn-primary btn-sm">S'inscrire</NuxtLink>
        </div>
        <!-- Mobile burger -->
        <button class="sm:hidden p-2 text-slate-500" @click="mobileMenu = !mobileMenu">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" :d="mobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
          </svg>
        </button>
      </div>
      <!-- Mobile menu -->
      <div v-if="mobileMenu" class="sm:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2">
        <NuxtLink to="/login" class="block py-2 text-body text-slate-600">Connexion</NuxtLink>
        <NuxtLink to="/register" class="btn-primary w-full text-center">S'inscrire</NuxtLink>
      </div>
    </nav>

    <!-- Content -->
    <section class="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-10 sm:mb-14">
          <h1 class="text-2xl sm:text-4xl lg:text-display-xl font-extrabold text-slate-900 leading-tight">
            Tarifs simples et transparents
          </h1>
          <p class="text-body sm:text-body-lg text-slate-500 mt-3 max-w-lg mx-auto">
            Commencez gratuitement. Passez Premium quand vous en avez besoin.
          </p>
        </div>

        <!-- Plans grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div
            v-for="plan in plans"
            :key="plan.name"
            :class="[
              'rounded-2xl bg-white p-6 sm:p-8 relative flex flex-col',
              plan.highlighted
                ? 'ring-2 ring-brand-500 shadow-elevated'
                : 'border border-slate-200 shadow-card',
            ]"
          >
            <!-- Badge -->
            <div v-if="plan.highlighted" class="mb-4">
              <AppBadge variant="brand">Recommandé</AppBadge>
            </div>

            <!-- Plan name + price -->
            <h3 class="text-lg sm:text-heading-2 font-semibold text-slate-900">{{ plan.name }}</h3>
            <div class="flex items-baseline gap-1 mt-2 mb-6">
              <span class="text-3xl sm:text-4xl font-extrabold text-slate-900">{{ plan.price }}</span>
              <span class="text-body text-slate-400">{{ plan.period }}</span>
            </div>

            <!-- Features list -->
            <ul class="space-y-3 mb-8 flex-1">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-start gap-2.5 text-body text-slate-600"
              >
                <svg class="w-5 h-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>

            <!-- CTA -->
            <NuxtLink
              :to="plan.to"
              :class="[
                'block w-full text-center py-3 rounded-xl font-semibold transition-all',
                plan.highlighted
                  ? 'btn-primary'
                  : 'btn-secondary',
              ]"
            >
              {{ plan.cta }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
