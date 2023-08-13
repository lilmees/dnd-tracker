<script setup lang="ts">
import logRocket from 'logrocket'
import { campaignUrl } from '@/utils/url-genarators'

const props = defineProps<{ campaign: Campaign }>()

const user = useSupabaseUser()
const store = useCampaignsStore()
const toast = useToastStore()
const localePath = useLocalePath()

const needConfirmation = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const isSettings = ref<boolean>(false)

async function deleteCampaign (): Promise<void> {
  try {
    await store.deleteCampaign(props.campaign.id)
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  }
}

function closeSettings (): void {
  isUpdating.value = false
  needConfirmation.value = false
  isSettings.value = false
}
</script>

<template>
  <div
    class="rounded-lg min-w-[250px] max-w-md relative group border-4"
    :style="{
      'background-color': `${campaign.background}80`,
      'border-color': campaign.background,
      color: campaign.color
    }"
  >
    <div class="flex justify-end mr-2">
      <tippy interactive trigger="click">
        <Icon
          name="tabler:dots"
          class="w-6 h-6 cursor-pointer opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
          :style="{ color: campaign.color }"
        />
        <template #content>
          <div class="p-4 space-y-2 overflow-auto">
            <h3>
              opties
            </h3>
          </div>
        </template>
      </tippy>
    </div>

    <NuxtLink
      :to="localePath(campaignUrl(campaign))"
      class="flex flex-col gap-2 justify-between px-6 pb-8 pt-2 cursor-pointer"
    >
      <h2>{{ campaign.title }}</h2>
      <div>
        <p>Encounters: {{ campaign.initiative_sheets?.length || 0 }}</p>
      </div>
    </NuxtLink>
    <!-- <div v-else class="flex flex-col gap-2 justify-between p-4">
      <h2>{{ campaign.title }}</h2>
      <div class="flex gap-2 cursor-pointer max-w-max" @click="isUpdating = true">
        <Icon name="lucide:wrench" class="h-6 w-6" />
        <p>{{ $t('actions.update') }}</p>
      </div>
      <div
        v-if="user && campaign.created_by === user.id"
        class="flex gap-2 cursor-pointer max-w-max"
        @click="needConfirmation = true"
      >
        <Icon name="material-symbols:delete-outline-rounded" class="h-6 w-6" />
        <p>{{ $t('actions.delete') }}</p>
      </div>
    </div> -->
    <div class="absolute z-[1]">
      <ConfirmationModal
        :open="needConfirmation"
        :title="campaign.title"
        @close="closeSettings"
        @delete="deleteCampaign"
      />
      <UpdateCampaignModal :open="isUpdating" :campaign="campaign" @close="closeSettings" />
    </div>
  </div>
</template>
