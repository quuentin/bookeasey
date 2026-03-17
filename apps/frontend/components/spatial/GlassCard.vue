<script setup lang="ts">
interface Props {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  as?: string
}

const props = withDefaults(defineProps<Props>(), {
  hover: false,
  padding: 'md',
  as: 'div',
})

const paddingMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
</script>

<template>
  <component
    :is="as"
    :class="[hover ? 'card-hover' : 'card', paddingMap[padding]]"
  >
    <slot />
  </component>
</template>
