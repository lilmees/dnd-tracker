<script setup lang="ts">
import { reset } from '@formkit/core'

const emit = defineEmits(['close'])
const props = withDefaults(
  defineProps<{
    open: boolean
    campaign?: Campaign
    update?: boolean
  }>(), {
    update: false,
    campaign: undefined,
  },
)

const store = useCampaignsStore()
const user = useSupabaseUser()

const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

const form = ref<CampaignForm>({ title: '' })

whenever(
  () => props.open,
  () => {
    if (props.update) {
      form.value.title = props.campaign?.title || ''
    }
  },
)

function handleSubmit({ __init, ...formData }: Obj): void {
  error.value = null
  isLoading.value = true

  try {
    props.update ? updateCampaign(formData) : addCampaign(formData)
    resetForm()
  }
  catch (err: any) {
    console.error(err)
    error.value = err.message
  }
  finally {
    isLoading.value = false
  }
}

async function addCampaign(data: Obj): Promise<void> {
  if (user.value) {
    await store.addCampaign({
      ...data as CampaignForm,
      created_by: user.value.id,
    })
  }
}

async function updateCampaign(data: Obj): Promise<void> {
  if (props.campaign) {
    await store.updateCampaign(data, props.campaign.id)
  }
}

function resetForm(): void {
  reset('form')
  form.value.title = ''
  emit('close')
}
</script>

<template>
  <Modal
    :open="open"
    @close="resetForm"
  >
    <template #header>
      <h2>
        {{ $t(`components.cammpaignModal.${update ? 'update' : 'add'}`) }}
      </h2>
    </template>
    <p
      v-if="error"
      class="text-danger text-center"
    >
      {{ error }}
    </p>
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"
      @submit="handleSubmit"
    >
      <FormKit
        name="title"
        :label="$t('components.inputs.titleLabel')"
        validation="required|length:3,30"
      />
      <FormKit
        type="submit"
        :aria-label="$t(`pages.campaigns.${update ? 'update' : 'add'}`)"
        :disabled="store.loading"
        outer-class="!mb-0"
      >
        {{ $t(`pages.campaigns.${update ? 'update' : 'add'}`) }}
      </FormKit>
    </FormKit>
  </Modal>
</template>
