<script setup lang="ts">
import { reset } from '@formkit/core'
import logRocket from 'logrocket'

const emit = defineEmits(['close'])
const props = defineProps<{ open: boolean, campaign: Campaign }>()

const store = useCurrentCampaignStore()
const profile = useProfileStore()
const toast = useToastStore()
const { locale, t } = useI18n()

const loadingUsers = ref<boolean>(false)
const loadingSubmit = ref<boolean>(false)
const error = ref<string | undefined>()
const search = ref<string>()
const users = ref<SocialProfile[]>([])
const selectedUser = ref<SocialProfile>()
const userRole = ref<UserRole>('Viewer')

watchDebounced(() => search.value, async () => {
  if (search.value) {
    loadingUsers.value = true

    const data = await profile.getProfileByUsernameFuzzy(search.value)

    if (data) {
      users.value = data
    }

    loadingUsers.value = false
  }
  else {
    users.value = []
  }
}, { debounce: 250, maxWait: 500 })

async function handleSubmit(): Promise<void> {
  loadingSubmit.value = true

  try {
    if (selectedUser.value) {
      if (isInvited(props.campaign, selectedUser.value.id)) {
        toast.info({
          title: t('components.userModal.toast.alreadyInvited.title'),
          text: t('components.userModal.toast.alreadyInvited.text'),
        })

        return
      }

      const token = generateToken()

      await store.createJoinCampaignToken({
        user: selectedUser.value.id,
        campaign: props.campaign.id,
        role: userRole.value,
        token,
      })

      sentMail(token)

      toast.success({
        title: t('components.userModal.toast.invited.title'),
        text: t('components.userModal.toast.invited.text'),
      })

      resetState()
    }
  }
  catch (err: any) {
    logRocket.captureException(err as Error)
    error.value = err.message
  }
  finally {
    loadingSubmit.value = false
  }
}

async function sentMail(token: string): Promise<void> {
  const link = `https://dnd-tracker.com${campaignUrl(props.campaign, 'join')}?token=${token}`

  const { error } = await useFetch('/api/emails/campaign-invite', {
    method: 'POST',
    body: {
      locale: locale.value,
      to: selectedUser.value!.email,
      props: {
        inviteLink: link,
        invitedBy: profile.data?.username || 'Owner',
        username: selectedUser.value?.username || 'User',
        campaign: props.campaign.title,
      },
    },
  })

  if (error.value) {
    throw new Error(t('general.mail.fail.text'))
  }
}

function resetState(): void {
  error.value = undefined
  selectedUser.value = undefined
  users.value = []
  search.value = ''
  userRole.value = 'Viewer'
  reset('form')
  emit('close')
}
</script>

<template>
  <Modal
    :open="open"
    @close="resetState"
  >
    <template #header>
      <h2>
        {{ $t(`components.userModal.title`, { campaign: campaign.title }) }}
      </h2>
    </template>
    <FormKit
      v-model="search"
      name="search"
      type="search"
      prefix-icon="search"
      :placeholder="$t('components.inputs.searchByUsername')"
    />
    <p
      v-if="error"
      class="text-danger text-center mb-3"
    >
      {{ error }}
    </p>
    <div
      v-if="loadingUsers"
      class="grid sm:grid-cols-3 gap-2 mb-3"
    >
      <SkeletonAvatar
        v-for="i in 6"
        :key="i"
        name
        username
      />
    </div>
    <div
      v-else-if="users.length && !selectedUser"
      class="grid sm:grid-cols-3 gap-2 mb-3"
    >
      <button
        v-for="user in users"
        :key="user.id"
        class="flex flex-col gap-1"
        :class="{ 'cursor-not-allowed': isMember(campaign, user.id) || isInvited(campaign, user.id) }"
        @click="isMember(campaign, user.id) || isInvited(campaign, user.id) ? undefined : selectedUser = user"
      >
        <Avatar
          :user="user"
          :interactive="false"
          username
          name
        />
        <span
          v-if="isMember(campaign, user.id)"
          class="body-small text-success"
        >
          {{ $t('components.userModal.member') }}
        </span>
        <span
          v-else-if="isInvited(campaign, user.id)"
          class="body-small text-info"
        >
          {{ $t('components.userModal.invited') }}
        </span>
      </button>
    </div>
    <div
      v-else-if="selectedUser"
      class="mb-3 space-y-3"
    >
      <div class="border-primary border-4 bg-primary/50 rounded-lg px-4 py-2 flex items-center justify-between">
        <Avatar
          :user="selectedUser"
          :interactive="false"
          username
          name
        />
        <button
          :aria-label="$t('actions.remove')"
          @click="selectedUser = undefined"
        >
          <Icon
            name="ic:round-clear"
            class="text-danger w-6 h-6"
            aria-hidden="true"
          />
        </button>
      </div>
      <FormKit
        v-model="userRole"
        type="radio"
        :label="$t('components.inputs.roleLabel')"
        :options="[
          { label: $t('general.roles.Viewer.title'), value: 'Viewer' },
          { label: $t('general.roles.Admin.title'), value: 'Admin' },
        ]"
      />
    </div>
    <div class="flex justify-end">
      <button
        class="btn-black"
        :disabled="!selectedUser || !userRole || loadingSubmit"
        @click="handleSubmit"
      >
        {{
          !selectedUser || !userRole
            ? $t('components.userModal.select')
            : $t('components.userModal.add', { username: selectedUser.username })
        }}
      </button>
    </div>
  </Modal>
</template>
