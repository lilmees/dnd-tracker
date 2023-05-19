<script setup lang="ts">
import { useAuthStore } from '@/store/auth'

definePageMeta({ middleware: ['loggedin'] })

const store = useAuthStore()
const localePath = useLocalePath()
const { $logRocket } = useNuxtApp()

const form: Ref<Login> = ref({ email: '', password: '' })
const isLoading: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)

async function login ({ __init, ...credentials }: Obj): Promise<void> {
  error.value = null
  try {
    isLoading.value = true
    await store.login(credentials as Login)
  } catch (err: any) {
    $logRocket.captureException(err as Error)
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
        {{ $t('login.title') }}
      </h1>
      <NuxtImg
        src="/classes.png"
        alt="D20 logo dice"
        sizes="sm:250px md:250px lg:250px"
        format="webp"
        provider="imagekit"
        class="mx-auto visibility-pulse"
      />
      <p v-if="error" class="text-danger text-center">
        {{ error }}
      </p>
      <FormKit
        v-model="form"
        type="form"
        :actions="false"

        @submit="login"
      >
        <Input
          focus
          name="email"
          :label="$t('inputs.emailLabel')"
          validation="required|length:5,50|email"
          required
        />
        <Input
          name="password"
          type="password"
          :label="$t('inputs.passwordLabel')"
          validation="required|length:6,50"
          required
        />
        <Button type="submit" :label="$t('login.signIn')" :loading="isLoading" inline />
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
