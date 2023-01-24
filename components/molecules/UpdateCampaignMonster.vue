<script setup>
import { reset } from '@formkit/core'
import { useMonstersStore } from '@/store/monsters'

const emit = defineEmits(['close', 'updated'])
const props = defineProps({
  monster: { type: Object, required: true },
  open: { type: Boolean, required: true },
})

const store = useMonstersStore()

const error = ref()
const isLoading = ref(false)
const form = ref({
  name: props.monster.name,
  ac: props.monster.ac || null,
  health: props.monster.health || null,
  link: props.monster.link || null,
})

watch(
  () => props.open,
  v => {
    if (!v) return
    form.value = {
      name: props.monster.name,
      ac: props.monster.ac || null,
      health: props.monster.health || null,
      link: props.monster.link || null,
    }
  }
)

async function updateMonster({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    const monster = await store.updateMonster({ ...formData, campaign: props.monster.campaign }, props.monster.id)
    emit('updated', monster)
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
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"
      message-class="error-message"
      @submit="updateMonster"
    >
      <Input focus name="name" :label="$t('inputs.nameLabel')" validation="required|length:3,30" required />
      <Input name="ac" type="number" :label="$t('inputs.acLabel')" validation="between:1,100|number" />
      <Input name="health" type="number" :label="$t('inputs.hpLabel')" validation="between:1,1000|number" />
      <Input name="link" :label="$t('inputs.linkLabel')" validation="length10,200|url" />
      <Button type="submit" :label="$t('monsters.update')" :loading="isLoading" inline />
    </FormKit>
  </Modal>
</template>
