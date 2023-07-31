<script setup lang="ts">
import logRocket from 'logrocket'

const emit = defineEmits(['deleted', 'copied', 'updated'])
const props = defineProps<{ encounter: Encounter }>()

const user = useSupabaseUser()
const store = useEncountersStore()
const toast = useToastStore()
const localePath = useLocalePath()

const needConfirmation = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const isSettings = ref<boolean>(false)

async function deleteEncounter (): Promise<void> {
  try {
    await store.deleteEncounter(props.encounter.id)
    emit('deleted', props.encounter.id)
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
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
    const enc = await store.addEncounter(encounter as AddEncounter)
    emit('copied', enc)
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    isSettings.value = false
  }
}

function updatedEncounter (encounter: UpdateEncounter): void {
  emit('updated', encounter)
  closeSettings()
}

function closeSettings (): void {
  isUpdating.value = false
  needConfirmation.value = false
  isSettings.value = false
}
</script>

<template>
  <div
    class="rounded-lg min-w-[250px] max-w-md relative group border-4"
    :style="{
      'background-color': `${encounter.background}80`,
      'border-color': encounter.background,
      color: encounter.color
    }"
  >
    <Icon
      v-if="!isSettings"
      v-tippy="{ content: $t('actions.openSettings'), animation: 'shift-away' }"
      name="material-symbols:settings-outline-rounded"
      class="w-6 h-6 cursor-pointer absolute top-1 right-1 opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
      :style="{ color: encounter.color }"
      @click="isSettings = true"
    />
    <Icon
      v-else
      v-tippy="{ content: $t('actions.closeSettings'), animation: 'shift-away' }"
      name="ic:round-clear"
      class="w-6 h-6 cursor-pointer float-right mt-1 mr-1"
      :style="{ color: encounter.color }"
      @click="isSettings = false"
    />
    <NuxtLink
      v-if="!isSettings"
      :to="
        localePath(
          `/encounters/${encounter.id}-${
            encounter.title.replace(/[\W]/g, '') === '' ? 'encounter' : encounter.title.replace(/[\W]/g, '')
          }`
        )
      "
      class="flex flex-col gap-2 justify-between px-6 py-8 cursor-pointer"
    >
      <h2>{{ encounter.title }}</h2>
      <div>
        <p>Rows: {{ encounter.rows.length }}</p>
      </div>
    </NuxtLink>
    <div v-else class="flex flex-col gap-2 justify-between p-4">
      <h2>{{ encounter.title }}</h2>
      <div class="flex gap-2 cursor-pointer max-w-max" @click="isUpdating = true">
        <Icon name="lucide:wrench" class="h-6 w-6" />
        <p>{{ $t('actions.update') }}</p>
      </div>
      <div class="flex gap-2 cursor-pointer max-w-max" @click="copyEncounter(encounter)">
        <Icon name="material-symbols:content-copy-outline-rounded" class="h-6 w-6" />
        <p>{{ $t('actions.copy') }}</p>
      </div>
      <div
        v-if="user && encounter.created_by === user.id"
        class="flex gap-2 cursor-pointer max-w-max"
        @click="needConfirmation = true"
      >
        <Icon name="material-symbols:delete-outline-rounded" class="h-6 w-6" />
        <p>{{ $t('actions.delete') }}</p>
      </div>
    </div>
    <div class="absolute z-[1]">
      <ConfirmationModal
        :open="needConfirmation"
        :title="encounter.title"
        @close="closeSettings"
        @delete="deleteEncounter"
      />
      <UpdateEncounterModal
        :open="isUpdating"
        :encounter="encounter"
        @close="closeSettings"
        @updated="updatedEncounter"
      />
    </div>
  </div>
</template>
