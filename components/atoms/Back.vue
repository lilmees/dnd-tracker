<script setup lang="ts">
defineProps<{ url: string, label: string }>()

const localePath = useLocalePath()
</script>

<template>
  <NuxtLink
    :to="localePath(url)"
    class="w-fit group"
  >
    <div class="flex gap-2 items-center">
      <Icon
        name="ph:arrow-left"
        class="h-6 w-6 group-hover:mr-2 transition-all duration-200 ease-in-out"
        aria-hidden="true"
      />
      <p>{{ label }}</p>
    </div>
  </NuxtLink>
</template>
