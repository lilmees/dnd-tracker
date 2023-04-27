<script setup>
import { FormKitSchema } from '@formkit/vue'
import { reset } from '@formkit/core'
import { removeEmptyKeys } from '@/util/removeEmptyKeys'
import { useCurrentCampaignStore } from '@/store/currentCampaign'
import schema from '@/formkit/addHomebrew.json'

const { $i18n } = useNuxtApp()
const store = useCurrentCampaignStore()

const isOpen = ref(false)
const form = ref({ name: null, initiative: null, link: null })
const data = reactive({ isLoading: false, update: false, type: 'player', error: null })

const formSchema = computed(() => {
  const form = []
  schema.forEach((cmp) => {
    if (cmp?.props?.label) {
      cmp.props.label = $i18n.t(cmp.props.label)
    }
    form.push(cmp)
  })
  return form
})

function addHomebrew ({ __init, ...formData }) {
  data.error = null
  try {
    data.isLoading = true

    store.addHomebrew(
      removeEmptyKeys({
        ...formData,
        campaign: store.campaign.id,
        type: data.type
      })
    )

    reset('form')
    closeModal()
  } catch (err) {
    useBugsnag().notify(`Handeld in catch: ${err}`)
    data.error = err.message
  } finally {
    data.isLoading = false
  }
}

function closeModal () {
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
