<script setup lang="ts">
import { reset } from '@formkit/core'
import logRocket from 'logrocket'
import schema from '~~/formkit/homebrew.json'

const emit = defineEmits(['updated'])
const props = defineProps<{ item: Homebrew }>()

const store = useCurrentCampaignStore()

const isOpen = ref<boolean>(false)

const form = ref<UpdateHomebrewForm>({
  name: '',
  player: '',
  link: null,
  type: 'player' as RowType,
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

watch(() => isOpen.value, (v) => {
  if (v) {
    form.value.type = props.item.type as RowType
    form.value.player = props.item.player || ''
    form.value.name = props.item.name
    form.value.link = props.item.link as string
  }
})

function updateHomebrew ({ __init, data, slots, ...formData }: Obj): void {
  form.value.data.error = null
  form.value.data.isLoading = true

  try {
    const updated = useEmptyKeyRemover(formData) as Homebrew

    store.updateHomebrew(updated, props.item.id as number)

    emit('updated', updated)
    reset('form')
    closeModal()
  } catch (err: any) {
    logRocket.captureException(err as Error)
    form.value.data.error = err.message
  } finally {
    form.value.data.isLoading = false
  }
}

function closeModal () {
  form.value.type = 'player'
  isOpen.value = false
}
</script>

<template>
  <section>
    <button
      v-tippy="{ content: $t('actions.update') }"
      @click="isOpen = true"
    >
      <Icon
        name="lucide:wrench"
        class="w-6 h-6 text-info outline-none relative top-1"
      />
    </button>
    <Modal v-if="isOpen" @close="closeModal">
      <h2>{{ $t('components.updateInitiativeModal.updateHomebrew') }}</h2>
      <FormKit
        id="form"
        v-model="form"
        type="form"
        :actions="false"

        @submit="updateHomebrew"
      >
        <FormKitSchema :data="form" :schema="useI18nForm(schema)" />
      </FormKit>
    </Modal>
  </section>
</template>
