<script setup lang="ts">
import { reset } from '@formkit/core'

const emit = defineEmits(['close', 'delete'])
const props = defineProps<{ open: boolean, title: string }>()

const form = ref<{ title: string }>({ title: '' })
const same = computed<boolean>(() => props.title === form.value.title)

function deleteConfirmation (): void {
  if (form.value.title.trim() === props.title.trim()) {
    reset('form')
    emit('delete')
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <div class="text-white space-y-4">
      <h2 class="text-danger">
        {{ $t('components.confirmationModal.title') }}
      </h2>
      <p class="pb-4">
        {{ $t('components.confirmationModal.text', { title }) }}
      </p>
      <FormKit
        id="form"
        v-model="form"
        type="form"
        :actions="false"
        @submit="deleteConfirmation"
      >
        <Input
          focus
          name="title"
          :label="$t('components.inputs.titleLabel')"
          validation="required"
          required
          :placeholder="title"
        />
        <button
          type="submit"
          class="btn-danger w-full"
          :aria-label="$t('actions.delete')"
          :disabled="!same"
        >
          {{ $t('actions.delete') }}
        </button>
      </FormKit>
    </div>
  </Modal>
</template>
