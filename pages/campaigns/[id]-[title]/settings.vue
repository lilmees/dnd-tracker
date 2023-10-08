<script setup lang="ts">
import logRocket from 'logrocket'
import { contrastColor } from '@/utils/color-helpers'

const store = useCurrentCampaignStore()
const campaignStore = useCampaignsStore()
const toast = useToastStore()
const { t } = useI18n()
const isSmall = useMediaQuery('(max-width: 768px)')

const isLoading = ref<boolean>(false)
const isOpen = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const selectedInvite = ref<JoinCampaign>()
const selectedTeamMember = ref<TeamMember>()

// when creating content as admin the owner cant see it
// when creating content as admin set the created_by still as the owner
// check creating encounter/campaign because rls changed
// update role when switching select
// add danger zone functionality
// when finished remove that the invite is always sent to my email adress

const members = computed<any[]>(() => {
  return !store.campaign
    ? []
    : [
        { role: 'Owner', user: store.campaign.created_by },
        ...store.campaign.team || [],
        ...store.campaign.join_campaign?.map((join) => { return { ...join, invite: true } }) || []
      ]
})

async function handleSubmit ({ __init, ...formData }: Obj): Promise<void> {
  isLoading.value = true
  try {
    if (store.campaign) {
      await campaignStore.updateCampaign(
        {
          ...formData,
          color: contrastColor(formData.background)
        },
        store.campaign.id
      )
      toast.success({ title: t('pages.campaign.toast.update') })
    }
  } catch (err: any) {
    toast.error()
    logRocket.captureException(err as Error)
  } finally {
    isLoading.value = false
  }
}

async function handleDelete (): Promise<void> {
  try {
    if (selectedTeamMember.value) {
      await store.deleteCampaignTeamMember(selectedTeamMember.value.id)
    } else if (selectedInvite.value) {
      await store.deleteJoinCampaignToken(selectedInvite.value.id)
    }
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    selectedTeamMember.value = undefined
    selectedInvite.value = undefined
  }
}
</script>

<template>
  <section class="space-y-2">
    <div
      class="flex flex-col md:flex-row justify-between gap-x-10 gap-y-4 py-6 border-b-2 border-slate-700"
    >
      <div class="md:min-w-[300px]">
        <h2>
          Manage access
          <span class="text-[10px]">
            (max 10)
          </span>
        </h2>
      </div>
      <div class="grow max-w-4xl">
        <div
          v-if="!store.loading && store.campaign"
          class="p-6 rounded-lg overflow-x-auto overflow-y-hidden w-full border-4 border-tracker bg-tracker/50"
        >
          <div
            v-for="item in members"
            :key="item.user.id"
            class="flex flex-col sm:flex-row gap-x-4 gap-y-2 sm:items-center sm:justify-between border-b border-slate-700 mb-2 pb-1 last:border-none last:mb-0 last:pb-0"
          >
            <Avatar :user="item.user" :username="isSmall" />
            <p class="w-[200px] hidden sm:block font-bold">
              {{ item.user.username }}
            </p>
            <div v-if="item?.invite" class="max-w-[300px] grow flex items-center gap-2">
              <Icon name="mingcute:invite-line" :aria-hidden="true" class="w-5 h-5" />
              <span>
                {{ $t('components.userModal.invited') }}
              </span>
            </div>
            <div
              v-else-if="item.role === 'Owner'"
              class="max-w-[300px] grow flex items-center gap-2"
            >
              <Icon name="tabler:chess-king" :aria-hidden="true" class="w-5 h-5" />
              <span>
                {{ $t('general.roles.Owner.title') }}
              </span>
            </div>
            <FormKit
              v-else
              :value="item.role"
              name="title"
              type="select"
              :disabled="item.role === 'Owner'"
              :options="[
                { value: 'Viewer', label: $t('general.roles.Viewer.title') },
                { value: 'Admin', label: $t('general.roles.Admin.title') }
              ]"
              outer-class="$reset max-w-[300px] grow !pb-0"
            />
            <button
              :disabled="item.role === 'Owner'"
              :aria-label="$t('actions.delete')"
              class="w-fit disabled:opacity-50 disabled:cursor-not-allowed"
              @click="() => {
                item?.invite ? selectedInvite = item : selectedTeamMember = item
                needConfirmation = true
              }"
            >
              <Icon
                v-tippy="{ content: $t('actions.delete')}"
                name="material-symbols:delete-outline-rounded"
                class="w-6 h-6 text-danger outline-none"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <SkeletonManageAccess v-else />
        <div
          v-if="isLoading || store.loading || (store.campaign?.team?.length || 0) <= 9"
          class="flex justify-end mt-2"
        >
          <button
            class="btn-black disabled:cursor-not-allowed"
            :aria-label="$t('pages.campaign.settings.add')"
            :disabled="isLoading || store.loading || members.length >= 10"
            @click="isOpen = true"
          >
            {{ $t('pages.campaign.settings.add') }}
          </button>
        </div>
      </div>
    </div>
    <FormKit
      id="form"
      type="form"
      :actions="false"
      @submit="handleSubmit"
    >
      <div
        class="flex flex-col md:flex-row justify-between gap-x-10 gap-y-4 pt-6"
      >
        <div class="md:min-w-[300px]">
          <h2>
            Campaign settings
          </h2>
        </div>
        <div class="grow max-w-4xl">
          <template v-if="store.campaign && !store.loading">
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
          </template>
          <template v-else>
            <SkeletonInput />
            <SkeletonInput />
          </template>
          <FormKit
            type="submit"
            :aria-label="$t('pages.campaigns.update')"
            :disabled="isLoading || store.loading"
          >
            {{ $t('pages.campaigns.update') }}
          </FormKit>
        </div>
      </div>
    </FormKit>

    <ConfirmationModal
      v-if="selectedTeamMember || selectedInvite"
      :open="needConfirmation"
      :title="selectedTeamMember?.user.username || selectedInvite!.user.username"
      @close="needConfirmation = false"
      @delete="handleDelete"
    />
    <UserModal
      v-if="store.campaign"
      :open="isOpen"
      :campaign="store.campaign"
      @close="isOpen = false"
    />
  </section>
</template>
