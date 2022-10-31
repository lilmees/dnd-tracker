<script setup>
import Remove from '~/assets/icons/remove.svg'
import Add from '~/assets/icons/add.svg'
import Info from '~/assets/icons/info.svg'

defineEmits(['remove', 'add', 'info'])
defineProps({
  condition: { type: Object, required: true },
  removable: { type: Boolean, default: false },
  addable: { type: Boolean, default: false },
  selected: { type: Boolean, default: true },
  color: {
    type: String,
    default: 'success',
    validator(value) {
      return ['primary', 'secondary', 'success', 'info', 'warning', 'help', 'danger'].includes(value)
    },
  },
})

const isOpen = ref(true)
</script>

<template>
  <div class="relative">
    <div
      class="relative px-3 py-1 font-semibold leading-tight rounded flex gap-2 w-fit items-center text-black"
      :class="{
        'bg-primary/50 ring-primary': color === 'primary',
        'bg-secondary/50 ring-secondary': color === 'secondary',
        'bg-success/50 ring-success': color === 'success' || !condition.negative,
        'bg-info/50 ring-info': color === 'info',
        'bg-warning/50 ring-warning': color === 'warning',
        'bg-help/50 ring-help': color === 'help',
        'bg-danger/50 ring-danger': color === 'danger' || condition.negative,
        'ring-2': selected,
      }"
    >
      <Remove
        v-if="removable"
        @click="$emit('remove', condition.id)"
        class="w-4 h-4 cursor-pointer hover:scale-110 duration-200 ease-in-out"
      />
      <Add
        v-if="addable && !removable"
        @click="$emit('add', condition)"
        class="w-4 h-4 cursor-pointer hover:scale-110 duration-200 ease-in-out"
      />
      <div>
        {{ condition.name }}
      </div>
      <Info class="w-4 h-4 hover:scale-110 cursor-pointer" @click="$emit('info', condition.description.en)" />
    </div>
  </div>
</template>
