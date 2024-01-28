<script setup lang="ts">
withDefaults(
  defineProps<{
  title?: string
  text?: string
  text2?: string
  buttonLabel?: string
  buttonLink?: string
  center?: boolean
  sprite?: string
  }>(), {
    text: '',
    text2: '',
    title: '',
    center: false,
    buttonLabel: '',
    buttonLink: '',
    sprite: undefined
  }
)
</script>

<template>
  <div class="group" :class="{ 'text-center': center }">
    <h2
      v-if="title"
      class="pb-4 relative max-w-max"
      :class="{ 'mx-auto': center }"
    >
      {{ title }}
      <img
        v-if="sprite"
        :src="`/art/${sprite}`"
        loading="lazy"
        class="w-10 h-10 absolute -right-12 -top-3 z-[-1] group-hover:rotate-12 transition-transform group-hover:scale-[1.2]"
      >
    </h2>
    <p
      v-if="text"
      class="max-w-prose"
      :class="{ 'mx-auto': center }"
    >
      {{ text }}
    </p>
    <p
      v-if="text2"
      class="max-w-prose pt-3"
      :class="{ 'mx-auto': center }"
    >
      {{ text2 }}
    </p>
    <div
      v-if="buttonLink && buttonLabel"
      class="flex mt-6"
      :class="[center ? 'justify-center' : 'justify-start']"
    >
      <RouteLink :url="buttonLink">
        <button
          class="w-fit btn-primary"
          :aria-label="buttonLabel"
        >
          {{ buttonLabel }}
        </button>
      </RouteLink>
    </div>
  </div>
</template>
