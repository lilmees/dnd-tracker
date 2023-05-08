<script setup lang="ts">
import { FormKitSchema } from '@formkit/vue'
import { reset } from '@formkit/core'
import { useCurrentCampaignStore } from '@/store/currentCampaign'
import schema from '@/formkit/addHomebrew.json'

const store = useCurrentCampaignStore()
const formSchema = useI18nForm(schema)

const isOpen: Ref<boolean> = ref(false)

const form: Ref<AddHomebrewForm> = ref({
  name: '',
  initiative: null,
  link: ''
})

const data: HomebrewSchemaOptions = reactive({
  isLoading: false,
  update: false,
  type: 'player',
  error: null
})

function addHomebrew ({ __init, ...formData }: Obj): void {
  data.error = null
  try {
    data.isLoading = true

    store.addHomebrew(
      useEmptyKeyRemover({
        ...formData,
        campaign: store?.campaign?.id,
        type: data.type
      }) as Homebrew
    )

    reset('form')
    closeModal()
  } catch (err: any) {
    useBugsnag().notify(`Handeld in catch: ${useError(err)}`)
    data.error = err.message
  } finally {
    data.isLoading = false
  }
}

function closeModal (): void {
  data.type = 'player'
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
      <Select
        :absolute="false"
        :input-label="$t('inputs.typeLabel')"
        :label="data.type"
        bold
        :options="[
          { label: 'Player', id: 'player' },
          { label: 'Summon', id: 'summon' },
          { label: 'Npc', id: 'npc' },
          { label: 'Monster', id: 'monster' },
          { label: 'Lair', id: 'lair' },
        ]"
        @selected="v => (data.type = v)"
      />
      <FormKit
        id="form"
        v-model="form"
        type="form"
        :actions="false"
        message-class="error-message"
        @submit="addHomebrew"
      >
        <FormKitSchema :data="data" :schema="formSchema" />
      </FormKit>
    </Modal>
  </section>
</template>
