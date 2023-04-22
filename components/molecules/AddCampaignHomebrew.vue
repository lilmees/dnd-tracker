<script setup>
import { reset } from '@formkit/core'
import { useHomebrewStore } from '@/store/homebrew'

const emit = defineEmits(['close', 'homebrews'])
const props = defineProps({
  homebrews: { type: Array, required: true },
  open: { type: Boolean, required: true },
  id: { type: Number, required: true }
})

const store = useHomebrewStore()

const error = ref()
const isLoading = ref(false)
const form = ref({ type: 'player', name: null, ac: null, health: null, link: null })

async function addHomebrew ({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    const homebrew = await store.addHomebrew({ ...formData, campaign: props.id }, props.id)
    emit('homebrews', [...props.homebrews, homebrew])
    reset('form')
  } catch (err) {
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
      message-class="error-message"
      @submit="addHomebrew"
    >
      <Input
        focus
        name="name"
        :label="$t('inputs.nameLabel')"
        validation="required|length:3,30"
        required
      />
      <Input
        name="ac"
        type="number"
        :label="$t('inputs.acLabel')"
        validation="between:1,100|number"
      />
      <Input
        name="health"
        type="number"
        :label="$t('inputs.hpLabel')"
        validation="between:1,1000|number"
      />
      <Input
        name="link"
        :label="$t('inputs.linkLabel')"
        validation="length10,200|url"
      />
      <Button type="submit" :label="$t('homebrews.add')" :loading="isLoading" inline />
    </FormKit>
  </Modal>
</template>
