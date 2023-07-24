<script setup lang="ts">
import schema from '@/formkit/encounter.json'

const emit = defineEmits(['close', 'updated'])
const props = defineProps<{ open: boolean, encounter: Encounter }>()

const store = useEncountersStore()
const { $logRocket } = useNuxtApp()

const form = ref<UpdateEncounterForm>({
  title: props.encounter.title,
  background: props.encounter.background,
  data: {
    isLoading: false,
    campaign: false,
    update: true,
    error: null,
    options: [],
    changeColor: () => {
      form.value.background = useRandomColor()
    }
  }
})

async function updateEncounter ({ __init, data, slots, ...formData }: Obj): Promise<void> {
  form.value.data.error = null
  form.value.data.isLoading = true

  try {
    const enc = await store.updateEncounter(
      { ...formData, color: useContrastColor(formData.background) },
      props.encounter.id
    )
    emit('updated', enc)
  } catch (err: any) {
    $logRocket.captureException(err as Error)
    form.value.data.error = err.message
  } finally {
    form.value.data.isLoading = false
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <h2>{{ $t('components.updateEncounterModal.update') }}</h2>
    <p v-if="form.data.error" class="text-danger text-center">
      {{ form.data.error }}
    </p>
    <FormKit
      v-model="form"
      type="form"
      :actions="false"
      @submit="updateEncounter"
    >
      <FormKitSchema :data="form" :schema="useI18nForm(schema)" />
    </FormKit>
  </Modal>
</template>
