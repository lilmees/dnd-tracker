<script setup>
defineProps({
  label: { type: String, required: true },
  name: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  validation: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false }
})
</script>

<template>
  <FormKit
    :value="modelValue"
    type="color"
    :name="name"
    :label="required ? label + ' *' : label"
    :validation="validation"
    label-class="font-bold body-small"
    input-class="w-full border-2 border-slate-400 focus-within:border-white h-9 rounded"
    outer-class="mb-3 w-full"
    message-class="error-message"
    :disabled="disabled"
  />
</template>
