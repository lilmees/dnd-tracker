<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import { gsap, Power3 } from 'gsap'

withDefaults(
  defineProps<{
  title: string,
  text: string,
  buttonLabel?: string,
  buttonLink?: string,
  center?: boolean
  }>(), {
    center: false,
    buttonLabel: '',
    buttonLink: ''
  }
)

const localePath = useLocalePath()

const el = ref()
const isVisible = useElementVisibility(el)

watch(isVisible, (v: boolean) => {
  if (v) {
    gsap.fromTo(
      el.value,
      { scale: 0.85 },
      { scale: 1, duration: 0.75, ease: Power3.easeOut }
    )
  }
})
</script>

<template>
  <div ref="el" :class="{ 'text-center': center }">
    <h2 v-if="title" class="pb-4">
      {{ title }}
    </h2>
    <p
      v-if="text"
      class="max-w-prose"
      :class="{ 'mx-auto': center }"
    >
      {{ text }}
    </p>
    <div
      v-if="buttonLink && buttonLabel"
      class="flex"
      :class="[center ? 'justify-center' : 'justify-start']"
    >
      <NuxtLink
        :to="localePath(`/${buttonLink}`)"
        class="max-w-max"
      >
        <Button
          :label="buttonLabel"
          color="primary"
          class="mt-6 w-fit tracker-shadow-pulse"
        />
      </NuxtLink>
    </div>
  </div>
</template>
