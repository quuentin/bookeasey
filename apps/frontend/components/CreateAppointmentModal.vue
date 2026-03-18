<script setup lang="ts">
interface Props { modelValue: boolean }
defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; 'created': [] }>()

const { $api } = useNuxtApp()
const loading = ref(false)
const error = ref('')

const form = reactive({
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  serviceId: '',
  calendarId: '',
  date: '',
  time: '',
})

const { data: services } = useAsyncData('modal-services', () => $api<any[]>('/services'))
const { data: calendars } = useAsyncData('modal-calendars', () => $api<any[]>('/calendars'))

const serviceOptions = computed(() =>
  (services.value || []).map((s: any) => ({ value: s.id, label: `${s.name} (${s.durationMinutes} min — ${s.price}€)` }))
)

const calendarOptions = computed(() =>
  (calendars.value || []).map((c: any) => ({ value: c.id, label: c.name }))
)

// Auto-select first calendar
watch(calendars, (val) => {
  if (val?.length && !form.calendarId) {
    form.calendarId = val[0].id
  }
}, { immediate: true })

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await $api('/appointments', {
      method: 'POST',
      body: {
        serviceId: form.serviceId,
        calendarId: form.calendarId,
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientPhone: form.clientPhone || undefined,
        date: form.date,
        time: form.time,
      },
    })
    emit('created')
    emit('update:modelValue', false)
    // Reset form
    Object.assign(form, { clientName: '', clientEmail: '', clientPhone: '', serviceId: '', calendarId: calendars.value?.[0]?.id || '', date: '', time: '' })
  } catch (e: any) {
    error.value = e.data?.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <GlassModal :model-value="modelValue" title="Nouveau rendez-vous" size="md" @update:model-value="$emit('update:modelValue', $event)">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <AppInput v-model="form.clientName" label="Nom du client" placeholder="Jean Dupont" required />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppInput v-model="form.clientEmail" type="email" label="Email" placeholder="jean@exemple.fr" required />
        <AppInput v-model="form.clientPhone" type="tel" label="Téléphone (optionnel)" placeholder="06 12 34 56 78" />
      </div>
      <AppSelect v-model="form.serviceId" :options="serviceOptions" label="Service" placeholder="Choisir un service" required />
      <AppSelect v-if="calendarOptions.length > 1" v-model="form.calendarId" :options="calendarOptions" label="Calendrier" required />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppInput v-model="form.date" type="date" label="Date" required />
        <AppInput v-model="form.time" type="time" label="Heure" required />
      </div>

      <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-100 text-body-sm text-red-600">{{ error }}</div>

      <div class="flex justify-end gap-3 pt-2">
        <button type="button" class="btn-ghost" @click="$emit('update:modelValue', false)">Annuler</button>
        <AppButton type="submit" :loading="loading">Créer le RDV</AppButton>
      </div>
    </form>
  </GlassModal>
</template>
