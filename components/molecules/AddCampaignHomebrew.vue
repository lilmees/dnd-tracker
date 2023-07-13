<script setup lang="ts">
import { reset } from '@formkit/core'
import { useHomebrewStore } from '@/store/homebrew'

const emit = defineEmits(['close', 'homebrews'])
const props = defineProps<{
  homebrews: Homebrew[],
  open: boolean,
  id: number
}>()

const store = useHomebrewStore()
const { $logRocket } = useNuxtApp()

const error: Ref<string | null> = ref(null)
const isLoading: Ref<boolean> = ref(false)
const form: Ref<AddCampaignHomebrewForm> = ref({
  type: 'player' as HomebrewType,
  name: '',
  ac: null,
  health: null,
  link: ''
})

async function addHomebrew ({ __init, ...formData }: Obj): Promise<void> {
  error.value = null
  isLoading.value = true

  try {
    const homebrew = await store.addHomebrew({
      ...formData,
      campaign: props.id
    } as AddHomebrew)

    emit('homebrews', [...props.homebrews, homebrew])
    reset('form')
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
    <p v-if="error" class="text-danger text-center">
      {{ error }}
    </p>
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"
      @submit="addHomebrew"
    >
      <Input
        focus
        name="name"
        :label="$t('components.inputs.nameLabel')"
        validation="required|length:3,30"
        required
      />
      <Input
        name="ac"
        type="number"
        :label="$t('components.inputs.acLabel')"
        validation="between:1,100|number"
      />
      <Input
        name="health"
        type="number"
        :label="$t('components.inputs.hpLabel')"
        validation="between:1,1000|number"
      />
      <Input
        name="link"
        :label="$t('components.inputs.linkLabel')"
        validation="length10,200|url"
      />
      <button
        type="submit"
        class="btn-black w-full"
        :aria-label="$t('components.addCammpaignHomebrew.add')"
        :disabled="isLoading"
      >
        {{ $t('components.addCammpaignHomebrew.add') }}
      </button>
    </FormKit>
  </Modal>
</template>
