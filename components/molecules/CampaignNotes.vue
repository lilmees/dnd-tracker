<script setup lang="ts">
import logRocket from 'logrocket'

const store = useCurrentCampaignStore()
const toast = useToastStore()
const notes = useNotesStore()

const isOpen = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const selected = ref<Note[]>([])

function addedNote (note: Note): void {
  if (store.campaign) {
    store.campaign.notes = [...(store.campaign.notes || []), note]
  }
  resetState()
}

async function removeNote (): Promise<void> {
  try {
    await notes.deleteNote(selected.value[0].id)

    if (store?.campaign?.notes) {
      store.campaign.notes = store.campaign.notes.filter(p => p.id !== selected.value[0].id)
    }
  } catch (err: unknown) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    resetState()
  }
}

function updatedNote (note: Note): void {
  if (store?.campaign?.notes) {
    const index = store.campaign.notes.findIndex(p => p.id === note.id)
    store.campaign.notes[index] = note
  }
  resetState()
}

function resetState (): void {
  isOpen.value = false
  isUpdating.value = false
  needConfirmation.value = false
  selected.value = []
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between border-b-2 border-slate-700 pb-1">
      <h2>{{ $t('general.notes') }}</h2>
      <button
        v-tippy="{ content: $t('actions.add') }"
        :aria-label="$t('actions.add')"
        @click="isOpen = true"
      >
        <Icon
          name="material-symbols:add"
          class="w-6 h-6 text-success"
          aria-hidden="true"
        />
      </button>
    </div>
    <div v-if="store.loading" class="flex gap-2 flex-wrap items-start">
      <SkeletonNoteCard v-for="i in 4" :key="i" />
    </div>
    <div v-else-if="!store?.campaign?.notes?.length" class="space-y-4 pt-4">
      <p class="text-center">
        {{ $t('components.campaignNotes.none') }}
      </p>
      <div class="flex justify-center">
        <button
          class="btn-primary w-fit mx-auto"
          :aria-label="$t('components.addCampaignNotes.add')"
          @click="isOpen = true"
        >
          {{ $t('components.addCampaignNotes.add') }}
        </button>
      </div>
    </div>
    <div v-else class="flex gap-4 flex-wrap items-start">
      <NoteCard
        v-for="note in store.campaign.notes"
        :key="note.created_at"
        :note="note"
        @update="(v: Note) => {
          selected = [v]
          isUpdating = true
          isOpen = true
        }"
        @remove="(v: Note) => {
          selected = [v]
          needConfirmation = true
        }"
      />
    </div>
    <NoteModal
      v-if="store.campaign"
      :id="store.campaign.id"
      :open="isOpen"
      :note="selected[0] || undefined"
      :update="isUpdating"
      @close="resetState"
      @added="addedNote"
      @updated="updatedNote"
    />
    <ConfirmationModal
      v-if="selected.length"
      :open="needConfirmation"
      :title="selected[0].title"
      @close="resetState"
      @delete="removeNote"
    />
  </section>
</template>
