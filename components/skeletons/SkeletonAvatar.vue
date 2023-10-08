<script setup lang="ts">
withDefaults(
  defineProps<{
    username?: boolean
    name?: boolean
  }>(), {
    username: false,
    name: false
  }
)
</script>

<template>
  <div class="flex items-end gap-2 animate-pulse">
    <div class="w-10 h-10 rounded-lg bg-background" />
    <div v-if="username || name" class="flex flex-col items-start gap-1">
      <div v-if="username" class="w-20 h-4 rounded-full bg-background" />
      <div v-if="name" class="w-16 h-4 rounded-full bg-background" />
    </div>
  </div>
</template>
