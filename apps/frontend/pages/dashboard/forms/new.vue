<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { $api } = useNuxtApp()
const loading = ref(false)
const error = ref('')

const formName = ref('')

interface Question {
  id: number
  type: 'text' | 'textarea' | 'select' | 'checkbox'
  label: string
  required: boolean
  options: string[]
}

const questions = ref<Question[]>([
  { id: 1, type: 'text', label: '', required: false, options: [] },
])

let nextId = 2

function addQuestion() {
  questions.value.push({
    id: nextId++,
    type: 'text',
    label: '',
    required: false,
    options: [],
  })
}

function removeQuestion(id: number) {
  if (questions.value.length <= 1) return
  questions.value = questions.value.filter(q => q.id !== id)
}

function addOption(question: Question) {
  question.options.push('')
}

function removeOption(question: Question, index: number) {
  question.options.splice(index, 1)
}

const typeOptions = [
  { value: 'text', label: 'Texte court' },
  { value: 'textarea', label: 'Texte long' },
  { value: 'select', label: 'Liste déroulante' },
  { value: 'checkbox', label: 'Case à cocher' },
]

async function handleSubmit() {
  error.value = ''
  if (!formName.value.trim()) {
    error.value = 'Le nom du formulaire est requis'
    return
  }
  const emptyLabel = questions.value.find(q => !q.label.trim())
  if (emptyLabel) {
    error.value = 'Toutes les questions doivent avoir un libellé'
    return
  }

  loading.value = true
  try {
    const fields = questions.value.map(q => ({
      type: q.type,
      label: q.label,
      required: q.required,
      options: q.type === 'select' ? q.options.filter(o => o.trim()) : undefined,
    }))

    await $api('/forms', {
      method: 'POST',
      body: {
        name: formName.value,
        fields,
      },
    })
    navigateTo('/dashboard/forms')
  } catch (e: any) {
    error.value = e.data?.message || 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl">
    <h2 class="text-heading-1 text-slate-900 mb-6">Nouveau formulaire</h2>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Form name -->
      <div class="card p-6">
        <AppInput v-model="formName" label="Nom du formulaire" placeholder="Ex: Informations pré-consultation" required />
      </div>

      <!-- Questions -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-slate-900">Questions</h3>
          <button type="button" class="btn-secondary btn-sm flex items-center gap-1.5" @click="addQuestion">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Ajouter une question
          </button>
        </div>

        <div v-for="(question, qIndex) in questions" :key="question.id" class="card p-5">
          <div class="flex items-start justify-between mb-4">
            <span class="text-xs font-semibold text-slate-400 uppercase">Question {{ qIndex + 1 }}</span>
            <button
              v-if="questions.length > 1"
              type="button"
              class="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              @click="removeQuestion(question.id)"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>

          <div class="space-y-3">
            <AppInput v-model="question.label" label="Libellé" placeholder="Ex: Avez-vous des allergies ?" required />

            <div class="grid grid-cols-2 gap-4">
              <AppSelect
                v-model="question.type"
                :options="typeOptions"
                label="Type de réponse"
              />
              <div class="flex items-end pb-0.5">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="question.required" type="checkbox" class="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                  <span class="text-sm text-slate-700">Obligatoire</span>
                </label>
              </div>
            </div>

            <!-- Options for select type -->
            <div v-if="question.type === 'select'" class="space-y-2 pt-2 border-t border-slate-100">
              <label class="block text-body-sm font-medium text-slate-700">Options</label>
              <div v-for="(_, oIndex) in question.options" :key="oIndex" class="flex items-center gap-2">
                <input
                  v-model="question.options[oIndex]"
                  type="text"
                  class="input-field flex-1"
                  :placeholder="`Option ${oIndex + 1}`"
                />
                <button type="button" class="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" @click="removeOption(question, oIndex)">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <button type="button" class="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1" @click="addOption(question)">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Ajouter une option
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-100 text-body-sm text-red-600">{{ error }}</div>

      <div class="flex justify-end gap-3">
        <NuxtLink to="/dashboard/forms" class="btn-ghost">Annuler</NuxtLink>
        <AppButton type="submit" :loading="loading">Créer le formulaire</AppButton>
      </div>
    </form>
  </div>
</template>
