<script setup>
import { useAuthStore } from '@/store/auth'

definePageMeta({ middleware: ['loggedin'] })

const store = useAuthStore()
const localePath = useLocalePath()

const form = ref({ email: '', password: '' })
const isLoading = ref(false)
const error = ref()

async function login({ __init, ...credentials }) {
  error.value = null
  try {
    isLoading.value = true
    await store.login(credentials)
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <NuxtLayout name="centered">
    <section class="space-y-6">
      <h1 class="text-center">{{ $t('login.title') }}</h1>
      <NuxtImg
        src="/images/dice.webp"
        alt="D20 logo dice"
        sizes="sm:40px md:40px lg:40px"
        format="webp"
        class="w-10 h-10 mx-auto visibility-pulse"
      />
      <p v-if="error" class="text-danger text-center">{{ error }}</p>
      <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="login">
        <Input focus name="email" :label="$t('inputs.emailLabel')" validation="required|length:5,50|email" required />
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
