<script setup>
import { Menu, hideAllPoppers } from 'floating-vue'
import { useI18n } from 'vue-i18n'
import { useRouteStore } from '@/store/route'
import { useToastStore } from '@/store/toast'
import { useAuthStore } from '@/store/auth'
import { useMediaQuery } from '@vueuse/core'
import Hamburger from '@/assets/icons/hamburger.svg'

const { t } = useI18n({ useScope: 'global' })
const toast = useToastStore()
const store = useRouteStore()
const auth = useAuthStore()
const user = useSupabaseUser()
const isSmall = useMediaQuery('(max-width: 768px)')
const isOpen = ref(false)

const visibleRoutes = computed(() => {
  if (user.value) return store.routes.filter(r => !r.requiredLogOut)
  else return store.routes.filter(r => !r.requiredLogIn || (!r.requiredLogIn && !r.requiredLogOut))
})

watch(isSmall, v => {
  if (!v && isOpen.value) isOpen.value = false
  if (v) hideAllPoppers()
})

async function logout() {
  try {
    await auth.logout()
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
    <NuxtLink to="/" class="max-w-[200px]">
      <img src="@/assets/images/logo.png" alt="Logo dnd tracker" />
    </NuxtLink>
    <div class="hidden sm:flex justify-end gap-4">
      <Menu>
        <div
          v-if="user"
          class="text-slate-300 hover:text-white cursor-pointer duration-200 ease-in-out max-w-max font-bold"
        >
          {{ $t('navigation.collections') }}
        </div>

        <template #popper>
          <div class="flex flex-col p-6 space-y-5 rounded-md shadow-md text-greys-light-gray bg-tracker border-tracker">
            <RouteLink v-for="route in store.dropdown" :key="route.url" :label="$t(route.label)" :url="route.url" />
          </div>
        </template>
      </Menu>
      <RouteLink v-for="route in visibleRoutes" :key="route.url" :label="$t(route.label)" :url="route.url" />
      <div
        v-if="user"
        class="text-slate-300 hover:text-white cursor-pointer duration-200 ease-in-out max-w-max font-bold"
        @click="logout()"
      >
        {{ $t('navigation.logout') }}
      </div>
      <LangSwitcher />
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
        :dropdown="store.dropdown"
        :loggedIn="user ? true : false"
        @logout="logout"
        @close="isOpen = false"
      />
    </transition>
  </nav>
</template>
