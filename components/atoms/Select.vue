<script setup>
import ChevronDown from '~/assets/icons/chevron-down.svg'

const emit = defineEmits(['selected'])
defineProps({
  inputLabel: { type: String },
  label: { type: String, required: true },
  bold: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  options: { type: Array, default: () => [] },
})

const isOpen = ref(false)

function selectedOption(option) {
  isOpen.value = false
  emit('selected', option.id)
}
</script>

<template>
  <div :class="{ 'mb-3': inputLabel }">
    <p v-if="inputLabel" class="font-bold">
      {{ inputLabel }}
      <span>{{ required ? '*' : '' }}</span>
    </p>
    <div v-click-outside="() => (isOpen = false)" class="relative z-[1]">
      <div
        class="flex flex-row items-center justify-between gap-2 bg-black rounded py-2 px-6 cursor-pointer"
        :class="{ 'rounded-b-none': isOpen }"
        @click="isOpen = !isOpen"
      >
        <div :class="{ 'font-bold': bold }">{{ label }}</div>
        <ChevronDown class="relative duration-200 h-4 w-4 stroke-2" :class="{ 'rotate-180': isOpen }" />
      </div>
      <div
        class="flex flex-col absolute w-full bg-black rounded rounded-t-none tracker-shadow"
        :class="{ hidden: !isOpen }"
      >
        <div
          v-for="option in options"
          :key="option"
          class="cursor-pointer p-2 hover:text-primary"
          @click="selectedOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>
