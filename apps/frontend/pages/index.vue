<script setup lang="ts">
definePageMeta({ layout: 'default' })
const mobileMenu = ref(false)

const painPoints = [
  { icon: '📞', problem: 'Vous perdez des clients', desc: 'Vos clients tombent sur votre répondeur pendant que vous travaillez. La plupart ne rappellent jamais.' },
  { icon: '🗓️', problem: 'Votre agenda est un casse-tête', desc: 'SMS, appels, "je vous rappelle"... Vous passez plus de temps à gérer votre planning qu\'à exercer votre métier.' },
  { icon: '😤', problem: 'Les no-shows vous coûtent cher', desc: '20% de vos clients oublient leur rendez-vous. Chaque créneau vide, c\'est du chiffre d\'affaires perdu.' },
]

const features = [
  {
    title: 'Votre vitrine pro, pas juste un calendrier',
    desc: 'Vos clients voient qui vous êtes, ce que vous proposez et à quel prix. Ils réservent en 30 secondes, sans vous appeler.',
    points: ['Logo, description, localisation', 'Services avec tarifs affichés', 'Réservation sans créer de compte'],
    visual: 'storefront',
  },
  {
    title: 'Encaissez dès la réservation',
    desc: 'Un client qui a payé, c\'est un client qui vient. Demandez un acompte ou le paiement total en ligne.',
    points: ['Acompte ou paiement total', 'Paiement sécurisé Stripe', '-80% de no-shows'],
    visual: 'payment',
  },
  {
    title: 'Rappels automatiques, zéro effort',
    desc: 'Vos clients reçoivent un email de confirmation instantané et un rappel la veille. Vous n\'avez rien à faire.',
    points: ['Confirmation instantanée', 'Rappel J-1 par email', 'SMS en option'],
    visual: 'notification',
  },
  {
    title: 'Votre agenda, simplifié',
    desc: 'Un tableau de bord simple et lisible. Vos rendez-vous du jour, votre semaine, vos stats. C\'est tout.',
    points: ['Vue jour et semaine', 'Congés en 1 clic', 'Stats de votre activité'],
    visual: 'dashboard',
  },
]

const comparisons = [
  { feature: 'Page vitrine de votre activité', us: true, them: false },
  { feature: 'Services avec tarifs affichés', us: true, them: false },
  { feature: 'Paiement à la réservation', us: true, them: false },
  { feature: 'Réservation sans compte client', us: true, them: false },
  { feature: 'Interface 100% en français', us: true, them: false },
  { feature: 'Gratuit sans limite de temps', us: true, them: false },
  { feature: 'Multi-employés', us: true, them: true },
  { feature: 'Rappels automatiques', us: true, them: true },
  { feature: 'Sync Google Calendar', us: true, them: true },
]

const testimonials = [
  { name: 'Marie L.', role: 'Coiffeuse, Paris', text: 'Je passais 30 min par jour au téléphone pour les RDV. Aujourd\'hui mes clientes réservent depuis Instagram. J\'ai gagné 2h par semaine.', rating: 5, stat: '2h/semaine gagnées' },
  { name: 'Thomas R.', role: 'Coach sportif, Lyon', text: 'J\'ai testé Calendly, impossible d\'afficher mes tarifs ou demander un acompte. Avec BookEasy, zéro no-show depuis 3 mois.', rating: 5, stat: '0 no-show en 3 mois' },
  { name: 'Sophie M.', role: 'Thérapeute, Bordeaux', text: 'Mes patients adorent réserver à 23h depuis leur canapé. Et moi j\'adore voir mon planning rempli le matin sans avoir rien fait.', rating: 5, stat: '+40% de réservations' },
]

const targetAudiences = [
  { emoji: '💇', name: 'Coiffeurs & Barbiers', desc: 'Lien de réservation dans votre bio Instagram' },
  { emoji: '💪', name: 'Coachs sportifs', desc: 'Séances solo, duo, groupe avec prix différents' },
  { emoji: '🧘', name: 'Thérapeutes', desc: 'Formulaire pré-consultation intégré' },
  { emoji: '💼', name: 'Consultants', desc: 'Sync Google Calendar, zéro conflit' },
  { emoji: '📸', name: 'Photographes', desc: 'Acompte obligatoire à la réservation' },
  { emoji: '💅', name: 'Esthéticiennes', desc: 'Multi-prestations avec durées différentes' },
]

