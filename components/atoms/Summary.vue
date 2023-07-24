<script setup lang="ts">
import { gsap, Power3 } from 'gsap'

withDefaults(
  defineProps<{ title?: string, items?: string[]}>(),
  { title: '', items: () => [] }
)

const el: Ref<HTMLDivElement | undefined> = ref()
const isVisible: Ref<boolean> = useElementVisibility(el)

watch(isVisible, (v: boolean) => {
  if (v && el.value) {
    gsap.fromTo(
      el.value,
      { scale: 0.85 },
      { scale: 1, duration: 0.75, ease: Power3.easeOut }
    )
  }
})
</script>

<template>
  <div ref="el">
    <h2 v-if="title" class="pb-4">
      {{ title }}
    </h2>
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
