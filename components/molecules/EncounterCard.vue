<script setup>
import Copy from '@/assets/icons/copy.svg'
import Delete from '@/assets/icons/delete.svg'
import Update from '@/assets/icons/update.svg'
import Settings from '@/assets/icons/settings.svg'
import Remove from '@/assets/icons/remove.svg'
import { useEncountersStore } from '@/store/encounters'
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['deleted', 'copied', 'updated'])
const props = defineProps({ encounter: { type: Object, required: true } })

const user = useSupabaseUser()
const store = useEncountersStore()
const toast = useToastStore()
const { t } = useI18n({ useScope: 'global' })
const localePath = useLocalePath()

const needConfirmation = ref(false)
const isUpdating = ref(false)
const isSettings = ref(false)

async function deleteEncounter() {
  try {
    await store.deleteEncounter(props.encounter.id)
    emit('deleted', props.encounter.id)
  } catch (err) {
    toast.error({ title: t('error.general.title'), text: t('error.general.text') })
  }
}

async function copyEncounter({ created_at, id, profiles, ...enc }) {
  const encounter = { ...enc, title: `copy ${enc.title}`.slice(0, 30), created_by: user.value.id }
  if (typeof encounter.group === 'object') encounter.group = encounter.group.id
  try {
    const enc = await store.addEncounter(encounter)
    emit('copied', enc)
  } catch (err) {
    toast.error({ title: t('error.general.title'), text: t('error.general.text') })
  } finally {
    isSettings.value = false
  }
}

function updatedEncounter(encounter) {
  emit('updated', encounter)
  closeSettings()
}

function closeSettings() {
  isUpdating.value = false
  needConfirmation.value = false
  isSettings.value = false
}
</script>

<template>
  <div
    class="rounded-xl tracker-shadow min-w-[250px] max-w-md relative group"
    :style="{ 'background-color': encounter.background, color: encounter.color }"
  >
    <Settings
      v-if="!isSettings"
      v-tippy="$t('actions.openSettings')"
      class="w-8 h-8 cursor-pointer absolute top-1 right-1 opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
      :style="{ color: encounter.color }"
      @click="isSettings = true"
    />
    <Remove
      v-else
      v-tippy="$t('actions.closeSettings')"
      class="w-8 h-8 cursor-pointer float-right mt-1 mr-1"
      :style="{ color: encounter.color }"
      @click="isSettings = false"
    />
    <NuxtLink
      v-if="!isSettings"
      :to="
        localePath(
          `/encounters/${
            encounter.title.replace(/[\W]/g, '') === '' ? 'encounter' : encounter.title.replace(/[\W]/g, '')
          }-${encounter.id}`
        )
      "
      class="flex flex-col gap-2 justify-between p-4 cursor-pointer"
    >
      <h2>{{ encounter.title }}</h2>
      <div>
        <p>Rows: {{ encounter.rows.length }}</p>
      </div>
    </NuxtLink>
    <div v-else class="flex flex-col gap-2 justify-between p-4">
      <h2>{{ encounter.title }}</h2>
      <div class="flex gap-2 cursor-pointer max-w-max" @click="isUpdating = true">
        <Update class="h-6 w-6" />
        <p>{{ $t('actions.update') }}</p>
      </div>
      <div class="flex gap-2 cursor-pointer max-w-max" @click="copyEncounter(encounter)">
        <Copy class="h-6 w-6" />
        <p>{{ $t('actions.copy') }}</p>
      </div>
      <div
        v-if="encounter.created_by === user.id"
        class="flex gap-2 cursor-pointer max-w-max"
        @click="needConfirmation = true"
      >
        <Delete class="h-6 w-6" />
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
