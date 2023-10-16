<script setup lang="ts">
import logRocket from 'logrocket'
import { reset } from '@formkit/core'

const toast = useToastStore()
const table = useTableStore()
const { t } = useI18n()

const rowOptions = ['summoner', 'ac', 'health', 'conditions', 'note', 'deathSaves', 'concentration', 'modify']

const isLoading = ref<boolean>(false)
const isOpen = ref<boolean>(false)

whenever(() => isOpen.value, () => {
  if (table.encounter) {
    if (table.encounter.settings.modified) {
      form.value.rows = table.encounter.settings.rows
    }
    form.value.spacing = table.encounter.settings.spacing || 'normal'
  }
})

const form = ref<{ spacing: TableSpacing, rows: string[] }>({
  spacing: table.encounter?.settings.spacing || 'normal',
  rows: rowOptions
})

function update ({ __init, ...formData }: Obj): void {
  try {
    table.encounterUpdate({ settings: { ...formData, modified: true } as EncounterSettings })
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    resetState()
  }
}

function resetState (): void {
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
    <Modal :open="isOpen && !!table.encounter" @close="resetState">
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
          :label="$t('components.visualOptions.spacing')"
          :options="[
            { label: 'Compact', value: 'compact' },
            { label: 'Normal', value: 'normal' },
            { label: 'Cozy', value: 'cozy' }
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
            { label: 'Modify', value: 'modify' }
          ]"
        />
        <FormKit type="submit" :aria-label="$t('actions.update')">
          {{ $t('actions.save') }}
        </FormKit>
      </FormKit>
    </Modal>
  </section>
</template>
