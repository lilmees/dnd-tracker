<script setup>
defineProps({
  title: { type: String },
  text: { type: String },
  buttonLabel: { type: String },
  buttonLink: { type: String },
  center: { type: Boolean, default: false },
})
</script>

<template>
  <div v-motion-slide-bottom :class="{ 'text-center': center }">
    <h2 v-if="title" class="pb-4">{{ title }}</h2>
    <p v-if="text" class="max-w-prose" :class="{ 'mx-auto': center }">
      {{ text }}
    </p>
    <div v-if="buttonLink && buttonLabel" class="flex" :class="[center ? 'justify-center' : 'justify-start']">
      <NuxtLink :to="buttonLink" class="max-w-max">
        <Button :label="buttonLabel" color="primary" class="mt-6 w-fit tracker-shadow-pulse" />
      </NuxtLink>
    </div>
  </div>
</template>
