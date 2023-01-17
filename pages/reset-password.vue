<script setup>
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import { useToastStore } from '@/store/toast'

const { t } = useI18n({ useScope: 'global' })
const store = useAuthStore()
const toast = useToastStore()
const localePath = useLocalePath()

const form = ref({ password: '' })
const isLoading = ref(false)
const error = ref()

async function resetPassword({ __init, password }) {
  error.value = null
  try {
    isLoading.value = true
    await store.updateUser({ password })
    toast.success({ title: t('resetPassword.toast.success.title') })
    navigateTo('/')
  } catch (err) {
    error.value = err.message
    toast.error({
      title: t('error.general.title'),
      text: t('error.general.text'),
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <NuxtLayout name="centered">
    <section class="space-y-6">
      <h1 class="text-center">{{ $t('resetPassword.title') }}</h1>
      <NuxtImg
        src="/images/dice.webp"
        alt="D20 logo dice"
        sizes="sm:40px md:40px lg:40px"
        format="webp"
        class="w-10 h-10 mx-auto visibility-pulse"
      />
      <p v-if="error" class="text-danger text-center">{{ error }}</p>
      <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="resetPassword">
        <Input
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
