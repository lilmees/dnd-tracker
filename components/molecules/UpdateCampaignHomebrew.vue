<script setup>
import { reset } from '@formkit/core'
import { useHomebrewStore } from '@/store/homebrew'

const emit = defineEmits(['close', 'updated'])
const props = defineProps({
  homebrew: { type: Object, required: true },
  open: { type: Boolean, required: true }
})

const store = useHomebrewStore()

const error = ref()
const isLoading = ref(false)
const form = ref({
  link: props.homebrew.link || null,
  name: props.homebrew.name,
  ac: props.homebrew.ac || null,
  health: props.homebrew.health || null,
  type: props.homebrew.link || null
})

watch(
  () => props.open,
  (v) => {
    if (v) {
      form.value = {
        type: props.homebrew.type || null,
        name: props.homebrew.name,
        ac: props.homebrew.ac || null,
        health: props.homebrew.health || null,
        link: props.homebrew.link || null
      }
    }
  }
)

async function updateHomebrew ({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    const hb = await store.updateHomebrew({
      ...formData,
      campaign: props.homebrew.campaign
    },
    props.homebrew.id
    )
    emit('updated', hb)
    reset('form')
  } catch (err) {
    useBugsnag().notify(`Handeld in catch: ${err}`)
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
      @submit="updateHomebrew"
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
      <Button
        type="submit"
        :label="$t('homebrews.update')"
        :loading="isLoading"
        inline
      />
    </FormKit>
  </Modal>
</template>
