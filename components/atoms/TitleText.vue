<script setup>
import { useElementVisibility } from '@vueuse/core'
import { gsap } from 'gsap'

defineProps({
  title: { type: String },
  text: { type: String },
  buttonLabel: { type: String },
  buttonLink: { type: String },
  center: { type: Boolean, default: false },
})

const localePath = useLocalePath()

const el = ref()
const isVisible = useElementVisibility(el)

watch(isVisible, v => {
  if(v) gsap.fromTo(el.value, { y: 100 }, { y: 0 })
})
</script>

<template>
    <div ref="el" :class="{ 'text-center': center }">
      <h2 v-if="title" class="pb-4">{{ title }}</h2>
      <p v-if="text" class="max-w-prose" :class="{ 'mx-auto': center }">
        {{ text }}
      </p>
      <div v-if="buttonLink && buttonLabel" class="flex" :class="[center ? 'justify-center' : 'justify-start']">
        <NuxtLink :to="localePath(`/${buttonLink}`)" class="max-w-max">
          <Button :label="buttonLabel" color="primary" class="mt-6 w-fit tracker-shadow-pulse" />
        </NuxtLink>
      </div>
    </div>
</template>
