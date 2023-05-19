<script setup lang="ts">
import { FormKitSchema } from '@formkit/vue'
import { reset } from '@formkit/core'
import { useCurrentCampaignStore } from '@/store/currentCampaign'
import schema from '~~/formkit/homebrew.json'

const props = defineProps<{ item: Homebrew }>()

const store = useCurrentCampaignStore()

const isOpen: Ref<boolean> = ref(false)

const form: Ref<UpdateHomebrewForm> = ref({
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

watch(() => isOpen.value, (v) => {
  if (v) {
    form.value.type = props.item.type as HomebrewType
    form.value.name = props.item.name
    form.value.link = props.item.link as string
  }
})

function updateHomebrew ({ __init, data, slots, ...formData }: Obj): void {
  form.value.data.error = null
  form.value.data.isLoading = true

  try {
    store.updateHomebrew(
      useEmptyKeyRemover(formData) as Homebrew,
      props.item.id as number
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

function closeModal () {
  form.value.type = 'player'
  isOpen.value = false
}
</script>

<template>
  <section>
    <button
      v-tippy="{ content: $t('actions.update'), animation: 'shift-away' }"
      @click="isOpen = true"
    >
      <Icon
        name="lucide:wrench"
        class="w-6 h-6 text-info outline-none relative top-1"
      />
    </button>
    <Modal v-if="isOpen" @close="closeModal">
      <h2>{{ $t('encounter.updateHomebrew') }}</h2>
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
