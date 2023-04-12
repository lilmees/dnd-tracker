<script setup>
import ArrowLeft from '@/assets/icons/arrow-left.svg'

const emit = defineEmits(['update:modelValue', 'paginate'])
const props = defineProps({
  modelValue: { type: Number, required: true },
  perPage: { type: Number, default: 20 },
  totalPages: { type: Number, required: true }
})

function handleNext () {
  handleSelect(Math.min(props.modelValue + 1, props.totalPages))
}

function handlePrevious () {
  handleSelect(Math.max(props.modelValue - 1, 0))
}

function handleSelect (v) {
  emit('update:modelValue', v)
  emit('paginate', v)
}

const numbersList = computed(() => Array.from({ length: props.totalPages }, (_, i) => i + 1))

const limitedNumbersList = computed(() => {
  let limited = []
  if (props.totalPages <= 4) {
    limited = numbersList.value
  } else if (props.modelValue === 0 || props.modelValue === 1) {
    // get first four of array when page is the first or second of the array
    limited = numbersList.value.slice(0, 4)
  } else if (
    props.modelValue + 1 === numbersList.value[[numbersList.value.length - 1]] ||
    props.modelValue + 1 === numbersList.value[[numbersList.value.length - 2]]
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
      class="flex items-center justify-center w-8 h-8 rounded-full bg-primary"
      :class="{ 'bg-slate-700': modelValue === 0 }"
      :disabled="modelValue === 0"
      @click="handlePrevious"
    >
      <ArrowLeft class="h-8 w-8" />
    </button>
    <div class="flex items-center space-x-4">
      <button
        v-for="pageNumber in limitedNumbersList"
        :key="pageNumber"
        class="flex items-center justify-center w-8 h-8 rounded-full hover:font-bold focus:font-bold"
        :class="{ 'font-bold': modelValue === pageNumber - 1 }"
        @click="handleSelect(pageNumber - 1)"
      >
        {{ pageNumber }}
      </button>
    </div>
    <button
      class="flex items-center justify-center w-8 h-8 text-white rounded-full bg-primary"
      :class="{ 'bg-slate-700': modelValue === totalPages - 1 }"
      :disabled="modelValue === totalPages - 1"
      @click="handleNext"
    >
      <ArrowLeft class="h-8 w-8 rotate-180" />
    </button>
  </div>
</template>
