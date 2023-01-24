<script setup>
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import { useToastStore } from '@/store/toast'

definePageMeta({ middleware: ['loggedin'] })

const { t } = useI18n({ useScope: 'global' })
const store = useAuthStore()
const toast = useToastStore()
const localePath = useLocalePath()

const form = ref({ email: '', password: '', name: '', username: '' })
const isLoading = ref(false)
const error = ref()
const image = ref(
  `https://avatars.dicebear.com/api/open-peeps/${(Math.random() + 1).toString(36).substring(7)}.svg?size=100`
)

async function register({ __init, username, name, ...credentials }) {
  error.value = null
  try {
    isLoading.value = true
    await store.register(credentials, { username, name, avatar: image.value, role: 'User' })
    toast.success({ title: t('register.toast.success.title'), text: t('register.toast.success.text') })
    navigateTo('/login')
  } catch (err) {
    error.value = err.message
    toast.error({
      title: t('error.general.title'),
      text: t('error.general.text'),
    })
  } finally {
    isLoading.value = false
  }
}

function randomAvatar() {
  image.value = `https://avatars.dicebear.com/api/open-peeps/${(Math.random() + 1)
    .toString(36)
    .substring(7)}.svg?size=100`
}
</script>

<template>
  <NuxtLayout name="centered">
    <section class="space-y-6">
      <h1 class="text-center">{{ $t('register.register') }}</h1>
      <div class="flex flex-col gap-2 items-center">
        <div class="w-[100px] h-[100px]">
          <NuxtImg v-if="image" :src="image" alt="avatar" sizes="sm:100px md:100px lg:100px" format="webp" />
        </div>
        <TextButton @click="randomAvatar">{{ $t('register.random') }}</TextButton>
      </div>
      <p v-if="error" class="text-danger text-center">{{ error }}</p>
      <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="register">
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
        <Button type="submit" :label="$t('register.register')" :loading="isLoading" inline />
      </FormKit>
      <div class="flex flex-wrap gap-2 justify-center">
        <NuxtLink :to="localePath('/register')">
          <TextButton>{{ $t('login.new') }}</TextButton>
        </NuxtLink>
        <NuxtLink :to="localePath('/forgot-password')">
          <TextButton>{{ $t('login.forgot') }}</TextButton>
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>
