<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { useToastStore } from '@/store/toast'

const { $i18n } = useNuxtApp()
const store = useAuthStore()
const toast = useToastStore()
const localePath = useLocalePath()

const form: Ref<{ password: string }> = ref({ password: '' })
const isLoading: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)

async function resetPassword ({ __init, password }: Obj): Promise<void> {
  error.value = null
  try {
    isLoading.value = true
    await store.updateUser({ password })
    toast.success({ title: $i18n.t('resetPassword.toast.success.title') })
    navigateTo(localePath('/'))
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
        {{ $t('resetPassword.title') }}
      </h1>
      <NuxtImg
        src="/dice.webp"
        alt="D20 logo dice"
        sizes="sm:40px md:40px lg:40px"
        format="webp"
        provider="imagekit"
        class="w-10 h-10 mx-auto visibility-pulse"
      />
      <p v-if="error" class="text-danger text-center">
        {{ error }}
      </p>
      <FormKit
        v-model="form"
        type="form"
        :actions="false"

        @submit="resetPassword"
      >
        <Input
          focus
          name="password"
          type="password"
          :label="$t('inputs.passwordLabel')"
          validation="required|length:6,50"
          required
        />
        <Button type="submit" :label="$t('resetPassword.reset')" :loading="isLoading" inline />
      </FormKit>
      <div class="flex flex-wrap gap-2 justify-center">
        <NuxtLink :to="localePath('/')">
          <TextButton>{{ $t('actions.cancel') }}</TextButton>
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>
