<script setup lang="ts">
import logRocket from 'logrocket'

const currentStore = useCurrentCampaignStore()
const profile = useProfileStore()
const toast = useToastStore()
const noteStore = useNotesStore()

const isOpen = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const selected = ref<Note[]>([])

whenever(() => currentStore.campaign, () => {
  if (currentStore.campaign) {
    noteStore.fetch({ field: 'campaign', value: currentStore.campaign.id })
  }
})

async function removeNote (): Promise<void> {
  try {
    await noteStore.deleteNote(selected.value[0].id)
  } catch (err: unknown) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    resetState()
  }
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
      <div class="flex gap-4 items-center">
        <div
          class="body-small"
          :class="{
            'text-danger': noteStore.noteCount >= noteStore.maxAmount
          }"
        >
          {{ noteStore.noteCount }} / {{ noteStore.maxAmount }}
        </div>
        <button
          v-tippy="{ content: $t('actions.add') }"
          :aria-label="$t('actions.add')"
          :disabled="
            !currentStore.campaign ||
              !isAdmin(currentStore.campaign, profile.data?.id || '') ||
              noteStore.noteCount >= noteStore.maxAmount
          "
          class="disabled:opacity-40 disabled:cursor-not-allowed"
          @click="isOpen = true"
        >
          <Icon
            name="material-symbols:add"
            class="w-6 h-6 text-success"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
    <div v-if="currentStore.loading" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <SkeletonNoteCard v-for="i in 16" :key="i" />
    </div>
    <NoContent
      v-else-if="!noteStore.data.length && !noteStore.loading"
      :content="$t('general.notes').toLowerCase()"
      icon="clarity:note-line"
    />
    <template v-else-if="currentStore.campaign">
      <FormKit
        v-model="noteStore.search"
        type="search"
        suffix-icon="search"
        outer-class="$reset !pb-0 w-fit"
      />
      <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <NoteCard
          v-for="note in noteStore.visibleItems"
          :key="note.created_at"
          :note="note"
          :campaign="currentStore.campaign"
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
      <div
        v-if="noteStore.noItems"
        class="max-w-prose mx-auto px-8 py-4 text-center font-bold"
      >
        {{ $t('components.table.nothing', { item: $t('general.notes').toLowerCase() }) }}
      </div>
    </template>
    <NoteModal
      v-if="currentStore.campaign"
      :id="currentStore.campaign.id"
      :open="isOpen"
      :note="selected[0] || undefined"
      :update="isUpdating"
      @close="resetState"
      @added="resetState"
      @updated="resetState"
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
