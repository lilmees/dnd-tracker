<script setup lang="ts">
defineEmits(['logout', 'close'])
defineProps<{
  routes: Route[],
  dropDownRoutes: Route[],
  loggedIn: boolean
}>()

const localePath = useLocalePath()
</script>

<template>
  <div
    class="fixed inset-0 flex flex-col overflow-x-hidden overflow-y-auto bg-tracker p-4 z-20"
  >
    <div class="flex justify-between items-center gap-4 pb-10">
      <NuxtLink :to="localePath('/')">
        <NuxtImg
          src="/logo.svg"
          alt="DnD Tracker logo"
          sizes="sm:500px md:500px lg:500px"
          class="h-16"
          provider="imagekit"
        />
      </NuxtLink>
      <button
        :aria-label="$t('actions.close')"
        @click="$emit('close')"
      >
        <Icon
          name="ic:round-clear"
          class="w-10 h-10 text-danger"
          aria-hidden="true"
        />
      </button>
    </div>
    <div class="flex flex-col gap-y-2 pt-4">
      <div v-show="!loggedIn" class="flex flex-col gap-y-2">
        <RouteLink :label="$t('components.navbar.login')" url="login" />
        <RouteLink :label="$t('components.navbar.register')" url="register" />
      </div>
      <RouteLink
        v-for="route in routes"
        :key="route.url"
        :label="$t(route.label)"
        :url="route.url"
        @click="$emit('close')"
      />
      <div v-show="loggedIn" class="flex flex-col gap-y-2">
        <RouteLink
          v-for="route in dropDownRoutes"
          :key="route.url"
          :label="$t(route.label)"
          :url="route.url"
          @click="$emit('close')"
        />
        <div
          class="text-danger hover:text-white cursor-pointer duration-200 ease-in-out max-w-max font-bold pt-4"
          @click="$emit('logout')"
        >
          {{ $t('components.navbar.logout') }}
        </div>
      </div>
    </div>
    <LangSwitcher class="pt-5" />
  </div>
</template>
