<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const store = useCurrentCampaignStore()
const route = useRoute()

const url = computed<string>(() => {
  return route.fullPath.split('/').slice(0, -1).join('/')
})

onMounted(() => {
  if (route?.params?.id) {
    store.getCampaignInfo(+route.params.id)
  }
})
</script>

<template>
  <div class="pt-[150px] pb-20">
    <template v-if="!route.fullPath.includes('/join')">
      <h1 class="pb-4 dnd-container flex gap-4 items-center">
        <span class="text-slate-300">Campaign:</span>
        <span v-if="store.campaign">{{ store.campaign.title }}</span>
        <div v-else class="w-[150px] h-8 rounded-full bg-tracker animate-pulse" />
      </h1>
      <Tabs
        class="mb-10"
        role="Owner"
        :disabled="!store.campaign"
        :tabs="[
          {
            label: 'Content',
            icon: 'fluent:content-view-24-regular',
            link: `${url}/content`
          },
          {
            label: 'Settings',
            icon: 'iconamoon:options',
            link: `${url}/settings`,
            adminOnly: true
          },
          {
            label: 'Danger zone',
            icon: 'solar:danger-triangle-outline',
            link: `${url}/danger-zone`,
            ownerOnly: true
          },
        ]"
      />
    </template>
    <div v-if="!route.fullPath.includes('/join')" class="dnd-container">
      <NuxtPage />
    </div>
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
