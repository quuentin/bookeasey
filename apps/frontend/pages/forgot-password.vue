<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'guest' })
const config = useRuntimeConfig(); const email = ref(''); const sent = ref(false); const loading = ref(false)
async function handleSubmit() { loading.value = true; try { await $fetch(`${config.public.apiUrl}/auth/forgot-password`, { method: 'POST', body: { email: email.value } }) } catch {}; sent.value = true; loading.value = false }
</script>

<template>
  <div>
    <h1 class="text-heading-1 text-slate-900 mb-1">Mot de passe oublié</h1>
    <p class="text-body text-slate-500 mb-8">Entrez votre email pour recevoir un lien de réinitialisation</p>
    <div v-if="sent" class="text-center py-4">
      <div class="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4"><svg class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg></div>
      <p class="text-body text-slate-600">Si un compte existe, un lien a été envoyé.</p><NuxtLink to="/login" class="btn-secondary mt-4 inline-block">Retour</NuxtLink>
    </div>
    <form v-else class="space-y-4" @submit.prevent="handleSubmit"><AppInput v-model="email" type="email" label="Email" placeholder="vous@exemple.com" required /><AppButton type="submit" :loading="loading" class="w-full">Envoyer le lien</AppButton></form>
    <p v-if="!sent" class="mt-6 text-center text-body-sm text-slate-500"><NuxtLink to="/login" class="text-brand-600 hover:text-brand-700">Retour à la connexion</NuxtLink></p>
  </div>
</template>
