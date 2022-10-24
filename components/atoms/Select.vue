<script setup>
import ChevronDown from '~/assets/icons/chevron-down.svg'

const emit = defineEmits(['selected'])
defineProps({
  label: { type: String },
  options: { type: Array, default: () => [] },
})

const isOpen = ref(false)

function selectedOption(value) {
  isOpen.value = false
  emit('selected', value)
}
</script>

<template>
  <div v-click-outside="() => (isOpen = false)" class="relative z-10">
    <div
      class="flex flex-row items-center justify-between border-2 border-slate-400 rounded focus-within:border-white h-9 px-3"
      :class="{ 'rounded-b-none': isOpen }"
      @click="isOpen = !isOpen"
    >
      <div>{{ label }}</div>
      <ChevronDown class="relative duration-200 h-4 w-4 stroke-2" :class="{ 'rotate-180': isOpen }" />
    </div>
    <div
      class="flex flex-col absolute w-full glass rounded rounded-t-none border-2 border-slate-400"
      :class="{ hidden: !isOpen }"
    >
      <div v-for="option in options" :key="option" class="cursor-pointer px-2" @click="selectedOption(option)">
        {{ option }}
      </div>
    </div>
  </div>
</template>
