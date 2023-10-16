<script setup lang="ts">
import { reset } from '@formkit/core'

const emit = defineEmits(['close', 'delete'])
defineProps<{ open: boolean, title: string }>()

const form = ref<{ title: string }>({ title: '' })
const same = computed<boolean>(() => form.value.title.trim().toLowerCase() === 'delete')

function deleteConfirmation (): void {
  if (same.value) {
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
      <div class="p-4 bg-danger/50 rounded-lg flex gap-4 items-center">
        <Icon name="ph:warning-bold" class="min-w-[30px] min-h-[30px]" />
        <p>
          <template
            v-for="text in $t('components.confirmationModal.text', { title }).split(title)"
            :key="text"
          >
            {{ text }}
            <span class="font-bold last:hidden">
              {{ title }}
            </span>
          </template>
        </p>
      </div>
      <FormKit
        id="form"
        v-model="form"
        type="form"
        :actions="false"
        @submit="deleteConfirmation"
      >
        <FormKit
          name="title"
          validation="required"
          placeholder="DELETE"
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
