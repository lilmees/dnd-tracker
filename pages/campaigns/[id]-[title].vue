<script setup lang="ts">
import { getRole } from '@/utils/permission-helpers'

definePageMeta({ middleware: ['auth'] })

const profile = useProfileStore()
const store = useCurrentCampaignStore()
const route = useRoute()

const url = computed<string>(() => {
  return route.fullPath.split('/').slice(0, -1).join('/')
})

onMounted(() => {
  if (route?.params?.id && !route.fullPath.includes('/join')) {
    store.getCampaignInfo(+route.params.id)
  }
})
</script>

<template>
  <div class="pt-[150px] pb-20 relative">
    <template v-if="!route.fullPath.includes('/join')">
      <h1 class="pb-4 dnd-container flex gap-4 items-center">
        <span class="text-slate-300">Campaign:</span>
        <span v-if="store.campaign">{{ store.campaign.title }}</span>
        <div v-else class="w-[150px] h-8 rounded-full bg-tracker animate-pulse" />
      </h1>
      <Tabs
        class="mb-10"
        :role="store.campaign ? getRole(store.campaign, profile.data?.id || '') : 'Viewer'"
        :disabled="!store.campaign"
        :tabs="[
          {
            label: 'Content',
            icon: 'fluent:content-view-24-regular',
            link: `${url}/content`,
            role: 'Viewer'
          },
          {
            label: 'Settings',
            icon: 'iconamoon:options',
            link: `${url}/settings`,
            role: 'Admin'
          },
          {
            label: 'Danger zone',
            icon: 'solar:danger-triangle-outline',
            link: `${url}/danger-zone`,
            role: 'Owner'
          },
        ]"
      />
      <div class="fixed !top-1/4 !left-0 !w-[50vw] !h-[50vh] fancy-shadow z-[-1] opacity-70" />
    </template>
    <div v-if="!route.fullPath.includes('/join')" class="dnd-container">
      <NuxtPage />
    </div>
    <NuxtLayout v-else name="centered">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
