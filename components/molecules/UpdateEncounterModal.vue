<script setup>
import { contrastColor } from '@/util/contrastColor'
import { randomColor } from '@/util/randomColor'
import { useEncountersStore } from '@/store/encounters'
import { useCampaignsStore } from '@/store/campaigns'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close'])
const props = defineProps({
  open: { type: Boolean, required: true },
  encounter: { type: Object, required: true },
})

const store = useEncountersStore()
const campaigns = useCampaignsStore()
const { t } = useI18n({ useScope: 'global' })
const form = ref({ title: props.encounter.title, background: props.encounter.background })
const isLoading = ref(false)
const error = ref()
const campaign = ref()

onMounted(() => {
  campaigns.fetch()
  if (props.encounter.group) campaign.value = { label: props.encounter.group.title, id: props.encounter.group.id }
})

watch(
  () => props.open,
  v => {
    if (!v) campaign.value = null
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

async function updateEncounter({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    await store.updateEncounter(
      {
        ...formData,
        group: campaign.value && campaign.value.id !== 'none' ? campaign.value.id : null,
        color: contrastColor(formData.background),
      },
      props.encounter.id
    )
    emit('close')
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

function selectedCampaign(id) {
  const filtered = campaignOptions.value.filter(c => c.id === id && c.id !== 'none')
  campaign.value = filtered[0] || null
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <h2>{{ $t('encounters.update') }}</h2>
    <p v-if="error" class="text-danger text-center">{{ error }}</p>
    <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="updateEncounter">
      <Input name="title" :label="$t('inputs.titleLabel')" validation="required|length:3,30" required />
      <Select
        :inputLabel="$t('inputs.campaignLabel')"
        :label="campaign?.label || $t('campaigns.no')"
        bold
        :options="campaignOptions"
        @selected="selectedCampaign"
      />
      <div class="flex gap-2 items-end">
        <ColorPicker name="background" :label="$t('inputs.backgroundLabel')" validation="required" required />
        <div class="mb-[14px]">
          <Button :label="$t('actions.random')" bold @click="changeColor" />
        </div>
      </div>
      <Button type="submit" :label="$t('actions.update')" :loading="store.loading" inline bold />
    </FormKit>
  </Modal>
</template>
