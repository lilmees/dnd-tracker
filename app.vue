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
    <NuxtPage />
    <ClientOnly>
      <CookieBanner />
    </ClientOnly>
  </div>
</template>
