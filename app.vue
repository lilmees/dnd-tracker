<script setup>
import { useProfileStore } from '@/store/profile'

const appName = 'DnD tracker'

useHead({
  meta: [{ name: 'description', content: 'The best initiative tracker for Dungeon & Dragons' }],
  titleTemplate: title => (title ? `${title} | ${appName}` : appName),
})

const profile = useProfileStore()
const supabase = useSupabaseClient()

supabase.auth.onAuthStateChange(async (event, session) => {
  profile.fetch()
  if (event == 'PASSWORD_RECOVERY') navigateTo('/reset-password')
})

onBeforeMount(() => profile.fetch())
</script>

<template>
  <div>
    <Toasts />
    <NuxtPage />
  </div>
</template>
