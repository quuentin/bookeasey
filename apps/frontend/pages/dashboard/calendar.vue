<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const currentDate = ref(new Date())
const selectedDay = ref(new Date())

const weekStart = computed(() => {
  const d = new Date(currentDate.value); const day = d.getDay()
  return new Date(d.setDate(d.getDate() - day + (day === 0 ? -6 : 1)))
})
const weekDays = computed(() => Array.from({ length: 7 }, (_, i) => {
  const d = new Date(weekStart.value); d.setDate(d.getDate() + i); return d
}))
const hours = Array.from({ length: 12 }, (_, i) => i + 8)

const { data: appointments, refresh: refreshCal } = useAsyncData('cal', async () => {
  const s = weekDays.value[0].toISOString().split('T')[0]
  const e = weekDays.value[6].toISOString().split('T')[0]
  return $api<any>('/appointments', { query: { startDate: s, endDate: e, status: 'CONFIRMED' } }).then(r => r.data || r)
}, { watch: [currentDate] })

function aptsFor(d: Date) { return (appointments.value || []).filter((a: any) => a.startTime.startsWith(d.toISOString().split('T')[0])) }
function fmtDay(d: Date) { return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }) }
function fmtDayLong(d: Date) { return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }
function fmtTime(d: string) { return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
function isToday(d: Date) { return d.toDateString() === new Date().toDateString() }
function isSelected(d: Date) { return d.toDateString() === selectedDay.value.toDateString() }
function prev() { const d = new Date(currentDate.value); d.setDate(d.getDate() - 7); currentDate.value = d }
function next() { const d = new Date(currentDate.value); d.setDate(d.getDate() + 7); currentDate.value = d }
function goToday() { currentDate.value = new Date(); selectedDay.value = new Date() }
function aptStyle(a: any) {
  const s = new Date(a.startTime), e = new Date(a.endTime)
  return { top: `${(s.getHours() - 8) * 60 + s.getMinutes()}px`, height: `${Math.max(((e.getTime() - s.getTime()) / 60000), 20)}px` }
}

const showCreateModal = ref(false)
function onCreated() { refreshCal() }

const selectedDayApts = computed(() => aptsFor(selectedDay.value))
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-lg font-bold text-slate-900">Calendrier</h2>
        <p class="text-sm text-slate-500 mt-0.5">{{ weekStart.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-primary btn-sm flex items-center gap-1.5" @click="showCreateModal = true">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          <span class="hidden sm:inline">Nouveau RDV</span>
          <span class="sm:hidden">Nouveau</span>
        </button>
        <div class="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
          <button class="p-1.5 rounded-md hover:bg-white hover:shadow-xs text-slate-500 transition-all" @click="prev">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button class="px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 hover:bg-white hover:shadow-xs transition-all" @click="goToday">Aujourd'hui</button>
          <button class="p-1.5 rounded-md hover:bg-white hover:shadow-xs text-slate-500 transition-all" @click="next">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile: day selector + list view -->
    <div class="sm:hidden space-y-4">
      <!-- Day pills -->
      <div class="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        <button v-for="d in weekDays" :key="d.toISOString()"
          :class="['flex flex-col items-center min-w-[52px] py-2 px-2.5 rounded-xl text-xs font-medium transition-all shrink-0',
            isSelected(d) ? 'bg-brand-600 text-white shadow-glow' :
            isToday(d) ? 'bg-brand-50 text-brand-700 border border-brand-200' :
            'bg-white text-slate-600 border border-slate-100']"
          @click="selectedDay = d"
        >
          <span class="text-[10px] uppercase" :class="isSelected(d) ? 'text-white/70' : 'text-slate-400'">{{ d.toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3) }}</span>
          <span class="text-base font-bold mt-0.5">{{ d.getDate() }}</span>
          <span v-if="aptsFor(d).length" class="w-1.5 h-1.5 rounded-full mt-1" :class="isSelected(d) ? 'bg-white/70' : 'bg-brand-400'" />
        </button>
      </div>

      <!-- Selected day appointments -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-100">
          <p class="text-sm font-semibold text-slate-900 capitalize">{{ fmtDayLong(selectedDay) }}</p>
          <p class="text-xs text-slate-400">{{ selectedDayApts.length }} rendez-vous</p>
        </div>
        <div v-if="selectedDayApts.length" class="divide-y divide-slate-50">
          <NuxtLink v-for="a in selectedDayApts" :key="a.id" :to="`/dashboard/appointments/${a.id}`"
            class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
            <div class="w-10 h-10 rounded-lg bg-brand-50 flex flex-col items-center justify-center shrink-0">
              <p class="text-[11px] font-bold text-brand-700 leading-none">{{ fmtTime(a.startTime) }}</p>
              <p class="text-[9px] text-brand-400 mt-0.5">{{ fmtTime(a.endTime) }}</p>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 truncate">{{ a.clientName }}</p>
              <p class="text-xs text-slate-400 truncate">{{ a.service?.name }}</p>
            </div>
            <svg class="w-4 h-4 text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </NuxtLink>
        </div>
        <div v-else class="py-10 text-center">
          <p class="text-xs text-slate-400">Aucun rendez-vous ce jour</p>
        </div>
      </div>
    </div>

    <!-- Desktop: week grid view -->
    <div class="hidden sm:block bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <div class="min-w-[700px]">
          <!-- Day headers -->
          <div class="grid grid-cols-8 border-b border-slate-100">
            <div class="p-2 w-12" />
            <div v-for="d in weekDays" :key="d.toISOString()"
              :class="['p-2 text-center border-l border-slate-50',
                isToday(d) ? 'bg-brand-50/50' : '']">
              <p class="text-[10px] text-slate-400 uppercase">{{ d.toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3) }}</p>
              <p :class="['text-sm font-bold mt-0.5', isToday(d) ? 'text-brand-600' : 'text-slate-700']">{{ d.getDate() }}</p>
            </div>
          </div>

          <!-- Time grid -->
          <div class="relative grid grid-cols-8">
            <!-- Hours column -->
            <div>
              <div v-for="h in hours" :key="h" class="h-[60px] border-b border-slate-50 px-1.5 py-0.5">
                <span class="text-[10px] text-slate-400">{{ h }}h</span>
              </div>
            </div>
            <!-- Day columns -->
            <div v-for="d in weekDays" :key="d.toISOString()" :class="['relative border-l border-slate-50', isToday(d) ? 'bg-brand-50/20' : '']">
              <div v-for="h in hours" :key="h" class="h-[60px] border-b border-slate-50" />
              <!-- Appointments -->
              <NuxtLink v-for="a in aptsFor(d)" :key="a.id" :to="`/dashboard/appointments/${a.id}`"
                class="absolute left-0.5 right-0.5 bg-brand-100 border-l-2 border-brand-500 rounded px-1.5 py-0.5 overflow-hidden cursor-pointer hover:bg-brand-200 transition-colors"
                :style="aptStyle(a)">
                <p class="text-[10px] font-semibold text-brand-900 truncate leading-tight">{{ a.clientName }}</p>
                <p class="text-[9px] text-brand-600 truncate leading-tight">{{ a.service?.name }}</p>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CreateAppointmentModal v-model="showCreateModal" @created="onCreated" />
  </div>
</template>
