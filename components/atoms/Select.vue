<script setup lang="ts">
const emit = defineEmits(['selected'])
withDefaults(
  defineProps<{
  inputLabel?: string,
  label: string,
  bold?: boolean,
  required?: boolean,
  absolute?: boolean,
  options?: Option[]
}>(), {
    inputLabel: '',
    bold: false,
    required: false,
    absolute: true,
    options: () => []
  }
)

const isOpen: Ref<boolean> = ref(false)

function selectedOption (option: Option): void {
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
        <div :class="{ 'font-bold': bold }">
          {{ label }}
        </div>
        <Icon
          name="tabler:chevron-down"
          class="relative duration-200 h-6 w-6"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
      <div
        class="flex flex-col w-full bg-black rounded rounded-t-none tracker-shadow"
        :class="{ hidden: !isOpen, absolute: absolute }"
      >
        <div
          v-for="option in options"
          :key="option.id"
          class="cursor-pointer p-2 hover:text-primary"
          @click="selectedOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>
