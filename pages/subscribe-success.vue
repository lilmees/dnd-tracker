<script setup lang="ts">
import { useProfileStore } from '@/store/profile'

definePageMeta({ middleware: ['session-id'] })

const route = useRoute()
const profile = useProfileStore()

onMounted(async () =>
  await profile.updateProfile({ stripe_session_id: route.query.session_id as string })
)
</script>

<template>
  <NuxtLayout>
    <div>
      success
    </div>
  </NuxtLayout>
</template>
