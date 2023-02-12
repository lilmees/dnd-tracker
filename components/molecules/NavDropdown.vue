<script setup>
import ChevronDown from '@/assets/icons/chevron-down.svg'

defineProps({
  label: { type: String },
  routes: { type: Array },
})

const localePath = useLocalePath()

const isOpen = ref(false)
</script>

<template>
  <div v-click-outside="() => (isOpen = false)" class="relative">
    <button
      class="flex flex-row items-center px-4 py-3 cursor-pointer gap-x-2 group bg-tracker rounded-md group"
      :class="{ 'rounded-b-none': isOpen }"
      @click="isOpen = !isOpen"
    >
      <span class="duration-200 font-bold text-slate-300 group-hover:text-white">
        {{ label }}
      </span>
      <ChevronDown class="duration-200 ease-in-out" :class="{ 'rotate-180': isOpen }" />
    </button>
    <div class="absolute z-[1] block w-max right-0" :class="{ 'invisible top-0': !isOpen }">
      <div
        class="bg-tracker flex flex-col gap-y-3 p-5 pr-[30px] relative rounded-b rounded-tl box-border text-slate-300"
      >
        <NuxtLink
          v-for="route in routes"
          :key="route"
          :to="localePath(`/${route.url}`)"
          class="hover:text-white"
          active-class="active-link"
          @click="isOpen = false"
        >
          {{ $t(route.label) }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.active-link {
  @apply text-primary underline;
}
</style>
