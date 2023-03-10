<script setup>
import { contrastColor } from '@/util/contrastColor'
import { randomColor } from '@/util/randomColor'
import { useEncountersStore } from '@/store/encounters'
import { useCampaignsStore } from '@/store/campaigns'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close', 'added'])
const props = defineProps({
  open: { type: Boolean, required: true },
  campaignId: { type: [Number, String] },
})

const { t } = useI18n({ useScope: 'global' })
const store = useEncountersStore()
const campaigns = useCampaignsStore()
const user = useSupabaseUser()

const form = ref({ title: null, campaign: null, background: '#0073A1' })
const isLoading = ref(false)
const error = ref()
const chosenCampaign = ref()

onMounted(() => {
  if (!props.campaignId) campaigns.fetch()
})

watch(
  () => props.open,
  v => {
    if (!v) chosenCampaign.value = null
  }
)

const campaignOptions = computed(() => {
  return [
    { label: t('campaigns.no'), id: 'none' },
    ...campaigns.data.map(c => {
      return { label: c.title, id: c.id }
    }),
  ]
})

function changeColor() {
  form.value.background = randomColor()
}

async function addEncounter({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    let campaign =
      props.campaignId || (chosenCampaign.value && chosenCampaign.value.id !== 'none' ? chosenCampaign.value.id : null)
    const encounter = await store.addEncounter({
      ...formData,
      campaign,
      round: 1,
      rows: [],
      created_by: user.value.id,
      admins: [user.value.id],
      color: contrastColor(formData.background),
      activeIndex: 0,
    })
    emit('added', encounter)
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

function selectedCampaign(id) {
  const filtered = campaignOptions.value.filter(c => c.id === id && c.id !== 'none')
  chosenCampaign.value = filtered[0] || null
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <h2>{{ $t('encounters.title') }}</h2>
    <p v-if="error" class="text-danger text-center">{{ error }}</p>
    <FormKit
      v-if="campaignId || campaigns.data"
      v-model="form"
      type="form"
      :actions="false"
      message-class="error-message"
      @submit="addEncounter"
    >
      <Input focus name="title" :label="$t('inputs.titleLabel')" validation="required|length:3,30" required />
      <Select
        v-if="!campaignId"
        :inputLabel="$t('inputs.campaignLabel')"
        :label="chosenCampaign?.label || $t('campaigns.no')"
        bold
        :options="campaignOptions"
        @selected="selectedCampaign"
      />
      <div class="flex gap-2 items-end">
        <ColorPicker name="background" :label="$t('inputs.backgroundLabel')" validation="required" required />
        <div class="mb-[14px]">
          <Button :label="$t('actions.random')" @click="changeColor" />
        </div>
      </div>
      <Button type="submit" :label="$t('encounters.add')" :loading="store.loading" inline />
    </FormKit>
    <div v-else class="loader" />
  </Modal>
</template>
