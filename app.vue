<script setup>
import { onBeforeMount } from 'vue'
import { useProfileStore } from '@/store/profile'

const appName = 'DnD tracker'

useHead({
  meta: [{ name: 'description', content: 'The best initiative tracker for Dungeon & Dragons' }],
  titleTemplate: title => (title ? `${title} | ${appName}` : appName),
})

const profile = useProfileStore()
const supabase = useSupabaseClient()

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event == 'PASSWORD_RECOVERY') navigateTo('/reset-password')
  else profile.fetch()
})

onBeforeMount(() => profile.fetch())
</script>

<template>
  <div>
    <Toasts />
    <NuxtPage />
  </div>
</template>
