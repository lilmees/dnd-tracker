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
    default: 'danger',
    validator (value) {
      return ['primary', 'secondary', 'success', 'info', 'warning', 'help', 'danger'].includes(value)
    }
  }
})
</script>

<template>
  <div
    class="px-3 py-1 font-semibold leading-tight rounded flex gap-2 w-fit items-center text-white"
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
      v-tippy="{ content: $t('actions.remove'), animation: 'shift-away' }"
      class="w-4 h-4 cursor-pointer hover:scale-110 duration-200 ease-in-out"
      @click="$emit('remove', condition.id)"
    />
    <Add
      v-if="addable && !removable"
      v-tippy="{ content: $t('actions.add'), animation: 'shift-away' }"
      class="w-4 h-4 cursor-pointer hover:scale-110 duration-200 ease-in-out"
      @click="$emit('add', condition)"
    />
    <div>
      {{ condition.name }}
    </div>
    <Info
      v-tippy="{ content: $t('actions.info'), animation: 'shift-away' }"
      class="w-4 h-4 hover:scale-110 cursor-pointer"
      @click="$emit('info', condition.description.en)"
    />
  </div>
</template>
