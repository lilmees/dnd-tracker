<script setup lang="ts">
import { FormKitSchema } from '@formkit/vue'
import { reset } from '@formkit/core'
import { useCurrentCampaignStore } from '@/store/currentCampaign'
import schema from '@/formkit/addHomebrew.json'

const props = defineProps<{ item: Homebrew }>()

const store = useCurrentCampaignStore()
const formSchema = useI18nForm(schema)

const isOpen: Ref<boolean> = ref(false)

const form: Ref<{ name: string, link: string | null}> = ref({
  name: '',
  link: null
})

const data: { isLoading: boolean, update: boolean, type: HomebrewType, error: string| null} = reactive({
  isLoading: false,
  update: true,
  type: 'player',
  error: null
})

onMounted(() => {
  data.type = props.item.type as HomebrewType

  form.value = {
    name: props.item.name,
    link: props.item.link as string
  }
})

function updateHomebrew ({ __init, ...formData }: Obj): void {
  data.error = null
  data.isLoading = true

  try {
    store.updateHomebrew(
      useEmptyKeyRemover({ ...formData, type: data.type }) as Homebrew,
      props.item.id as number
    )

    reset('form')
    closeModal()
  } catch (err: any) {
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
