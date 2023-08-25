<script setup lang="ts">
import logRocket from 'logrocket'

const emit = defineEmits(['close', 'updated'])
const props = defineProps<{ open: boolean, encounter: Encounter }>()

const store = useEncountersStore()

store.loading = false

const form = ref<UpdateEncounterForm>({
  title: props.encounter.title,
  background: props.encounter.background,
  data: {
    isLoading: false,
    campaign: false,
    update: true,
    error: null,
    options: []
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
    logRocket.captureException(err as Error)
    form.value.data.error = err.message
  } finally {
    form.value.data.isLoading = false
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <template #header>
      <h2>{{ $t('components.updateEncounterModal.update') }}</h2>
    </template>
    <p v-if="form.data.error" class="text-danger text-center">
      {{ form.data.error }}
    </p>
    <FormKit
      v-model="form"
      type="form"
      :actions="false"
      @submit="updateEncounter"
    >
      <Input
        focus
        name="title"
        :label="$t('components.inputs.titleLabel')"
        validation="required|length:3,30"
        required
      />
      <FormKit
        v-if="form.data.campaign"
        name="campaign"
        type="select"
        :label="$t('components.inputs.campaignLabel')"
        :placeholder="$t('general.noSelected')"
        :options="form.data.options"
      />
      <ColorPicker
        name="background"
        :label="$t('components.inputs.backgroundLabel')"
        validation="required"
        required
      />
      <button
        type="submit"
        class="btn-black w-full"
        :aria-label="$t('components.updateEncounterModal.update')"
        :disabled="store.loading"
      >
        {{ $t('components.updateEncounterModal.update') }}
      </button>
    </FormKit>
  </Modal>
</template>
