<script setup lang="ts">
import logRocket from 'logrocket'

const emit = defineEmits<{ close: [] }>()

const props = withDefaults(
  defineProps<{
    open: boolean
    encounter?: Encounter
    campaignId?: number
    update?: boolean
  }>(), {
    encounter: undefined,
    campaignId: undefined,
    update: false,
  },
)

const store = useEncountersStore()
const campaigns = useCampaignsStore()
const user = useSupabaseUser()

const isLoading = ref<boolean>(false)
const campaign = ref<boolean>(false)
const error = ref<string>()

const form = ref<EncounterForm>({
  title: '',
  campaign: props.campaignId || undefined,
})

const campaignOptions = computed<Option[]>(() => {
  if (campaigns.campaigns) {
    return campaigns.campaigns.map((c: Campaign) => {
      return { label: c.title, value: c.id }
    })
  }
  else {
    return []
  }
})

onMounted(() => {
  if (!props.campaignId) {
    campaigns.fetch()
  }
})

watch(() => campaigns.campaigns, (v) => {
  campaign.value = !!v?.length || false
}, { immediate: true })

// set the values from campaign when in update mode
whenever(() => props.update, () => {
  const camp = props.encounter?.campaign?.id

  form.value.title = props.encounter?.title || ''
  form.value.campaign = props.campaignId || camp
})

function handleSubmit({ __init, data, slots, ...formData }: Obj): void {
  error.value = undefined
  isLoading.value = true

  try {
    props.update
      ? updateEncounter(formData as EncounterForm)
      : addEncounter(formData as EncounterForm)

    resetState()
  }
  catch (err: any) {
    logRocket.captureException(err as Error)
    error.value = err.message
  }
  finally {
    isLoading.value = false
  }
}

async function updateEncounter(data: EncounterForm): Promise<void> {
  if (props.encounter) {
    await store.updateEncounter(
      removeEmptyKeys({
        ...data,
        ...props.campaignId && { campaign: props.campaignId },
      }),
      props.encounter.id,
      !!props.campaignId,
    )

    emit('close')
  }
}

async function addEncounter(data: EncounterForm): Promise<void> {
  if (user.value) {
    const enc = removeEmptyKeys<AddEncounter>({
      ...data,
      ...props.campaignId && { campaign: props.campaignId },
      round: 1,
      rows: [],
      created_by: user.value.id,
      activeIndex: 0,
    })

    await store.addEncounter(enc)

    emit('close')
  }
}

function resetState(): void {
  form.value.title = ''
  form.value.campaign = undefined
  emit('close')
}
</script>

<template>
  <Modal
    :open="open"
    @close="resetState"
  >
    <template #header>
      <h2>
        {{ $t(`components.encounterModal.${update ? 'update' : 'add'}`) }}
      </h2>
    </template>
    <p
      v-if="error"
      class="text-danger text-center"
    >
      {{ error }}
    </p>
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"
      @submit="handleSubmit"
    >
      <FormKit
        name="title"
        :label="$t('components.inputs.titleLabel')"
        validation="required|length:3,30"
      />
      <FormKit
        v-if="!campaignId"
        name="campaign"
        type="select"
        :label="$t('components.inputs.campaignLabel')"
        :placeholder="$t('general.noSelected')"
        :options="campaignOptions"
      />
      <FormKit
        type="submit"
        :aria-label="$t(`pages.encounters.${update ? 'update' : 'add'}`)"
        :label="$t(`pages.encounters.${update ? 'update' : 'add'}`)"
        outer-class="!mb-0"
      />
    </FormKit>
  </Modal>
</template>
