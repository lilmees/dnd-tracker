<script setup lang="ts">
import logRocket from 'logrocket'
import schema from '@/formkit/encounter.json'

const emit = defineEmits(['close', 'added'])
const props = withDefaults(
  defineProps<{ open: boolean, campaignId?: number | null }>(), {
    campaignId: null
  }
)

const store = useEncountersStore()
const campaigns = useCampaignsStore()
const user = useSupabaseUser()

const form = ref<AddEncounterForm>({
  title: '',
  campaign: props.campaignId || undefined,
  background: '#0073A1',
  data: {
    isLoading: false,
    campaign: false,
    update: false,
    error: null,
    options: [],
    changeColor: () => {
      form.value.background = useRandomColor()
    }
  }
})

onMounted(() => {
  if (!props.campaignId) {
    campaigns.fetch()
  }
})

watch(() => campaigns.campaigns, (v) => {
  form.value.data.campaign = !!v?.length || false
  if (v) {
    form.value.data.options = v.map((c) => {
      return { label: c.title, value: c.id }
    })
  }
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
    <h2>{{ $t('components.addEncounterModal.title') }}</h2>
    <p v-if="form.data.error" class="text-danger text-center">
      {{ form.data.error }}
    </p>
    <FormKit
      v-if="campaignId || campaigns.campaigns"
      v-model="form"
      type="form"
      :actions="false"
      @submit="addEncounter"
    >
      <FormKitSchema :data="form" :schema="useI18nForm(schema)" />
    </FormKit>
    <div v-else class="loader" />
  </Modal>
</template>
