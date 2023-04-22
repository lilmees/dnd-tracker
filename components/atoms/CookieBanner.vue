<script setup>
const acceptedCookie = useCookie('accepted')
const localePath = useLocalePath()
</script>

<template>
  <div v-if="!acceptedCookie">
    <div class="bg-black/50 inset-0 fixed" />
    <div
      class="fixed z-50 flex flex-col items-center justify-center p-6 bg-primary rounded-md gap-y-10 bottom-4 left-4 right-4 md:flex-row md:justify-between md:px-10 md:py-8 md:bottom-10 md:left-10 md:right-10"
    >
      <Icon name="material-symbols:cookie-outline-rounded" class="w-12 h-12" />
      <div class="flex flex-col items-center text-center gap-y-6 md:flex-row md:inline-flex md:gap-x-7">
        <h2>
          {{ $t('cookie.text') }}
        </h2>
      </div>
      <div class="inline-flex gap-x-24 text-lg md:gap-x-8">
        <NuxtLink :to="localePath('/cookie-policy')" class="underline whitespace-pre underline-offset-2">
          {{ $t('cookie.policy') }}
        </NuxtLink>
        <button class="underline underline-offset-4" @click="acceptedCookie = true">
          {{ $t('cookie.button') }}
        </button>
      </div>
    </div>
  </div>
</template>
