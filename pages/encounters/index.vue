<script setup lang="ts">
import logRocket from 'logrocket'

definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Encounters' })

const user = useSupabaseUser()
const toast = useToastStore()
const store = useEncountersStore()
const { error } = storeToRefs(store)

const isOpen = ref<boolean>(false)
const isBulk = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const selectedEncounters = ref<Encounter[]>([])

onMounted(() => store.fetch())

whenever(error, () => { toast.error() })

function toggleSelection (enc: Encounter): void {
  const index: number = selectedEncounters.value.findIndex(e => e.id === enc.id)
  if (index === -1) {
    selectedEncounters.value.push(enc)
  } else {
    selectedEncounters.value.splice(index, 1)
  }
}

async function deleteEncounter (): Promise<void> {
  try {
    if (selectedEncounters.value.length === 1) {
      await store.deleteEncounter(selectedEncounters.value[0].id)
    } else if (selectedEncounters.value.length > 1) {
      await store.bulkDeleteEncounters(selectedEncounters.value.map(v => v.id))
    }
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    reset()
  }
}

async function copyEncounter ({ created_at, id, profiles, ...enc }: Encounter): Promise<void> {
  if (!user.value) {
    return
  }

  let encounter: UpdateEncounter = {
    ...enc,
    title: `copy ${enc.title}`.slice(0, 30),
    created_by: user.value.id,
    campaign: undefined
  }

  if (enc.campaign) {
    encounter = {
      ...encounter,
      campaign: typeof enc.campaign === 'object' ? enc.campaign.id : enc.campaign as number
    }
  }

  try {
    await store.addEncounter(encounter as AddEncounter)
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    reset()
  }
}

function reset (): void {
  needConfirmation.value = false
  isBulk.value = false
  isUpdating.value = false
  selectedEncounters.value = []
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
              <Icon name="tabler:dots" class="h-6 w-6" />
            </button>
            <template #content>
              <div class="p-4 space-y-2 overflow-auto">
                <button
                  class="flex gap-2 items-center max-w-max"
                  :aria-label="$t('actions.bulkRemove')"
                  @click="isBulk = true"
                >
                  <Icon name="material-symbols:delete-outline-rounded" class="h-4 w-4" />
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
              :disabled="!selectedEncounters.length"
              :aria-label="$t('pages.encounters.remove.amount', {number: selectedEncounters.length})"
              @click="needConfirmation = true"
            >
              {{ $t('pages.encounters.remove.amount', {number: selectedEncounters.length}) }}
            </button>
            <button
              class="btn-success"
              :aria-label="$t('actions.cancel')"
              @click="isBulk = false, selectedEncounters = []"
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
                  '!border-danger bg-danger/50': selectedEncounters.find(e => e.id === encounter.id)
                }"
                :style="{ 'border-color': encounter.background }"
                @click="toggleSelection(encounter)"
              />
              <EncounterCard
                :encounter="encounter"
                @update="(v: Encounter) => {
                  selectedEncounters = [v];
                  isUpdating = true
                }"
                @remove="(v: Encounter) => {
                  selectedEncounters = [v];
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
      <AddEncounterModal
        :open="isOpen"
        @close="isOpen = false"
        @added="isOpen = false"
      />
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
        :title="selectedEncounters.length === 1
          ? selectedEncounters[0].title
          : $t('pages.encounters.remove.multiple', {number: selectedEncounters.length})"
        @close="reset"
        @delete="deleteEncounter"
      />
      <UpdateEncounterModal
        v-if="selectedEncounters.length"
        :open="isUpdating"
        :encounter="selectedEncounters[0]"
        @close="reset"
      />
    </div>
  </NuxtLayout>
</template>
