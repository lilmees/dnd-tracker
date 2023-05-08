<script setup lang="ts">
import { useEncountersStore } from '@/store/encounters'
import { useCampaignsStore } from '@/store/campaigns'

const emit = defineEmits(['close', 'added'])
const props = withDefaults(
  defineProps<{ open: boolean, campaignId?: number | null }>(), {
    campaignId: null
  }
)

const { $i18n } = useNuxtApp()
const store = useEncountersStore()
const campaigns = useCampaignsStore()
const user = useSupabaseUser()

const form: Ref<AddEncounterForm> = ref({ title: '', campaign: null, background: '#0073A1' })
const isLoading: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)
const chosenCampaign: Ref<Option | null> = ref(null)

onMounted(() => {
  if (!props.campaignId) {
    campaigns.fetch()
  }
})

watch(
  () => props.open,
  (v: boolean) => {
    if (!v) { chosenCampaign.value = null }
  }
)

const campaignOptions: ComputedRef<Option[]> = computed(() => {
  let options : Option[] = [{ label: $i18n.t('campaigns.no'), id: -1 }]

  if (campaigns.campaigns) {
    options = [
      ...options,
      ...campaigns.campaigns.map((c) => {
        return { label: c.title, id: c.id }
      })
    ]
  }

  return options
})

function changeColor (): void {
  form.value.background = useRandomColor()
}

async function addEncounter ({ __init, ...formData }: Obj): Promise<void> {
  error.value = null
  isLoading.value = true

  const campaign: number | undefined =
  chosenCampaign.value && chosenCampaign.value.id > -1
    ? chosenCampaign.value.id
    : undefined

  try {
    if (user.value) {
      const encounter = await store.addEncounter({
        ...formData as AddEncounterForm,
        campaign,
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
    useBugsnag().notify(`Handeld in catch: ${useErrorMessage(err)}`)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

function selectedCampaign (id: number): void {
  const filtered = campaignOptions.value.filter(c => c.id === id && c.id !== -1)
  if (chosenCampaign.value) {
    chosenCampaign.value = filtered[0] || null
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <h2>{{ $t('encounters.title') }}</h2>
    <p v-if="error" class="text-danger text-center">
      {{ error }}
    </p>
    <FormKit
      v-if="campaignId || campaigns.campaigns"
      v-model="form"
      type="form"
      :actions="false"
      message-class="error-message"
      @submit="addEncounter"
    >
      <Input
        focus
        name="title"
        :label="$t('inputs.titleLabel')"
        validation="required|length:3,30"
        required
      />
      <Select
        v-if="!campaignId"
        :input-label="$t('inputs.campaignLabel')"
        :label="chosenCampaign?.label || $t('campaigns.no')"
        bold
        :options="campaignOptions"
        @selected="selectedCampaign"
      />
      <div class="flex gap-2 items-end">
        <ColorPicker
          name="background"
          :label="$t('inputs.backgroundLabel')"
          validation="required"
          required
        />
        <div class="mb-[14px]">
          <Button :label="$t('actions.random')" @click="changeColor" />
        </div>
      </div>
      <Button type="submit" :label="$t('encounters.add')" :loading="store.loading" inline />
    </FormKit>
    <div v-else class="loader" />
  </Modal>
</template>
