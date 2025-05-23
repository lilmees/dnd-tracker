<script setup lang="ts">
import { reset } from '@formkit/core'

const toast = useToastStore()
const table = useTableStore()

const rowOptions = ['summoner', 'ac', 'health', 'conditions', 'note', 'deathSaves', 'concentration', 'modify']
const widgetOptions = ['note', 'info-pins', 'fantasy-name-generator']

const isLoading = ref<boolean>(false)
const isOpen = ref<boolean>(false)

whenever(() => isOpen.value, () => {
  if (table.encounter) {
    if (table.encounter.settings.modified) {
      form.value.rows = table.encounter.settings.rows || []
      form.value.widgets = table.encounter.settings.widgets || []
    }
    form.value.spacing = table.encounter.settings.spacing || 'normal'
    form.value.pet = table.encounter.settings.pet || undefined
  }
})

const form = ref<Omit<EncounterSettings, 'modified'>>({
  spacing: table.encounter?.settings.spacing || 'normal',
  pet: table.encounter?.settings.pet,
  rows: rowOptions,
  widgets: widgetOptions,
})

function update({ __init, ...formData }: Obj): void {
  try {
    table.encounterUpdate({ settings: { ...formData, modified: true } as EncounterSettings })
  }
  catch (err) {
    console.error(err)
    toast.error()
  }
  finally {
    resetState()
  }
}

function resetState(): void {
  reset('form')
  isOpen.value = false
  isLoading.value = false
}
</script>

<template>
  <section>
    <button
      v-tippy="{ content: $t('components.visualOptions.tooltip') }"
      :aria-label="$t('components.visualOptions.tooltip')"
      class="btn-primary py-1 px-2 disabled:opacity-40 disabled:cursor-not-allowed"
      @click="isOpen = true"
    >
      <Icon
        name="iconamoon:options"
        class="w-6 h-6"
        aria-hidden="true"
      />
    </button>
    <Modal
      :open="isOpen && !!table.encounter"
      @close="resetState"
    >
      <template #header>
        <h2>{{ $t('components.visualOptions.tooltip') }}</h2>
      </template>
      <FormKit
        id="form"
        v-model="form"
        type="form"
        :actions="false"
        @submit="update"
      >
        <FormKit
          name="spacing"
          type="radio"
          options-class="flex flex-wrap gap-y-2 gap-x-6"
          :label="$t('components.visualOptions.spacing')"
          :options="[
            { label: 'Compact', value: 'compact' },
            { label: 'Normal', value: 'normal' },
            { label: 'Cozy', value: 'cozy' },
          ]"
        />
        <FormKit
          name="rows"
          type="checkbox"
          :label="$t('components.visualOptions.rows')"
          :options="[
            { label: 'Summond by', value: 'summoner' },
            { label: 'AC', value: 'ac' },
            { label: 'HP', value: 'health' },
            { label: 'Conditions', value: 'conditions' },
            { label: 'Note', value: 'note' },
            { label: 'Death saves', value: 'deathSaves' },
            { label: 'Concentration', value: 'concentration' },
            { label: 'Modify', value: 'modify' },
          ]"
        />
        <FormKit
          name="widgets"
          type="checkbox"
          options-class="flex flex-wrap gap-y-2 gap-x-6"
          :label="$t('components.visualOptions.widgets')"
          :options="[
            { label: $t('general.note'), value: 'note' },
            { label: $t('general.infoPins'), value: 'info-pins' },
            { label: $t('general.fantasyNameGenerator'), value: 'fantasy-name-generator' },
          ]"
        />

        <FormKit
          name="pet"
          type="select"
          :label="$t('components.visualOptions.pets.label')"
          :options="[
            { label: $t('general.none'), value: undefined },
            { label: $t('components.visualOptions.pets.cat'), value: 'cat' },
            { label: $t('components.visualOptions.pets.chicken'), value: 'chicken' },
            { label: $t('components.visualOptions.pets.barmaid'), value: 'barmaid' },
            { label: $t('components.visualOptions.pets.crawler'), value: 'crawler' },
            { label: $t('components.visualOptions.pets.dragon'), value: 'dragon' },
            { label: $t('components.visualOptions.pets.fairy'), value: 'fairy' },
            { label: $t('components.visualOptions.pets.redcap'), value: 'redcap' },
            { label: $t('components.visualOptions.pets.wolf-rider'), value: 'wolf-rider' },
          ]"
        />
        <FormKit
          type="submit"
          :aria-label="$t('actions.update')"
        >
          {{ $t('actions.save') }}
        </FormKit>
      </FormKit>
    </Modal>
  </section>
</template>
