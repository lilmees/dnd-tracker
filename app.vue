<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const localePath = useLocalePath()
const profile = useProfileStore()
const { auth } = useSupabaseAuthClient()

useSeo()

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.getAll().forEach(t => t.kill())
}

auth.onAuthStateChange((event, session) => {
  profile.fetch()
  if (event === 'PASSWORD_RECOVERY') {
    navigateTo(localePath('/reset-password'))
  }
})

onBeforeMount(() => profile.fetch())
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
    </div>

    <ClientOnly>
      <CookieBanner />
    </ClientOnly>
  </div>
</template>
