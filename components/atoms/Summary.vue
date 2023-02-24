<script setup>
import { useElementVisibility } from '@vueuse/core'
import { gsap } from 'gsap'

defineProps({
  title: { type: String },
  items: { type: Array },
})

const el = ref()
const isVisible = useElementVisibility(el)

watch(isVisible, v => {
  if(v) gsap.fromTo(el.value, { y: 100 }, { y: 0 })
})
</script>

<template>
  <div ref="el">
    <h2 v-if="title" class="pb-4">{{ title }}</h2>
    <div v-if="items.length" class="flex flex-col gap-4">
      <div v-for="item in items" :key="item" class="flex items-center gap-4">
        <NuxtImg
          src="/dice.webp"
          alt="Dice"
          sizes="sm:40px md:40px lg:40px"
          format="webp"
          provider="imagekit"
          class="w-6 h-6 animate-pulse"
        />
        <p>{{ item }}</p>
      </div>
    </div>
  </div>
</template>