const faqs = [
  { q: 'C\'est vraiment gratuit ?', a: 'Oui. Le plan gratuit inclut 1 calendrier, 5 services, les rappels email et votre page publique. Pas de carte bancaire, pas de période d\'essai, pas de piège.' },
  { q: 'Quelle est la différence avec Calendly ?', a: 'Calendly est fait pour planifier des réunions en entreprise. BookEasy est fait pour les indépendants qui vendent des prestations : coiffeurs, coachs, thérapeutes... Vous affichez vos tarifs, vous encaissez à la réservation, et vos clients n\'ont pas besoin de créer de compte.' },
  { q: 'Mes clients doivent créer un compte ?', a: 'Non. Ils entrent leur nom, email et téléphone. C\'est tout. Zéro friction.' },
  { q: 'Je peux encaisser des paiements ?', a: 'Oui, avec le plan Premium. Acompte ou paiement total via Stripe. C\'est la meilleure solution contre les no-shows.' },
  { q: 'Combien de temps pour créer ma page ?', a: 'Moins de 5 minutes. Inscription, horaires, services, et votre page est en ligne.' },
  { q: 'Je peux l\'utiliser si j\'ai déjà un site web ?', a: 'Bien sûr. Vous pouvez intégrer votre lien BookEasy sur votre site existant, ou l\'utiliser comme page autonome si vous n\'avez pas de site.' },
]

const openFaq = ref<number | null>(null)
function toggleFaq(i: number) { openFaq.value = openFaq.value === i ? null : i }
</script>

