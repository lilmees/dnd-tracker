<script setup>
import ArrowLeft from '@/assets/icons/arrow-left.svg'

defineProps({
  url: { type: String, required: true },
  label: { type: String, required: true },
})
</script>

<template>
  <NuxtLink :to="url" class="flex justify-end">
    <div class="flex gap-2 items-center hover:text-primary duration-200 ease-in-out">
      <ArrowLeft class="h-8 w-8" />
      <p>{{ label }}</p>
    </div>
  </NuxtLink>
</template>
