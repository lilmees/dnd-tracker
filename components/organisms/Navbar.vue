<script setup lang="ts">
import logRocket from 'logrocket'

const toast = useToastStore()
const route = useRouteStore()
const auth = useAuthStore()
const profile = useProfileStore()
const user = useSupabaseUser()
const isSmall = useMediaQuery('(max-width: 768px)')
const localePath = useLocalePath()

const showNav = useState<boolean>('showNavigation', () => true)

const isOpen = ref<boolean>(false)
const navbar = ref<HTMLElement>()

const visibleRoutes = computed<Route[]>(() =>
  user.value ? route.routes : route.routes.filter(r => !r.requiredLogIn)
)

watch(isSmall, (v: boolean) => {
  if (!v && isOpen.value) {
    isOpen.value = false
  }
})

onMounted(() => {
  let prevScrollpos = window.pageYOffset
  window.onscroll = function () {
    if (!navbar.value) { return }

    const currentScrollPos = window.pageYOffset

    if (prevScrollpos > currentScrollPos && currentScrollPos !== 0) {
      navbar.value.style.transform = 'translateY(0)'
    } else if (currentScrollPos === 0) {
      navbar.value.style.transform = 'translateY(0)'
    } else {
      navbar.value.style.transform = 'translateY(-200%)'
    }
    prevScrollpos = currentScrollPos
  }
})

async function logout (): Promise<void> {
  try {
    await auth.logout()
    profile.data = null
    isOpen.value = false
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  }
}
</script>

<template>
  <nav
    v-if="showNav"
    ref="navbar"
    class="bg-tracker/70 border-4 border-tracker m-4 rounded-lg duration-500 ease-in-out"
  >
    <div class="dnd-container py-4 flex justify-between items-center gap-4">
      <div class="flex gap-4">
        <NuxtLink :to="localePath('/')">
          <NuxtImg
            src="/logo.svg"
            alt="DnD Tracker logo"
            sizes="sm:500px md:500px lg:500px"
            class="h-16"
            provider="imagekit"
          />
        </NuxtLink>
        <p
          v-if="$config.public.beta === 'true'"
          class="text-secondary font-bold text-xs hidden sm:block relative top-4"
        >
          BETA
        </p>
      </div>
      <div class="hidden sm:flex justify-end items-center gap-4">
        <RouteLink
          v-for="link in visibleRoutes"
          :key="link.url"
          :label="$t(link.label)"
          :url="link.url"
        />
        <ClientOnly>
          <div v-show="!user" class="flex items-center gap-4">
            <RouteLink :label="$t('components.navbar.login')" url="login" />
            <RouteLink :label="$t('components.navbar.register')" url="register" />
            <LangSwitcher />
          </div>
          <div v-show="user" class="flex items-center gap-4">
            <NavDropdown :routes="route.playRoutes" :label="$t('components.navbar.play')" />
            <ProfileDropdown :routes="route.profileRoutes" @logout="logout" />
          </div>
        </ClientOnly>
      </div>
      <button v-if="isSmall" aria-label="Open menu">
        <Icon
          name="ci:hamburger-lg"
          class="w-8 h-8 min-w-[2rem] cursor-pointer text-white"
          @click="isOpen = true"
        />
      </button>
    </div>
    <Teleport to="body">
      <transition
        enter-active-class="duration-300 ease-in-out"
        enter-from-class="!-translate-y-full"
        enter-to-class="!translate-y-0"
        leave-active-class="duration-200 ease-in-out"
        leave-from-class="!translate-y-0"
        leave-to-class="!-translate-y-full"
      >
        <NavbarPopup
          v-show="isOpen"
          :routes="visibleRoutes"
          :drop-down-routes="[...route.playRoutes, ...route.profileRoutes]"
          :logged-in="user ? true : false"
          @logout="logout"
          @close="isOpen = false"
        />
      </transition>
    </Teleport>
  </nav>
</template>
