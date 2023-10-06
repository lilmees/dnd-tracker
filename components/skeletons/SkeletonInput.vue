<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: boolean
  }>(), {
    label: true
  }
)
</script>

<template>
  <div class="mb-3">
    <div
      v-if="label"
      class="animate-pulse rounded-full bg-tracker/50 h-5 w-20 mb-2 border-4 border-tracker"
    />
    <div class="animate-pulse rounded-lg bg-tracker/50 h-12 border-4 border-tracker" />
  </div>
</template>
