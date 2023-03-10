<script setup>
defineEmits(['update:modelValue'])
const props = defineProps({
  label: { type: String, required: true },
  help: { type: String, required: '' },
  placeholder: { type: String, required: false },
  type: { type: String, default: 'text' },
  name: { type: String, required: true },
  modelValue: { type: [String, Number] },
  validation: { type: String },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  focus: { type: Boolean, default: false },
  size: { type: String, default: 'large' },
  options: { type: Array, default: () => [] },
  validationRules: { type: Object },
})

onMounted(() => {
  if (props.focus) document.querySelector(`#${props.name}`)?.focus()
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
    :id="name"
    :placeholder="placeholder"
    :help="help"
    :label="required ? label + ' *' : label"
    :options="options"
    :validation="validation"
    :validation-rules="validationRules"
    rows="10"
    label-class="font-bold body-small"
    inner-class="ring ring-slate-400 rounded overflow-hidden focus-within:ring-white my-1"
    input-class="w-full py-2 px-3 border-none rounded text-white body-small placeholder-slate-400 bg-transparent"
    outer-class="mb-3"
    help-class="help-message"
    message-class="error-message"
    :disabled="disabled"
    :suffix-icon="type === 'password' ? 'eye' : undefined"
    @suffix-icon-click="handleIconClick"
    @input="$emit('update:modelValue', $event)"
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
