<script setup lang="ts">
import { reset } from '@formkit/core'
import { useNotesStore } from '@/store/notes'

const emit = defineEmits(['close', 'notes'])
const props = defineProps<{
  notes: Note[],
  open: boolean,
  id: number
}>()

const store = useNotesStore()
const { $logRocket } = useNuxtApp()

const error: Ref<string | null> = ref(null)
const isLoading: Ref<boolean> = ref(false)
const form: Ref<{ title: string, text: string }> = ref({ title: '', text: '' })

async function addNote ({ __init, ...formData }: Obj): Promise<void> {
  error.value = null
  try {
    isLoading.value = true
    const note: Note = await store.addNote({ ...formData, campaign: props.id } as Note)
    emit('notes', [...props.notes, note])
    reset('form')
  } catch (err: any) {
    $logRocket.captureException(err as Error)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <p v-if="error" class="text-danger text-center">
      {{ error }}
    </p>
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"

      @submit="addNote"
    >
      <Input
        focus
        name="title"
        :label="$t('inputs.titleLabel')"
        required
        validation="required|length:3,50"
      />
      <Input
        name="text"
        type="textarea"
        :label="$t('inputs.textLabel')"
        required
        validation="required|length:10,1000"
      />
      <button
        type="submit"
        class="btn-black w-full"
        :aria-label="$t('notes.add')"
        :disabled="isLoading"
      >
        {{ $t('notes.add') }}
      </button>
    </FormKit>
  </Modal>
</template>
