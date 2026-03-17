<script setup lang="ts">
interface Props { modelValue: boolean; title?: string; size?: 'sm' | 'md' | 'lg' }
const props = withDefaults(defineProps<Props>(), { title: '', size: 'md' })
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const sizeMap = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }
function close() { emit('update:modelValue', false) }
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="close">
        <div class="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" />
        <div :class="['relative w-full card-elevated p-6', sizeMap[size]]">
          <div v-if="title" class="flex items-center justify-between mb-4">
            <h2 class="text-heading-3 text-slate-900">{{ title }}</h2>
            <button class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" @click="close">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
