<script setup>
import { useMediaQuery } from '@vueuse/core'
import { useRouteStore } from '@/store/route'
import { useToastStore } from '@/store/toast'
import { useAuthStore } from '@/store/auth'
import { useProfileStore } from '@/store/profile'

const toast = useToastStore()
const route = useRouteStore()
const auth = useAuthStore()
const profile = useProfileStore()
const user = useSupabaseUser()
const isSmall = useMediaQuery('(max-width: 768px)')
const localePath = useLocalePath()

const isOpen = ref(false)

const visibleRoutes = computed(() =>
  user.value
    ? route.routes
    : route.routes.filter(r => !r.requiredLogIn)
)

watch(isSmall, (v) => {
  if (!v && isOpen.value) {
    isOpen.value = false
  }
})

async function logout () {
  try {
    await auth.logout()
    profile.data = null
    isOpen.value = false
  } catch (err) {
    useBugsnag().notify(`Handeld in catch: ${err}`)
    toast.error()
  }
}
</script>

<template>
  <nav class="bg-black tracker-shadow">
    <div class="dnd-container py-4 flex justify-between items-center gap-4">
      <NuxtLink :to="localePath('/')">
        <h1 class="font-logo">
          DND-TRACKER
        </h1>
      </NuxtLink>
      <div class="hidden sm:flex justify-end items-center gap-4">
        <RouteLink
          v-for="link in visibleRoutes"
          :key="link.url"
          :label="$t(link.label)"
          :url="link.url"
        />
        <template v-if="!user">
          <RouteLink :label="$t('navigation.login')" url="login" />
          <RouteLink :label="$t('navigation.register')" url="register" />
          <LangSwitcher />
        </template>
        <template v-else>
          <NavDropdown :routes="route.playRoutes" :label="$t('navigation.play')" />
          <ProfileDropdown :routes="route.profileRoutes" @logout="logout" />
        </template>
      </div>
      <Icon
        v-if="isSmall"
        name="ci:hamburger-lg"
        class="w-8 h-8 min-w-[2rem] cursor-pointer text-white"
        @click="isOpen = true"
      />
    </div>

    <transition
      enter-active-class="duration-300 ease-in-out"
      enter-from-class="!-translate-y-full"
      enter-to-class="!translate-y-0"
      leave-active-class="duration-200 ease-in-out"
      leave-from-class="!translate-y-0"
      leave-to-class="!-translate-y-full"
    >
      <NavbarPopup
        v-if="isOpen"
        :routes="visibleRoutes"
        :drop-down-routes="[...route.playRoutes, ...route.profileRoutes]"
        :logged-in="user ? true : false"
        @logout="logout"
        @close="isOpen = false"
      />
    </transition>
  </nav>
</template>
