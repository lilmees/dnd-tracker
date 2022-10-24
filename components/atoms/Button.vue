<script setup>
defineEmits(['click'])
defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  backgroundColor: { type: String },
  bold: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
})
</script>

<template>
  <FormKit
    :type="type"
    :label="label"
    :disabled="disabled || loading"
    input-class="bg-black text-white py-2 px-6 shadow rounded outline-none flex justify-center items-center gap-4 disabled:bg-gray-400"
    :style="{
      backgroundColor: backgroundColor,
      fontWeight: bold ? 'bold' : 'normal',
      width: inline ? '100%' : 'auto',
    }"
    @click="$emit('click')"
  />
</template>
