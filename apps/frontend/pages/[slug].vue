<script setup lang="ts">
definePageMeta({ layout: 'default' })
const route = useRoute()
const config = useRuntimeConfig()
const slug = route.params.slug as string

const { data: profile, error: profileError } = useAsyncData(`booking-${slug}`, () => $fetch<any>(`${config.public.apiUrl}/booking/${slug}`))

type Step = 'services' | 'slots' | 'info' | 'confirm'
const step = ref<Step>('services')
const selectedService = ref<any>(null)
const selectedDate = ref('')
const selectedSlot = ref('')
const availableSlots = ref<string[]>([])
const loadingSlots = ref(false)
const booking = ref(false)
const bookingDone = ref(false)
const clientForm = reactive({ name: '', email: '', phone: '', notes: '' })
const customForm = ref<any>(null)
const formResponses = ref<Record<string, string>>({})
const showStickyBtn = ref(false)
const showConfetti = ref(false)

function selectService(s: any) {
  selectedService.value = s; step.value = 'slots'; selectedDate.value = nextDay()
  customForm.value = null
  formResponses.value = {}
  if (s.customFormId) {
    $fetch<any>(`${config.public.apiUrl}/booking/${slug}/form/${s.customFormId}`)
      .then(f => { customForm.value = f })
      .catch(() => {})
  }
  scrollToContent()
}
function nextDay() { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0] }

watch(selectedDate, async (date) => {
  if (!date || !selectedService.value) return
  loadingSlots.value = true; selectedSlot.value = ''
  try { availableSlots.value = (await $fetch<any>(`${config.public.apiUrl}/booking/${slug}/slots`, { query: { serviceId: selectedService.value.id, date } })).slots }
  catch { availableSlots.value = [] }
  finally { loadingSlots.value = false }
})

function selectSlot(s: string) { selectedSlot.value = s; step.value = 'info'; scrollToContent() }

async function submitBooking() {
  booking.value = true
  try {
    const responses = customForm.value ? Object.entries(formResponses.value).map(([q, a]) => ({ question: q, answer: a })) : undefined
    await $fetch(`${config.public.apiUrl}/booking/${slug}/book`, { method: 'POST', body: { serviceId: selectedService.value.id, date: selectedDate.value, time: selectedSlot.value, clientName: clientForm.name, clientEmail: clientForm.email, clientPhone: clientForm.phone, clientNotes: clientForm.notes, formResponses: responses } })
    bookingDone.value = true; step.value = 'confirm'
    showConfetti.value = true
    setTimeout(() => { showConfetti.value = false }, 3000)
  } catch (e: any) { alert(e.data?.message || 'Erreur lors de la réservation') }
  finally { booking.value = false }
}

function goBack() {
  if (step.value === 'slots') step.value = 'services'
  else if (step.value === 'info') step.value = 'slots'
  scrollToContent()
}

