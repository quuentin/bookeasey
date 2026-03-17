<script setup lang="ts">
interface Props { variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand'; size?: 'sm' | 'md' }
withDefaults(defineProps<Props>(), { variant: 'neutral', size: 'md' })
const v: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
  danger: 'bg-red-50 text-red-700 border border-red-200/60',
  info: 'bg-blue-50 text-blue-700 border border-blue-200/60',
  neutral: 'bg-slate-100 text-slate-600 border border-slate-200/60',
  brand: 'bg-brand-50 text-brand-700 border border-brand-200/60',
}
</script>

<template>
  <span :class="['inline-flex items-center font-medium rounded-full', v[variant], size === 'sm' ? 'px-2 py-0.5 text-caption' : 'px-2.5 py-0.5 text-body-sm']">
    <slot />
  </span>
</template>
