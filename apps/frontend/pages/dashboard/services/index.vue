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
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Services</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Les prestations que vous proposez</p>
      </div>
      <NuxtLink to="/dashboard/services/new" class="btn-primary btn-sm flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        Nouveau
      </NuxtLink>
    </div>

    <div v-if="services?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <div v-for="s in services" :key="s.id" class="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-xs overflow-hidden hover:shadow-card hover:border-slate-200 dark:hover:border-slate-600 transition-all group">
        <!-- Color bar -->
        <div class="h-1.5" :style="{ backgroundColor: s.color || '#7c3aed' }" />
        <div class="p-4 sm:p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="{ backgroundColor: (s.color || '#7c3aed') + '15' }">
                <svg class="w-4 h-4" :style="{ color: s.color || '#7c3aed' }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{{ s.name }}</h3>
            </div>
          </div>

          <p v-if="s.description" class="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{{ s.description }}</p>

          <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
            <div class="flex items-center gap-3 text-xs text-slate-400">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {{ s.durationMinutes }} min
              </span>
            </div>
            <span class="text-base font-bold" :style="{ color: s.color || '#7c3aed' }">{{ s.price }}€</span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
            <NuxtLink :to="`/dashboard/services/${s.id}/edit`" class="flex-1 text-center py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors">
              Modifier
            </NuxtLink>
            <button class="flex-1 text-center py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" @click="deleteService(s.id)">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      </div>
      <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-1">Aucun service</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">Ajoutez votre première prestation pour commencer</p>
      <NuxtLink to="/dashboard/services/new" class="btn-primary btn-sm">Créer un service</NuxtLink>
    </div>

    <GlassModal v-model="showDeleteModal" title="Supprimer ce service ?">
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">Cette action est irréversible. Le service ne sera plus visible sur votre page.</p>
      <div class="flex justify-end gap-2">
        <AppButton variant="ghost" size="sm" @click="showDeleteModal = false">Annuler</AppButton>
        <AppButton variant="danger" size="sm" @click="confirmDelete">Supprimer</AppButton>
      </div>
    </GlassModal>
  </div>
</template>
