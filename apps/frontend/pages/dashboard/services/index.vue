<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const { data: services, refresh } = useAsyncData('services', () => $api<any[]>('/services'))
const showDeleteModal = ref(false); const serviceToDelete = ref<string | null>(null)
function deleteService(id: string) { serviceToDelete.value = id; showDeleteModal.value = true }
async function confirmDelete() { if (!serviceToDelete.value) return; await $api(`/services/${serviceToDelete.value}`, { method: 'DELETE' }); showDeleteModal.value = false; serviceToDelete.value = null; refresh() }
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div><h2 class="text-heading-1 text-slate-900">Services</h2><p class="text-body text-slate-500 mt-1">Gérez les prestations que vous proposez</p></div>
      <NuxtLink to="/dashboard/services/new" class="btn-primary">+ Nouveau service</NuxtLink>
    </div>
    <div v-if="services?.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <GlassCard v-for="s in services" :key="s.id" hover padding="md">
        <div class="flex items-start justify-between mb-3">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: s.color || '#7c3aed' }" />
          <div class="flex gap-2 text-body-sm">
            <NuxtLink :to="`/dashboard/services/${s.id}/edit`" class="text-slate-400 hover:text-slate-700">Modifier</NuxtLink>
            <button class="text-red-400 hover:text-red-600" @click="deleteService(s.id)">Supprimer</button>
          </div>
        </div>
        <h3 class="font-semibold text-slate-900 mb-1">{{ s.name }}</h3>
        <p v-if="s.description" class="text-body-sm text-slate-500 mb-3">{{ s.description }}</p>
        <div class="flex items-center justify-between text-body-sm pt-3 border-t border-slate-100">
          <span class="text-slate-400">{{ s.durationMinutes }} min</span>
          <span class="font-semibold text-brand-600">{{ s.price }}€</span>
        </div>
      </GlassCard>
    </div>
    <div v-else class="text-center py-16"><div class="card p-8"><p class="text-slate-400 mb-4">Aucun service configuré</p><NuxtLink to="/dashboard/services/new" class="btn-primary">Créer mon premier service</NuxtLink></div></div>
    <GlassModal v-model="showDeleteModal" title="Supprimer ce service ?">
      <p class="text-body text-slate-500 mb-5">Cette action est irréversible.</p>
      <div class="flex justify-end gap-3"><AppButton variant="ghost" @click="showDeleteModal = false">Annuler</AppButton><AppButton variant="danger" @click="confirmDelete">Supprimer</AppButton></div>
    </GlassModal>
  </div>
</template>
