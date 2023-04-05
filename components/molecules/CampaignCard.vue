<script setup>
// import Copy from '@/assets/icons/copy.svg'
import Delete from '@/assets/icons/delete.svg'
import Update from '@/assets/icons/update.svg'
import Settings from '@/assets/icons/settings.svg'
import Remove from '@/assets/icons/remove.svg'
import { useCampaignsStore } from '@/store/campaigns'
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'

const props = defineProps({ campaign: { type: Object, required: true } })

const user = useSupabaseUser()
const store = useCampaignsStore()
const toast = useToastStore()
const { t } = useI18n({ useScope: 'global' })
const localePath = useLocalePath()

const needConfirmation = ref(false)
const isUpdating = ref(false)
const isSettings = ref(false)

async function deleteCampaign() {
  try {
    await store.deleteCampaign(props.campaign.id)
  } catch (error) {
    errorToast()
  }
}

// async function copyCampaign({ created_at, id, profiles, ...enc }) {
//   const campaign = { ...enc, title: `copy ${enc.title}`.slice(0, 30), created_by: user.value.id }
//   delete campaign.initiative_sheets
//   try {
//     await store.addCampaign(campaign)
//   } catch (err) {
//     errorToast()
//   } finally {
//     isSettings.value = false
//   }
// }

function errorToast() {
  toast.error({
    title: t('error.general.title'),
    text: t('error.general.text'),
  })
}

function closeSettings() {
  isUpdating.value = false
  needConfirmation.value = false
  isSettings.value = false
}
</script>

<template>
  <div
    class="rounded-xl tracker-shadow min-w-[250px] max-w-md relative group"
    :style="{ 'background-color': campaign.background, color: campaign.color }"
  >
    <Settings
      v-if="!isSettings"
      class="w-8 h-8 cursor-pointer absolute top-1 right-1 opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
      :style="{ color: campaign.color }"
      @click="isSettings = true"
    />
    <Remove
      v-else
      class="w-8 h-8 cursor-pointer float-right mt-1 mr-1"
      :style="{ color: campaign.color }"
      @click="isSettings = false"
    />
    <NuxtLink
      v-if="!isSettings"
      :to="
        localePath(
          `/campaigns/${campaign.id}-${
            campaign.title.replace(/[\W]/g, '') === '' ? 'encounter' : campaign.title.replace(/[\W]/g, '')
          }`
        )
      "
      class="flex flex-col gap-2 justify-between p-4 cursor-pointer"
    >
      <h2>{{ campaign.title }}</h2>
      <div>
        <p>Encounters: {{ campaign.initiative_sheets?.length || 0 }}</p>
      </div>
    </NuxtLink>
    <div v-else class="flex flex-col gap-2 justify-between p-4">
      <h2>{{ campaign.title }}</h2>
      <div class="flex gap-2 cursor-pointer max-w-max" @click="isUpdating = true">
        <Update class="h-6 w-6" />
        <p>{{ $t('actions.update') }}</p>
      </div>
      <!-- <div class="flex gap-2 cursor-pointer max-w-max" @click="copyCampaign(campaign)">
        <Copy class="h-6 w-6" />
        <p>{{ $t('actions.copy') }}</p>
      </div> -->
      <div
        v-if="campaign.created_by === user.id"
        class="flex gap-2 cursor-pointer max-w-max"
        @click="needConfirmation = true"
      >
        <Delete class="h-6 w-6" />
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
