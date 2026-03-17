<script setup lang="ts">
definePageMeta({ layout: 'default' })
const mobileMenu = ref(false)

// ── Hero questionnaire ──
const quizStep = ref(0)
const quizAnswers = reactive({ metier: '', situation: '' })

const metiers = [
  { value: 'coiffure', label: 'Coiffure / Barbier', emoji: '💇' },
  { value: 'coaching', label: 'Coach sportif', emoji: '💪' },
  { value: 'therapie', label: 'Thérapeute / Bien-être', emoji: '🧘' },
  { value: 'beaute', label: 'Esthétique / Beauté', emoji: '💅' },
  { value: 'consulting', label: 'Consultant / Freelance', emoji: '💼' },
  { value: 'photo', label: 'Photographe', emoji: '📸' },
  { value: 'sante', label: 'Professionnel de santé', emoji: '🩺' },
  { value: 'autre', label: 'Autre métier', emoji: '✨' },
]

const situations = [
  { value: 'solo', label: 'Je suis seul(e)' },
  { value: 'equipe', label: 'J\'ai une équipe (2-10 personnes)' },
  { value: 'lancement', label: 'Je me lance bientôt' },
]

function selectMetier(value: string) {
  quizAnswers.metier = value
  quizStep.value = 1
}

function selectSituation(value: string) {
  quizAnswers.situation = value
  navigateTo('/register')
}

// ── Stats contextualisées (style Planity) ──
const keyStats = [
  { value: '50%', label: 'des RDV sont pris en dehors de vos horaires d\'ouverture', icon: '🌙' },
  { value: '75%', label: 'de no-shows en moins grâce aux rappels automatiques', icon: '📉' },
  { value: '2h', label: 'gagnées par semaine en moyenne sur la gestion des RDV', icon: '⏱️' },
  { value: '5 min', label: 'pour créer votre page et recevoir vos premiers RDV', icon: '🚀' },
]

// ── Features avec bénéfice concret ──
const features = [
  {
    title: 'Votre page pro en ligne',
    subtitle: 'Votre activité visible 24h/24',
    desc: 'Vos clients découvrent vos services, vos tarifs et vos disponibilités sur votre propre page. Ils réservent en quelques clics, sans vous appeler.',
    benefit: '50% des réservations sont faites en dehors des horaires d\'ouverture',
    points: ['Logo, description et localisation', 'Services avec durée et prix affichés', 'Aucun compte requis pour vos clients'],
    visual: 'storefront',
  },
  {
    title: 'Encaissez dès la réservation',
    subtitle: 'Fini les rendez-vous oubliés',
    desc: 'Demandez un acompte ou le paiement complet au moment de la réservation. Un client qui a payé, c\'est un client qui vient.',
    benefit: '80% de no-shows en moins avec le paiement à la réservation',
    points: ['Acompte ou paiement total', 'Paiement sécurisé via Stripe', 'Remboursement en 1 clic si besoin'],
    visual: 'payment',
  },
  {
    title: 'Rappels automatiques',
    subtitle: 'Vos clients n\'oublient plus jamais',
    desc: 'Email de confirmation instantané, rappel la veille par email ou SMS. Vous n\'avez rien à faire, tout est automatique.',
    benefit: '75% de rendez-vous sauvés grâce aux rappels automatiques',
    points: ['Confirmation instantanée par email', 'Rappel J-1 automatique', 'SMS disponible en option'],
    visual: 'notification',
  },
  {
    title: 'Un agenda clair et simple',
    subtitle: 'Tout votre planning en un coup d\'œil',
    desc: 'Pas de logiciel compliqué. Un agenda lisible avec vos rendez-vous du jour, votre semaine et vos statistiques.',
    benefit: '2h gagnées par semaine sur la gestion administrative',
    points: ['Vue journée et semaine', 'Gestion des congés en 1 clic', 'Statistiques de votre activité'],
    visual: 'dashboard',
  },
]