function scrollToContent() {
  nextTick(() => {
    const el = document.getElementById('booking-content')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function fmtDate() { return selectedDate.value ? new Date(selectedDate.value).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '' }
function getDayName(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short' })
}
function getDayNumber(dateStr: string) {
  return new Date(dateStr).getDate()
}

const sectorLabels: Record<string, string> = {
  coiffure: 'Coiffure', coaching: 'Coaching', therapie: 'Thérapie & Bien-être',
  consulting: 'Consulting', cours: 'Cours particuliers', photo: 'Photographie',
  sante: 'Santé', beaute: 'Beauté & Esthétique', autre: 'Services',
}

const hasLocation = computed(() => profile.value?.address || profile.value?.city)

const currentStepIndex = computed(() => {
  if (step.value === 'services') return 0
  if (step.value === 'slots') return 1
  if (step.value === 'info') return 2
  return 3
})

// Sticky button logic
if (import.meta.client) {
  const handleScroll = () => {
    showStickyBtn.value = window.scrollY > 300 && step.value === 'services'
  }
  onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
}

function scrollToServices() {
  const el = document.getElementById('booking-content')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function generateCalendarUrl() {
  if (!selectedService.value || !selectedDate.value || !selectedSlot.value) return '#'
  const [h, m] = selectedSlot.value.split(':').map(Number)
  const start = new Date(selectedDate.value + 'T00:00:00')
  start.setHours(h, m, 0, 0)
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + selectedService.value.durationMinutes)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const title = encodeURIComponent(`${selectedService.value.name} - ${profile.value?.businessName}`)
  const location = encodeURIComponent([profile.value?.address, profile.value?.city].filter(Boolean).join(', '))
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&location=${location}`
}

useHead({
  title: computed(() => profile.value ? `${profile.value.businessName} — Réserver en ligne` : 'BookEasy'),
  meta: [
    { name: 'description', content: computed(() => profile.value?.description || 'Réservez en ligne') },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Confetti celebration -->
    <Teleport to="body">
      <div v-if="showConfetti" class="fixed inset-0 z-50 pointer-events-none overflow-hidden">
        <div v-for="i in 40" :key="i"
          class="absolute w-2 h-2 rounded-full"
          :style="{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            backgroundColor: ['#7c3aed', '#a78bfa', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'][i % 6],
            animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s forwards`,
          }"
        />
      </div>
    </Teleport>

    <!-- Sticky CTA button -->
    <Transition name="sticky-cta">
      <button
        v-if="showStickyBtn"
        @click="scrollToServices"
        class="fixed bottom-6 right-6 z-40 btn-primary shadow-glow-lg px-6 py-3.5 rounded-2xl flex items-center gap-2 text-sm"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
        Réserver
      </button>
    </Transition>

    <!-- Not found -->
    <div v-if="profileError" class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center animate-fade-in-up">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
          <svg class="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 mb-2">Page introuvable</h1>
        <p class="text-base text-slate-500">Ce professionnel n'existe pas ou a désactivé sa page.</p>
      </div>
    </div>

    <div v-else-if="profile">
      <!-- ════ COVER / HERO ════ -->
      <div class="relative">
        <!-- Cover image or gradient - taller, more dramatic -->
        <div
          v-if="profile.coverImageUrl"
          class="h-52 sm:h-64 md:h-72 bg-cover bg-center"
          :style="{ backgroundImage: `url(${profile.coverImageUrl})` }"
        >
          <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />
        </div>
        <div v-else class="h-52 sm:h-64 md:h-72 relative overflow-hidden" style="background: linear-gradient(135deg, #1f2533 0%, #2e1065 45%, #5b21b6 80%, #7c3aed 100%)">
          <div class="absolute inset-0 opacity-[0.06]" style="background-image: radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px); background-size: 28px 28px;" />
          <!-- Floating orbs for visual interest -->
          <div class="absolute top-10 right-10 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl animate-float" />
          <div class="absolute bottom-10 left-10 w-40 h-40 bg-brand-400/10 rounded-full blur-3xl animate-float" style="animation-delay: -4s;" />
        </div>

        <!-- Profile card overlapping cover - with glow effect -->
        <div class="max-w-2xl mx-auto px-4 sm:px-6 -mt-20 sm:-mt-24 relative z-10">
          <div class="bg-white rounded-3xl shadow-elevated p-6 sm:p-8 glow-pulse animate-fade-in-up">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <!-- Logo -->
              <div class="shrink-0">
                <div v-if="profile.logoUrl" class="w-22 h-22 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-elevated">
                  <img :src="profile.logoUrl" :alt="profile.businessName" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-22 h-22 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 border-4 border-white shadow-elevated flex items-center justify-center">
                  <span class="text-4xl sm:text-5xl font-extrabold text-brand-600">{{ profile.businessName?.charAt(0) }}</span>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 text-center sm:text-left min-w-0">
                <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{{ profile.businessName }}</h1>
                <div class="flex flex-wrap items-center gap-2.5 mt-2 justify-center sm:justify-start">
                  <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                    {{ sectorLabels[profile.sector] || profile.sector }}
                  </span>
                  <span v-if="hasLocation" class="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    {{ [profile.address, profile.city].filter(Boolean).join(', ') }}
                  </span>
                </div>
                <p v-if="profile.description" class="text-sm sm:text-base text-slate-500 mt-4 leading-relaxed max-w-lg">
                  {{ profile.description }}
                </p>
                <!-- Contact info -->
                <div v-if="profile.phone" class="flex items-center gap-4 mt-4 justify-center sm:justify-start">
                  <a :href="`tel:${profile.phone}`" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    {{ profile.phone }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ════ CONTENT ════ -->
      <div id="booking-content" class="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <!-- Progress indicator -->
        <div v-if="step !== 'services'" class="flex items-center justify-center gap-2 mb-8 animate-fade-in-up">
          <div v-for="(s, i) in ['Service', 'Créneau', 'Coordonnées']" :key="s" class="flex items-center gap-2">
            <div :class="[
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
              i < currentStepIndex ? 'bg-brand-600 text-white' :
              i === currentStepIndex ? 'bg-brand-600 text-white shadow-glow' :
              'bg-slate-200 text-slate-400'
            ]">
              <svg v-if="i < currentStepIndex" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span :class="['text-xs font-medium hidden sm:inline', i <= currentStepIndex ? 'text-slate-700' : 'text-slate-400']">{{ s }}</span>
            <div v-if="i < 2" :class="['w-8 h-0.5 rounded-full transition-all duration-300', i < currentStepIndex ? 'bg-brand-600' : 'bg-slate-200']" />
          </div>
        </div>

        <!-- ── Services ── -->
        <div v-if="step === 'services'" class="animate-fade-in-up">
          <div class="text-center mb-8">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Choisissez votre prestation</h2>
            <p class="text-sm text-slate-500">Sélectionnez le service qui vous convient</p>
          </div>
          <div class="space-y-4">
            <button
              v-for="(service, idx) in profile.services"
              :key="service.id"
              class="w-full text-left group"
              :class="[`animate-fade-in-up-delay-${Math.min(idx, 3)}`]"
              @click="selectService(service)"
            >
              <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex items-stretch gap-4 shadow-xs hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden relative">
                <!-- Color accent bar -->
                <div class="w-1 rounded-full shrink-0 self-stretch" :style="{ backgroundColor: service.color || '#7c3aed' }" />
                <div class="flex items-center justify-between flex-1 min-w-0 gap-4">
                  <div class="min-w-0 flex-1">
                    <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{{ service.name }}</h3>
                    <p v-if="service.description" class="text-sm text-slate-500 mt-1 leading-relaxed line-clamp-2">{{ service.description }}</p>
                    <div class="flex items-center gap-4 mt-3">
                      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {{ service.durationMinutes }} min
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end justify-between gap-2 shrink-0">
                    <span class="text-xl sm:text-2xl font-extrabold text-brand-600">{{ service.price }}<span class="text-sm font-semibold">€</span></span>
                    <div class="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                      <svg class="w-4 h-4 text-brand-500 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- ── Slots ── -->
        <div v-if="step === 'slots'" class="animate-fade-in-up">
          <button class="text-sm text-brand-600 hover:text-brand-700 mb-6 flex items-center gap-1.5 font-semibold transition-colors" @click="goBack">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            Retour aux services
          </button>
          <div class="bg-white rounded-3xl border border-slate-200 shadow-elevated p-6 sm:p-8">
            <!-- Selected service recap -->
            <div class="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
              <div class="w-1.5 h-10 rounded-full" :style="{ backgroundColor: selectedService.color || '#7c3aed' }" />
              <div class="flex-1">
                <h2 class="text-lg sm:text-xl font-bold text-slate-900">{{ selectedService.name }}</h2>
                <div class="flex items-center gap-3 mt-1">
                  <span class="inline-flex items-center gap-1 text-xs text-slate-500">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {{ selectedService.durationMinutes }} min
                  </span>
                  <span class="text-xs text-slate-300">|</span>
                  <span class="text-sm font-bold text-brand-600">{{ selectedService.price }}€</span>
                </div>
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-semibold text-slate-700 mb-2">Choisissez une date</label>
              <input v-model="selectedDate" type="date" :min="nextDay()" class="input-field text-base" />
              <p v-if="selectedDate" class="text-sm text-slate-500 mt-2 capitalize flex items-center gap-1.5">
                <svg class="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                {{ fmtDate() }}
              </p>
            </div>

            <div v-if="loadingSlots" class="flex justify-center py-10"><AppSpinner /></div>
            <div v-else-if="availableSlots.length">
              <p class="text-sm font-semibold text-slate-700 mb-3">Créneaux disponibles</p>
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                <button v-for="slot in availableSlots" :key="slot"
                  :class="[
                    'px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                    selectedSlot === slot
                      ? 'bg-brand-600 text-white shadow-glow scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 hover:scale-[1.02]'
                  ]"
                  @click="selectSlot(slot)">{{ slot }}</button>
              </div>
            </div>
            <div v-else-if="selectedDate" class="text-center py-10">
              <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p class="text-sm text-slate-500 font-medium">Aucun créneau disponible ce jour</p>
              <p class="text-xs text-slate-400 mt-1">Essayez une autre date</p>
            </div>
          </div>
        </div>

        <!-- ── Client info ── -->
        <div v-if="step === 'info'" class="animate-fade-in-up">
          <button class="text-sm text-brand-600 hover:text-brand-700 mb-6 flex items-center gap-1.5 font-semibold transition-colors" @click="goBack">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            Retour
          </button>
          <div class="bg-white rounded-3xl border border-slate-200 shadow-elevated p-6 sm:p-8">
            <!-- Recap -->
            <div class="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
              <div class="w-1.5 h-10 rounded-full" :style="{ backgroundColor: selectedService.color || '#7c3aed' }" />
              <div class="flex-1">
                <p class="text-base font-bold text-slate-900">{{ selectedService.name }}</p>
                <p class="text-sm text-slate-500 mt-0.5">
                  <span class="capitalize">{{ fmtDate() }}</span> à {{ selectedSlot }}
                </p>
              </div>
              <span class="text-lg font-extrabold text-brand-600">{{ selectedService.price }}€</span>
            </div>

            <h2 class="text-lg font-bold text-slate-900 mb-5">Vos coordonnées</h2>
            <form class="space-y-5" @submit.prevent="submitBooking">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="space-y-1.5">
                  <label class="block text-sm font-semibold text-slate-700">Nom complet <span class="text-brand-500">*</span></label>
                  <input v-model="clientForm.name" type="text" class="input-field" placeholder="Marie Dupont" required />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-semibold text-slate-700">Téléphone</label>
                  <input v-model="clientForm.phone" type="tel" class="input-field" placeholder="06 12 34 56 78" />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-slate-700">Email <span class="text-brand-500">*</span></label>
                <input v-model="clientForm.email" type="email" class="input-field" placeholder="marie@exemple.com" required />
              </div>
              <div class="space-y-1.5">
                <label class="block text-sm font-semibold text-slate-700">Notes <span class="text-xs font-normal text-slate-400">(optionnel)</span></label>
                <textarea v-model="clientForm.notes" class="input-field resize-none" rows="3" placeholder="Des précisions pour votre rendez-vous..." />
              </div>

              <!-- Custom form fields -->
              <div v-if="customForm?.fields?.length" class="pt-4 border-t border-slate-100 space-y-5">
                <div class="flex items-center gap-2 mb-1">
                  <svg class="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p class="text-sm font-semibold text-slate-900">{{ customForm.name }}</p>
                </div>
                <div v-for="(field, fi) in customForm.fields" :key="fi" class="space-y-1.5">
                  <label class="block text-sm font-semibold text-slate-700">
                    {{ field.label }}
                    <span v-if="field.required" class="text-brand-500 ml-0.5">*</span>
                  </label>
                  <input
                    v-if="field.type === 'text'"
                    v-model="formResponses[field.label]"
                    type="text"
                    class="input-field"
                    :required="field.required"
                    :placeholder="field.label"
                  />
                  <textarea
                    v-else-if="field.type === 'textarea'"
                    v-model="formResponses[field.label]"
                    class="input-field resize-none"
                    rows="3"
                    :required="field.required"
                    :placeholder="field.label"
                  />
                  <select
                    v-else-if="field.type === 'select'"
                    v-model="formResponses[field.label]"
                    class="input-field"
                    :required="field.required"
                  >
                    <option value="" disabled>Choisir...</option>
                    <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                  <label v-else-if="field.type === 'checkbox'" class="flex items-center gap-2.5 cursor-pointer py-1">
                    <input v-model="formResponses[field.label]" type="checkbox" class="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                    <span class="text-sm text-slate-700">{{ field.label }}</span>
                  </label>
                </div>
              </div>

              <AppButton type="submit" :loading="booking" class="w-full !py-3.5 !text-base !rounded-2xl">
                Confirmer la réservation
              </AppButton>
            </form>
          </div>
        </div>

        <!-- ── Confirmation ── -->
        <div v-if="step === 'confirm' && bookingDone" class="animate-scale-in">
          <div class="bg-white rounded-3xl border border-slate-200 shadow-elevated p-7 sm:p-10 text-center">
            <!-- Animated check -->
            <div class="w-18 h-18 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-lg animate-check">
              <svg class="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Réservation confirmée !</h2>
            <p class="text-base text-slate-500 mb-8">Un email de confirmation a été envoyé à<br /><strong class="text-slate-700">{{ clientForm.email }}</strong></p>

            <!-- Summary card -->
            <div class="p-5 sm:p-6 bg-slate-50 rounded-2xl text-left space-y-3.5 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-slate-400 font-medium">Service</span>
                <span class="font-semibold text-slate-800">{{ selectedService.name }}</span>
              </div>
              <div class="border-t border-slate-200" />
              <div class="flex justify-between items-center">
                <span class="text-slate-400 font-medium">Date</span>
                <span class="font-semibold text-slate-800 capitalize">{{ fmtDate() }}</span>
              </div>
              <div class="border-t border-slate-200" />
              <div class="flex justify-between items-center">
                <span class="text-slate-400 font-medium">Heure</span>
                <span class="font-semibold text-slate-800">{{ selectedSlot }}</span>
              </div>
              <div class="border-t border-slate-200" />
              <div class="flex justify-between items-center">
                <span class="text-slate-400 font-medium">Durée</span>
                <span class="font-semibold text-slate-800">{{ selectedService.durationMinutes }} min</span>
              </div>
              <div class="border-t border-slate-200" />
              <div class="flex justify-between items-center">
                <span class="text-slate-400 font-medium">Prix</span>
                <span class="text-lg font-extrabold text-brand-600">{{ selectedService.price }}€</span>
              </div>
            </div>

            <!-- Localisation -->
            <div v-if="hasLocation" class="mt-5 p-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-left">
              <div class="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-700">{{ profile.businessName }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ [profile.address, profile.postalCode, profile.city].filter(Boolean).join(', ') }}</p>
              </div>
            </div>

            <!-- Add to calendar suggestion -->
            <div class="mt-6">
              <a
                :href="generateCalendarUrl()"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-brand-700 bg-brand-50 border border-brand-100 hover:bg-brand-100 transition-all hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                Ajouter au calendrier
              </a>
            </div>
          </div>
        </div>

        <!-- Branding -->
        <div v-if="!profile.subscription || profile.subscription.plan === 'FREE'" class="text-center mt-10 mb-4">
          <p class="text-xs text-slate-400">
            Propulsé par <NuxtLink to="/" class="text-brand-600 hover:text-brand-700 font-semibold transition-colors">BookEasy</NuxtLink>
            — <NuxtLink to="/register" class="text-slate-400 hover:text-brand-600 transition-colors">Créez votre page gratuitement</NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <div v-else class="flex items-center justify-center min-h-screen"><AppSpinner size="lg" /></div>
  </div>
</template>

<style scoped>
.sticky-cta-enter-active { transition: all 0.3s ease-out; }
.sticky-cta-leave-active { transition: all 0.2s ease-in; }
.sticky-cta-enter-from { opacity: 0; transform: translateY(16px) scale(0.95); }
.sticky-cta-leave-to { opacity: 0; transform: translateY(16px) scale(0.95); }

.w-18 { width: 4.5rem; }
.h-18 { height: 4.5rem; }
.w-22 { width: 5.5rem; }
.h-22 { height: 5.5rem; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
