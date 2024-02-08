<script setup lang="ts">
import logRocket from 'logrocket'

const currentStore = useCurrentCampaignStore()
const profile = useProfileStore()
const toast = useToastStore()
const noteStore = useNotesStore()

const isOpen = ref<boolean>(false)
const isBulk = ref<boolean>(false)
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
    if (selected.value.length === 1) {
      await noteStore.deleteNote(selected.value[0].id)
    } else if (selected.value.length > 1) {
      await noteStore.bulkDeleteNote(selected.value.map(v => v.id))
    }
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
  isBulk.value = false
  selected.value = []
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between border-b-2 border-slate-700 pb-1">
      <h2>{{ $t('general.notes') }}</h2>
      <div class="flex gap-2 items-end flex-wrap">
        <div
          class="text-[12px]"
          :class="{
            'text-danger': noteStore.noteCount >= noteStore.maxAmount
          }"
        >
          {{ noteStore.noteCount }} / {{ noteStore.maxAmount }}
        </div>
        <button
          class="btn-small-primary"
          :aria-label="$t('actions.createItem', { item: $t('general.note') })"
          :disabled="
            !currentStore.campaign ||
              !isAdmin(currentStore.campaign, profile.data?.id || '') ||
              noteStore.noteCount >= noteStore.maxAmount
          "
          @click="isOpen = true"
        >
          {{ $t('actions.createItem', { item: $t('general.note') }) }}
        </button>
        <button
          v-tippy="$t('actions.bulkRemove')"
          :aria-label="$t('actions.bulkRemove')"
          :disabled="noteStore.loading"
          class="btn-small-danger"
          @click="() => {
            isBulk = !isBulk;
            if (!isBulk) {
              resetState()
            }
          }"
        >
          <Icon
            name="material-symbols:delete-outline-rounded"
            class="h-4 w-4"
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
      <BulkRemove
        v-model:isBulk="isBulk"
        v-model:needConfirmation="needConfirmation"
        v-model:selected="selected"
        type="notes"
      />
      <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div
          v-for="note in noteStore.visibleItems"
          :key="note.created_at"
          class="relative"
        >
          <div
            v-if="isBulk"
            class="absolute inset-0 z-[1] rounded-lg border-4 cursor-pointer transition-colors"
            :class="{
              '!border-danger bg-danger/50': selected.find(e => e.id === note.id)
            }"
            @click="toggleSelection<Note>(note, selected)"
          />
          <NoteCard
            :note="note"
            :campaign="currentStore.campaign"
            class="h-full"
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
      :open="isUpdating || isOpen"
      :note="selected.length && isUpdating ? selected[0] : undefined"
      :update="isUpdating"
      @close="resetState"
      @added="resetState"
      @updated="resetState"
    />
    <ConfirmationModal
      :open="needConfirmation"
      :title="selected.length === 1
        ? selected[0].title
        : $t('components.bulkRemove.multiple', {
          number: selected.length,
          type: $t('general.notes').toLowerCase()
        })"
      @close="resetState"
      @delete="removeNote"
    />
  </section>
</template>