const comparisons = [
  { feature: 'Page vitrine de votre activité', us: true, them: false },
  { feature: 'Services avec tarifs affichés', us: true, them: false },
  { feature: 'Paiement à la réservation', us: true, them: false },
  { feature: 'Réservation sans compte client', us: true, them: false },
  { feature: 'Inscription en 5 minutes (self-service)', us: true, them: false },
  { feature: 'Tarifs affichés et transparents', us: true, them: false },
  { feature: 'Multi-employés', us: true, them: true },
  { feature: 'Rappels automatiques', us: true, them: true },
  { feature: 'Sync Google Calendar', us: true, them: true },
]

const testimonials = [
  { name: 'Marie L.', role: 'Coiffeuse', city: 'Paris', text: 'Je passais 30 min par jour au téléphone pour les RDV. Aujourd\'hui mes clientes réservent depuis Instagram. Je ne reviendrais en arrière pour rien au monde.', stat: '2h/sem gagnées', statDetail: 'sur la gestion des RDV' },
  { name: 'Thomas R.', role: 'Coach sportif', city: 'Lyon', text: 'Impossible d\'afficher mes tarifs ou demander un acompte avec les autres outils. Avec BookEasy, mes clients paient à la réservation. Résultat : zéro no-show.', stat: '0 no-show', statDetail: 'depuis 3 mois' },
  { name: 'Sophie M.', role: 'Thérapeute', city: 'Bordeaux', text: 'Mes patients réservent à 23h depuis leur canapé. Le matin, mon planning est rempli sans que j\'aie rien fait. C\'est magique.', stat: '+40%', statDetail: 'de réservations' },
]

const targetAudiences = [
  { emoji: '💇', name: 'Coiffeurs & Barbiers', desc: 'Lien de réservation dans votre bio Instagram', stat: '+150 salons inscrits' },
  { emoji: '💪', name: 'Coachs sportifs', desc: 'Séances solo, duo, groupe avec prix différents', stat: '+200 coachs inscrits' },
  { emoji: '🧘', name: 'Thérapeutes', desc: 'Formulaire pré-consultation intégré', stat: '+300 praticiens' },
  { emoji: '💼', name: 'Consultants', desc: 'Sync Google Calendar, zéro conflit', stat: '+180 consultants' },
  { emoji: '📸', name: 'Photographes', desc: 'Acompte obligatoire à la réservation', stat: '+90 photographes' },
  { emoji: '💅', name: 'Esthéticiennes', desc: 'Multi-prestations avec durées différentes', stat: '+250 instituts' },
]

