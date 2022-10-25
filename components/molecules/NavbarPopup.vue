<script setup>
import Remove from '~/assets/icons/remove.svg'

defineEmits(['logout', 'close'])
defineProps({
  routes: { type: Array, required: true },
  loggedIn: { type: Boolean, required: true },
})
</script>

<template>
  <div class="fixed inset-0 flex flex-col overflow-x-hidden overflow-y-auto bg-tracker p-4">
    <div class="flex justify-between items-center gap-4">
      <NuxtLink to="/" class="max-w-[200px]">
        <img src="@/assets/images/logo.png" alt="Logo dnd tracker" />
      </NuxtLink>
      <Remove class="w-8 h-8 cursor-pointer text-danger" @click="$emit('close')" />
    </div>
    <div class="flex flex-col gap-y-2 pt-4">
      <RouteLink v-for="route in routes" :key="route.url" :label="route.label" :url="route.url" />
      <div
        v-if="loggedIn"
        class="text-slate-300 hover:text-white cursor-pointer duration-200 ease-in-out max-w-max"
        @click="$emit('logout')"
      >
        {{ $t('navigation.logout') }}
      </div>
    </div>
  </div>
</template>
