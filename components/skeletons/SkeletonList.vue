<script setup lang="ts">
withDefaults(
  defineProps<{
    amount?: number
  }>(), {
    amount: 10
  }
)
</script>

<template>
  <ul class="list-disc list-outside ml-4 grid sm:grid-cols-2 gap-x-6">
    <li v-for="i in amount" :key="i" class="mb-1 last:mb-0">
      <div class="animate-pulse rounded-lg bg-tracker/50 h-8 border-4 border-tracker" />
    </li>
  </ul>
</template>
