<script setup lang="ts">
import { start, end } from '@/utils/animation-helpers'

defineProps<{
  title: string,
  active: boolean | undefined
}>()

const open = ref<boolean>(false)
</script>

<template>
  <div
    class="rounded-lg p-4 bg-tracker/50 space-y-4 border-4 mb-1 transition-colors duration-200 ease-in-out"
    :class="[active ? 'border-success' : 'border-tracker']"
  >
    <button
      class="flex w-full justify-between items-center outline-none"
      @click="open = !open"
      @keydown.escape="open = false"
    >
      <h3>
        {{ title }}
      </h3>
      <Icon
        name="tabler:chevron-down"
        class="duration-200 h-6 w-6 stroke-2"
        :class="{ 'rotate-180': open }"
        aria-hidden="true"
      />
    </button>
    <Transition name="expand" @enter="start" @after-enter="end" @before-leave="start" @after-leave="end">
      <template v-if="open">
        <slot />
      </template>
    </Transition>
  </div>
</template>

<style scoped>
.expand-leave-active,
.expand-enter-active {
  @apply duration-200 ease-in-out overflow-hidden;
}

.expand-leave-to,
.expand-enter-from {
  @apply !h-0 opacity-0;
}
</style>
