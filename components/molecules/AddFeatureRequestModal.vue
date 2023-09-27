<script setup lang="ts">
import { reset } from '@formkit/core'
import logRocket from 'logrocket'

const emit = defineEmits(['close'])
const props = defineProps<{
  open: boolean,
  userId: string,
}>()

const feature = useFeaturesStore()

const isAccepted = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const error = ref<string|undefined>()

function handleSubmit ({ __init, ...formData }: Obj): void {
  error.value = undefined
  isLoading.value = true

  try {
    const newFeature: NewFeatureRequest = {
      ...formData as { title: string, text: string },
      created_by: props.userId,
      voted: {
        like: [props.userId],
        dislike: []
      },
      status: 'review'
    }

    feature.addFeature(newFeature)

    isAccepted.value = true
  } catch (err: any) {
    logRocket.captureException(err as Error)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

function resetForm (): void {
  isAccepted.value = false
  reset('form')
  emit('close')
}
</script>

<template>
  <Modal v-if="open" @close="resetForm">
    <template #header>
      <h2>
        {{ $t('components.addFeatureRequestModal.title') }}
      </h2>
    </template>
    <template v-if="!isAccepted">
      <p v-if="error" class="text-danger text-center">
        {{ error }}
      </p>
      <FormKit
        id="form"
        type="form"
        :actions="false"
        @submit="handleSubmit"
      >
        <FormKit
          name="title"
          :label="$t('components.inputs.titleLabel')"
          validation="required|length:3,50"
        />
        <FormKit
          type="textarea"
          name="text"
          :maxlength="500"
          :label="$t('components.inputs.descriptionLabel')"
          validation="required|length:10,500"
        />
        <FormKit
          type="submit"
          :aria-label="$t('actions.create')"
          :disabled="isLoading"
        >
          {{ $t('actions.create') }}
        </FormKit>
      </FormKit>
    </template>
    <template v-else>
      <p>
        {{ $t('components.addFeatureRequestModal.submitted') }}
      </p>
      <div class="flex justify-end">
        <button
          :aria-label="$t('components.addFeatureRequestModal.another')"
          class="btn-black mt-4"
          @click="() => {
            reset('form')
            isAccepted = false
          }"
        >
          {{ $t('components.addFeatureRequestModal.another') }}
        </button>
      </div>
    </template>
  </Modal>
</template>
