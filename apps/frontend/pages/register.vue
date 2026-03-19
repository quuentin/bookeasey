<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'guest' })
const authStore = useAuthStore()
const form = reactive({ email: '', password: '', businessName: '', sector: '' })
const error = ref(''); const loading = ref(false)
const sectors = [
  { value: 'coiffure', label: 'Coiffure' }, { value: 'coaching', label: 'Coaching' },
  { value: 'therapie', label: 'Thérapie / Bien-être' }, { value: 'consulting', label: 'Consulting' },
  { value: 'cours', label: 'Cours particuliers' }, { value: 'photo', label: 'Photographie' },
  { value: 'sante', label: 'Santé' }, { value: 'beaute', label: 'Beauté / Esthétique' }, { value: 'autre', label: 'Autre' },
]
async function handleRegister() {
  error.value = ''; loading.value = true
  try { await authStore.register(form.email, form.password, form.businessName, form.sector); navigateTo('/onboarding') }
  catch (e: any) { error.value = e.data?.message || 'Une erreur est survenue' }
  finally { loading.value = false }
}
</script>

<template>
  <div>
    <div class="lg:hidden flex items-center gap-2 mb-8">
      <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center"><span class="text-white font-bold text-sm">B</span></div>
      <span class="font-bold text-lg text-slate-900">SlotyBook</span>
    </div>
    <h1 class="text-heading-1 text-slate-900 mb-1">Créer mon compte</h1>
    <p class="text-body text-slate-500 mb-8">Gratuit, sans engagement</p>
    <form class="space-y-4" @submit.prevent="handleRegister">
      <AppInput v-model="form.businessName" label="Nom de votre activité" placeholder="Ex: Salon Marie" required />
      <AppSelect v-model="form.sector" :options="sectors" label="Secteur d'activité" required />
      <AppInput v-model="form.email" type="email" label="Email" placeholder="vous@exemple.com" required />
      <AppInput v-model="form.password" type="password" label="Mot de passe" placeholder="Minimum 8 caractères" required />
      <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-100 text-body-sm text-red-600">{{ error }}</div>
      <AppButton type="submit" :loading="loading" class="w-full">Créer mon compte</AppButton>
    </form>
    <p class="mt-6 text-center text-body-sm text-slate-500">Déjà inscrit ? <NuxtLink to="/login" class="text-brand-600 hover:text-brand-700 font-medium">Se connecter</NuxtLink></p>
  </div>
</template>
