<script setup lang="ts">
import { Swiper } from 'swiper/vue'
import { Keyboard, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

defineEmits(['loaded', 'slideChange'])
withDefaults(
  defineProps<{
    space?: number,
    speed?: number,
    loop?: boolean,
    centered?: boolean,
    pagination?: boolean,
    navigation?: boolean
  }>(), {
    space: 32,
    speed: 600,
    loop: false,
    centered: false,
    pagination: false,
    navigation: false
  }
)
</script>

<template>
  <section>
    <Swiper
      observer
      grab-cursor
      touch-release-on-edges
      keyboard
      :centered-slides="centered"
      :loop="loop"
      :space-between="space"
      :speed="speed"
      :slides-per-view="'auto'"
      :pagination="{
        enabled: pagination,
        clickable: true
      }"
      :navigation="navigation"
      :modules="[Keyboard, Pagination, Navigation]"
      class="w-full overflow-hidden"
      @swiper="$emit('loaded', $event)"
      @slide-change="$emit('slideChange', $event)"
    >
      <slot />
    </Swiper>
  </section>
</template>

<style>
  .swiper-pagination-bullets {
    @apply flex justify-center gap-0;
  }

  .swiper-pagination-bullet {
    @apply bg-tracker opacity-50 scale-75 duration-200 ease-in-out;
  }

  .swiper-pagination-bullet-active {
    @apply bg-black opacity-100 scale-100;
  }

  .swiper-button-next, .swiper-button-prev {
    @apply hidden;
  }
</style>
