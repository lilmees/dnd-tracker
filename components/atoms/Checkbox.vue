<script setup lang="ts">
defineEmits(['update:modelValue'])
withDefaults(
  defineProps<{
    label: string,
    name: string,
    modelValue?: string | number,
    validation?: string,
    disabled?: boolean
    type?: string
  }>(), {
    modelValue: '',
    validation: '',
    disabled: false,
    type: 'text'
  }
)
</script>

<template>
  <div class="flex flex-row items-center gap-2 mb-3">
    <div class="block font-bold text-lg mb-1">
      {{ label }}
    </div>
    <FormKit
      :value="modelValue"
      type="checkbox"
      :name="name"
      :validation="validation"
      input-class="w-5 h-5 rounded border-slate-400 disabled:pointer-events-none disabled:bg-slate-100 bg-transparent cursor-pointer"
      help-class="help-message"
      message-class="error-message"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event)"
    />
  </div>
</template>
