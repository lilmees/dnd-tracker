<script setup lang="ts">
import { useCampaignsStore } from '@/store/campaigns'

const emit = defineEmits(['close'])
defineProps<{ open: boolean }>()

const store = useCampaignsStore()
const user = useSupabaseUser()
const { $logRocket } = useNuxtApp()

const isLoading: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)
const form: Ref<AddCampaignForm> = ref({
  title: '',
  background: '#0073A1'
})

function changeColor (): void {
  form.value.background = useRandomColor()
}

async function addCampaign ({ __init, ...formData }: Obj): Promise<void> {
  error.value = null
  isLoading.value = true

  try {
    if (user.value) {
      await store.addCampaign({
        ...formData as AddCampaignForm,
        created_by: user.value.id,
        admins: [user.value.id],
        color: useContrastColor(formData.background)
      })
      emit('close')
    }
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
    <h2>{{ $t('components.addCammpaignModal.title') }}</h2>
    <p v-if="error" class="text-danger text-center">
      {{ error }}
    </p>
    <FormKit
      v-model="form"
      type="form"
      :actions="false"

      @submit="addCampaign"
    >
      <Input
        focus
        name="title"
        :label="$t('components.inputs.titleLabel')"
        validation="required|length:3,30"
        required
      />
      <div class="flex gap-2 items-end">
        <ColorPicker
          name="background"
          :label="$t('components.inputs.backgroundLabel')"
          validation="required"
          required
        />
        <button
          class="btn-black mb-[24px]"
          :aria-label="$t('actions.random')"
          @click="changeColor"
        >
          {{ $t('actions.random') }}
        </button>
      </div>
      <button
        type="submit"
        class="btn-black w-full"
        :aria-label="$t('pages.campaigns.add')"
        :disabled="store.loading"
      >
        {{ $t('pages.campaigns.add') }}
      </button>
    </FormKit>
  </Modal>
</template>
