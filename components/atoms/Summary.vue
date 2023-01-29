<script setup>
defineProps({
  title: { type: String },
  items: { type: Array },
})
</script>

<template>
  <div v-motion-slide-bottom>
    <h2 v-if="title" class="pb-4">{{ title }}</h2>
    <div v-if="items.length" class="flex flex-col gap-4">
      <div v-for="item in items" :key="item" class="flex items-center gap-4">
        <NuxtImg
          src="/dice.webp"
          alt="Dice"
          sizes="sm:40px md:40px lg:40px"
          format="webp"
          class="w-6 h-6 animate-pulse"
        />
        <p>{{ item }}</p>
      </div>
    </div>
  </div>
</template>
