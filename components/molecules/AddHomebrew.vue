<script setup lang="ts">
import { FormKitSchema } from '@formkit/vue'
import { reset } from '@formkit/core'
import { useCurrentCampaignStore } from '@/store/currentCampaign'
import schema from '@/formkit/addHomebrew.json'

const store = useCurrentCampaignStore()

const isOpen: Ref<boolean> = ref(false)

const form: Ref<AddHomebrewForm> = ref({
  name: '',
  link: null,
  type: 'player' as HomebrewType,
  data: {
    isLoading: false,
    encounter: false,
    update: true,
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
    useBugsnag().notify(`Handeld in catch: ${useErrorMessage(err)}`)
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
      v-tippy="{ content: $t('actions.add'), animation: 'shift-away' }"
      @click="isOpen = true"
    >
      <Icon name="material-symbols:add" class="w-6 h-6 text-success" />
    </button>
    <Modal v-if="isOpen" @close="closeModal">
      <h2>{{ $t('encounter.newHomebrew') }}</h2>
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
