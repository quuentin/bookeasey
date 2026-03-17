<script setup lang="ts">
interface Option { value: string | number; label: string }
interface Props { modelValue: string | number; options: Option[]; label?: string; placeholder?: string; error?: string; required?: boolean }
withDefaults(defineProps<Props>(), { label: '', placeholder: 'Sélectionner...', error: '', required: false })
defineEmits<{ 'update:modelValue': [value: string | number] }>()
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-body-sm font-medium text-slate-700">
      {{ label }}<span v-if="required" class="text-brand-500 ml-0.5">*</span>
    </label>
    <select :value="modelValue" :required="required" :class="['input-field appearance-none cursor-pointer', error && 'border-red-300']" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p v-if="error" class="text-caption text-red-500">{{ error }}</p>
  </div>
</template>
