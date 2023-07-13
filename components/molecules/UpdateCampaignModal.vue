<script setup lang="ts">
import { useCampaignsStore } from '@/store/campaigns'

const emit = defineEmits(['close'])
const props = defineProps<{ open: boolean, campaign: Campaign }>()

const store = useCampaignsStore()
const { $logRocket } = useNuxtApp()

const isLoading: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)
const form: Ref<{ title: string, background: string }> = ref({
  title: props.campaign.title,
  background: props.campaign.background
})

watch(
  () => props.open,
  (v: boolean) => {
    if (v) {
      form.value = {
        title: props.campaign.title,
        background: props.campaign.background
      }
    }
  }
)

function changeColor ():void {
  form.value.background = useRandomColor()
}

async function updateCampaign ({ __init, ...formData }: Obj): Promise<void> {
  error.value = null
  isLoading.value = true

  try {
    await store.updateCampaign(
      {
        ...formData,
        color: useContrastColor(formData.background)
      },
      props.campaign.id
    )
    emit('close')
  } catch (err: any) {
    $logRocket.captureException(err as Error)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <h2>{{ $t('components.updateCammpaignModal.update') }}</h2>
    <p v-if="error" class="text-danger text-center">
      {{ error }}
    </p>
    <FormKit
      v-model="form"
      type="form"
      :actions="false"

      @submit="updateCampaign"
    >
      <Input
        focus
        name="title"
        :label="$t('components.inputs.campaignLabel')"
        validation="length:3,30"
      />
      <div class="flex gap-2 items-end">
        <ColorPicker
          name="background"
          :label="$t('components.inputs.backgroundLabel')"
          validation="required"
          required
        />
        <button
          class="btn-black mb-[14px]"
          :aria-label="$t('actions.random')"
          @click="changeColor"
        >
          {{ $t('actions.random') }}
        </button>
      </div>
      <button
        type="submit"
        class="btn-black w-full mt-3"
        :aria-label="$t('components.updateCammpaignHomebrew.update')"
        :disabled="store.loading"
      >
        {{ $t('components.updateCammpaignHomebrew.update') }}
      </button>
    </FormKit>
  </Modal>
</template>
