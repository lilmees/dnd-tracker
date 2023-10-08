<script setup lang="ts">
import logRocket from 'logrocket'

const emit = defineEmits(['close', 'added', 'updated'])
const props = withDefaults(
  defineProps<{
    open: boolean,
    encounter?: Encounter,
    campaignId?: number,
    update?: boolean
  }>(), {
    encounter: undefined,
    campaignId: undefined,
    update: false
  }
)

const store = useEncountersStore()
const campaigns = useCampaignsStore()
const user = useSupabaseUser()

store.loading = false

const isLoading = ref<boolean>(false)
const campaign = ref<boolean>(false)
const error = ref<string>()

const form = ref<EncounterForm>({
  title: '',
  campaign: props.campaignId || undefined,
  background: '#7333E0'
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
  campaign.value = !!v?.length || false
}, { immediate: true })

// set the values from campaign when in update mode
whenever(() => props.update, () => {
  const camp = typeof props.encounter?.campaign !== 'object'
    ? props.encounter?.campaign
    : props.encounter?.campaign?.id

  form.value.title = props.encounter?.title || ''
  form.value.background = props.encounter?.background || '#7333E0'
  form.value.campaign = props.campaignId || camp
})

function handleSubmit ({ __init, data, slots, ...formData }: Obj): void {
  error.value = undefined
  isLoading.value = true

  try {
    props.update
      ? updateEncounter(formData as EncounterForm)
      : addEncounter(formData as EncounterForm)

    resetState()
  } catch (err: any) {
    logRocket.captureException(err as Error)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

async function updateEncounter (data: EncounterForm): Promise<void> {
  if (props.encounter) {
    const enc = await store.updateEncounter(
      { ...data, color: useContrastColor(data.background) },
      props.encounter.id
    )

    emit('updated', enc)
  }
}

async function addEncounter (data: EncounterForm): Promise<void> {
  if (user.value) {
    const enc = useEmptyKeyRemover({
      ...data,
      round: 1,
      rows: [],
      created_by: user.value.id,
      admins: [user.value.id],
      color: useContrastColor(data.background),
      activeIndex: 0
    }) as AddEncounter

    const encounter = await store.addEncounter(enc)

    emit('added', encounter)
  }
}

function resetState (): void {
  form.value.title = ''
  form.value.background = '#7333E0'
  form.value.campaign = undefined
  emit('close')
}
</script>

<template>
  <Modal :open="open" @close="resetState">
    <template #header>
      <h2>
        {{ $t(`components.encounterModal.${update ? 'update' : 'add'}`) }}
      </h2>
    </template>
    <p v-if="error" class="text-danger text-center">
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
        name="background"
        type="color"
        :label="$t('components.inputs.backgroundLabel')"
        validation="required"
        required
      />
      <FormKit
        type="submit"
        :aria-label="$t(`pages.encounters.${update ? 'update' : 'add'}`)"
        :label="$t(`pages.encounters.${update ? 'update' : 'add'}`)"
      />
    </FormKit>
  </Modal>
</template>
