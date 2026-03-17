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
  <div class="space-y-6 max-w-3xl">
    <h2 class="text-heading-1 text-slate-900">Disponibilités</h2>
    <div class="card p-6">
      <h3 class="text-heading-2 text-slate-900 mb-5">Horaires hebdomadaires</h3>
      <div class="space-y-2">
        <div v-for="day in schedule" :key="day.dayOfWeek" :class="['flex items-center gap-4 p-3 rounded-xl', day.isActive ? 'bg-slate-50' : 'bg-slate-50/50 opacity-50']">
          <AppToggle v-model="day.isActive" />
          <span class="w-24 font-medium text-body text-slate-700">{{ dayNames[day.dayOfWeek] }}</span>
          <template v-if="day.isActive"><input v-model="day.startTime" type="time" class="input-field w-28" /><span class="text-slate-400">à</span><input v-model="day.endTime" type="time" class="input-field w-28" /></template>
          <span v-else class="text-body-sm text-slate-400 italic">Fermé</span>
        </div>
      </div>
      <div class="mt-5"><AppSelect v-model="bufferMinutes" :options="[{value:0,label:'Pas de pause'},{value:5,label:'5 min'},{value:10,label:'10 min'},{value:15,label:'15 min'},{value:30,label:'30 min'}]" label="Pause entre RDV" /></div>
      <div class="flex items-center gap-3 mt-5"><AppButton :loading="loading" @click="saveSchedule">Enregistrer</AppButton><span v-if="saved" class="text-body-sm text-emerald-600">Sauvegardé !</span></div>
    </div>
    <div class="card p-6">
      <h3 class="text-heading-2 text-slate-900 mb-5">Jours de congé</h3>
      <div class="flex gap-3 mb-5"><AppInput v-model="newDate" type="date" label="Date" /><AppInput v-model="newReason" label="Motif" placeholder="Vacances" /><AppButton class="self-end" @click="addOverride">Ajouter</AppButton></div>
      <div v-if="overrides.length" class="space-y-2">
        <div v-for="o in overrides" :key="o.id" class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div><span class="font-medium text-slate-800">{{ new Date(o.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }}</span><span v-if="o.reason" class="text-body-sm text-slate-400 ml-2">— {{ o.reason }}</span></div>
          <button class="text-body-sm text-red-500 hover:underline" @click="removeOverride(o.id)">Supprimer</button>
        </div>
      </div>
      <p v-else class="text-body-sm text-slate-400">Aucun jour bloqué</p>
    </div>
  </div>
</template>
