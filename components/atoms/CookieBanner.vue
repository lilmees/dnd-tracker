<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const localePath = useLocalePath()
const cookiesConsent = useStorage('_dndtracker_cookies_consent', false)
const cookiesSet = useStorage('_dndtracker_cookies_set', false)

function handleConsent (): void {
  cookiesSet.value = true
  cookiesConsent.value = true
}
</script>

<template>
  <div v-if="!cookiesSet">
    <div class="bg-black/50 inset-0 fixed" />
    <div
      class="fixed z-50 flex flex-col items-center justify-center p-6 bg-primary/50 border-4 border-primary backdrop-blur rounded-lg gap-y-10 bottom-4 left-4 right-4 lg:flex-row md:justify-between lg:px-10 md:py-8 md:bottom-10 md:left-10 md:right-10"
    >
      <Icon
        name="material-symbols:cookie-outline-rounded"
        class="w-12 h-12"
        aria-hidden="true"
      />
      <div class="flex flex-col items-center text-center gap-y-6 lg:flex-row lg:inline-flex lg:gap-x-7">
        <h2>
          {{ $t('components.cookieBanner.text') }}
        </h2>
      </div>
      <div class="inline-flex gap-x-24 text-lg md:gap-x-8">
        <NuxtLink :to="localePath('/cookie-policy')" class="underline whitespace-pre underline-offset-2">
          {{ $t('components.cookieBanner.policy') }}
        </NuxtLink>
        <button class="underline underline-offset-4" @click="handleConsent">
          {{ $t('components.cookieBanner.button') }}
        </button>
      </div>
    </div>
  </div>
</template>
