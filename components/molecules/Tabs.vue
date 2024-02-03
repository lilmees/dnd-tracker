<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'

withDefaults(
  defineProps<{
    tabs: Tab[],
    role: UserRole,
    disabled?: boolean
  }>(), {
    disabled: false
  }
)

const { width } = useWindowSize()
const route = useRoute()

const slideOffset = ref<number>(16)

watch(width, v => (slideOffset.value = calculateSliderOverflow(v)), { immediate: true })
</script>

<template>
  <div class="flex justify-between border-b-4 border-slate-700">
    <div class="hidden sm:flex gap-6 dnd-container">
      <div
        v-for="(tab, i) in tabs"
        :key="i"
        class="pb-1 border-b-4 relative top-1 border-transparent transition-colors duration-200 ease-in-out"
        :class="{ '!border-primary': tab.link === route.fullPath }"
      >
        <RouteLink
          :url="tab.link"
          class="flex gap-2 items-center py-1 px-2 rounded-lg text-slate-300 hover:bg-tracker hover:text-white"
          active-class="text-white"
          :class="{
            'pointer-events-none opacity-50': !hasPermission(role, tab.role)
          }"
        >
          <Icon :name="tab.icon" class="w-5 h-5" />
          <span>
            {{ tab.label }}
          </span>
        </RouteLink>
      </div>
    </div>
    <Carousel class="pb-1 w-full sm:hidden" :space="8" :slide-offset="slideOffset">
      <SwiperSlide
        v-for="(tab, i) in tabs"
        :key="i"
        class="max-w-fit"
      >
        <RouteLink
          :url="tab.link"
          class="flex gap-2 items-center py-1 px-2 rounded-lg text-slate-300 bg-tracker border-4 border-tracker hover:text-white"
          active-class="text-white"
          :class="{
            'pointer-events-none opacity-50': !hasPermission(role, tab.role),
            '!border-slate-300': tab.link === route.fullPath
          }"
        >
          <Icon :name="tab.icon" class="w-5 h-5" />
          <span>
            {{ tab.label }}
          </span>
        </RouteLink>
      </SwiperSlide>
    </Carousel>
  </div>
</template>
