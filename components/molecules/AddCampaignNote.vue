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
    useBugsnag().notify(`Handeld in catch: ${err}`)
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
      message-class="error-message"
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
      <Button type="submit" :label="$t('notes.add')" :loading="isLoading" inline />
    </FormKit>
  </Modal>
</template>
