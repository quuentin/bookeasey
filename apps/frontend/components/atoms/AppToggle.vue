<script setup lang="ts">
interface Props { modelValue: boolean; label?: string }
withDefaults(defineProps<Props>(), { label: '' })
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <label class="flex items-center gap-3 cursor-pointer">
    <button type="button" role="switch" :aria-checked="modelValue"
      :class="['relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200', modelValue ? 'bg-brand-600' : 'bg-slate-200']"
      @click="$emit('update:modelValue', !modelValue)">
      <span :class="['pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200', modelValue ? 'translate-x-5' : 'translate-x-0']" />
    </button>
    <span v-if="label" class="text-body-sm text-slate-600">{{ label }}</span>
  </label>
</template>
