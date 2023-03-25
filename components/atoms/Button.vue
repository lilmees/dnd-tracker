<script setup>
defineEmits(['click'])
const props = defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
  color: {
    type: String,
    default: 'black',
    validator(value) {
      return ['black', 'primary', 'secondary', 'success', 'info', 'warning', 'help', 'danger'].includes(value)
    },
  },
})

const background = computed(() => {
  switch (props.color) {
    case 'black':
      return '#000000'
    case 'primary':
      return '#9eade6'
    case 'secondary':
      return '#b4bfcd'
    case 'success':
      return '#cede9c'
    case 'info':
      return '#35a4cc'
    case 'warning':
      return '#ffdf8a'
    case 'help':
      return '#b09ce5'
    case 'danger':
      return '#e693a9'
  }
})
</script>

<template>
  <div>
    <FormKit
      :type="type"
      :label="label"
      :disabled="disabled || loading"
      input-class="py-2 px-6 shadow rounded-md outline-none focus-within:ring ring-white active:scale-95 duration-200 ease-in-out disabled:cursor-not-allowed"
      :style="{
        fontWeight: 'bold',
        width: inline ? '100%' : 'auto',
        'background-color': background,
        color: color === 'black' ? '#fff' : '#000',
        opacity: disabled ? 0.4 : 1
      }"
      @click="$emit('click')"
    />
  </div>
</template>
