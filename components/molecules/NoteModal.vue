<script setup lang="ts">
import logRocket from 'logrocket'

const emit = defineEmits(['close', 'added', 'updated'])
const props = withDefaults(
  defineProps<{
  id: number,
  note?: Note,
  open: boolean,
  update?: boolean
}>(), {
    note: undefined,
    update: false
  }
)

const store = useNotesStore()

const error = ref<string | null>(null)
const isLoading = ref<boolean>(false)
const form = ref<{ title: string, text: string }>({ title: '', text: '' })

whenever(
  () => props.open,
  () => {
    if (props.update && props.note) {
      form.value = {
        title: props.note.title,
        text: props.note.text
      }
    }
  }
)

function handleSubmit ({ __init, ...formData }: Obj): void {
  error.value = null
  isLoading.value = true

  try {
    props.update
      ? updateNote(formData as Note)
      : addNote(formData as Note)
  } catch (err: any) {
    logRocket.captureException(err as Error)
    error.value = err.message
  } finally {
    resetState()
  }
}

async function updateNote (note: Note): Promise<void> {
  if (props.note) {
    const updatedNote = await store.updateNote(
      { ...note, campaign: props.note.campaign },
      props.note.id
    )
    emit('updated', updatedNote)
  }
}

async function addNote (note: Note): Promise<void> {
  const newNote: Note = await store.addNote({ ...note, campaign: props.id })
  emit('added', newNote)
}

function resetState (): void {
  form.value = { title: '', text: '' }
  isLoading.value = false
  emit('close')
}
</script>

<template>
  <Modal v-if="open" @close="resetState">
    <template #header>
      <h2>
        {{ $t(`components.noteModal.${update ? 'update' : 'add'}`) }}
      </h2>
    </template>
    <p v-if="error" class="text-danger text-center">
      {{ error }}
    </p>
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"
      @submit="handleSubmit"
    >
      <FormKit
        name="title"
        :label="$t('components.inputs.titleLabel')"
        validation="required|length:3,50"
      />
      <FormKit
        name="text"
        type="textarea"
        :label="$t('components.inputs.textLabel')"
        validation="required|length:10,1000"
      />
      <FormKit
        type="submit"
        :aria-label="$t(`components.noteModal.${update ? 'update' : 'add'}`)"
        :disabled="isLoading"
      >
        {{ $t(`components.noteModal.${update ? 'update' : 'add'}`) }}
      </FormKit>
    </FormKit>
  </Modal>
</template>
