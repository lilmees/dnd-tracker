<script setup lang="ts">
defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
  label: string,
  help?: string,
  placeholder?: string,
  type?: string,
  name: string,
  modelValue: string | number,
  validation: string,
  disabled?: boolean,
  required?: boolean,
  focus?: boolean,
  size?: string,
  options: Option[],
  validationRules: Obj
}>(), {
  help: '',
  placeholder: '',
  type: 'text',
  modelValue: '',
  validation: '',
  disabled: false,
  required: false,
  focus: false,
  size: 'large',
  options: () => [],
  validationRules: () => { return {} }
}
)

onMounted(() => {
  if (props.focus) {
    (document.querySelector(`#${props.name}`) as HTMLInputElement).focus()
  }
})

function handleIconClick (node: any) {
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
