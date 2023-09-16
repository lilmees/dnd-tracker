<script setup lang="ts">
const localePath = useLocalePath()
const umami = useRuntimeConfig().public.umamiId
const profile = useProfileStore()
const { auth } = useSupabaseClient()

useSeo()

auth.onAuthStateChange((event, session) => {
  profile.fetch()
  if (event === 'PASSWORD_RECOVERY') {
    navigateTo(localePath('/reset-password'))
  }
})

onBeforeMount(() => profile.fetch())

useHead({
  script: [
    { src: 'https://analytics.umami.is/script.js', async: true, 'data-website-id': umami }
  ]
})
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
