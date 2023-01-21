<script setup>
import { contrastColor } from '@/util/contrastColor'
import { randomColor } from '@/util/randomColor'
import { useCampaignsStore } from '@/store/campaigns'

const emit = defineEmits(['close'])
const props = defineProps({
  open: { type: Boolean, required: true },
  campaign: { type: Object, required: true },
})

const store = useCampaignsStore()

const isLoading = ref(false)
const error = ref()
const form = ref({
  title: props.campaign.title,
  background: props.campaign.background,
})

watch(
  () => props.open,
  v => {
    if (!v) return
    form.value = { title: props.campaign.title, background: props.campaign.background }
  }
)

function changeColor() {
  form.value.background = randomColor()
}

async function updateCampaign({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    await store.updateCampaign(
      {
        ...formData,
        color: contrastColor(formData.background),
      },
      props.campaign.id
    )
    emit('close')
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <h2>{{ $t('campaigns.update') }}</h2>
    <p v-if="error" class="text-danger text-center">{{ error }}</p>
    <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="updateCampaign">
      <Input focus name="title" :label="$t('inputs.campaignLabel')" validation="length:3,30" />
      <div class="flex gap-2 items-end">
        <ColorPicker name="background" :label="$t('inputs.backgroundLabel')" validation="required" required />
        <div class="mb-[14px]">
          <Button :label="$t('actions.random')" @click="changeColor" />
        </div>
      </div>
      <Button type="submit" :label="$t('actions.update')" :loading="store.loading" inline />
    </FormKit>
  </Modal>
</template>
