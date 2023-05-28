<script setup>
defineEmits(['update:modelValue'])
const props = defineProps({
  label: { type: String, required: true },
  help: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  name: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  validation: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  focus: { type: Boolean, default: false },
  size: { type: String, default: 'large' },
  options: { type: Array, default: () => [] },
  validationRules: { type: Object, default: () => {} }
})

onMounted(() => {
  if (props.focus) {
    document.querySelector(`#${props.name}`)?.focus()
  }
})

function handleIconClick (node) {
  node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye'
  node.props.type = node.props.type === 'password' ? 'text' : 'password'
}
</script>

<template>
  <FormKit
    :id="name"
    :value="modelValue"
    :type="type"
    :name="name"
    :placeholder="placeholder"
    :help="help"
    :label="required ? label + ' *' : label"
    :options="options"
    :validation="validation"
    :validation-rules="validationRules"
    rows="10"
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
