<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp(); const loading = ref(false); const saved = ref(false)
const dayNames = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
interface DS { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }
const schedule = ref<DS[]>([]); const bufferMinutes = ref(15); const overrides = ref<any[]>([]); const newDate = ref(''); const newReason = ref('')
const { data: calendars } = useAsyncData('calendars', () => $api<any[]>('/calendars'))
watch(calendars, async (c) => { if (!c?.length) return; const cal = c.find((x:any)=>x.isDefault)||c[0]; schedule.value = await $api(`/calendars/${cal.id}/schedule`); overrides.value = await $api(`/calendars/${cal.id}/overrides`) }, { immediate: true })
async function saveSchedule() { if (!calendars.value?.length) return; loading.value = true; saved.value = false; const cal = calendars.value.find((c:any)=>c.isDefault)||calendars.value[0]; await $api(`/calendars/${cal.id}/schedule`, { method: 'PUT', body: { schedule: schedule.value, bufferMinutes: bufferMinutes.value } }); loading.value = false; saved.value = true; setTimeout(()=>saved.value=false, 3000) }
async function addOverride() { if (!newDate.value||!calendars.value?.length) return; const cal = calendars.value.find((c:any)=>c.isDefault)||calendars.value[0]; await $api(`/calendars/${cal.id}/overrides`, { method: 'POST', body: { date: newDate.value, isBlocked: true, reason: newReason.value } }); overrides.value = await $api(`/calendars/${cal.id}/overrides`); newDate.value=''; newReason.value='' }
async function removeOverride(id: string) { if (!calendars.value?.length) return; const cal = calendars.value.find((c:any)=>c.isDefault)||calendars.value[0]; await $api(`/calendars/${cal.id}/overrides/${id}`, { method: 'DELETE' }); overrides.value = await $api(`/calendars/${cal.id}/overrides`) }
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">Disponibilités</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Configurez vos horaires de travail</p>
    </div>

    <!-- Weekly schedule -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs overflow-hidden">
      <div class="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
          <svg class="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Horaires hebdomadaires</h3>
      </div>

      <div class="p-4 sm:p-6 space-y-2">
        <div v-for="day in schedule" :key="day.dayOfWeek"
          :class="['rounded-xl p-3 sm:p-4 transition-colors', day.isActive ? 'bg-slate-50 dark:bg-slate-900' : 'bg-slate-50/40 dark:bg-slate-900/40']">
          <!-- Mobile: stacked layout -->
          <div class="flex items-center justify-between mb-2 sm:mb-0">
            <div class="flex items-center gap-3">
              <AppToggle v-model="day.isActive" />
              <span :class="['text-sm font-medium', day.isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400']">
                {{ dayNames[day.dayOfWeek] }}
              </span>
            </div>
            <span v-if="!day.isActive" class="text-xs text-slate-400 sm:hidden">Fermé</span>
          </div>
          <!-- Time inputs -->
          <div v-if="day.isActive" class="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-14">
            <input v-model="day.startTime" type="time" class="input-field flex-1 sm:flex-none sm:w-28 text-sm" />
            <span class="text-xs text-slate-400">à</span>
            <input v-model="day.endTime" type="time" class="input-field flex-1 sm:flex-none sm:w-28 text-sm" />
          </div>
          <span v-if="!day.isActive" class="text-xs text-slate-400 hidden sm:block sm:ml-14">Fermé</span>
        </div>
      </div>

      <div class="px-4 sm:px-6 pb-5 space-y-4">
        <AppSelect v-model="bufferMinutes" :options="[{value:0,label:'Pas de pause'},{value:5,label:'5 min'},{value:10,label:'10 min'},{value:15,label:'15 min'},{value:30,label:'30 min'}]" label="Pause entre chaque RDV" />
        <div class="flex items-center gap-3">
          <AppButton :loading="loading" size="sm" @click="saveSchedule">Enregistrer</AppButton>
          <span v-if="saved" class="text-xs text-emerald-600 flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            Sauvegardé
          </span>
        </div>
      </div>
    </div>

    <!-- Day off / overrides -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs overflow-hidden">
      <div class="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
          <svg class="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
        </div>
        <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Jours de congé</h3>
      </div>

      <div class="p-4 sm:p-6">
        <!-- Add override form -->
        <div class="flex flex-col sm:flex-row gap-3 mb-5">
          <div class="flex-1">
            <AppInput v-model="newDate" type="date" label="Date" />
          </div>
          <div class="flex-1">
            <AppInput v-model="newReason" label="Motif (optionnel)" placeholder="Vacances, formation..." />
          </div>
          <AppButton class="self-end shrink-0" size="sm" @click="addOverride">Ajouter</AppButton>
        </div>

        <!-- Override list -->
        <div v-if="overrides.length" class="space-y-2">
          <div v-for="o in overrides" :key="o.id" class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                  {{ new Date(o.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }}
                </p>
                <p v-if="o.reason" class="text-xs text-slate-400 truncate">{{ o.reason }}</p>
              </div>
            </div>
            <button class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors shrink-0" @click="removeOverride(o.id)">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div v-else class="text-center py-6">
          <p class="text-xs text-slate-400">Aucun jour bloqué</p>
        </div>
      </div>
    </div>
  </div>
</template>
