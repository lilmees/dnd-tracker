<script setup>
import { FormKitSchema } from '@formkit/vue'
import { reset } from '@formkit/core'
import { removeEmptyKeys } from '@/util/removeEmptyKeys'
import { useCurrentCampaignStore } from '@/store/currentCampaign'
import schema from '@/formkit/addHomebrew.json'
import Update from '~/assets/icons/update.svg'

const props = defineProps({ item: { type: Object, required: true } })

const { t } = useI18n({ useScope: 'global' })
const store = useCurrentCampaignStore()

const isOpen = ref(false)
const form = ref({ name: null, initiative: null, link: null })
const data = reactive({ isLoading: false, update: true, type: 'player', error: null })

const formSchema = computed(() => {
  const form = []
  schema.forEach((cmp) => {
    if (cmp?.props?.label) {
      cmp.props.label = t(cmp.props.label)
    }
    form.push(cmp)
  })
  return form
})

onMounted(() => {
  data.type = props.item.type

  form.value = {
    name: props.item.name,
    initiative: props.item.initiative,
    link: props.item.link
  }
})

function updateHomebrew ({ __init, ...formData }) {
  data.error = null
  try {
    data.isLoading = true

    store.updateHomebrew(
      removeEmptyKeys({ ...formData, type: data.type }),
      props.item.id
    )

    reset('form')
    closeModal()
  } catch (err) {
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
      v-tippy="{ content: $t('actions.update'), animation: 'shift-away' }"
      @click="isOpen = true"
    >
      <Update class="w-6 h-6 text-info outline-none relative top-1" />
    </button>
    <Modal v-if="isOpen" @close="closeModal">
      <h2>{{ $t('encounter.updateHomebrew') }}</h2>
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
        @submit="updateHomebrew"
      >
        <FormKitSchema :data="data" :schema="formSchema" />
      </FormKit>
    </Modal>
  </section>
</template>