const faqs = [
  { q: 'C\'est vraiment gratuit ?', a: 'Oui, le plan gratuit est gratuit pour toujours. Il inclut 1 calendrier, 5 services, les rappels email et votre page publique. Aucune carte bancaire demandée.' },
  { q: 'En quoi c\'est différent de Calendly ou Planity ?', a: 'Calendly est fait pour les réunions en entreprise, Planity pour les gros salons de coiffure avec caisse enregistreuse. BookEasy est fait pour les indépendants de tous les métiers qui veulent une page pro simple avec réservation et paiement intégré, sans complexité et sans appel commercial.' },
  { q: 'Mes clients doivent créer un compte ?', a: 'Non. Ils entrent leur nom, email et téléphone, c\'est tout. Aucune appli à télécharger, aucun mot de passe à retenir.' },
  { q: 'Je peux encaisser des paiements ?', a: 'Oui, avec le plan Premium à 12€/mois. Vous choisissez entre acompte ou paiement total via Stripe. C\'est la meilleure arme contre les absences.' },
  { q: 'Combien de temps pour créer ma page ?', a: 'Moins de 5 minutes. Vous renseignez vos horaires, ajoutez vos services, et votre page est en ligne immédiatement. Aucune compétence technique requise.' },
  { q: 'Je peux l\'utiliser si j\'ai déjà un site web ?', a: 'Oui. Vous pouvez ajouter votre lien BookEasy sur votre site existant, ou l\'utiliser comme page autonome si vous n\'avez pas de site.' },
  { q: 'Est-ce que mes données sont sécurisées ?', a: 'Oui. Vos données sont hébergées en France, les paiements sont gérés par Stripe (leader mondial), et nous n\'avons aucun accès à vos données bancaires.' },
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
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" :d="mobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" /></svg>
        </button>
      </div>
      <div v-if="mobileMenu" class="sm:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2">
        <NuxtLink to="/pricing" class="block py-2 text-slate-600">Tarifs</NuxtLink>
        <NuxtLink to="/login" class="block py-2 text-slate-600">Connexion</NuxtLink>
        <NuxtLink to="/register" class="btn-primary w-full text-center">Essai gratuit</NuxtLink>
      </div>
    </nav>

    <!-- ═══ HERO + QUIZ ═══ -->
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
            <h1 class="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-[1.15] mb-5">
              Votre page pro.<br>Votre agenda.<br><span class="text-brand-300">Vos clients réservent seuls.</span>
            </h1>
            <p class="text-base sm:text-lg text-white/55 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Créez votre vitrine en ligne en 5 minutes. Vos clients voient vos services, vos tarifs et réservent 24h/24. Pas besoin de site web.
            </p>

            <!-- Mini quiz (style Planity) -->
            <div class="bg-white/[0.08] backdrop-blur-sm rounded-2xl border border-white/10 p-5 sm:p-6 max-w-md mx-auto lg:mx-0">
              <!-- Step 0: Métier -->
              <div v-if="quizStep === 0">
                <p class="text-sm font-semibold text-white mb-3">Quel est votre métier ?</p>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="m in metiers" :key="m.value"
                    class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                    @click="selectMetier(m.value)"
                  >
                    <span>{{ m.emoji }}</span>
                    <span>{{ m.label }}</span>
                  </button>
                </div>
              </div>
              <!-- Step 1: Situation -->
              <div v-else>
                <button class="text-xs text-white/40 hover:text-white/60 mb-3 flex items-center gap-1" @click="quizStep = 0">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                  Retour
                </button>
                <p class="text-sm font-semibold text-white mb-3">Quelle est votre situation ?</p>
                <div class="space-y-2">
                  <button
                    v-for="s in situations" :key="s.value"
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                    @click="selectSituation(s.value)"
                  >
                    <span class="w-5 h-5 rounded-full border-2 border-white/20 shrink-0" />
                    {{ s.label }}
                  </button>
                </div>
              </div>
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
              <div class="relative"><MockStorefront /></div>
            </div>
          </div>
        </div>

        <!-- Stats bar -->
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

    <!-- ═══ KEY STATS (style Planity) ═══ -->
    <section class="py-12 sm:py-16 px-4 sm:px-6 bg-white border-b border-slate-100">
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div v-for="(s, i) in keyStats" :key="i" class="text-center">
            <span class="text-2xl block mb-2">{{ s.icon }}</span>
            <span class="block text-2xl sm:text-3xl font-extrabold text-brand-600">{{ s.value }}</span>
            <p class="text-xs sm:text-sm text-slate-500 mt-1 leading-snug">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ AVANT / APRÈS ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900">Ce qui change avec BookEasy</h2>
          <p class="text-base sm:text-lg text-slate-500 mt-3 max-w-lg mx-auto">Rejoignez les professionnels qui ont simplifié leur quotidien.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="rounded-2xl bg-white border border-red-100 p-6">
            <div class="flex items-center gap-2 mb-5">
              <span class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-sm font-bold">✗</span>
              <h3 class="font-semibold text-slate-900">Aujourd'hui</h3>
            </div>
            <ul class="space-y-3">
              <li v-for="item in ['Vous décrochez le téléphone entre deux clients','Vous notez les RDV sur un carnet ou dans votre tête','Vos clients oublient et ne viennent pas','Impossible de réserver en dehors de vos horaires','Pas de présence en ligne pour votre activité']" :key="item" class="flex items-start gap-2.5 text-sm text-slate-600">
                <svg class="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="rounded-2xl bg-white border border-emerald-100 p-6 ring-1 ring-emerald-200">
            <div class="flex items-center gap-2 mb-5">
              <span class="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 text-sm font-bold">✓</span>
              <h3 class="font-semibold text-slate-900">Avec BookEasy</h3>
            </div>
            <ul class="space-y-3">
              <li v-for="item in ['Vos clients réservent seuls, 24h/24, 7j/7','Votre agenda se remplit automatiquement','Rappels email et SMS, plus d\'oublis','Paiement à la réservation, plus de no-shows','Votre propre page pro visible sur Google']" :key="item" class="flex items-start gap-2.5 text-sm text-slate-700">
                <svg class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <div class="text-center mt-8">
          <NuxtLink to="/register" class="btn-primary px-8 py-3.5">Créer ma page gratuitement</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ FEATURES (bénéfice + visuel) ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-16">
          <p class="text-brand-600 font-semibold text-sm mb-2">FONCTIONNALITÉS</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Tout ce qu'il vous faut pour travailler sereinement</h2>
        </div>
        <div class="space-y-16 sm:space-y-24">
          <div v-for="(f, i) in features" :key="i" :class="['flex flex-col gap-8 sm:gap-12 items-center', i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row']">
            <div class="flex-1">
              <p class="text-brand-600 font-semibold text-sm mb-2">{{ f.subtitle }}</p>
              <h3 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{{ f.title }}</h3>
              <p class="text-body sm:text-body-lg text-slate-500 leading-relaxed mb-4">{{ f.desc }}</p>
              <!-- Chiffre clé (style Planity) -->
              <div class="flex items-center gap-3 p-3 rounded-xl bg-brand-50 border border-brand-100 mb-5">
                <div class="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <p class="text-sm text-brand-700 font-medium">{{ f.benefit }}</p>
              </div>
              <ul class="space-y-2">
                <li v-for="point in f.points" :key="point" class="flex items-center gap-2.5 text-body text-slate-700">
                  <svg class="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                  {{ point }}
                </li>
              </ul>
            </div>
            <div class="flex-1 min-w-0 w-full">
              <MockStorefront v-if="f.visual === 'storefront'" />
              <MockPayment v-else-if="f.visual === 'payment'" />
              <MockNotification v-else-if="f.visual === 'notification'" />
              <MockDashboard v-else />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CTA INTERMÉDIAIRE ═══ -->
    <section class="py-10 sm:py-14 px-4 sm:px-6 bg-brand-600">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-3">Prêt à gagner du temps ?</h2>
        <p class="text-white/70 mb-6">Créez votre page en 5 minutes. Gratuit, sans carte bancaire.</p>
        <NuxtLink to="/register" class="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-brand-600 bg-white hover:bg-slate-50 transition-colors">Créer ma page gratuite</NuxtLink>
      </div>
    </section>

    <!-- ═══ AUDIENCES ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <p class="text-brand-600 font-semibold text-sm mb-2">POUR QUI</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Quel que soit votre métier</h2>
          <p class="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">Si vous prenez des rendez-vous, BookEasy est fait pour vous.</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div v-for="(a, i) in targetAudiences" :key="i" class="card p-4 sm:p-5">
            <div class="flex items-start justify-between mb-2 sm:mb-3">
              <span class="text-2xl sm:text-3xl">{{ a.emoji }}</span>
              <span class="text-[10px] sm:text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{{ a.stat }}</span>
            </div>
            <h3 class="text-sm sm:text-base font-semibold text-slate-900 mb-1">{{ a.name }}</h3>
            <p class="text-xs sm:text-sm text-slate-500">{{ a.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ COMPARISON ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <p class="text-brand-600 font-semibold text-sm mb-2">COMPARATIF</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">BookEasy vs. Calendly, Planity & co</h2>
          <p class="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">Ils sont faits pour les grandes entreprises ou les gros salons. Nous sommes faits pour vous.</p>
        </div>
        <div class="card overflow-hidden">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50">
                <th class="px-4 sm:px-6 py-3.5 text-sm font-semibold text-slate-700">Fonctionnalité</th>
                <th class="px-4 sm:px-6 py-3.5 text-sm font-semibold text-brand-700 text-center">BookEasy</th>
                <th class="px-4 sm:px-6 py-3.5 text-sm font-semibold text-slate-400 text-center">Les autres</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, i) in comparisons" :key="i" :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'">
                <td class="px-4 sm:px-6 py-3 text-sm text-slate-700">{{ c.feature }}</td>
                <td class="px-4 sm:px-6 py-3 text-center"><svg v-if="c.us" class="w-5 h-5 text-emerald-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg></td>
                <td class="px-4 sm:px-6 py-3 text-center">
                  <svg v-if="c.them" class="w-5 h-5 text-emerald-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                  <svg v-else class="w-5 h-5 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-center mt-8">
          <NuxtLink to="/register" class="btn-primary px-8 py-3.5">Essayer gratuitement</NuxtLink>
          <p class="text-xs text-slate-400 mt-2">Aucune carte bancaire requise</p>
        </div>
      </div>
    </section>

    <!-- ═══ TESTIMONIALS ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <p class="text-brand-600 font-semibold text-sm mb-2">TÉMOIGNAGES</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Ils ont choisi BookEasy</h2>
          <div class="flex items-center justify-center gap-2 mt-4">
            <div class="flex gap-0.5">
              <svg v-for="s in 5" :key="s" class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
            <span class="text-sm text-slate-500 font-medium">4.9/5 sur +200 avis</span>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div v-for="(t, i) in testimonials" :key="i" class="card p-5 sm:p-6 flex flex-col">
            <!-- Impact stat -->
            <div class="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 mb-4">
              <span class="text-xl sm:text-2xl font-extrabold text-emerald-600">{{ t.stat }}</span>
              <span class="text-xs text-emerald-700">{{ t.statDetail }}</span>
            </div>
            <p class="text-body text-slate-600 leading-relaxed mb-4 flex-1">"{{ t.text }}"</p>
            <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div class="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center">
                <span class="text-brand-700 font-semibold text-sm">{{ t.name.charAt(0) }}</span>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ t.name }}</p>
                <p class="text-xs text-slate-400">{{ t.role }}, {{ t.city }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ HOW IT WORKS ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <p class="text-brand-600 font-semibold text-sm mb-2">COMMENT ÇA MARCHE</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900">En ligne en 5 minutes, 3 étapes</h2>
        </div>
        <div class="relative">
          <!-- Connection line -->
          <div class="hidden sm:block absolute top-10 left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-0.5 bg-brand-100" />
          <div class="space-y-4 sm:space-y-0 sm:flex sm:gap-6">
            <div v-for="(step, i) in [
              { n: '1', title: 'Inscrivez-vous', desc: 'Email, nom de votre activité et votre secteur. 30 secondes.' },
              { n: '2', title: 'Configurez', desc: 'Vos horaires, vos services avec durée et prix. 3 minutes.' },
              { n: '3', title: 'Partagez', desc: 'Votre lien sur Instagram, Google Maps, votre vitrine, vos cartes de visite.' },
            ]" :key="i" class="flex-1 card p-5 sm:p-6 text-center relative">
              <div class="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center mx-auto mb-3 relative z-10">{{ step.n }}</div>
              <h3 class="text-base font-semibold text-slate-900 mb-1">{{ step.title }}</h3>
              <p class="text-sm text-slate-500">{{ step.desc }}</p>
            </div>
          </div>
        </div>
        <div class="text-center mt-10">
          <NuxtLink to="/register" class="btn-primary px-8 py-3.5">Commencer maintenant</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ PRICING TEASER ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-white">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-10">
          <p class="text-brand-600 font-semibold text-sm mb-2">TARIFS TRANSPARENTS</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Gratuit pour démarrer, Premium pour grandir</h2>
          <p class="text-base text-slate-500">Pas de surprise. Pas de commission. Pas d'engagement.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div class="card p-6 text-center flex flex-col">
            <h3 class="text-lg font-semibold text-slate-900 mb-1">Gratuit</h3>
            <p class="text-3xl font-extrabold text-slate-900 mb-1">0€</p>
            <p class="text-sm text-slate-400 mb-5">pour toujours</p>
            <ul class="text-sm text-slate-600 space-y-2 text-left mb-6 flex-1">
              <li class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>Page vitrine complète</li>
              <li class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>Jusqu'à 5 services</li>
              <li class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>Rappels email automatiques</li>
              <li class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>Agenda et statistiques</li>
            </ul>
            <NuxtLink to="/register" class="btn-secondary w-full text-center">Commencer</NuxtLink>
          </div>
          <div class="card p-6 text-center ring-2 ring-brand-500 flex flex-col">
            <div class="mb-2"><span class="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">POPULAIRE</span></div>
            <h3 class="text-lg font-semibold text-slate-900 mb-1">Premium</h3>
            <p class="text-3xl font-extrabold text-slate-900 mb-1">12€<span class="text-base font-normal text-slate-400">/mois</span></p>
            <p class="text-sm text-slate-400 mb-5">sans engagement</p>
            <ul class="text-sm text-slate-600 space-y-2 text-left mb-6 flex-1">
              <li class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>Tout le plan Gratuit</li>
              <li class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>Services et calendriers illimités</li>
              <li class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>Paiement en ligne (Stripe)</li>
              <li class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>SMS + Google Calendar</li>
            </ul>
            <NuxtLink to="/pricing" class="btn-primary w-full text-center">Voir le détail</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ FAQ ═══ -->
    <section class="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-10 sm:mb-14">
          <p class="text-brand-600 font-semibold text-sm mb-2">FAQ</p>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900">Questions fréquentes</h2>
        </div>
        <div class="space-y-2">
          <div v-for="(faq, i) in faqs" :key="i" class="card overflow-hidden">
            <button class="w-full flex items-center justify-between p-4 sm:p-5 text-left" @click="toggleFaq(i)">
              <span class="font-semibold text-sm sm:text-base text-slate-900 pr-4">{{ faq.q }}</span>
              <svg :class="['w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200', openFaq === i && 'rotate-180']" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div v-if="openFaq === i" class="px-4 sm:px-5 pb-4 sm:pb-5">
              <p class="text-sm sm:text-body text-slate-500 leading-relaxed">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ REASSURANCE ═══ -->
    <section class="py-8 px-4 sm:px-6 bg-white border-y border-slate-100">
      <div class="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-500">
        <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>Données hébergées en France</span>
        <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>Sans engagement</span>
        <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>Aucune carte bancaire</span>
        <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>Aucune commission</span>
        <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>Support réactif</span>
      </div>
    </section>

    <!-- ═══ FINAL CTA ═══ -->
    <section class="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6" style="background: linear-gradient(135deg, #1f2533 0%, #2e1065 55%, #5b21b6 100%)">
      <div class="absolute inset-0 opacity-[0.06]" style="background-image: radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px); background-size: 28px 28px;" />
      <div class="relative max-w-2xl mx-auto text-center">
        <h2 class="text-2xl sm:text-4xl font-extrabold text-white mb-4">Créez votre page pro en 5 minutes</h2>
        <p class="text-base sm:text-lg text-white/60 mb-8">Rejoignez +2 500 professionnels qui remplissent leur agenda sans décrocher le téléphone.</p>
        <NuxtLink to="/register" class="inline-flex items-center justify-center px-10 py-4 rounded-xl font-semibold text-brand-700 bg-white hover:bg-slate-50 transition-colors text-base">Créer ma page gratuite</NuxtLink>
        <p class="text-xs text-white/30 mt-4">Gratuit pour toujours. Sans engagement. En ligne en 5 minutes.</p>
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
