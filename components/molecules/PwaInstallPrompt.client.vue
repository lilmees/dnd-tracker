<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const hidePrompt = useStorage('_dndtracker_hide_pwa_install', false)
const cookiesSet = useStorage('_dndtracker_cookies_set', false)
const { $pwa } = useNuxtApp()

const isIos = ref<boolean>(false)
const showPrompt = ref<boolean>(false)

onMounted(() => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  isIos.value = /iphone|ipad|ipod/.test(userAgent)

  if (!hidePrompt.value && cookiesSet.value && process.client) {
    isIos.value
      ? showPrompt.value = true
      : $pwa.showInstallPrompt = true
  }
})

async function install (): Promise<void> {
  await $pwa.install()
  // reset()
}

function close (): void {
  $pwa.cancelInstall()
  reset()
}

function reset (): void {
  $pwa.showInstallPrompt = false
  showPrompt.value = false
  // hidePrompt.value = true
}
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform opacity-0 translate-y-4"
    enter-to-class="transform opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-300"
    leave-from-class="transform opacity-100 translate-y-0"
    leave-to-class="transform opacity-0 translate-y-4"
  >
    <div
      v-if="($pwa?.showInstallPrompt && !$pwa.needRefresh && !$pwa.isInstalled) || showPrompt"
      class="fixed z-20 p-6 bg-primary/50 border-4 border-primary backdrop-blur rounded-lg gap-y-10 bottom-4 left-4 right-4 top-auto lg:flex-row md:justify-between lg:px-10 md:py-8 md:bottom-10 md:left-10 md:right-10"
      :class="[ isIos ? 'bottom-2' : 'top-2' ]"
    >
      <div
        v-if="isIos"
        class="container flex flex-wrap justify-between gap-y-4 gap-x-10"
      >
        <h2 class="font-bold">
          {{ $t('components.appInstallBanner.install') }}
        </h2>
        <ul class="flex flex-col gap-2 list-disc">
          <li class="ml-4">
            <p>
              {{ $t('components.appInstallBanner.press') }}
              <Icon name="ion:share-outline" class="h-5 w-5" aria-hidden="true" />
            </p>
          </li>
          <li class="ml-4">
            <p>
              {{ $t('components.appInstallBanner.addToHome') }}
            </p>
          </li>
        </ul>
      </div>
      <div
        v-else
        class="container flex flex-col sm:flex-row items-center justify-between gap-y-4 gap-x-10"
      >
        <h2 class="font-bold">
          {{ $t('components.appInstallBanner.install') }}
        </h2>
        <div class="flex justify-end w-full">
          <button class="btn-black" @click="install">
            Install
          </button>
        </div>
      </div>
      <button class="absolute top-1 right-1 group">
        <Icon
          name="ic:round-clear"
          class="text-danger w-8 h-8 rounded-full ring-danger group-focus-within:ring"
          @click="close"
        />
      </button>
      <pre>
        {{ $pwa }}
      </pre>
    </div>
  </Transition>
</template>
