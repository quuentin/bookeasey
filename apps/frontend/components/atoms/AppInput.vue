<script setup lang="ts">
interface Props { modelValue: string | number; type?: string; label?: string; placeholder?: string; error?: string; required?: boolean; disabled?: boolean }
withDefaults(defineProps<Props>(), { type: 'text', label: '', placeholder: '', error: '', required: false, disabled: false })
defineEmits<{ 'update:modelValue': [value: string | number] }>()
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-body-sm font-medium text-slate-700">
      {{ label }}<span v-if="required" class="text-brand-500 ml-0.5">*</span>
    </label>
    <input
      :type="type" :value="modelValue" :placeholder="placeholder" :required="required" :disabled="disabled"
      :class="['input-field', error && 'border-red-300 focus:border-red-400 focus:ring-red-100', disabled && 'opacity-50 cursor-not-allowed bg-slate-50']"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-caption text-red-500">{{ error }}</p>
  </div>
</template>
