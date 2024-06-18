<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const umami = useRuntimeConfig().public.umamiId
const profile = useProfileStore()
const { auth } = useSupabaseClient()

useSeo()

auth.onAuthStateChange((event) => {
  if (['INITIAL_SESSION', 'USER_UPDATED', 'SIGNED_IN'].includes(event)) {
    profile.fetch()
  }
})

useHead({
  script: [
    { 'src': 'https://analytics.umami.is/script.js', 'async': true, 'data-website-id': umami },
  ],
})

if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.getAll().forEach((t: any) => t.kill())
}
</script>

<template>
  <div>
    <VitePwaManifest />
    <Toasts />
    <DiceNotification />

    <div class="flex flex-col min-h-screen">
      <Navbar class="fixed z-10 left-0 right-0 backdrop-blur" />
      <NuxtPage />
      <Footer />
      <ClientOnly>
        <YbugButton />
      </ClientOnly>
    </div>

    <ClientOnly>
      <CookieBanner />
    </ClientOnly>
  </div>
</template>
