<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'guest' })
const authStore = useAuthStore()
const email = ref(''); const password = ref(''); const error = ref(''); const loading = ref(false)

async function handleLogin() {
  error.value = ''; loading.value = true
  try { await authStore.login(email.value, password.value); await authStore.fetchMe(); navigateTo(authStore.onboardingDone ? '/dashboard' : '/onboarding') }
  catch (e: any) { error.value = e.data?.message || 'Email ou mot de passe incorrect' }
  finally { loading.value = false }
}
</script>

<template>
  <div>
    <div class="lg:hidden flex items-center gap-2 mb-8">
      <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center"><span class="text-white font-bold text-sm">B</span></div>
      <span class="font-bold text-lg text-slate-900">BookEasy</span>
    </div>

    <h1 class="text-heading-1 text-slate-900 mb-1">Connexion</h1>
    <p class="text-body text-slate-500 mb-8">Accédez à votre espace professionnel</p>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <AppInput v-model="email" type="email" label="Email" placeholder="vous@exemple.com" required />
      <AppInput v-model="password" type="password" label="Mot de passe" placeholder="••••••••" required />
      <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-100 text-body-sm text-red-600">{{ error }}</div>
      <AppButton type="submit" :loading="loading" class="w-full">Se connecter</AppButton>
    </form>

    <div class="mt-6 space-y-2 text-center">
      <NuxtLink to="/forgot-password" class="block text-body-sm text-brand-600 hover:text-brand-700">Mot de passe oublié ?</NuxtLink>
      <p class="text-body-sm text-slate-500">Pas encore de compte ? <NuxtLink to="/register" class="text-brand-600 hover:text-brand-700 font-medium">S'inscrire</NuxtLink></p>
    </div>
  </div>
</template>
