<script setup lang="ts">
import { reset } from '@formkit/core'
import logRocket from 'logrocket'

const emit = defineEmits(['close'])
defineProps<{ open: boolean }>()

const feature = useFeaturesStore()
const profile = useProfileStore()
const { t } = useI18n()

const isAccepted = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const error = ref<string|undefined>()

async function handleSubmit ({ __init, ...formData }: Obj): Promise<void> {
  error.value = undefined
  isLoading.value = true

  try {
    const newFeature: NewFeatureRequest = {
      ...formData as { title: string, text: string },
      created_by: profile.data!.id,
      voted: {
        like: [profile.data!.id],
        dislike: []
      },
      status: 'review'
    }

    const feat = await feature.addFeature(newFeature)

    if (feat) {
      const { error } = await useFetch('/api/emails/feature-request', {
        method: 'POST',
        body: {
          props: {
            ...formData,
            id: feat.id,
            name: profile.data!.username,
            email: profile.data!.email
          }
        }
      })

      if (error.value) {
        throw new Error(t('general.mail.fail.text'))
      }
    }

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
  <Modal :open="open" @close="resetForm">
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
