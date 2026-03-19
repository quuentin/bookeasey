<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })
const authStore = useAuthStore(); const { $api } = useNuxtApp(); const currentStep = ref(1); const loading = ref(false); const totalSteps = 4
const workDays = reactive<Record<number,boolean>>({ 1:true, 2:true, 3:true, 4:true, 5:true, 6:false, 0:false })
const dayNames: Record<number,string> = { 1:'Lundi', 2:'Mardi', 3:'Mercredi', 4:'Jeudi', 5:'Vendredi', 6:'Samedi', 0:'Dimanche' }
const schedule = reactive({ startTime: '09:00', endTime: '18:00', bufferMinutes: 15 })
interface SD { name: string; durationMinutes: number; price: number }
const services = ref<SD[]>([{ name: '', durationMinutes: 30, price: 0 }])
function addService() { services.value.push({ name: '', durationMinutes: 30, price: 0 }) }
function removeService(i: number) { if (services.value.length > 1) services.value.splice(i, 1) }
function next() { if (currentStep.value < totalSteps) currentStep.value++ }
function prev() { if (currentStep.value > 1) currentStep.value-- }
const error = ref('')
async function submit() {
  loading.value = true
  error.value = ''
  try {
    const validServices = services.value.filter(s => s.name.trim())
    if (!validServices.length) {
      error.value = 'Ajoutez au moins un service.'
      loading.value = false
      return
    }
    await $api('/professional/onboarding', {
      method: 'PUT',
      body: {
        weeklySchedule: Object.entries(workDays).map(([d, a]) => ({
          dayOfWeek: Number(d),
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isActive: a,
        })),
        bufferMinutes: Number(schedule.bufferMinutes),
        services: validServices.map(s => ({
          name: s.name,
          durationMinutes: Number(s.durationMinutes),
          price: Number(s.price),
        })),
      },
    })
    await authStore.fetchMe()
    navigateTo('/dashboard')
  } catch (e: any) {
    console.error('Onboarding error:', e)
    error.value = e?.data?.message || e?.message || 'Une erreur est survenue. Réessayez.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-slate-50">
    <div class="w-full max-w-2xl">
      <div class="flex items-center justify-center gap-2 mb-8">
        <div v-for="s in totalSteps" :key="s" :class="['h-1.5 rounded-full transition-all duration-300', s <= currentStep ? 'bg-brand-500 w-14' : 'bg-slate-200 w-8']" />
      </div>
      <div class="card-elevated p-8">
        <div v-if="currentStep === 1">
          <h2 class="text-heading-1 text-slate-900 mb-1">Vos jours de travail</h2><p class="text-body text-slate-500 mb-6">Sélectionnez les jours où vous recevez des clients.</p>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="(name, day) in dayNames" :key="day" type="button" :class="['px-4 py-3 rounded-xl font-medium text-body transition-all', workDays[day as unknown as keyof typeof workDays] ? 'bg-brand-50 text-brand-700 border-2 border-brand-300' : 'bg-slate-50 text-slate-500 border-2 border-slate-200 hover:border-slate-300']" @click="workDays[day as unknown as keyof typeof workDays] = !workDays[day as unknown as keyof typeof workDays]">{{ name }}</button>
          </div>
        </div>
        <div v-if="currentStep === 2">
          <h2 class="text-heading-1 text-slate-900 mb-1">Vos horaires</h2><p class="text-body text-slate-500 mb-6">Définissez vos heures et pause entre RDV.</p>
          <div class="space-y-4"><div class="grid grid-cols-2 gap-4"><AppInput v-model="schedule.startTime" type="time" label="Ouverture" /><AppInput v-model="schedule.endTime" type="time" label="Fermeture" /></div>
          <AppSelect v-model="schedule.bufferMinutes" :options="[{value:0,label:'Pas de pause'},{value:5,label:'5 min'},{value:10,label:'10 min'},{value:15,label:'15 min'},{value:30,label:'30 min'}]" label="Pause entre RDV" /></div>
        </div>
        <div v-if="currentStep === 3">
          <h2 class="text-heading-1 text-slate-900 mb-1">Vos services</h2><p class="text-body text-slate-500 mb-6">Ajoutez vos prestations.</p>
          <div class="space-y-3">
            <div v-for="(svc, i) in services" :key="i" class="p-4 bg-slate-50 rounded-xl space-y-3">
              <div class="flex items-center justify-between"><span class="text-body-sm font-medium text-slate-500">Service {{ i+1 }}</span><button v-if="services.length>1" type="button" class="text-red-500 text-body-sm" @click="removeService(i)">Supprimer</button></div>
              <AppInput v-model="svc.name" label="Nom" placeholder="Ex: Coupe homme" /><div class="grid grid-cols-2 gap-3"><AppSelect v-model="svc.durationMinutes" :options="[{value:15,label:'15 min'},{value:30,label:'30 min'},{value:45,label:'45 min'},{value:60,label:'1h'},{value:90,label:'1h30'},{value:120,label:'2h'}]" label="Durée" /><AppInput v-model="svc.price" type="number" label="Prix (€)" placeholder="25" /></div>
            </div>
            <button type="button" class="btn-secondary w-full" @click="addService">+ Ajouter un service</button>
          </div>
        </div>
        <div v-if="currentStep === 4">
          <h2 class="text-heading-1 text-slate-900 mb-1">Votre page est prête !</h2><p class="text-body text-slate-500 mb-6">Accessible à <span class="font-semibold text-brand-600">slotybook.com/{{ authStore.professional?.slug }}</span></p>
          <div class="p-5 bg-slate-50 rounded-xl space-y-3"><h3 class="text-heading-2 text-slate-900">{{ authStore.professional?.businessName }}</h3><p class="text-body-sm text-slate-500">{{ authStore.professional?.sector }}</p><div class="border-t border-slate-200 pt-3 space-y-2"><div v-for="(svc,i) in services.filter(s=>s.name.trim())" :key="i" class="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100"><div><p class="font-medium text-slate-800">{{ svc.name }}</p><p class="text-body-sm text-slate-400">{{ svc.durationMinutes }} min</p></div><span class="font-semibold text-brand-600">{{ svc.price }}€</span></div></div></div>
        </div>
        <div v-if="error" class="mt-6 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">{{ error }}</div>
        <div class="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
          <AppButton v-if="currentStep>1" variant="ghost" @click="prev">Retour</AppButton><div v-else />
          <AppButton v-if="currentStep<totalSteps" @click="next">Suivant</AppButton><AppButton v-else :loading="loading" @click="submit">Lancer ma page</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
