<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp(); const currentDate = ref(new Date())
const weekStart = computed(() => { const d = new Date(currentDate.value); const day = d.getDay(); return new Date(d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))) })
const weekDays = computed(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart.value); d.setDate(d.getDate() + i); return d }))
const hours = Array.from({ length: 12 }, (_, i) => i + 8)
const { data: appointments, refresh: refreshCal } = useAsyncData('cal', async () => { const s = weekDays.value[0].toISOString().split('T')[0]; const e = weekDays.value[6].toISOString().split('T')[0]; return $api<any>('/appointments', { query: { startDate: s, endDate: e, status: 'CONFIRMED' } }).then(r => r.data || r) }, { watch: [currentDate] })
function aptsFor(d: Date) { return (appointments.value||[]).filter((a:any) => a.startTime.startsWith(d.toISOString().split('T')[0])) }
function fmtDay(d: Date) { return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }) }
function prev() { const d = new Date(currentDate.value); d.setDate(d.getDate()-7); currentDate.value = d }
function next() { const d = new Date(currentDate.value); d.setDate(d.getDate()+7); currentDate.value = d }
function today() { currentDate.value = new Date() }
function aptStyle(a: any) { const s = new Date(a.startTime), e = new Date(a.endTime); return { top: `${(s.getHours()-8)*64 + s.getMinutes()/60*64}px`, height: `${Math.max(((e.getTime()-s.getTime())/3600000)*64,24)}px` } }
const showCreateModal = ref(false)
function onCreated() { refreshCal() }
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3"><h2 class="text-heading-1 text-slate-900">Calendrier</h2><span class="text-body text-slate-400">{{ weekStart.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) }}</span></div>
      <div class="flex items-center gap-2">
        <button class="btn-primary btn-sm flex items-center gap-1.5" @click="showCreateModal = true">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Nouveau RDV
        </button>
        <div class="flex items-center gap-1">
          <AppButton variant="ghost" size="sm" @click="prev"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg></AppButton>
          <AppButton variant="secondary" size="sm" @click="today">Aujourd'hui</AppButton>
          <AppButton variant="ghost" size="sm" @click="next"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></AppButton>
        </div>
      </div>
    </div>
    <div class="card p-2 overflow-x-auto">
      <div class="min-w-[800px]">
        <div class="grid grid-cols-8 border-b border-slate-100"><div class="p-3 w-14" /><div v-for="d in weekDays" :key="d.toISOString()" :class="['p-2 text-center text-body-sm font-medium', d.toDateString()===new Date().toDateString()?'text-brand-600':'text-slate-500']">{{ fmtDay(d) }}</div></div>
        <div class="relative grid grid-cols-8"><div><div v-for="h in hours" :key="h" class="h-16 border-b border-slate-50 px-2 py-1"><span class="text-caption text-slate-400">{{ h }}h</span></div></div>
          <div v-for="d in weekDays" :key="d.toISOString()" class="relative border-l border-slate-50"><div v-for="h in hours" :key="h" class="h-16 border-b border-slate-50" />
            <div v-for="a in aptsFor(d)" :key="a.id" class="absolute left-1 right-1 bg-brand-50 border-l-2 border-brand-500 rounded-lg px-2 py-1 overflow-hidden cursor-pointer hover:bg-brand-100 transition-colors" :style="aptStyle(a)">
              <p class="text-caption font-medium text-brand-900 truncate">{{ a.clientName }}</p><p class="text-caption text-brand-600 truncate">{{ a.service?.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CreateAppointmentModal v-model="showCreateModal" @created="onCreated" />
  </div>
</template>
