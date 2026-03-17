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

function selectService(s: any) { selectedService.value = s; step.value = 'slots'; selectedDate.value = nextDay() }
function nextDay() { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0] }

watch(selectedDate, async (date) => {
  if (!date || !selectedService.value) return
  loadingSlots.value = true; selectedSlot.value = ''
  try { availableSlots.value = (await $fetch<any>(`${config.public.apiUrl}/booking/${slug}/slots`, { query: { serviceId: selectedService.value.id, date } })).slots }
  catch { availableSlots.value = [] }
  finally { loadingSlots.value = false }
})

function selectSlot(s: string) { selectedSlot.value = s; step.value = 'info' }

async function submitBooking() {
  booking.value = true
  try {
    await $fetch(`${config.public.apiUrl}/booking/${slug}/book`, { method: 'POST', body: { serviceId: selectedService.value.id, date: selectedDate.value, time: selectedSlot.value, clientName: clientForm.name, clientEmail: clientForm.email, clientPhone: clientForm.phone, clientNotes: clientForm.notes } })
    bookingDone.value = true; step.value = 'confirm'
  } catch (e: any) { alert(e.data?.message || 'Erreur lors de la réservation') }
  finally { booking.value = false }
}

function goBack() { if (step.value === 'slots') step.value = 'services'; else if (step.value === 'info') step.value = 'slots' }
function fmtDate() { return selectedDate.value ? new Date(selectedDate.value).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '' }

const sectorLabels: Record<string, string> = {
  coiffure: 'Coiffure', coaching: 'Coaching', therapie: 'Thérapie & Bien-être',
  consulting: 'Consulting', cours: 'Cours particuliers', photo: 'Photographie',
  sante: 'Santé', beaute: 'Beauté & Esthétique', autre: 'Services',
}

const hasLocation = computed(() => profile.value?.address || profile.value?.city)

