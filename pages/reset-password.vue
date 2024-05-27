<script setup lang="ts">
import logRocket from 'logrocket'

const { t } = useI18n()
const store = useAuthStore()
const toast = useToastStore()
const localePath = useLocalePath()

const form = ref<{ password: string }>({ password: '' })
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

async function resetPassword({ __init, password }: Obj): Promise<void> {
  error.value = null
  isLoading.value = true

  try {
    await store.updateUser({ password })
    toast.success({ title: t('pages.resetPassword.toast.success.title') })
    navigateTo(localePath('/'))
  }
  catch (err: any) {
    logRocket.captureException(err as Error)
    error.value = err.message
    toast.error()
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Layout name="centered">
    <section class="space-y-6">
      <h1 class="text-center">
        {{ $t('pages.resetPassword.title') }}
      </h1>
      <NuxtImg
        src="/dice.webp"
        alt="D20 logo dice"
        sizes="sm:80px md:80px lg:80px"
        format="webp"
        provider="imagekit"
        class="w-20 h-20 mx-auto visibility-pulse"
      />
      <p
        v-if="error"
        class="text-danger text-center"
      >
        {{ error }}
      </p>
      <FormKit
        v-model="form"
        type="form"
        :actions="false"
        @submit="resetPassword"
      >
        <FormKit
          name="password"
          type="password"
          :label="$t('components.inputs.passwordLabel')"
          validation="required|length:6,50|contains_lowercase|contains_uppercase|contains_alpha|contains_numeric|contains_symbol"
        />
        <FormKit
          type="submit"
          :aria-label="$t('pages.resetPassword.reset')"
          :disabled="isLoading"
        >
          {{ $t('pages.resetPassword.reset') }}
        </FormKit>
      </FormKit>
      <div class="flex flex-wrap gap-2 justify-center">
        <NuxtLink :to="localePath('/')">
          <TextButton>{{ $t('actions.cancel') }}</TextButton>
        </NuxtLink>
      </div>
    </section>
  </Layout>
</template>
