<script setup lang="ts">
import { FormKitNode, reset } from '@formkit/core'
import logRocket from 'logrocket'

definePageMeta({ middleware: ['auth'] })

const profile = useProfileStore()
const stripe = useStripeStore()
const toast = useToastStore()
const { t } = useI18n()

const image = ref<string>(profile.data?.avatar || randomAvatar())
const isLoading = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const passwordError = ref<string>('')
const infoError = ref<string>('')

const formInfo = ref<ProfileUpdate>({
  email: '',
  name: '',
  username: '',
  marketing: true
})

if (profile.data) {
  setUserData()
} else {
  whenever(() => profile.data, () => setUserData())
}

function setUserData (): void {
  image.value = profile.data?.avatar || randomAvatar()
  formInfo.value = {
    email: profile.data?.email || '',
    name: profile.data?.name || '',
    username: profile.data?.username || '',
    marketing: profile.data?.marketing ?? true
  }
}

const updateProfile = useThrottleFn(async ({ __init, data, ...formData }: Obj): Promise<void> => {
  infoError.value = ''
  passwordError.value = ''
  isLoading.value = true

  try {
    await profile.updateProfile(formData)
    reset('password')
    toast.success({ title: t('pages.profile.toast.success.text') })
  } catch (err: any) {
    logRocket.captureException(err as Error)

    if (formData.password) {
      passwordError.value = err.message
    } else if (!formData.avatar) {
      infoError.value = err.message
    }

    toast.error({ text: err.message })
  } finally {
    isLoading.value = false
  }
}, 1000)

function randomAvatar (): string {
  return `https://api.dicebear.com/7.x/open-peeps/svg?seed=${(Math.random() + 1)
    .toString(36)
    .substring(7)}&size=100`
}

async function deleteUser (): Promise<void> {
  needConfirmation.value = false
  isLoading.value = true

  try {
    await profile.deleteProfile()
    toast.success({ text: t('pages.profile.toast.delete.text') })
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    isLoading.value = false
  }
}

function handleIconClick (node: FormKitNode) {
  node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye'
  node.props.type = node.props.type === 'password' ? 'text' : 'password'
}
</script>

<template>
  <NuxtLayout shadow>
    <section v-if="profile.data" class="space-y-2">
      <div
        class="flex flex-wrap gap-y-2 gap-x-4 items-end pb-4 border-b-2 border-slate-700"
      >
        <div
          class="w-20 h-20 bg-primary/50 rounded-lg border-4 border-primary overflow-hidden"
        >
          <NuxtImg
            :src="image"
            alt="avatar"
            sizes="sm:100px md:100px lg:100px"
            class="w-full h-full object-cover "
          />
        </div>
        <div class="flex flex-col gap-2">
          <TextButton class="w-fit" @click="image = randomAvatar()">
            {{ $t('pages.register.random') }}
          </TextButton>
          <div v-if="image !== profile.data.avatar" class="flex gap-2">
            <button
              class="btn-black"
              @click="updateProfile({ avatar: image })"
            >
              {{ $t('pages.profile.updateImage') }}
            </button>
            <button
              class="btn-danger"
              @click="image = profile.data.avatar || ''"
            >
              {{ $t('actions.cancel') }}
            </button>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap items-end gap-4 pt-2 pb-4 border-b-2 border-slate-700">
        <Badge
          v-for="badge in profile.data.badges"
          :key="badge.label.nl"
          v-bind="badge"
        />
        <BadgeModal />
      </div>
      <div class="flex flex-wrap gap-4 items-center justify-between pt-2 pb-4 border-b-2 border-slate-700">
        <div class="flex gap-4">
          {{ $t('pages.profile.subscription.current') }}:
          <span class="font-bold capitalize">{{
            profile.data.paid_subscription_active
              ? profile.data.subscription_type
              : 'free'
          }}</span>
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
            v-model="formInfo"
            type="form"
            :actions="false"
            @submit="updateProfile"
          >
            <FormKit
              name="name"
              :label="$t('components.inputs.nameLabel')"
              validation="required|length:3,30|alpha_spaces"
            />
            <FormKit
              name="username"
              :label="$t('components.inputs.usernameLabel')"
              validation="required|length:3,15|alpha_spaces"
            />
            <FormKit
              name="email"
              :label="$t('components.inputs.emailLabel')"
              validation="required|length:5,50|email"
            />
            <FormKit
              name="marketing"
              type="checkbox"
              :label="$t('components.inputs.marketingLabel')"
            />
            <FormKit
              type="submit"
              :label="$t('actions.save')"
              input-class="$reset btn-primary"
            />
            <p v-if="infoError" class="text-danger body-small mt-1">
              {{ infoError }}
            </p>
          </FormKit>
        </div>
      </div>
      <div
        class="flex flex-col md:flex-row justify-between gap-x-10 gap-y-4 py-6 border-b-2 border-slate-700"
      >
        <div class="md:min-w-[300px]">
          <h2>
            {{ $t('pages.profile.password.title') }}
          </h2>
          <p class="pt-2">
            {{ $t('pages.profile.password.subtitle') }}
          </p>
        </div>
        <div class="grow max-w-4xl">
          <FormKit
            id="password"
            type="form"
            :actions="false"
            @submit="updateProfile"
          >
            <FormKit
              name="password"
              type="password"
              suffix-icon="eye"
              :label="$t('components.inputs.passwordLabel')"
              validation="required|length:6,50|contains_lowercase|contains_uppercase|contains_alpha|contains_numeric|contains_symbol"
              @suffix-icon-click="handleIconClick"
            />
            <FormKit
              type="submit"
              :label="$t('actions.save')"
              input-class="$reset btn-primary"
            />
            <p v-if="passwordError" class="text-danger body-small mt-1">
              {{ passwordError }}
            </p>
          </FormKit>
        </div>
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-2 pt-4 justify-end">
        <button
          class="btn-danger"
          :aria-label="$t('pages.profile.delete')"
          :disabled="isLoading"
          @click="needConfirmation = true"
        >
          {{ $t('pages.profile.delete') }}
        </button>
      </div>
      <ConfirmationModal
        :open="needConfirmation"
        :title="profile.data.username"
        @close="needConfirmation = false"
        @delete="deleteUser"
      />
    </section>
  </NuxtLayout>
</template>
