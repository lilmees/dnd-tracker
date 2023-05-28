<script setup lang="ts">
withDefaults(
  defineProps<{
  url: string,
  label: string,
  color?: string
}>(), {
    color: '#fff'
  })

const localePath = useLocalePath()
</script>

<template>
  <NuxtLink :to="localePath(`/${url}`)" class="flex justify-end">
    <div
      class="flex gap-2 items-center hover:text-primary duration-200 ease-in-out"
      :style="{ color: color || '#fff' }"
    >
      <Icon name="ph:arrow-left" class="h-6 w-6" />
      <p>{{ label }}</p>
    </div>
  </NuxtLink>
</template>
