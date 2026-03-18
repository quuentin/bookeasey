<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp(); const authStore = useAuthStore(); const loading = ref(false); const saved = ref(false)
const form = reactive({ businessName: '', description: '', phone: '', address: '', city: '', postalCode: '' })
onMounted(async () => { const p = await $api<any>('/professional/profile'); Object.assign(form, { businessName: p.businessName, description: p.description||'', phone: p.phone||'', address: p.address||'', city: p.city||'', postalCode: p.postalCode||'' }) })
async function save() { loading.value = true; saved.value = false; await $api('/professional/profile', { method: 'PUT', body: form }); await authStore.fetchMe(); loading.value = false; saved.value = true; setTimeout(()=>saved.value=false, 3000) }
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-heading-1 text-slate-900">Paramètres</h2>
    <div class="card p-6">
      <h3 class="text-heading-2 text-slate-900 mb-5">Profil de l'activité</h3>
      <form class="space-y-4" @submit.prevent="save">
        <AppInput v-model="form.businessName" label="Nom de l'activité" required />
        <div class="space-y-1.5"><label class="block text-body-sm font-medium text-slate-700">Description</label><textarea v-model="form.description" class="input-field" rows="3" placeholder="Décrivez votre activité..." /></div>
        <AppInput v-model="form.phone" type="tel" label="Téléphone" /><AppInput v-model="form.address" label="Adresse" />
        <div class="grid grid-cols-2 gap-4"><AppInput v-model="form.city" label="Ville" /><AppInput v-model="form.postalCode" label="Code postal" /></div>
        <div class="flex items-center gap-3 pt-2"><AppButton type="submit" :loading="loading">Enregistrer</AppButton><span v-if="saved" class="text-body-sm text-emerald-600">Sauvegardé !</span></div>
      </form>
    </div>
    <div class="card p-6">
      <h3 class="text-heading-2 text-slate-900 mb-3">Abonnement</h3>
      <div class="flex items-center justify-between">
        <div><AppBadge :variant="authStore.isPremium ? 'brand' : 'neutral'">{{ authStore.isPremium ? 'Premium' : 'Gratuit' }}</AppBadge><p class="text-body-sm text-slate-500 mt-2">{{ authStore.isPremium ? 'Toutes les fonctionnalités débloquées.' : 'Passez Premium pour tout débloquer.' }}</p></div>
        <NuxtLink v-if="!authStore.isPremium" to="/dashboard/upgrade" class="btn-primary btn-sm">Passer Premium</NuxtLink>
      </div>
    </div>
    <div class="card p-6">
      <h3 class="text-heading-2 text-slate-900 mb-3">Lien de réservation</h3>
      <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"><code class="text-body text-brand-600 flex-1">bookeasey.fr/{{ authStore.professional?.slug }}</code><button class="btn-secondary btn-sm" @click="navigator.clipboard.writeText(`${$config.public.appUrl}/${authStore.professional?.slug}`)">Copier</button></div>
    </div>
    <div class="card p-6">
      <h3 class="text-heading-2 text-slate-900 mb-3">Intégrations</h3>
      <p class="text-body-sm text-slate-500 mb-4">Connectez Google Calendar et d'autres outils.</p>
      <NuxtLink to="/dashboard/settings/integrations" class="btn-secondary btn-sm inline-flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
        Gérer les intégrations
      </NuxtLink>
    </div>
  </div>
</template>
