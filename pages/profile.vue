<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const profile = useProfileStore()
const toast = useToastStore()
const { $logRocket, $i18n } = useNuxtApp()

const image = ref<string | null>(profile.data?.avatar || null)
const isUpdating = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const error = ref<string | null>(null)
const form = ref<Register>({
  email: profile.data?.email || '',
  password: '',
  name: profile.data?.name || '',
  username: profile.data?.username || ''
})

watch(isUpdating, (v: boolean) => {
  if (v) {
    form.value = {
      email: profile.data?.email || '',
      password: '',
      name: profile.data?.name || '',
      username: profile.data?.username || ''
    }
  }
  if (profile?.data?.avatar) {
    image.value = profile.data.avatar
  }
})

async function updateProfile ({ __init, username, name, ...credentials }: Obj): Promise<void> {
  error.value = null
  try {
    isLoading.value = true
    await profile.updateCredentialsProfile(
      credentials as Login,
      { username, name, avatar: image.value as string, role: 'User' }
    )
    isUpdating.value = false
    toast.success({ text: $i18n.t('pages.profile.toast.success.text') })
  } catch (err: any) {
    ($logRocket as any).captureException(err as Error)
    error.value = err.message
    toast.error()
  } finally {
    isLoading.value = false
  }
}

function randomAvatar (): void {
  image.value = `https://avatars.dicebear.com/api/open-peeps/${(Math.random() + 1)
    .toString(36)
    .substring(7)}.svg?size=100`
}

async function deleteUser (): Promise<void> {
  needConfirmation.value = false
  isLoading.value = true

  try {
    await profile.deleteProfile()
    toast.success({ text: $i18n.t('pages.profile.toast.delete.text') })
  } catch (err) {
    ($logRocket as any).captureException(err as Error)
    toast.error()
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <NuxtLayout name="centered">
    <section v-if="profile.data" class="space-y-2">
      <template v-if="!isUpdating">
        <div class="flex flex-wrap gap-y-2 gap-x-8 items-center pb-4">
          <div class="w-[100px] h-[100px]">
            <NuxtImg :src="profile.data.avatar" alt="avatar" sizes="sm:100px md:100px lg:100px" />
          </div>
          <h1>{{ profile.data.username }}</h1>
        </div>
        <p>
          <span class="font-bold">{{ $t('components.inputs.nameLabel') }}:</span> {{ profile.data.name }}
        </p>
        <p>
          <span class="font-bold">{{ $t('components.inputs.emailLabel') }}:</span> {{ profile.data.email }}
        </p>
        <p>
          <span class="font-bold">{{ $t('components.inputs.passwordLabel') }}: 🤫</span>
        </p>
        <div class="flex flex-wrap gap-x-4 gap-y-2">
          <button
            class="btn-black"
            :aria-label="$t('pages.profile.update')"
            :disabled="isLoading"
            @click="isUpdating = true"
          >
            {{ $t('pages.profile.update') }}
          </button>
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
      </template>
      <template v-else>
        <h1 class="text-center">
          {{ $t('pages.profile.update') }}
        </h1>
        <div class="flex flex-col gap-2 items-center">
          <div class="w-[100px] h-[100px]">
            <NuxtImg
              v-if="image"
              :src="image"
              alt="avatar"
              sizes="sm:100px md:100px lg:100px"
            />
          </div>
          <TextButton @click="randomAvatar">
            {{ $t('pages.register.random') }}
          </TextButton>
        </div>
        <p v-if="error" class="text-danger text-center">
          {{ error }}
        </p>
        <FormKit
          v-model="form"
          type="form"
          :actions="false"

          @submit="updateProfile"
        >
          <Input
            focus
            name="name"
            :label="$t('components.inputs.fullNameLabel')"
            validation="required|length:3,30|alpha_spaces"
            required
          />
          <Input
            name="username"
            :label="$t('components.inputs.usernameLabel')"
            validation="required|length:3,15|alpha_spaces"
            required
          />
          <Input
            name="email"
            :label="$t('components.inputs.emailLabel')"
            validation="required|length:5,50|email"
            required
          />
          <Input
            name="password"
            type="password"
            :label="$t('components.inputs.passwordLabel')"
            validation="required|length:6,50"
            required
          />
          <div class="flex flex-wrap gap-2">
            <button
              type="submit"
              class="btn-primary grow"
              :aria-label="$t('actions.update')"
              :disabled="isLoading"
            >
              {{ $t('actions.update') }}
            </button>
            <button
              class="btn-black grow"
              :aria-label="$t('actions.cancel')"
              @click="isUpdating = false"
            >
              {{ $t('actions.cancel') }}
            </button>
          </div>
        </FormKit>
      </template>
    </section>
  </NuxtLayout>
</template>