<template>
  <div>
    <!-- ═══ NAVBAR ═══ -->
    <nav class="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span class="text-white font-bold text-sm">B</span>
          </div>
          <span class="font-bold text-lg text-slate-900">BookEasy</span>
        </NuxtLink>
        <div class="hidden sm:flex items-center gap-2">
          <NuxtLink to="/pricing" class="btn-ghost text-body-sm">Tarifs</NuxtLink>
          <NuxtLink to="/login" class="btn-ghost text-body-sm">Connexion</NuxtLink>
          <NuxtLink to="/register" class="btn-primary btn-sm">Essai gratuit</NuxtLink>
        </div>
        <button class="sm:hidden p-2 text-slate-500" @click="mobileMenu = !mobileMenu">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" :d="mobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
          </svg>
        </button>
      </div>
      <div v-if="mobileMenu" class="sm:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2">
        <NuxtLink to="/pricing" class="block py-2 text-slate-600">Tarifs</NuxtLink>
        <NuxtLink to="/login" class="block py-2 text-slate-600">Connexion</NuxtLink>
        <NuxtLink to="/register" class="btn-primary w-full text-center">Essai gratuit</NuxtLink>
      </div>
    </nav>

    <!-- ═══ HERO ═══ -->
    <section class="relative overflow-hidden" style="background: linear-gradient(135deg, #1f2533 0%, #2e1065 55%, #5b21b6 100%)">
      <div class="absolute inset-0 opacity-[0.06]" style="background-image: radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px); background-size: 28px 28px;" />

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-14 sm:pb-20">
        <div class="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          <!-- Left -->
          <div class="flex-1 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-5 backdrop-blur-sm border border-white/10">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% gratuit pour démarrer
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-[1.15] mb-6">
              Un lien. <span class="text-brand-300">Vos clients réservent.</span>
            </h1>
            <p class="text-base sm:text-lg text-white/60 leading-relaxed mb-3 max-w-md mx-auto lg:mx-0">
              Votre vitrine pro, votre agenda et vos paiements réunis en une seule page.
            </p>
            <p class="text-sm sm:text-base text-white/40 leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
              Pas besoin de site web. Créez votre page en 5 minutes, partagez le lien, vos clients font le reste.
            </p>
            <!-- URL preview -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 mb-6 mx-auto lg:mx-0">
              <div class="w-2 h-2 rounded-full bg-emerald-400" />
              <span class="text-sm text-white/50">bookeasey.fr/</span>
              <span class="text-sm text-white font-semibold">votre-activite</span>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <NuxtLink to="/register" class="btn-primary px-7 py-3.5 text-center text-base">
                Créer ma page gratuite
              </NuxtLink>
              <NuxtLink to="/pricing" class="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white/90 border border-white/20 hover:bg-white/5 transition-colors text-center">
                Voir les tarifs
              </NuxtLink>
            </div>
            <!-- Social proof -->
            <div class="flex items-center gap-3 mt-6 justify-center lg:justify-start">
              <div class="flex -space-x-2">
                <div class="w-7 h-7 rounded-full bg-brand-300 border-2 border-brand-900 flex items-center justify-center text-[9px] font-bold text-brand-900">M</div>
                <div class="w-7 h-7 rounded-full bg-emerald-300 border-2 border-brand-900 flex items-center justify-center text-[9px] font-bold text-emerald-900">T</div>
                <div class="w-7 h-7 rounded-full bg-amber-300 border-2 border-brand-900 flex items-center justify-center text-[9px] font-bold text-amber-900">S</div>
                <div class="w-7 h-7 rounded-full bg-sky-300 border-2 border-brand-900 flex items-center justify-center text-[9px] font-bold text-sky-900">L</div>
              </div>
              <p class="text-xs text-white/40"><span class="text-white/70 font-semibold">+2 500 pros</span> utilisent déjà BookEasy</p>
            </div>
          </div>

          <!-- Right: mockup -->
          <div class="flex-1 w-full max-w-sm lg:max-w-md">
            <div class="relative">
              <div class="absolute -inset-4 bg-brand-500/10 rounded-3xl blur-2xl" />
              <div class="relative">
                <MockStorefront />
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-12 sm:mt-14 pt-7 border-t border-white/10">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center">
            <div><span class="block text-xl sm:text-2xl font-bold text-white">+2 500</span><span class="text-[11px] sm:text-xs text-white/40">professionnels</span></div>
            <div><span class="block text-xl sm:text-2xl font-bold text-white">+45 000</span><span class="text-[11px] sm:text-xs text-white/40">rendez-vous pris</span></div>
            <div><span class="block text-xl sm:text-2xl font-bold text-white">4.9/5</span><span class="text-[11px] sm:text-xs text-white/40">satisfaction</span></div>
            <div><span class="block text-xl sm:text-2xl font-bold text-white">5 min</span><span class="text-[11px] sm:text-xs text-white/40">pour être en ligne</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ PAIN POINTS ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <p class="text-brand-600 font-semibold text-sm mb-2">LE PROBLÈME</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Vous êtes un pro, pas un standardiste</h2>
          <p class="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">Gérer vos rendez-vous à la main vous coûte du temps, des clients et de l'argent.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div v-for="(p, i) in painPoints" :key="i" class="card p-6">
            <span class="text-3xl block mb-4">{{ p.icon }}</span>
            <h3 class="text-lg font-semibold text-slate-900 mb-2">{{ p.problem }}</h3>
            <p class="text-body text-slate-500 leading-relaxed">{{ p.desc }}</p>
          </div>
        </div>
        <!-- CTA intermédiaire -->
        <div class="text-center mt-10">
          <NuxtLink to="/register" class="btn-primary px-8 py-3.5">La solution ? Créer ma page BookEasy</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ AVANT / APRÈS ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <p class="text-brand-600 font-semibold text-sm mb-2">AVANT / APRÈS</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900">Ce qui change avec BookEasy</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Avant -->
          <div class="rounded-2xl bg-white border border-red-100 p-6">
            <div class="flex items-center gap-2 mb-5">
              <span class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-sm font-bold">✗</span>
              <h3 class="font-semibold text-slate-900">Sans BookEasy</h3>
            </div>
            <ul class="space-y-3">
              <li v-for="item in [
                'Vous décrochez le téléphone entre deux clients',
                'Vous notez les RDV sur papier ou dans votre tête',
                'Vos clients oublient et ne viennent pas',
                'Impossible de réserver en dehors de vos horaires',
                'Pas de visibilité en ligne pour votre activité',
              ]" :key="item" class="flex items-start gap-2.5 text-sm text-slate-600">
                <svg class="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                {{ item }}
              </li>
            </ul>
          </div>
          <!-- Après -->
          <div class="rounded-2xl bg-white border border-emerald-100 p-6 ring-1 ring-emerald-200">
            <div class="flex items-center gap-2 mb-5">
              <span class="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 text-sm font-bold">✓</span>
              <h3 class="font-semibold text-slate-900">Avec BookEasy</h3>
            </div>
            <ul class="space-y-3">
              <li v-for="item in [
                'Vos clients réservent seuls, 24h/24',
                'Votre agenda se remplit automatiquement',
                'Rappels automatiques, plus d\'oublis',
                'Paiement en ligne, plus de no-shows',
                'Une vraie page pro qui vous représente',
              ]" :key="item" class="flex items-start gap-2.5 text-sm text-slate-700">
                <svg class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ FEATURES ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-16">
          <p class="text-brand-600 font-semibold text-sm mb-2">FONCTIONNALITÉS</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Tout ce qu'il vous faut</h2>
        </div>
        <div class="space-y-8 sm:space-y-16">
          <div v-for="(f, i) in features" :key="i" :class="['flex flex-col gap-6 sm:gap-10', i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row']">
            <div class="flex-1">
              <h3 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{{ f.title }}</h3>
              <p class="text-body sm:text-body-lg text-slate-500 leading-relaxed mb-5">{{ f.desc }}</p>
              <ul class="space-y-2.5">
                <li v-for="point in f.points" :key="point" class="flex items-center gap-2.5 text-body text-slate-700">
                  <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                  {{ point }}
                </li>
              </ul>
            </div>
            <div class="flex-1 min-w-0">
              <MockStorefront v-if="f.visual === 'storefront'" />
              <MockPayment v-else-if="f.visual === 'payment'" />
              <MockNotification v-else-if="f.visual === 'notification'" />
              <MockDashboard v-else />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ COMPARISON ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <p class="text-brand-600 font-semibold text-sm mb-2">BOOKEASEY VS CALENDLY & CO</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Pas un outil de plus. Celui qu'il vous fallait.</h2>
          <p class="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">Les outils de planification génériques ne sont pas pensés pour votre métier.</p>
        </div>
        <div class="card overflow-hidden">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50">
                <th class="px-4 sm:px-6 py-3 text-sm font-semibold text-slate-700">Fonctionnalité</th>
                <th class="px-4 sm:px-6 py-3 text-sm font-semibold text-brand-700 text-center">BookEasy</th>
                <th class="px-4 sm:px-6 py-3 text-sm font-semibold text-slate-400 text-center">Calendly & co</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, i) in comparisons" :key="i" :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'">
                <td class="px-4 sm:px-6 py-3 text-sm text-slate-700">{{ c.feature }}</td>
                <td class="px-4 sm:px-6 py-3 text-center">
                  <svg v-if="c.us" class="w-5 h-5 text-emerald-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                </td>
                <td class="px-4 sm:px-6 py-3 text-center">
                  <svg v-if="c.them" class="w-5 h-5 text-emerald-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                  <svg v-else class="w-5 h-5 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- CTA après comparaison -->
        <div class="text-center mt-8">
          <NuxtLink to="/register" class="btn-primary px-8 py-3.5">Essayer gratuitement</NuxtLink>
          <p class="text-xs text-slate-400 mt-2">Aucune carte bancaire requise</p>
        </div>
      </div>
    </section>

    <!-- ═══ AUDIENCES ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <p class="text-brand-600 font-semibold text-sm mb-2">POUR QUI</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Pensé pour les indépendants</h2>
          <p class="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">Si vous prenez des rendez-vous, BookEasy est fait pour vous.</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div v-for="(a, i) in targetAudiences" :key="i" class="card p-4 sm:p-5 text-center sm:text-left">
            <span class="text-2xl sm:text-3xl block mb-2 sm:mb-3">{{ a.emoji }}</span>
            <h3 class="text-sm sm:text-base font-semibold text-slate-900 mb-1">{{ a.name }}</h3>
            <p class="text-xs sm:text-sm text-slate-500">{{ a.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ TESTIMONIALS ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <p class="text-brand-600 font-semibold text-sm mb-2">TÉMOIGNAGES</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Ils ont adopté BookEasy</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div v-for="(t, i) in testimonials" :key="i" class="card p-5 sm:p-6">
            <!-- Impact stat -->
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              {{ t.stat }}
            </div>
            <!-- Stars -->
            <div class="flex gap-0.5 mb-3">
              <svg v-for="s in t.rating" :key="s" class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p class="text-body text-slate-600 leading-relaxed mb-4">"{{ t.text }}"</p>
            <div>
              <p class="text-sm font-semibold text-slate-900">{{ t.name }}</p>
              <p class="text-xs text-slate-400">{{ t.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ HOW IT WORKS ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-white">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <p class="text-brand-600 font-semibold text-sm mb-2">3 ÉTAPES</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900">En ligne en 5 minutes</h2>
        </div>
        <div class="space-y-4 sm:space-y-0 sm:flex sm:gap-4">
          <div v-for="(step, i) in [
            { n: '1', title: 'Inscrivez-vous', desc: 'Email, nom de votre activité, secteur. C\'est tout.' },
            { n: '2', title: 'Configurez', desc: 'Vos horaires, vos services avec durée et prix. 3 minutes max.' },
            { n: '3', title: 'Partagez', desc: 'Votre lien bookeasey.fr/votre-nom sur Instagram, Google, votre vitrine.' },
          ]" :key="i" class="flex-1 card p-5 sm:p-6 text-center">
            <div class="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center mx-auto mb-3">{{ step.n }}</div>
            <h3 class="text-base font-semibold text-slate-900 mb-1">{{ step.title }}</h3>
            <p class="text-sm text-slate-500">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ PRICING TEASER ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-10">
          <p class="text-brand-600 font-semibold text-sm mb-2">TARIFS</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Gratuit pour démarrer, Premium pour grandir</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div class="card p-6 text-center">
            <h3 class="text-lg font-semibold text-slate-900 mb-1">Gratuit</h3>
            <p class="text-3xl font-extrabold text-slate-900 mb-3">0€</p>
            <p class="text-sm text-slate-500 mb-5">1 calendrier, 5 services, rappels email, page publique</p>
            <NuxtLink to="/register" class="btn-secondary w-full text-center">Commencer</NuxtLink>
          </div>
          <div class="card p-6 text-center ring-2 ring-brand-500">
            <h3 class="text-lg font-semibold text-slate-900 mb-1">Premium</h3>
            <p class="text-3xl font-extrabold text-slate-900 mb-3">12€<span class="text-base font-normal text-slate-400">/mois</span></p>
            <p class="text-sm text-slate-500 mb-5">Tout illimité, paiements, SMS, Google Calendar, stats</p>
            <NuxtLink to="/pricing" class="btn-primary w-full text-center">Voir le détail</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ FAQ ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-white">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <p class="text-brand-600 font-semibold text-sm mb-2">FAQ</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900">Questions fréquentes</h2>
        </div>
        <div class="space-y-2">
          <div v-for="(faq, i) in faqs" :key="i" class="card overflow-hidden">
            <button class="w-full flex items-center justify-between p-4 sm:p-5 text-left" @click="toggleFaq(i)">
              <span class="font-semibold text-sm sm:text-base text-slate-900 pr-4">{{ faq.q }}</span>
              <svg :class="['w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200', openFaq === i && 'rotate-180']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="openFaq === i" class="px-4 sm:px-5 pb-4 sm:pb-5">
              <p class="text-sm sm:text-body text-slate-500 leading-relaxed">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ REASSURANCE ═══ -->
    <section class="py-8 px-4 sm:px-6 bg-slate-50 border-y border-slate-100">
      <div class="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-500">
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
          Données hébergées en France
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          Sans engagement
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          Aucune carte bancaire
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
          Support réactif
        </span>
      </div>
    </section>

    <!-- ═══ FINAL CTA ═══ -->
    <section class="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6" style="background: linear-gradient(135deg, #1f2533 0%, #2e1065 55%, #5b21b6 100%)">
      <div class="absolute inset-0 opacity-[0.06]" style="background-image: radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px); background-size: 28px 28px;" />
      <div class="relative max-w-2xl mx-auto text-center">
        <h2 class="text-2xl sm:text-4xl font-extrabold text-white mb-4">Créez votre page en 5 minutes</h2>
        <p class="text-base sm:text-lg text-white/60 mb-8">Rejoignez +2 500 professionnels qui ont simplifié leur quotidien.</p>
        <NuxtLink to="/register" class="btn-primary px-8 sm:px-10 py-3.5 sm:py-4 text-base">Créer ma page gratuite</NuxtLink>
        <p class="text-xs text-white/30 mt-4">Gratuit pour toujours. En ligne en 5 minutes.</p>
      </div>
    </section>

    <!-- ═══ FOOTER ═══ -->
    <footer class="bg-slate-900 py-10 sm:py-12 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <div class="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center"><span class="text-white font-bold text-xs">B</span></div>
              <span class="font-bold text-white">BookEasy</span>
            </div>
            <p class="text-sm text-slate-400">La prise de rendez-vous en ligne pour les indépendants.</p>
          </div>
          <div class="flex gap-6 text-sm text-slate-400">
            <NuxtLink to="/pricing" class="hover:text-white transition-colors">Tarifs</NuxtLink>
            <NuxtLink to="/login" class="hover:text-white transition-colors">Connexion</NuxtLink>
            <NuxtLink to="/register" class="hover:text-white transition-colors">S'inscrire</NuxtLink>
          </div>
        </div>
        <div class="border-t border-slate-800 mt-8 pt-6 text-xs text-slate-500">&copy; {{ new Date().getFullYear() }} BookEasy. Tous droits réservés.</div>
      </div>
    </footer>
  </div>
</template>
