<script setup lang="ts">
defineEmits(['click'])
const props = withDefaults(
  defineProps<{
  type?: string,
  disabled?: boolean,
  label?: string,
  loading?: boolean,
  inline?: boolean,
  color?: Color
}>(), {
    type: 'button',
    disabled: false,
    label: 'button',
    loading: false,
    inline: false,
    color: 'black'
  }
)

const background: ComputedRef<string> = computed(() => {
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
    default: return '#000000'
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
