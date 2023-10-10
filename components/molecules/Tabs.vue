<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import { hasPermission } from '@/utils/permission-helpers'

withDefaults(
  defineProps<{
    tabs: Tab[],
    role: UserRole,
    disabled?: boolean
  }>(), {
    disabled: false
  }
)

const route = useRoute()
</script>

<template>
  <div class="flex justify-between border-b-4 border-slate-700">
    <div class="hidden sm:flex gap-6 dnd-container">
      <div
        v-for="(tab, i) in tabs"
        :key="i"
        class="pb-1 border-b-4 relative top-1 border-transparent"
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
    <Carousel class="dnd-container sm:hidden pb-1" :space="8">
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
            '!border-black': tab.link === route.fullPath
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
