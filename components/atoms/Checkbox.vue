<script setup>
defineEmits(['update:modelValue'])
defineProps({
  label: { type: String, required: true },
  modelValue: { type: Boolean },
  disabled: { type: Boolean, default: false },
  help: { type: String, default: null },
  validation: { type: String, default: '' },
  name: { type: String, required: true },
  type: { type: String, default: 'text' }
})
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
      :help="help"
      :validation="validation"
      input-class="w-5 h-5 rounded border-slate-400 disabled:pointer-events-none disabled:bg-slate-100 bg-transparent cursor-pointer"
      help-class="help-message"
      message-class="error-message"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event)"
    />
  </div>
</template>
