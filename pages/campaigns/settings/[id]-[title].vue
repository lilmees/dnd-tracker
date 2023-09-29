<script setup lang="ts">
import logRocket from 'logrocket'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const store = useCurrentCampaignStore()
const campaignStore = useCampaignsStore()
const toast = useToastStore()
const profile = useProfileStore()

const isLoading = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const form = ref<CampaignForm>({
  title: '',
  background: '#7333E0'
})

onMounted(() => {
  if (route?.params?.id) {
    store.getCampaignInfo(+route.params.id)
  }
})

async function handleSubmit ({ __init, ...formData }: Obj): Promise<void> {
  isLoading.value = true
  try {
    if (store.campaign) {
      await campaignStore.updateCampaign(
        {
          ...formData,
          color: useContrastColor(formData.background)
        },
        store.campaign.id
      )
    }
  } catch (err: any) {
    logRocket.captureException(err as Error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <NuxtLayout>
    <section v-if="store.campaign" class="space-y-2">
      <FormKit
        id="form"
        type="form"
        :actions="false"
        @submit="handleSubmit"
      >
        <div
          class="flex flex-col md:flex-row justify-between gap-x-10 gap-y-4 py-6 border-b-2 border-slate-700"
        >
          <div class="md:min-w-[300px]">
            <h2>
              {{ $t('pages.profile.data.title') }}
            </h2>
            <p class="pt-2">
              {{ $t('pages.profile.data.subtitle') }}
            </p>
          </div>
          <div class="grow max-w-4xl">
            <FormKit
              :value="store.campaign.title"
              name="title"
              :label="$t('components.inputs.titleLabel')"
              validation="required|length:3,30"
            />
            <FormKit
              :value="store.campaign.background"
              type="color"
              name="background"
              :label="$t('components.inputs.backgroundLabel')"
              validation="required"
            />
            <FormKit
              type="submit"
              :aria-label="$t('pages.campaigns.update')"
              :disabled="campaignStore.loading"
            >
              {{ $t('pages.campaigns.update') }}
            </FormKit>
          </div>
        </div>
        <div
          class="flex flex-col md:flex-row justify-between gap-x-10 gap-y-4 py-6 border-b-2 border-slate-700"
        >
          <div class="md:min-w-[300px]">
            <h2>
              {{ $t('pages.profile.data.title') }}
            </h2>
            <p class="pt-2">
              {{ $t('pages.profile.data.subtitle') }}
            </p>
          </div>
          <div class="grow max-w-4xl">
            <FormKit
              :value="store.campaign.title"
              name="title"
              :label="$t('components.inputs.titleLabel')"
              validation="required|length:3,30"
            />
            <FormKit
              :value="store.campaign.background"
              type="color"
              name="background"
              :label="$t('components.inputs.backgroundLabel')"
              validation="required"
            />
            <FormKit
              type="submit"
              :aria-label="$t('pages.campaigns.update')"
              :disabled="campaignStore.loading"
            >
              {{ $t('pages.campaigns.update') }}
            </FormKit>
          </div>
        </div>
        <div class="flex pt-4 justify-end">
          <button
            class="btn-danger mb-4"
            :aria-label="$t('pages.profile.delete')"
            :disabled="isLoading"
            @click="needConfirmation = true"
          >
            {{ $t('pages.profile.delete') }}
          </button>
        </div>
      </FormKit>

    <!-- <ConfirmationModal
      :open="needConfirmation"
      :title="profile.data.username"
      @close="needConfirmation = false"
      @delete="deleteUser"
    /> -->
    </section>
  </NuxtLayout>
</template>
