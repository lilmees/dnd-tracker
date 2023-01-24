<script setup>
import { contrastColor } from '@/util/contrastColor'
import { randomColor } from '@/util/randomColor'
import { useEncountersStore } from '@/store/encounters'

const emit = defineEmits(['close', 'updated'])
const props = defineProps({
  open: { type: Boolean, required: true },
  encounter: { type: Object, required: true },
})

const store = useEncountersStore()

const form = ref({ title: props.encounter.title, background: props.encounter.background })
const isLoading = ref(false)
const error = ref()

watch(
  () => props.open,
  v => {
    if (!v) return
    form.value = { title: props.encounter.title, background: props.encounter.background }
  }
)

function changeColor() {
  form.value.background = randomColor()
}

async function updateEncounter({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    const enc = await store.updateEncounter(
      { ...formData, color: contrastColor(formData.background) },
      props.encounter.id
    )
    emit('updated', enc)
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <h2>{{ $t('encounters.update') }}</h2>
    <p v-if="error" class="text-danger text-center">{{ error }}</p>
    <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="updateEncounter">
      <Input focus name="title" :label="$t('inputs.titleLabel')" validation="required|length:3,30" required />
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
