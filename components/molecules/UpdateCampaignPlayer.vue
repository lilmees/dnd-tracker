<script setup>
import { reset } from '@formkit/core'
import { usePlayersStore } from '@/store/players'

const emit = defineEmits(['close', 'updated'])
const props = defineProps({
  player: { type: Object, required: true },
  open: { type: Boolean, required: true },
})

const store = usePlayersStore()

const error = ref()
const isLoading = ref(false)
const form = ref({
  name: props.player.name,
  ac: props.player.ac || null,
  health: props.player.health || null,
  link: props.player.link || null,
})

async function updatePlayer({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    const player = await store.updatePlayer({ ...formData, campaign: props.player.campaign }, props.player.id)
    emit('updated', player)
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
    <p v-if="error" class="text-danger text-center">{{ error }}</p>
    <FormKit id="form" v-model="form" type="form" :actions="false" message-class="error-message" @submit="updatePlayer">
      <Input name="name" :label="$t('inputs.nameLabel')" validation="required|length:3,30" required />
      <Input name="ac" type="number" :label="$t('inputs.acLabel')" validation="between:1,100|number" />
      <Input name="health" type="number" :label="$t('inputs.hpLabel')" validation="between:1,1000|number" />
      <Input name="link" :label="$t('inputs.linkLabel')" validation="length10,200|url" />
      <Button type="submit" :label="$t('players.update')" :loading="isLoading" inline />
    </FormKit>
  </Modal>
</template>
