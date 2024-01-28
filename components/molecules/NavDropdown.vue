<script setup lang="ts">
import { start, end } from '@/utils/animation-helpers'

defineExpose({ close })
withDefaults(
  defineProps<{
    label?: string
    routes?: Route[]
    loggedIn?: boolean
  }>(), {
    label: '',
    routes: () => [],
    loggedIn: false
  }
)

const isOpen = ref<boolean>(false)

onKeyStroke('Escape', () => close())

function close (): void {
  isOpen.value = false
}
</script>

<template>
  <div v-click-outside="() => (isOpen = false)" class="relative">
    <button
      class="border-4 border-primary flex flex-row items-center px-4 py-3 cursor-pointer gap-x-2 group bg-primary/50 rounded-lg group duration-200 ease-in-out transition-all"
      :class="{ 'rounded-b-none !bg-primary/80': isOpen }"
      @click="isOpen = !isOpen"
    >
      <span class="duration-200 font-bold text-slate-300 group-hover:text-white">
        {{ label }}
      </span>
      <Icon
        class="duration-200 ease-in-out w-6 h-6"
        :class="{ 'rotate-180': isOpen }"
        name="tabler:chevron-down"
        aria-hidden="true"
      />
    </button>
    <Transition
      name="expand"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
      @after-leave="end"
    >
      <div
        v-show="isOpen"
        class="absolute z-[1] block w-max right-0"
      >
        <div
          class="bg-primary/80 border-4 border-primary flex flex-col gap-y-3 p-5 pr-[30px] relative rounded-b-lg rounded-tl-lg box-border text-slate-300"
        >
          <template v-for="route in routes" :key="route.label">
            <RouteLink
              v-if="!route.requiredLogIn || (loggedIn && route.requiredLogIn)"
              :url="route.url"
              class="hover:text-white"
              @click="isOpen = false"
            >
              {{ $t(route.label) }}
              <span
                v-if="route.beta"
                class="body-extra-small text-secondary relative bottom-px ml-2"
              >
                BETA
              </span>
            </RouteLink>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>
