<script setup>
import { useI18n } from 'vue-i18n'
import { useRouteStore } from '@/store/route'
import { useToastStore } from '@/store/toast'
import { useAuthStore } from '@/store/auth'
import { useProfileStore } from '@/store/profile'
import { useMediaQuery } from '@vueuse/core'
import Hamburger from '@/assets/icons/hamburger.svg'

const { t } = useI18n({ useScope: 'global' })
const toast = useToastStore()
const route = useRouteStore()
const auth = useAuthStore()
const profile = useProfileStore()
const user = useSupabaseUser()
const isSmall = useMediaQuery('(max-width: 768px)')
const localePath = useLocalePath()

const isOpen = ref(false)

const visibleRoutes = computed(() => (user.value ? route.routes : route.routes.filter(r => !r.requiredLogIn)))

watch(isSmall, v => {
  if (!v && isOpen.value) isOpen.value = false
})

async function logout() {
  try {
    await auth.logout()
    profile.data = null
    isOpen.value = false
  } catch (err) {
    toast.error({
      title: t('error.general.title'),
      text: t('error.general.text'),
    })
  }
}
</script>

<template>
  <nav class="bg-black rounded-xl p-4 flex justify-between items-center gap-4 tracker-shadow m-2">
    <NuxtLink :to="localePath('/')" class="flex gap-4 items-center">
      <NuxtImg src="/icon.webp" alt="Logo dnd tracker" sizes="sm:40px md:40px lg:40px" class="w-10" />
      <h2>DND-TRACKER</h2>
    </NuxtLink>
    <div class="hidden sm:flex justify-end items-center gap-4">
      <RouteLink v-for="route in visibleRoutes" :key="route.url" :label="$t(route.label)" :url="route.url" />
      <template v-if="!user">
        <RouteLink :label="$t('navigation.login')" url="login" />
        <RouteLink :label="$t('navigation.register')" url="register" />
        <LangSwitcher />
      </template>
      <NavigationDropdown v-else :routes="route.dropdownRoutes" @logout="logout" />
    </div>

    <Hamburger class="block sm:hidden w-8 h-8 min-w-[2rem] cursor-pointer text-primary" @click="isOpen = true" />
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
        :dropDownRoutes="route.dropdownRoutes"
        :loggedIn="user ? true : false"
        @logout="logout"
        @close="isOpen = false"
      />
    </transition>
  </nav>
</template>
