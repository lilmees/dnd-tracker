<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { useToastStore } from '@/store/toast'

definePageMeta({ middleware: ['loggedin'] })

const { $i18n } = useNuxtApp()
const store = useAuthStore()
const toast = useToastStore()
const localePath = useLocalePath()

const form: Ref<{ email: string }> = ref({ email: '' })
const isLoading: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)

async function forgotPassword ({ __init, email }: Obj): Promise<void> {
  error.value = null
  try {
    isLoading.value = true
    await store.forgotPassword(email)
    toast.success({
      title: $i18n.t('forgotPassword.toast.success.title'),
      text: $i18n.t('forgotPassword.toast.success.text')
    })
    navigateTo(localePath('/login'))
  } catch (err: any) {
    useBugsnag().notify(`Handeld in catch: ${useErrorMessage(err)}`)
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
        {{ $t('forgotPassword.title') }}
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
          :label="$t('inputs.emailLabel')"
          validation="required|length:5,50|email"
          required
        />
        <Button
          type="submit"
          :label="$t('forgotPassword.reset')"
          :loading="isLoading"
          inline
        />
      </FormKit>
      <div class="flex flex-wrap gap-2 justify-center">
        <NuxtLink :to="localePath('/register')">
          <TextButton>{{ $t('login.new') }}</TextButton>
        </NuxtLink>
        <NuxtLink :to="localePath('/login')">
          <TextButton>{{ $t('login.signIn') }}</TextButton>
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>
