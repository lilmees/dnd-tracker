<script setup>
import { useProfileStore } from '@/store/profile'

defineEmits(['logout'])
defineProps({ routes: { type: Array, required: true } })

const profile = useProfileStore()
const user = useSupabaseUser()

onBeforeMount(() => profile.fetch())
</script>

<template>
  <tippy interactive>
    <div class="bg-tracker p-2 rounded-full tracker-shadow hover:tracker-shadow-pulse cursor-pointer">
      <NuxtImg
        :src="profile.data?.avatar || '/dice.webp'"
        alt="Logo dnd tracker"
        sizes="sm:40px md:40px lg:40px"
        class="w-10 -scale-x-100"
        :class="{ 'relative bottom-1': profile.data?.avatar }"
      />
    </div>
    <template #content>
      <div class="p-4 flex flex-col gap-2">
        <RouteLink v-for="route in routes" :key="route.url" :label="$t(route.label)" :url="route.url" />
        <div
          v-if="user"
          class="text-danger hover:text-white cursor-pointer duration-200 ease-in-out max-w-max font-bold"
          @click="$emit('logout')"
        >
          {{ $t('navigation.logout') }}
        </div>
        <LangSwitcher class="pt-4" />
      </div>
    </template>
  </tippy>
</template>

// fix mobile menu
