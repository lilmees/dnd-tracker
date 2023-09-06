<script setup lang="ts">
import logRocket from 'logrocket'

definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Encounters' })

const store = useEncountersStore()
const toast = useToastStore()
const { error } = storeToRefs(store)

const {
  isBulk,
  isUpdating,
  needConfirmation,
  selected,
  toggleSelection,
  reset
} = useBulkEditing()

const isOpen = ref<boolean>(false)

onMounted(() => store.fetch())

whenever(error, () => { toast.error() })

async function deleteEncounter (): Promise<void> {
  try {
    if (selected.value.length === 1) {
      await store.deleteEncounter(selected.value[0].id)
    } else if (selected.value.length > 1) {
      await store.bulkDeleteEncounters(selected.value.map(v => v.id))
    }
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    resetState()
  }
}

async function copyEncounter (enc : Encounter): Promise<void> {
  try {
    await store.copyEncounter(enc)
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    resetState()
  }
}

function resetState (): void {
  reset()
  isOpen.value = false
}
</script>

<template>
  <NuxtLayout>
    <div v-if="!store.error">
      <div class="pt-5 pb-10 flex justify-between gap-4 items-center flex-wrap">
        <h1 class="grow">
          {{ $t('pages.encounters.encounters') }}
        </h1>
        <div class="flex gap-2">
          <button
            class="btn-primary tracker-shadow-pulse"
            :aria-label="$t('pages.encounters.add')"
            @click="isOpen = true"
          >
            {{ $t('pages.encounters.add') }}
          </button>
          <tippy interactive :z-index="2" placement="left">
            <button
              class="bg-secondary/50 border-4 border-secondary rounded-lg w-12 h-12"
              :aria-label="$t('general.options')"
              :disabled="store.loading"
            >
              <Icon
                name="tabler:dots"
                class="h-6 w-6"
                aria-hidden="true"
              />
            </button>
            <template #content>
              <div class="p-4 space-y-2 overflow-auto">
                <button
                  class="flex gap-2 items-center max-w-max"
                  :aria-label="$t('actions.bulkRemove')"
                  @click="isBulk = true"
                >
                  <Icon
                    name="material-symbols:delete-outline-rounded"
                    class="h-4 w-4"
                    aria-hidden="true"
                  />
                  <p>{{ $t('actions.bulkRemove') }}</p>
                </button>
              </div>
            </template>
          </tippy>
        </div>
      </div>
      <div
        v-if="store.loading"
        class="flex flex-wrap gap-4 items-start"
      >
        <SkeletonEncounterCard v-for="i in 10" :key="i" />
      </div>
      <div v-else-if="store.sortedEncounters">
        <template v-if="isBulk">
          <h2 class="text-danger">
            {{ $t('pages.encounters.remove.title') }}
          </h2>
          <p class="pt-2 pb-6">
            {{ $t('pages.encounters.remove.subtitle') }}
          </p>
          <div class="flex gap-2 mb-12">
            <button
              class="btn-danger"
              :disabled="!selected.length"
              :aria-label="$t('pages.encounters.remove.amount', {number: selected.length})"
              @click="needConfirmation = true"
            >
              {{ $t('pages.encounters.remove.amount', {number: selected.length}) }}
            </button>
            <button
              class="btn-success"
              :aria-label="$t('actions.cancel')"
              @click="isBulk = false, selected = []"
            >
              {{ $t('actions.cancel') }}
            </button>
          </div>
        </template>
        <div
          v-for="(group, index) in Object.values(store.sortedEncounters)"
          :key="index"
          class="space-y-4 pb-10"
        >
          <CampaignHeader
            v-if="Object.keys(store.sortedEncounters)[index] !== '0'"
            :campaign="
              typeof group[0].campaign === 'object'
                ? (group[0].campaign as Campaign).id
                : group[0].campaign
            "
          />
          <div class="flex flex-wrap gap-4 items-start">
            <div
              v-for="encounter in group"
              :key="encounter.id"
              class="relative"
            >
              <div
                v-if="isBulk"
                class="absolute inset-0 z-[1] rounded-lg border-4 cursor-pointer"
                :class="{
                  '!border-danger bg-danger/50': selected.find(e => e.id === encounter.id)
                }"
                :style="{ 'border-color': encounter.background }"
                @click="toggleSelection(encounter)"
              />
              <EncounterCard
                :encounter="encounter"
                @update="(v: Encounter) => {
                  selected = [v];
                  isUpdating = true
                }"
                @remove="(v: Encounter) => {
                  selected = [v];
                  needConfirmation = true
                }"
                @copy="copyEncounter"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="mx-auto max-w-lg border-4 border-primary p-2 sm:p-10 rounded-lg space-y-4"
      >
        <h2>{{ $t('pages.encounters.noData.title') }}</h2>
        <p>{{ $t('pages.encounters.noData.text') }}</p>
        <button
          class="btn-primary"
          :aria-label="$t('pages.encounters.add')"
          @click="isOpen = true"
        >
          {{ $t('pages.encounters.add') }}
        </button>
      </div>
    </div>
    <div v-else class="max-w-sm mx-auto py-20 space-y-4">
      <h2 class="text-center text-danger">
        {{ $t('general.error.text') }}
      </h2>
      <button
        class="btn-black w-full"
        :aria-label="$t('actions.tryAgain')"
        @click="store.fetch()"
      >
        {{ $t('actions.tryAgain') }}
      </button>
    </div>
    <div class="absolute z-[1]">
      <ConfirmationModal
        :open="needConfirmation"
        :title="selected.length === 1
          ? selected[0].title
          : $t('pages.encounters.remove.multiple', {number: selected.length})"
        @close="resetState"
        @delete="deleteEncounter"
      />
      <EncounterModal
        :open="isUpdating || isOpen"
        :encounter="selected.length && isUpdating ? selected[0] : undefined"
        :update="isUpdating"
        @close="resetState"
        @updated="resetState"
        @added="resetState"
      />
    </div>
  </NuxtLayout>
</template>
