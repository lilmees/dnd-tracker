<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string,
    name: string,
    modelValue?: string | number,
    validation?: string,
    disabled?: boolean,
    required?: boolean
  }>(), {
    modelValue: '',
    validation: '',
    disabled: false,
    required: false
  }
)
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
    :disabled="disabled"
  />
</template>
