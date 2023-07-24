<script setup lang="ts">
import logRocket from 'logrocket'

definePageMeta({ middleware: ['loggedin'] })

const { t } = useI18n()
const store = useAuthStore()
const toast = useToastStore()
const localePath = useLocalePath()

const form = ref<Register>({ email: '', password: '', name: '', username: '' })
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)
const image = ref<string>(
  `https://avatars.dicebear.com/api/open-peeps/${(Math.random() + 1).toString(36).substring(7)}.svg?size=100`
)

async function register ({ __init, username, name, ...credentials }: Obj): Promise<void> {
  error.value = null
  try {
    isLoading.value = true
    await store.register(
      credentials as Login,
      { username, name, avatar: image.value, role: 'User' }
    )
    toast.success({
      title: t('pages.register.toast.success.title'),
      text: t('pages.register.toast.success.text')
    })
    navigateTo(localePath('/login'))
  } catch (err: any) {
    logRocket.captureException(err as Error)
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
</script>

<template>
  <NuxtLayout name="centered">
    <section class="space-y-6">
      <h1 class="text-center">
        {{ $t('pages.register.register') }}
      </h1>
      <div class="flex flex-col gap-2 items-center">
        <div class="w-[100px] h-[100px]">
          <NuxtImg v-if="image" :src="image" alt="avatar" sizes="sm:100px md:100px lg:100px" />
        </div>
        <TextButton @click="randomAvatar">
          {{ $t('pages.register.random') }}
        </TextButton>
      </div>
      <p v-if="error" class="text-danger text-center">
        {{ error }}
      </p>
      <FormKit v-model="form" type="form" :actions="false" @submit="register">
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
        <Input name="email" :label="$t('components.inputs.emailLabel')" validation="required|length:5,50|email" required />
        <Input
          name="password"
          type="password"
          :label="$t('components.inputs.passwordLabel')"
          validation="required|length:6,50"
          required
        />
        <button
          type="submit"
          class="btn-black w-full mt-3"
          :aria-label="$t('pages.register.register')"
          :disabled="isLoading"
        >
          {{ $t('pages.register.register') }}
        </button>
      </FormKit>
      <div class="flex flex-wrap gap-2 justify-center">
        <NuxtLink :to="localePath('/register')">
          <TextButton>{{ $t('pages.login.new') }}</TextButton>
        </NuxtLink>
        <NuxtLink :to="localePath('/forgot-password')">
          <TextButton>{{ $t('pages.login.forgot') }}</TextButton>
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>
