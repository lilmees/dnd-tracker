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
  <Modal :open="open" @close="$emit('close')">
    <template #header>
      <h2>
        {{ $t('components.confirmationModal.title') }}
      </h2>
    </template>
    <div class="text-white space-y-4">
      <p class="pb-4">
        <template
          v-for="text in $t('components.confirmationModal.text', { title }).split(title)"
          :key="text"
        >
          {{ text }}
          <span class="font-bold last:hidden text-danger">
            {{ title }}
          </span>
        </template>
      </p>
      <FormKit
        id="form"
        v-model="form"
        type="form"
        :actions="false"
        @submit="deleteConfirmation"
      >
        <FormKit
          name="title"
          :label="$t('components.inputs.titleLabel')"
          validation="required"
          :placeholder="title"
        />
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="btn-black"
            :aria-label="$t('actions.cancel')"
            @click="$emit('close')"
          >
            {{ $t('actions.cancel') }}
          </button>
          <button
            type="submit"
            class="btn-danger"
            :aria-label="$t('actions.delete')"
            :disabled="!same"
          >
            {{ $t('actions.delete') }}
          </button>
        </div>
      </FormKit>
    </div>
  </Modal>
</template>
