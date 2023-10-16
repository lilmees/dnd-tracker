<script setup lang="ts">
import { reset } from '@formkit/core'
import logRocket from 'logrocket'

const emit = defineEmits(['close', 'transfered'])
const props = defineProps<{ open: boolean, campaign: Campaign }>()

const store = useCurrentCampaignStore()
const campaignStore = useCampaignsStore()
const profile = useProfileStore()
const toast = useToastStore()
const { t } = useI18n()

const isLoading = ref<boolean>(false)
const selectedUser = ref<SocialProfile>()

const form = ref<{
  title: string,
  role: UserRole | 'Remove'
}>({
  title: '',
  role: 'Admin'
})

const same = computed<boolean>(() => props.campaign.title === form.value.title)

async function handleSubmit ({ __init, ...formData }: Obj): Promise<void> {
  isLoading.value = true

  try {
    if (selectedUser.value && profile.data) {
      const oldOwner = props.campaign.created_by
      const newOwner = props.campaign.team?.find(t => t.user.id === selectedUser.value?.id)

      if (!newOwner) {
        return
      }

      if (formData.role !== 'Remove') {
        await store.addCampaignTeamMember({
          role: formData.role,
          user: oldOwner.id,
          campaign: props.campaign.id.toString()
        })
      }

      await store.deleteCampaignTeamMember(newOwner.id)
      await campaignStore.updateCampaign({ created_by: newOwner.user.id }, props.campaign.id)

      if (store.campaign) {
        store.campaign.created_by = newOwner.user
      }

      toast.success({
        title: t('components.transferOwnershipModal.toast.success.title', { username: selectedUser.value.username })
      })

      resetState('transfered')
    }
  } catch (err: any) {
    toast.error()
    logRocket.captureException(err as Error)
  } finally {
    isLoading.value = false
  }
}

function resetState (emitName: 'close' | 'transfered' = 'close'): void {
  selectedUser.value = undefined
  reset('form')
  emit(emitName)
}
</script>

<template>
  <Modal :open="open" @close="resetState">
    <template #header>
      <h2>
        {{ $t('components.transferOwnershipModal.title', { campaign: campaign.title }) }}
      </h2>
    </template>
    <div v-if="!selectedUser" class="grid sm:grid-cols-3 gap-2 mb-3">
      <button
        v-for="member in campaign.team"
        :key="member.id"
        class="flex flex-col gap-1"
        :class="{ 'cursor-not-allowed': isLoading }"
        @click="selectedUser = member.user"
      >
        <Avatar
          :user="member.user"
          :interactive="false"
          username
          name
        />
      </button>
    </div>
    <div v-else class="mb-3 space-y-3">
      <div class="border-primary border-4 bg-primary/50 rounded-lg px-4 py-2 flex items-center justify-between">
        <Avatar
          :user="selectedUser"
          :interactive="false"
          username
          name
        />
        <button :aria-label="$t('actions.remove')" @click="selectedUser = undefined">
          <Icon
            name="ic:round-clear"
            class="text-danger w-6 h-6"
            aria-hidden="true"
          />
        </button>
      </div>
      <FormKit
        id="form"
        v-model="form"
        type="form"
        :actions="false"
        @submit="handleSubmit"
      >
        <FormKit
          name="role"
          type="radio"
          validation="required"
          :label="$t('components.inputs.newRoleLabel')"
          :options="[
            { label: $t('general.roles.Admin.title'), value: 'Admin' },
            { label: $t('general.roles.Viewer.title'), value: 'Viewer' },
            { label: $t('components.transferOwnershipModal.removed'), value: 'Remove' }
          ]"
        />
        <p class="py-4">
          <template
            v-for="text in $t('components.transferOwnershipModal.text', { campaign: campaign.title }).split(campaign.title)"
            :key="text"
          >
            {{ text }}
            <span class="font-bold last:hidden text-danger">
              {{ campaign.title }}
            </span>
          </template>
        </p>
        <FormKit
          name="title"
          :label="$t('components.inputs.titleLabel')"
          validation="required"
          :placeholder="campaign.title"
        />
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="btn-black"
            :aria-label="$t('actions.cancel')"
            @click="resetState()"
          >
            {{ $t('actions.cancel') }}
          </button>
          <button
            type="submit"
            class="btn-danger"
            :aria-label="$t('actions.transfer')"
            :disabled="!same"
          >
            {{ $t('actions.transfer') }}
          </button>
        </div>
      </FormKit>
    </div>
  </Modal>
</template>
