<script setup>
import { contrastColor } from '@/util/contrastColor'
import { randomColor } from '@/util/randomColor'
import { useCampaignsStore } from '@/store/Campaigns'

const emit = defineEmits(['close'])
defineProps({ open: { type: Boolean, required: true } })

const store = useCampaignsStore()
const user = useSupabaseUser()
const form = reactive({ title: null, background: '#0073A1' })
const isLoading = ref(false)
const error = ref()

function changeColor() {
  form.background = randomColor()
}

async function addCampaign({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    await store.addCampaign({
      ...formData,
      created_by: user.value.id,
      admins: [user.value.id],
      color: contrastColor(formData.background),
      encounters: 0,
    })
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
    <h2>{{ $t('campaigns.title') }}</h2>
    <p v-if="error" class="text-danger text-center">{{ error }}</p>
    <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="addCampaign">
      <Input name="title" :label="$t('inputs.titleLabel')" validation="required|length:3,30" required />
      <div class="flex gap-2 items-end">
        <ColorPicker name="background" :label="$t('inputs.backgroundLabel')" validation="required" required />
        <div class="mb-[14px]">
          <Button :label="$t('actions.random')" bold @click="changeColor" />
        </div>
      </div>
      <Button type="submit" :label="$t('campaigns.add')" :loading="store.loading" inline bold />
    </FormKit>
  </Modal>
</template>
