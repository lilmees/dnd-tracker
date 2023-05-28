<script setup lang="ts">
import { reset } from '@formkit/core'
import { useNotesStore } from '@/store/notes'

const emit = defineEmits(['close', 'updated'])
const props = defineProps<{ note: Note, open: boolean }>()

const store = useNotesStore()
const { $logRocket } = useNuxtApp()

const error: Ref<string | null> = ref(null)
const isLoading: Ref<boolean> = ref(false)
const form: Ref<{ title: string, text: string}> = ref({
  title: props.note.title,
  text: props.note.text
})

watch(
  () => props.open,
  (v: boolean) => {
    if (v) {
      form.value = { title: props.note.title, text: props.note.text }
    }
  }
)

async function updateNote ({ __init, ...formData }: Obj): Promise<void> {
  error.value = null
  try {
    isLoading.value = true
    const note = await store.updateNote(
      { ...formData, campaign: props.note.campaign } as Note,
      props.note.id
    )
    emit('updated', note)
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

      @submit="updateNote"
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
        class="btn-black w-full mt-3"
        :aria-label="$t('notes.update')"
        :disabled="isLoading"
      >
        {{ $t('notes.update') }}
      </button>
    </FormKit>
  </Modal>
</template>
