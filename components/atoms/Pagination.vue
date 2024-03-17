<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'paginate'])
const props = withDefaults(
  defineProps<{
    modelValue: number
    totalPages: number
    perPage?: number
    searching?: boolean
  }>(), {
    perPage: 20,
    searching: false
  }
)

function handleNext (): void {
  handleSelect(Math.min(props.modelValue + 1, props.totalPages))
}

function handlePrevious (): void {
  handleSelect(Math.max(props.modelValue - 1, 0))
}

function handleSelect (v: number): void {
  emit('update:modelValue', v)
  emit('paginate', v)
}

const numbersList: ComputedRef<number[]> = computed(() =>
  Array.from({ length: props.totalPages }, (_, i) => i + 1)
)

const limitedNumbersList: ComputedRef<number[]> = computed(() => {
  let limited = []
  if (props.totalPages <= 4) {
    limited = numbersList.value
  } else if (props.modelValue === 0 || props.modelValue === 1) {
    // get first four of array when page is the first or second of the array
    limited = numbersList.value.slice(0, 4)
  } else if (
    props.modelValue + 1 === numbersList.value[numbersList.value.length - 1] ||
    props.modelValue + 1 === numbersList.value[numbersList.value.length - 2]
  ) {
    // get last four of array when page is the last or second last of the array
    limited = numbersList.value.slice(-4)
  } else {
    limited = [
      numbersList.value[props.modelValue - 1],
      numbersList.value[props.modelValue],
      numbersList.value[props.modelValue + 1],
      numbersList.value[props.modelValue + 2]
    ]
  }
  return limited
})
</script>

<template>
  <div class="flex gap-6 justify-center items-center py-3">
    <button
      class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/50 border-4 border-primary transition-colors"
      :class="{
        'bg-slate-700/50 border-slate-700': modelValue === 0,
        'cursor-progress': searching
      }"
      :disabled="modelValue === 0 || searching"
      :aria-label="$t('actions.prev')"
      @click="handlePrevious"
    >
      <Icon
        name="ph:arrow-left"
        class="h-5 w-5"
        aria-hidden="true"
      />
    </button>
    <div class="flex items-center space-x-4">
      <button
        v-for="pageNumber in limitedNumbersList"
        :key="pageNumber"
        :aria-label="`Page ${pageNumber}`"
        :disabled="searching"
        class="flex items-center justify-center w-8 h-8 rounded-lg"
        :class="{
          'font-bold text-secondary': modelValue === pageNumber - 1,
          'cursor-progress': searching,
          'hover:font-bold focus:font-bold': !searching
        }"
        @click="handleSelect(pageNumber - 1)"
      >
        {{ pageNumber }}
      </button>
    </div>
    <button
      class="flex items-center justify-center w-8 h-8 text-white rounded-lg  bg-primary/50 border-4 border-primary transition-colors"
      :class="{
        'bg-slate-700/50 border-slate-700': modelValue === totalPages - 1,
        'cursor-progress': searching
      }"
      :disabled="modelValue === totalPages - 1 || searching"
      :aria-label="$t('actions.next')"
      @click="handleNext"
    >
      <Icon
        name="ph:arrow-right"
        class="h-5 w-5"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
