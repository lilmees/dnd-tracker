<script setup lang="ts">
const currentStore = useCurrentCampaignStore()
const profile = useProfileStore()
const noteStore = useNotesStore()

const isOpen = ref<boolean>(false)
const isBulk = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const selected = ref<Note[]>([])

onMounted(() => fetchNotes())

whenever(() => currentStore.campaign, () => fetchNotes())

function fetchNotes (): void {
  if (currentStore.campaign) {
    noteStore.fetch({ field: 'campaign', value: currentStore.campaign.id })
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
            noteStore.loading ||
              noteStore.noteCount >= noteStore.maxAmount ||
              !isAdmin(currentStore.campaign || undefined, profile.data?.id || '')
          "
          @click="isOpen = true"
        >
          {{ $t('actions.createItem', { item: $t('general.note') }) }}
        </button>
        <button
          v-tippy="$t('actions.bulkRemove')"
          :aria-label="$t('actions.bulkRemove')"
          :disabled="noteStore.loading || !isAdmin(currentStore.campaign || undefined, profile.data?.id || '')"
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
    <template
      v-else-if="
        (!noteStore.noItems || (noteStore.search !== '' && noteStore.noItems)) &&
          currentStore.campaign
      "
    >
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
          <BulkRemoveCard
            v-if="isBulk"
            :selected="!!selected.find(e => e.id === note.id)"
            @toggled="toggleSelection<Note>(note, selected)"
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
    <NoContent
      v-else
      :content="$t('general.notes').toLowerCase()"
      icon="clarity:note-line"
    />

    <NoteModal
      :id="currentStore.campaign?.id || 0"
      :open="(isUpdating || isOpen) && !!currentStore.campaign"
      :note="selected.length && isUpdating ? selected[0] : undefined"
      :update="isUpdating"
      @close="resetState"
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
      @delete="() => {
        noteStore.deleteNote(
          selected.length === 1 ? selected[0].id : selected.map(v => v.id)
        )
        resetState()
      }"
    />
  </section>
</template>
