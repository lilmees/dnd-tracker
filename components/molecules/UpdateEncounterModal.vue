<script setup lang="ts">
import { useEncountersStore } from '@/store/encounters'

const emit = defineEmits(['close', 'updated'])
const props = defineProps<{ open: boolean, encounter: Encounter }>()

const store = useEncountersStore()

const form: Ref<{ title: string, background: string}> = ref({
  title: props.encounter.title,
  background: props.encounter.background
})
const isLoading: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)

watch(
  () => props.open,
  (v: boolean) => {
    if (v) {
      form.value = {
        title: props.encounter.title,
        background: props.encounter.background
      }
    }
  }
)

function changeColor (): void {
  form.value.background = useRandomColor()
}

async function updateEncounter ({ __init, ...formData }: Obj): Promise<void> {
  error.value = null
  try {
    isLoading.value = true
    const enc = await store.updateEncounter(
      { ...formData, color: useContrastColor(formData.background) },
      props.encounter.id
    )
    emit('updated', enc)
  } catch (err: any) {
    useBugsnag().notify(`Handeld in catch: ${useErrorMessage(err)}`)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Modal v-if="open" @close="$emit('close')">
    <h2>{{ $t('encounters.update') }}</h2>
    <p v-if="error" class="text-danger text-center">
      {{ error }}
    </p>
    <FormKit
      v-model="form"
      type="form"
      :actions="false"
      message-class="error-message"
      @submit="updateEncounter"
    >
      <Input
        focus
        name="title"
        :label="$t('inputs.titleLabel')"
        validation="required|length:3,30"
        required
      />
      <div class="flex gap-2 items-end">
        <ColorPicker
          name="background"
          :label="$t('inputs.backgroundLabel')"
          validation="required"
          required
        />
        <div class="mb-[14px]">
          <Button :label="$t('actions.random')" @click="changeColor" />
        </div>
      </div>
      <Button
        type="submit"
        :label="$t('actions.update')"
        :loading="store.loading"
        inline
      />
    </FormKit>
  </Modal>
</template>
