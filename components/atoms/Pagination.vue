<script setup lang="ts">
const emit = defineEmits<{ paginate: [value: number] }>()

const props = withDefaults(
  defineProps<{
    totalPages: number
    perPage?: number
    searching?: boolean
  }>(), {
    perPage: 20,
    searching: false,
  },
)

const page = defineModel<number>('page', { required: true })

function handleNext(): void {
  handleSelect(Math.min(page.value + 1, props.totalPages))
}

function handlePrevious(): void {
  handleSelect(Math.max(page.value - 1, 0))
}

function handleSelect(v: number): void {
  page.value = v
  emit('paginate', v)
}

const numbersList = computed<number[]>(() =>
  Array.from({ length: props.totalPages }, (_, i) => i + 1),
)

const limitedNumbersList = computed<number[]>(() => {
  let limited = []
  if (props.totalPages <= 4) {
    limited = numbersList.value
  }
  else if (page.value === 0 || page.value === 1) {
    // get first four of array when page is the first or second of the array
    limited = numbersList.value.slice(0, 4)
  }
  else if (
    page.value + 1 === numbersList.value[numbersList.value.length - 1]
    || page.value + 1 === numbersList.value[numbersList.value.length - 2]
  ) {
    // get last four of array when page is the last or second last of the array
    limited = numbersList.value.slice(-4)
  }
  else {
    limited = [
      numbersList.value[page.value - 1],
      numbersList.value[page.value],
      numbersList.value[page.value + 1],
      numbersList.value[page.value + 2],
    ]
  }
  return limited
})
</script>

<template>
  <div class="flex justify-center items-center my-3 bg-tracker/50 border-4 border-tracker w-fit mx-auto rounded-lg">
    <button
      class="flex items-center justify-center w-8 h-8 border-r-4 border-tracker"
      :class="{ 'cursor-progress': searching }"
      :disabled="page === 0 || searching"
      aria-label="First page"
      @click="handleSelect(0)"
    >
      <Icon
        name="ph:caret-double-left"
        class="h-5 w-5 transition-colors"
        :class="{ 'text-slate-700': page === 0 }"
        aria-hidden="true"
      />
    </button>
    <button
      class="flex items-center justify-center w-8 h-8 border-r-4 border-tracker"
      :class="{ 'cursor-progress': searching }"
      :disabled="page === 0 || searching"
      :aria-label="$t('actions.prev')"
      @click="handlePrevious"
    >
      <Icon
        name="ph:caret-left"
        class="h-5 w-5 transition-colors"
        :class="{ 'text-slate-700': page === 0 }"
        aria-hidden="true"
      />
    </button>
    <div class="flex items-center">
      <button
        v-for="pageNumber in limitedNumbersList"
        :key="pageNumber"
        :aria-label="`Page ${pageNumber}`"
        :disabled="searching"
        class="flex items-center justify-center w-8 h-8 border-r-4 border-tracker"
        :class="{
          'font-bold text-secondary': page === pageNumber - 1,
          'cursor-progress': searching,
          'hover:font-bold focus:font-bold': !searching,
        }"
        @click="handleSelect(pageNumber - 1)"
      >
        {{ pageNumber }}
      </button>
    </div>
    <button
      class="flex items-center justify-center w-8 h-8 border-r-4 border-tracker"
      :class="{ 'cursor-progress': searching }"
      :disabled="page === totalPages - 1 || searching"
      :aria-label="$t('actions.next')"
      @click="handleNext"
    >
      <Icon
        name="ph:caret-right"
        class="h-5 w-5 transition-colors"
        :class="{ 'text-slate-700': page === totalPages - 1 }"
        aria-hidden="true"
      />
    </button>
    <button
      class="flex items-center justify-center w-8 h-8"
      :class="{ 'cursor-progress': searching }"
      :disabled="page === totalPages - 1 || searching"
      aria-label="Last page"
      @click="handleSelect(totalPages - 1)"
    >
      <Icon
        name="ph:caret-double-right"
        class="h-5 w-5 transition-colors"
        :class="{ 'text-slate-700': page === totalPages - 1 }"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
