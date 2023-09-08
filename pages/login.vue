<script setup lang="ts">
import logRocket from 'logrocket'

definePageMeta({ middleware: ['loggedin'] })

const store = useAuthStore()
const localePath = useLocalePath()

const form = ref<Login>({ email: '', password: '' })
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

async function login ({ __init, isTrusted, _vts, ...credentials }: Obj): Promise<void> {
  error.value = null
  try {
    isLoading.value = true
    await store.login(credentials as Login)
  } catch (err: any) {
    logRocket.captureException(err as Error)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <NuxtLayout name="centered">
    <section class="space-y-6">
      <h1 class="text-center">
        {{ $t('pages.login.title') }}
      </h1>
      <NuxtImg
        src="/classes.png"
        alt="D20 logo dice"
        sizes="sm:250px md:250px lg:250px"
        :width="250"
        :height="250"
        format="webp"
        provider="imagekit"
        class="mx-auto visibility-pulse"
      />
      <p v-if="error" class="text-danger text-center body-small">
        {{ error }}
      </p>
      <FormKit
        v-model="form"
        type="form"
        :actions="false"
        @submit="login"
      >
        <FormKit
          name="email"
          :label="$t('components.inputs.emailLabel')"
          validation="required|length:5,50|email"
        />
        <FormKit
          name="password"
          type="password"
          :label="$t('components.inputs.passwordLabel')"
          validation="required|length:6,50"
        />
        <div class="flex justify-end gap-x-3 items-start">
          <FormKit
            type="submit"
            :aria-label="$t('pages.login.signIn')"
            :label="$t('pages.login.signIn')"
            :disabled="isLoading"
            outer-class="$reset grow"
            input-class="w-full"
          />
          <button
            type="button"
            class="btn-black"
            aria-label="Google SSO"
            @click="login"
          >
            <Icon
              name="flat-color-icons:google"
              class="w-5 h-5"
              aria-hidden="true"
            />
          </button>
        </div>
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
