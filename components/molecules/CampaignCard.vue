<script setup lang="ts">
import logRocket from 'logrocket'

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

// async function copyCampaign({ created_at, id, profiles, ...enc }) {
//   const campaign = { ...enc, title: `copy ${enc.title}`.slice(0, 30), created_by: user.value.id }
//   delete campaign.initiative_sheets
//   try {
//     await store.addCampaign(campaign)
//   } catch (err) {
//  logRocket.captureException(err as Error)
//     toast.error()
//   } finally {
//     isSettings.value = false
//   }
// }

function closeSettings (): void {
  isUpdating.value = false
  needConfirmation.value = false
  isSettings.value = false
}
</script>

<template>
  <div
    class="rounded-lg tracker-shadow min-w-[250px] max-w-md relative group"
    :style="{ 'background-color': campaign.background, color: campaign.color }"
  >
    <Icon
      v-if="!isSettings"
      name="material-symbols:settings-outline-rounded"
      class="w-6 h-6 cursor-pointer absolute top-1 right-1 opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
      :style="{ color: campaign.color }"
      @click="isSettings = true"
    />
    <Icon
      v-else
      name="ic:round-clear"
      class="w-6 h-6 cursor-pointer float-right mt-1 mr-1"
      :style="{ color: campaign.color }"
      @click="isSettings = false"
    />
    <NuxtLink
      v-if="!isSettings"
      :to="
        localePath(
          `/campaigns/${campaign.id}-${
            campaign.title.replace(/[\W]/g, '') === '' ? 'campaign' : campaign.title.replace(/[\W]/g, '')
          }`
        )
      "
      class="flex flex-col gap-2 justify-between px-6 py-8 cursor-pointer"
    >
      <h2>{{ campaign.title }}</h2>
      <div>
        <p>Encounters: {{ campaign.initiative_sheets?.length || 0 }}</p>
      </div>
    </NuxtLink>
    <div v-else class="flex flex-col gap-2 justify-between p-4">
      <h2>{{ campaign.title }}</h2>
      <div class="flex gap-2 cursor-pointer max-w-max" @click="isUpdating = true">
        <Icon name="lucide:wrench" class="h-6 w-6" />
        <p>{{ $t('actions.update') }}</p>
      </div>
      <!-- <div class="flex gap-2 cursor-pointer max-w-max" @click="copyCampaign(campaign)">
        <Icon name="material-symbols:content-copy-outline-rounded" class="h-6 w-6" />
        <p>{{ $t('actions.copy') }}</p>
      </div> -->
      <div
        v-if="user && campaign.created_by === user.id"
        class="flex gap-2 cursor-pointer max-w-max"
        @click="needConfirmation = true"
      >
        <Icon name="material-symbols:delete-outline-rounded" class="h-6 w-6" />
        <p>{{ $t('actions.delete') }}</p>
      </div>
    </div>
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
