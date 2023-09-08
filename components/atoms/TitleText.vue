<script setup lang="ts">
withDefaults(
  defineProps<{
  title?: string,
  text?: string,
  buttonLabel?: string,
  buttonLink?: string,
  center?: boolean
  }>(), {
    text: '',
    title: '',
    center: false,
    buttonLabel: '',
    buttonLink: ''
  }
)

const localePath = useLocalePath()
</script>

<template>
  <div :class="{ 'text-center': center }">
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
