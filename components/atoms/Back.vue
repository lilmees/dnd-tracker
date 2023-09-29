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
  <NuxtLink :to="localePath(url)" class="w-fit group">
    <div
      class="flex gap-2 items-center"
      :style="{ color: color || '#fff' }"
    >
      <Icon
        name="ph:arrow-left"
        class="h-6 w-6 group-hover:mr-2 duration-200 ease-in-out"
        aria-hidden="true"
      />
      <p>{{ label }}</p>
    </div>
  </NuxtLink>
</template>
