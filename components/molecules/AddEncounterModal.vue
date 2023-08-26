<script setup lang="ts">
import { reset } from '@formkit/core'
import logRocket from 'logrocket'

const emit = defineEmits(['close', 'added'])
const props = withDefaults(
  defineProps<{ open: boolean, campaignId?: number | undefined }>(), {
    campaignId: undefined
  }
)

const store = useEncountersStore()
const campaigns = useCampaignsStore()
const user = useSupabaseUser()

const form = ref<AddEncounterForm>({
  title: '',
  campaign: props.campaignId || undefined,
  background: '#7333E0',
  data: {
    isLoading: false,
    campaign: false,
    update: false,
    error: null
  }
})

const campaignOptions = computed<Option[]>(() => {
  if (campaigns.campaigns) {
    return campaigns.campaigns.map((c: Campaign) => {
      return { label: c.title, value: c.id }
    })
  } else {
    return []
  }
})

onMounted(() => {
  if (!props.campaignId) {
    campaigns.fetch()
  }
})

watch(() => campaigns.campaigns, (v) => {
  form.value.data.campaign = !!v?.length || false
}, { immediate: true })

async function addEncounter ({ __init, data, slots, ...formData }: Obj): Promise<void> {
  form.value.data.error = null
  form.value.data.isLoading = true

  try {
    if (user.value) {
      const encounter = await store.addEncounter({
        ...formData as AddEncounterForm,
        round: 1,
        rows: [],
        created_by: user.value.id,
        admins: [user.value.id],
        color: useContrastColor(formData.background),
        activeIndex: 0
      })

      reset('form')
      form.value.background = '#7333E0'

      emit('added', encounter)
    }
  } catch (err: any) {
    logRocket.captureException(err as Error)
    form.value.data.error = err.message
  } finally {
    form.value.data.isLoading = false
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <template #header>
      <h2>{{ $t('components.addEncounterModal.title') }}</h2>
    </template>
    <p v-if="form.data.error" class="text-danger text-center">
      {{ form.data.error }}
    </p>
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"
      @submit="addEncounter"
    >
      <Input
        focus
        name="title"
        :label="$t('components.inputs.titleLabel')"
        validation="required|length:3,30"
        required
      />
      <Input
        v-if="!campaignId"
        name="campaign"
        type="select"
        :label="$t('components.inputs.campaignLabel')"
        :placeholder="$t('general.noSelected')"
        :options="campaignOptions"
      />
      <ColorPicker
        name="background"
        :label="$t('components.inputs.backgroundLabel')"
        validation="required"
        required
      />
      <button
        type="submit"
        class="btn-black w-full"
        :aria-label="$t('pages.encounters.add')"
      >
        {{ $t('pages.encounters.add') }}
      </button>
    </FormKit>
  </Modal>
</template>
