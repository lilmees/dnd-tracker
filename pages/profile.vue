<script setup lang="ts">
import logRocket from 'logrocket'
import profileSchema from '@/formkit/updateProfile.json'
import passwordSchema from '@/formkit/updatePassword.json'

definePageMeta({ middleware: ['auth'] })

const profile = useProfileStore()
const toast = useToastStore()
const { t } = useI18n()

const image = ref<string>(profile.data?.avatar || randomAvatar())
const isLoading = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)

const formInfo = ref<ProfileUpdateForm>({
  email: '',
  name: '',
  username: '',
  data: {
    error: null
  }
})

const formPassword = ref<UpdatePasswordForm>({
  password: '',
  data: {
    error: null
  }
})

if (profile.data) {
  setUserData()
} else {
  whenever(() => profile.data, () => setUserData())
}

function setUserData (): void {
  image.value = profile.data?.avatar || randomAvatar()
  formInfo.value.email = profile.data?.email || ''
  formInfo.value.name = profile.data?.name || ''
  formInfo.value.username = profile.data?.username || ''
}

const updateProfile = useThrottleFn(async ({ __init, data, ...formData }: Obj): Promise<void> => {
  formInfo.value.data.error = null
  formPassword.value.data.error = null
  isLoading.value = true

  try {
    await profile.updateProfile(formData)
    toast.success({ title: t('pages.profile.toast.success.text') })
  } catch (err: any) {
    logRocket.captureException(err as Error)
    if (formData.password) {
      formPassword.value.data.error = err.message
    } else if (!formData.avatar) {
      formInfo.value.data.error = err.message
    }
    toast.error({ text: err.message })
  } finally {
    isLoading.value = false
  }
}, 1000)

function randomAvatar (): string {
  return `https://avatars.dicebear.com/api/open-peeps/${(Math.random() + 1)
    .toString(36)
    .substring(7)}.svg?size=100`
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
</script>

<template>
  <NuxtLayout>
    <section v-if="profile.data" class="space-y-2">
      <div
        class="flex flex-wrap gap-y-2 gap-x-4 items-end pb-4 border-b-2 border-slate-700"
      >
        <div
          class="w-[100px] h-[100px] bg-primary/50 rounded-lg border-4 border-primary overflow-hidden"
        >
          <NuxtImg
            :src="image"
            alt="avatar"
            sizes="sm:150px md:150px lg:150px"
            class="w-full h-full object-cover p-2"
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
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-x-10 gap-y-4 py-6 border-b-2 border-slate-700"
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
            <FormKitSchema
              :data="{...formInfo, data: { ...formInfo.data, isLoading }}"
              :schema="useI18nForm(profileSchema)"
            />
          </FormKit>
        </div>
      </div>
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-x-10 gap-y-4 py-6 border-b-2 border-slate-700"
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
            v-model="formPassword"
            type="form"
            :actions="false"
            @submit="updateProfile"
          >
            <FormKitSchema
              :data="{...formPassword, data: { ...formPassword.data, isLoading }}"
              :schema="useI18nForm(passwordSchema)"
            />
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
