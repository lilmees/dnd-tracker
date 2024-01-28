<script setup lang="ts">
import { start, end } from '@/utils/animation-helpers'

const emit = defineEmits(['close', 'open'])

const props = withDefaults(
  defineProps<{
    title: string,
    active?: boolean,
    onlyOpenActive?: boolean
  }>(), {
    active: false,
    onlyOpenActive: false
  }
)

const open = ref<boolean>(false)

watch(() => open.value, v => emit(v ? 'open' : 'close'))

if (props.onlyOpenActive) {
  watch(() => props.active, (v) => { open.value = v || false })
}
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
