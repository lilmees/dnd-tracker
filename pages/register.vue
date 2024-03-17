<script setup lang="ts">
import logRocket from 'logrocket'

definePageMeta({ middleware: ['loggedin'] })
useHead({ title: 'Register' })

const { t } = useI18n()
const store = useAuthStore()
const toast = useToastStore()
const localePath = useLocalePath()

const form = ref<Register>({ email: '', password: '', name: '', username: '', marketing: true })
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)
const image = ref<string>(
  `https://api.dicebear.com/7.x/open-peeps/svg?seed=${(Math.random() + 1).toString(36).substring(7)}&size=100`
)

async function register ({ __init, username, name, marketing, ...credentials }: Obj): Promise<void> {
  error.value = null
  try {
    isLoading.value = true

    await store.register(
      credentials as Login,
      { username, name, marketing, avatar: image.value, role: 'User' }
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
  image.value = `https://api.dicebear.com/7.x/open-peeps/svg?seed=${(Math.random() + 1)
    .toString(36)
    .substring(7)}&size=100`
}

function handleIconClick (node: any) {
  node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye'
  node.props.type = node.props.type === 'password' ? 'text' : 'password'
}
</script>

<template>
  <Layout name="centered">
    <section class="space-y-6">
      <h1 class="text-center">
        {{ $t('pages.register.register') }}
      </h1>
      <div class="flex flex-col gap-2 items-center">
        <div class="w-[100px] h-[100px]">
          <NuxtImg
            v-if="image"
            :src="image"
            preload
            alt="avatar"
            sizes="sm:100px md:100px lg:100px"
            class="w-full h-full"
          />
        </div>
        <TextButton @click="randomAvatar">
          {{ $t('pages.register.random') }}
        </TextButton>
      </div>
      <p v-if="error" class="text-danger text-center">
        {{ error }}
      </p>
      <FormKit v-model="form" type="form" :actions="false" @submit="register">
        <FormKit
          name="name"
          :label="$t('components.inputs.fullNameLabel')"
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
          name="password"
          type="password"
          suffix-icon="eye"
          :label="$t('components.inputs.passwordLabel')"
          validation="required|length:6,50|contains_lowercase|contains_uppercase|contains_alpha|contains_numeric|contains_symbol"
          @suffix-icon-click="handleIconClick"
        />
        <FormKit
          name="marketing"
          type="checkbox"
          :label="$t('components.inputs.marketingLabel')"
        />
        <FormKit
          type="submit"
          :aria-label="$t('pages.register.register')"
          :disabled="isLoading"
          input-class="w-full"
        >
          {{ $t('pages.register.register') }}
        </FormKit>
        <p class="body-small text-center">
          {{ $t('pages.register.consent') }}
        </p>
      </FormKit>
      <div class="flex flex-wrap gap-2 justify-center">
        <NuxtLink :to="localePath('/login')">
          <TextButton>{{ $t('pages.login.signIn') }}</TextButton>
        </NuxtLink>
        <NuxtLink :to="localePath('/forgot-password')">
          <TextButton>{{ $t('pages.login.forgot') }}</TextButton>
        </NuxtLink>
      </div>
    </section>
  </Layout>
</template>