useHead({
  title: computed(() => profile.value ? `${profile.value.businessName} — Réserver en ligne` : 'BookEasy'),
  meta: [
    { name: 'description', content: computed(() => profile.value?.description || 'Réservez en ligne') },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Not found -->
    <div v-if="profileError" class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
        </div>
        <h1 class="text-xl font-bold text-slate-900 mb-2">Page introuvable</h1>
        <p class="text-sm text-slate-500">Ce professionnel n'existe pas ou a désactivé sa page.</p>
      </div>
    </div>

    <div v-else-if="profile">
      <!-- ════ COVER / HERO ════ -->
      <div class="relative">
        <!-- Cover image or gradient -->
        <div
          v-if="profile.coverImageUrl"
          class="h-40 sm:h-52 bg-cover bg-center"
          :style="{ backgroundImage: `url(${profile.coverImageUrl})` }"
        >
          <div class="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
        </div>
        <div v-else class="h-40 sm:h-52" style="background: linear-gradient(135deg, #1f2533 0%, #2e1065 55%, #5b21b6 100%)">
          <div class="absolute inset-0 opacity-[0.06]" style="background-image: radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px); background-size: 24px 24px;" />
        </div>

        <!-- Profile card overlapping cover -->
        <div class="max-w-2xl mx-auto px-4 -mt-16 sm:-mt-20 relative z-10">
          <div class="bg-white rounded-2xl shadow-elevated p-5 sm:p-6">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <!-- Logo -->
              <div class="shrink-0">
                <div v-if="profile.logoUrl" class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white shadow-card">
                  <img :src="profile.logoUrl" :alt="profile.businessName" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-brand-50 border-4 border-white shadow-card flex items-center justify-center">
                  <span class="text-3xl sm:text-4xl font-bold text-brand-600">{{ profile.businessName?.charAt(0) }}</span>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 text-center sm:text-left min-w-0">
                <h1 class="text-xl sm:text-2xl font-bold text-slate-900">{{ profile.businessName }}</h1>
                <div class="flex flex-wrap items-center gap-2 mt-1.5 justify-center sm:justify-start">
                  <span class="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                    {{ sectorLabels[profile.sector] || profile.sector }}
                  </span>
                  <span v-if="hasLocation" class="inline-flex items-center gap-1 text-xs text-slate-500">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    {{ [profile.address, profile.city].filter(Boolean).join(', ') }}
                  </span>
                </div>
                <p v-if="profile.description" class="text-sm text-slate-500 mt-3 leading-relaxed">
                  {{ profile.description }}
                </p>
                <!-- Contact info -->
                <div v-if="profile.phone" class="flex items-center gap-4 mt-3 justify-center sm:justify-start">
                  <a :href="`tel:${profile.phone}`" class="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    {{ profile.phone }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ════ CONTENT ════ -->
      <div class="max-w-2xl mx-auto px-4 py-6 sm:py-8">

        <!-- ── Services ── -->
        <div v-if="step === 'services'">
          <h2 class="text-base sm:text-lg font-semibold text-slate-900 mb-3">Réserver un créneau</h2>
          <div class="space-y-2.5">
            <button v-for="service in profile.services" :key="service.id" class="w-full text-left group" @click="selectService(service)">
              <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:shadow-card hover:border-brand-200 transition-all">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: service.color || '#7c3aed' }" />
                  <div class="min-w-0">
                    <h3 class="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-brand-700 transition-colors truncate">{{ service.name }}</h3>
                    <p v-if="service.description" class="text-xs text-slate-400 truncate mt-0.5">{{ service.description }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="inline-flex items-center gap-1 text-xs text-slate-400">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {{ service.durationMinutes }} min
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2 ml-3 shrink-0">
                  <span class="text-base sm:text-lg font-bold text-brand-600">{{ service.price }}€</span>
                  <svg class="w-4 h-4 text-slate-300 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- ── Slots ── -->
        <div v-if="step === 'slots'">
          <button class="text-sm text-brand-600 hover:text-brand-700 mb-4 flex items-center gap-1 font-medium" @click="goBack">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            Retour aux services
          </button>
          <div class="bg-white rounded-2xl border border-slate-200 shadow-card p-5 sm:p-6">
            <!-- Selected service recap -->
            <div class="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: selectedService.color || '#7c3aed' }" />
              <div class="flex-1">
                <h2 class="text-base sm:text-lg font-semibold text-slate-900">{{ selectedService.name }}</h2>
                <p class="text-xs text-slate-400">{{ selectedService.durationMinutes }} min · {{ selectedService.price }}€</p>
              </div>
            </div>

            <div class="mb-5">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Choisissez une date</label>
              <input v-model="selectedDate" type="date" :min="nextDay()" class="input-field" />
              <p v-if="selectedDate" class="text-sm text-slate-500 mt-1.5 capitalize">{{ fmtDate() }}</p>
            </div>

            <div v-if="loadingSlots" class="flex justify-center py-8"><AppSpinner /></div>
            <div v-else-if="availableSlots.length">
              <p class="text-sm font-medium text-slate-700 mb-2.5">Créneaux disponibles</p>
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <button v-for="slot in availableSlots" :key="slot"
                  :class="['px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    selectedSlot === slot ? 'bg-brand-600 text-white shadow-glow' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-brand-300 hover:text-brand-700']"
                  @click="selectSlot(slot)">{{ slot }}</button>
              </div>
            </div>
            <p v-else-if="selectedDate" class="text-center py-8 text-sm text-slate-400">Aucun créneau disponible ce jour. Essayez une autre date.</p>
          </div>
        </div>

        <!-- ── Client info ── -->
        <div v-if="step === 'info'">
          <button class="text-sm text-brand-600 hover:text-brand-700 mb-4 flex items-center gap-1 font-medium" @click="goBack">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            Retour
          </button>
          <div class="bg-white rounded-2xl border border-slate-200 shadow-card p-5 sm:p-6">
            <!-- Recap -->
            <div class="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: selectedService.color || '#7c3aed' }" />
              <div class="flex-1">
                <p class="text-sm font-semibold text-slate-900">{{ selectedService.name }}</p>
                <p class="text-xs text-slate-400"><span class="capitalize">{{ fmtDate() }}</span> à {{ selectedSlot }}</p>
              </div>
              <span class="text-sm font-bold text-brand-600">{{ selectedService.price }}€</span>
            </div>

            <h2 class="text-base font-semibold text-slate-900 mb-4">Vos coordonnées</h2>
            <form class="space-y-4" @submit.prevent="submitBooking">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="clientForm.name" label="Nom complet" placeholder="Marie Dupont" required />
                <AppInput v-model="clientForm.phone" type="tel" label="Téléphone" placeholder="06 12 34 56 78" />
              </div>
              <AppInput v-model="clientForm.email" type="email" label="Email" placeholder="marie@exemple.com" required />
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-700">Notes (optionnel)</label>
                <textarea v-model="clientForm.notes" class="input-field" rows="2" placeholder="Des précisions pour votre rendez-vous..." />
              </div>
              <AppButton type="submit" :loading="booking" class="w-full">
                Confirmer la réservation
              </AppButton>
            </form>
          </div>
        </div>

        <!-- ── Confirmation ── -->
        <div v-if="step === 'confirm' && bookingDone">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 text-center">
            <div class="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 class="text-xl font-bold text-slate-900 mb-2">Réservation confirmée !</h2>
            <p class="text-sm text-slate-500 mb-6">Un email de confirmation a été envoyé à <strong class="text-slate-700">{{ clientForm.email }}</strong></p>
            <div class="p-4 bg-slate-50 rounded-xl text-left space-y-2.5 text-sm">
              <div class="flex justify-between"><span class="text-slate-400">Service</span><span class="font-medium text-slate-800">{{ selectedService.name }}</span></div>
              <div class="border-t border-slate-100" />
              <div class="flex justify-between"><span class="text-slate-400">Date</span><span class="font-medium text-slate-800 capitalize">{{ fmtDate() }}</span></div>
              <div class="border-t border-slate-100" />
              <div class="flex justify-between"><span class="text-slate-400">Heure</span><span class="font-medium text-slate-800">{{ selectedSlot }}</span></div>
              <div class="border-t border-slate-100" />
              <div class="flex justify-between"><span class="text-slate-400">Prix</span><span class="font-semibold text-brand-600">{{ selectedService.price }}€</span></div>
            </div>
            <!-- Localisation -->
            <div v-if="hasLocation" class="mt-5 p-3 bg-slate-50 rounded-xl flex items-center gap-2.5 text-left">
              <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              <div>
                <p class="text-sm font-medium text-slate-700">{{ profile.businessName }}</p>
                <p class="text-xs text-slate-400">{{ [profile.address, profile.postalCode, profile.city].filter(Boolean).join(', ') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Branding -->
        <div v-if="!profile.subscription || profile.subscription.plan === 'FREE'" class="text-center mt-8">
          <p class="text-[11px] text-slate-400">
            Propulsé par <NuxtLink to="/" class="text-brand-600 hover:text-brand-700 font-medium">BookEasy</NuxtLink>
            — <NuxtLink to="/register" class="text-slate-400 hover:text-brand-600 transition-colors">Créez votre page gratuitement</NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <div v-else class="flex items-center justify-center min-h-screen"><AppSpinner size="lg" /></div>
  </div>
</template>
