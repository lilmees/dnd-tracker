<script setup lang="ts">
import { reset } from '@formkit/core'
import logRocket from 'logrocket'
import schema from '~~/formkit/homebrew.json'

const store = useCurrentCampaignStore()

const isOpen = ref<boolean>(false)

const form = ref<AddHomebrewForm>({
  name: '',
  player: '',
  link: null,
  type: 'player' as RowType,
  data: {
    isLoading: false,
    encounter: false,
    update: false,
    error: null,
    options: [
      { label: 'Player', value: 'player' },
      { label: 'Summon', value: 'summon' },
      { label: 'Npc', value: 'npc' },
      { label: 'Monster', value: 'monster' },
      { label: 'Lair', value: 'lair' }
    ]
  }
})

function addHomebrew ({ __init, data, slots, ...formData }: Obj): void {
  form.value.data.error = null
  form.value.data.isLoading = true

  try {
    store.addHomebrew(
      useEmptyKeyRemover({
        ...formData,
        campaign: store?.campaign?.id
      }) as AddHomebrew
    )

    reset('form')
    closeModal()
  } catch (err: any) {
    logRocket.captureException(err as Error)
    form.value.data.error = err.message
  } finally {
    form.value.data.isLoading = false
  }
}

function closeModal (): void {
  form.value.type = 'player'
  isOpen.value = false
}
</script>

<template>
  <section>
    <button
      v-tippy="{ content: $t('actions.add') }"
      @click="isOpen = true"
    >
      <Icon name="material-symbols:add" class="w-6 h-6 text-success" />
    </button>
    <Modal v-if="isOpen" @close="closeModal">
      <template #header>
        <h2>{{ $t('components.addHomebrew.newHomebrew') }}</h2>
      </template>
      <FormKit
        id="form"
        v-model="form"
        type="form"
        :actions="false"
        @submit="addHomebrew"
      >
        <FormKitSchema :data="form" :schema="useI18nForm(schema)" />
      </FormKit>
    </Modal>
  </section>
</template>
