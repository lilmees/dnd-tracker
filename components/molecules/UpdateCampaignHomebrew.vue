<script setup lang="ts">
import { reset } from '@formkit/core'
import logRocket from 'logrocket'

const emit = defineEmits(['close', 'updated'])
const props = defineProps<{ homebrew: Homebrew, open: boolean }>()

const store = useHomebrewStore()

const error = ref<string | null>(null)
const isLoading = ref<boolean>(false)
const form = ref<UpdateHomebrew>({
  link: props.homebrew.link || '',
  name: props.homebrew.name || '',
  ac: props.homebrew.ac || undefined,
  health: props.homebrew.health || undefined,
  type: props.homebrew.type || ''
})

watch(
  () => props.open,
  (v : boolean) => {
    if (v) {
      form.value = {
        type: props.homebrew.type || '',
        name: props.homebrew.name,
        ac: props.homebrew.ac || undefined,
        health: props.homebrew.health || undefined,
        link: props.homebrew.link || ''
      }
    }
  }
)

async function updateHomebrew ({ __init, ...formData }: Obj): Promise<void> {
  error.value = null
  isLoading.value = true
  try {
    const hb = await store.updateHomebrew({
      ...formData,
      campaign: props.homebrew.campaign
    },
    props.homebrew.id
    )
    emit('updated', hb)
    reset('form')
  } catch (err: any) {
    logRocket.captureException(err as Error)
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

      @submit="updateHomebrew"
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
        class="btn-black w-full mt-3"
        :aria-label="$t('components.updateCampaignHomebrew.update')"
        :disabled="isLoading"
      >
        {{ $t('components.updateCampaignHomebrew.update') }}
      </button>
    </FormKit>
  </Modal>
</template>
