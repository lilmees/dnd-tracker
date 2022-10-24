<script setup>
defineProps({
  label: { type: String, required: true },
  help: { type: String, required: '' },
  placeholder: { type: String, required: false },
  type: { type: String, default: 'text' },
  name: { type: String, required: true },
  modelValue: { type: [String, Number] },
  validation: { type: String },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'large' },
  options: { type: Array, default: () => [] },
  validationRules: { type: Object },
})

function handleIconClick(node) {
  node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye'
  node.props.type = node.props.type === 'password' ? 'text' : 'password'
}
</script>

<template>
  <FormKit
    :value="modelValue"
    :type="type"
    :name="name"
    :placeholder="placeholder"
    :help="help"
    :label="label"
    :options="options"
    :validation="validation"
    :validation-rules="validationRules"
    label-class="font-bold body-small"
    inner-class="border-2 border-slate-400 rounded overflow-hidden focus-within:border-white"
    input-class="w-full h-8 px-3 border-none rounded text-white body-small placeholder-slate-400 bg-transparent"
    outer-class="mb-3"
    help-class="help-message"
    message-class="error-message"
    :disabled="disabled"
    :suffix-icon="type === 'password' ? 'eye' : undefined"
    @suffix-icon-click="handleIconClick"
  />
</template>

<style>
.formkit-suffix-icon {
  @apply flex w-10 justify-center cursor-pointer;
}

.formkit-suffix-icon svg {
  @apply w-6;
}

.formkit-inner {
  @apply flex;
}
</style>
