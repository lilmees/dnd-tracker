<script setup lang="ts">
import logRocket from 'logrocket'

definePageMeta({ middleware: ['loggedin'] })

const { t } = useI18n()
const store = useAuthStore()
const toast = useToastStore()
const localePath = useLocalePath()

const form = ref<{ email: string }>({ email: '' })
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

async function forgotPassword ({ __init, email }: Obj): Promise<void> {
  error.value = null
  try {
    isLoading.value = true
    await store.forgotPassword(email)
    toast.success({
      title: t('pages.forgotPassword.toast.success.title'),
      text: t('pages.forgotPassword.toast.success.text')
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
</script>

<template>
  <NuxtLayout name="centered">
    <section class="space-y-6">
      <h1 class="text-center">
        {{ $t('pages.forgotPassword.title') }}
      </h1>
      <NuxtImg
        src="/dice.webp"
        alt="D20 logo dice"
        sizes="sm:80px md:80px lg:80px"
        format="webp"
        provider="imagekit"
        class="w-20 h-20 mx-auto visibility-pulse"
      />
      <p v-if="error" class="text-danger text-center">
        {{ error }}
      </p>
      <FormKit
        v-model="form"
        type="form"
        :actions="false"

        @submit="forgotPassword"
      >
        <Input
          focus
          name="email"
          :label="$t('components.inputs.emailLabel')"
          validation="required|length:5,50|email"
          required
        />
        <button
          type="submit"
          class="btn-black w-full mt-3"
          :aria-label="$t('pages.forgotPassword.reset')"
          :disabled="isLoading"
        >
          {{ $t('pages.forgotPassword.reset') }}
        </button>
      </FormKit>
      <div class="flex flex-wrap gap-2 justify-center">
        <NuxtLink :to="localePath('/register')">
          <TextButton>{{ $t('pages.login.new') }}</TextButton>
        </NuxtLink>
        <NuxtLink :to="localePath('/login')">
          <TextButton>{{ $t('pages.login.signIn') }}</TextButton>
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>
