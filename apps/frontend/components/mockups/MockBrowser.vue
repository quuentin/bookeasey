<script setup lang="ts">
defineProps<{ url?: string }>()
</script>

<template>
  <div class="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-card bg-white">
    <!-- Browser chrome -->
    <div class="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-slate-50 border-b border-slate-100">
      <div class="flex gap-1.5">
        <div class="w-2.5 h-2.5 rounded-full bg-red-300" />
        <div class="w-2.5 h-2.5 rounded-full bg-amber-300" />
        <div class="w-2.5 h-2.5 rounded-full bg-emerald-300" />
      </div>
      <div v-if="url" class="flex-1 ml-2">
        <div class="bg-white rounded-md px-3 py-1 text-[11px] text-slate-400 border border-slate-100 max-w-[220px] truncate">
          {{ url }}
        </div>
      </div>
    </div>
    <!-- Content -->
    <div class="overflow-hidden">
      <slot />
    </div>
  </div>
</template>
