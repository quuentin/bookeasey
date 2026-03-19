<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { $api } = useNuxtApp()
const search = ref('')
const clients = ref<any[]>([])
const loading = ref(true)
const searchTimeout = ref<any>(null)

async function fetchClients(query?: string) {
  loading.value = true
  try {
    const params: any = {}
    if (query && query.trim()) params.search = query.trim()
    clients.value = await $api<any[]>('/clients', { query: params })
  } catch {
    clients.value = []
  } finally {
    loading.value = false
  }
}

watch(search, (val) => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => fetchClients(val), 300)
})

onMounted(() => fetchClients())

function formatDate(d: string | null) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-heading-2 text-slate-900 dark:text-white">Clients</h1>
        <p class="text-body-sm text-slate-500 dark:text-slate-400 mt-1">Gérez vos fiches clients et suivez leur historique</p>
      </div>
      <div class="text-sm text-slate-500 dark:text-slate-400">
        {{ clients.length }} client{{ clients.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Search bar -->
    <div class="mb-6">
      <div class="relative">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un client par nom ou email..."
          class="input-field pl-11"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <AppSpinner size="lg" />
    </div>

    <!-- Empty state -->
    <div v-else-if="clients.length === 0" class="text-center py-16">
      <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
      <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-1">
        {{ search ? 'Aucun résultat' : 'Aucun client' }}
      </h3>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        {{ search ? 'Aucun client ne correspond à votre recherche.' : 'Les clients seront créés automatiquement lors des réservations.' }}
      </p>
    </div>

    <!-- Client cards -->
    <div v-else class="grid gap-3">
      <NuxtLink
        v-for="client in clients"
        :key="client.id"
        :to="`/dashboard/clients/${client.id}`"
        class="card-hover p-4 sm:p-5 block"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3.5 min-w-0 flex-1">
            <!-- Avatar -->
            <div class="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0">
              <span class="text-sm font-semibold text-brand-600 dark:text-brand-400">{{ client.name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ client.name }}</h3>
                <!-- Tags -->
                <span
                  v-for="tag in client.tags?.slice(0, 3)"
                  :key="tag"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400"
                >
                  {{ tag }}
                </span>
              </div>
              <div class="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span class="truncate">{{ client.email }}</span>
                <span v-if="client.phone" class="hidden sm:inline">{{ client.phone }}</span>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-4 shrink-0 text-right">
            <div class="hidden sm:block">
              <p class="text-xs text-slate-400 dark:text-slate-500">Visites</p>
              <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ client.totalVisits }}</p>
            </div>
            <div class="hidden sm:block">
              <p class="text-xs text-slate-400 dark:text-slate-500">Dépensé</p>
              <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ client.totalSpent }}€</p>
            </div>
            <div class="hidden md:block">
              <p class="text-xs text-slate-400 dark:text-slate-500">Dernière visite</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ formatDate(client.lastVisitAt) }}</p>
            </div>
            <svg class="w-4 h-4 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
