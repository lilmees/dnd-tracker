<script setup>
import { useAuthStore } from '@/store/auth'

definePageMeta({ middleware: ['loggedin'] })

const user = useSupabaseUser()
const store = useAuthStore()
const form = reactive({ email: '', password: '' })
const isLoading = ref(false)
const error = ref()

async function login(data) {
  const { __init, ...credentials } = data
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

watchEffect(() => {
  if (user.value) navigateTo('/')
})
</script>

<template>
  <NuxtLayout name="centered">
    <section class="space-y-6">
      <h1 class="text-center">{{ $t('login.title') }}</h1>
      <img src="@/assets/images/dice.png" alt="D20 logo dice" class="w-10 h-10 mx-auto visibility-pulse" />
      <p v-if="error" class="text-red-400 text-center">{{ error }}</p>
      <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="login">
        <Input name="email" :label="$t('inputs.emailLabel')" validation="required|length:5,50|email" />
        <Input name="password" type="password" :label="$t('inputs.passwordLabel')" validation="required|length:6,50" />
        <Button type="submit" :label="$t('login.signIn')" :loading="isLoading" inline bold />
      </FormKit>
      <div class="flex flex-wrap gap-2 justify-center">
        <NuxtLink to="/register">
          <TextButton>{{ $t('login.new') }}</TextButton>
        </NuxtLink>
        <NuxtLink to="/forgot-password">
          <TextButton>{{ $t('login.forgot') }}</TextButton>
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>
