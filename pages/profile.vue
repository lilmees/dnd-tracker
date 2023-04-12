<script setup>
import { useI18n } from 'vue-i18n'
import { useProfileStore } from '@/store/profile'
import { useToastStore } from '@/store/toast'

definePageMeta({ middleware: ['auth'] })

const profile = useProfileStore()
const toast = useToastStore()
const { t } = useI18n({ useScope: 'global' })

const image = ref(profile.data?.avatar || null)
const isUpdating = ref(false)
const isLoading = ref(false)
const needConfirmation = ref(false)
const error = ref()
const form = ref({
  email: profile.data?.email || '',
  password: '',
  name: profile.data?.name || '',
  username: profile.data?.username || ''
})

watch(isUpdating, (v) => {
  if (v) {
    form.value = {
      email: profile.data?.email || '',
      password: '',
      name: profile.data?.name || '',
      username: profile.data?.username || ''
    }
  }
  if (profile.data.avatar) {
    image.value = profile.data.avatar
  }
})

async function updateProfile ({ __init, username, name, ...credentials }) {
  error.value = null
  try {
    isLoading.value = true
    await profile.updateCredentialsProfile(credentials, { username, name, avatar: image.value, role: 'User' })
    isUpdating.value = false
  } catch (err) {
    error.value = err.message
    toast.error({ title: t('error.general.title'), text: t('error.general.text') })
  } finally {
    isLoading.value = false
  }
}

function randomAvatar () {
  image.value = `https://avatars.dicebear.com/api/open-peeps/${(Math.random() + 1)
    .toString(36)
    .substring(7)}.svg?size=100`
}

async function deleteUser () {
  try {
    needConfirmation.value = false
    isLoading.value = true
    await profile.deleteProfile()
  } catch (err) {
    toast.error({ title: t('error.general.title'), text: t('error.general.text') })
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
          <span class="font-bold">{{ $t('inputs.nameLabel') }}:</span> {{ profile.data.name }}
        </p>
        <p>
          <span class="font-bold">{{ $t('inputs.emailLabel') }}:</span> {{ profile.data.email }}
        </p>
        <p>
          <span class="font-bold">{{ $t('inputs.passwordLabel') }}: 🤫</span>
        </p>
        <div class="flex flex-wrap gap-x-4 gap-y-2">
          <Button :label="$t('profile.update')" :loading="isLoading" @click="isUpdating = true" />
          <Button :label="$t('profile.delete')" color="danger" :loading="isLoading" @click="needConfirmation = true" />
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
          {{ $t('profile.update') }}
        </h1>
        <div class="flex flex-col gap-2 items-center">
          <div class="w-[100px] h-[100px]">
            <NuxtImg v-if="image" :src="image" alt="avatar" sizes="sm:100px md:100px lg:100px" />
          </div>
          <TextButton @click="randomAvatar">
            {{ $t('register.random') }}
          </TextButton>
        </div>
        <p v-if="error" class="text-danger text-center">
          {{ error }}
        </p>
        <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="updateProfile">
          <Input
            focus
            name="name"
            :label="$t('inputs.fullNameLabel')"
            validation="required|length:3,30|alpha_spaces"
            required
          />
          <Input
            name="username"
            :label="$t('inputs.usernameLabel')"
            validation="required|length:3,15|alpha_spaces"
            required
          />
          <Input name="email" :label="$t('inputs.emailLabel')" validation="required|length:5,50|email" required />
          <Input
            name="password"
            type="password"
            :label="$t('inputs.passwordLabel')"
            validation="required|length:6,50"
            required
          />
          <div class="flex flex-wrap gap-2">
            <Button
              type="submit"
              :label="$t('actions.update')"
              :loading="isLoading"
              inline
              class="grow"
              color="primary"
            />
            <Button :label="$t('actions.cancel')" inline class="grow" @click="isUpdating = false" />
          </div>
        </FormKit>
      </template>
    </section>
  </NuxtLayout>
</template>
