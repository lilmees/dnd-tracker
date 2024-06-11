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
const navVisible = ref<boolean>(true)
const dropdown = ref()
const profileDropdown = ref()

const visibleRoutes = computed<Route[]>(() =>
  user.value ? route.routes : route.routes.filter(r => !r.requiredLogIn),
)

watch(isSmall, (v: boolean) => {
  if (!v && isOpen.value) {
    isOpen.value = false
  }
})

onMounted(() => {
  let prevScrollpos = window.scrollY
  window.onscroll = function () {
    const currentScrollPos = window.scrollY

    navVisible.value = (prevScrollpos > currentScrollPos && currentScrollPos !== 0) || currentScrollPos === 0

    if (!navVisible.value) {
      if (dropdown.value) {
        dropdown.value.close()
      }
      if (profileDropdown.value) {
        profileDropdown.value.close()
      }
    }

    prevScrollpos = currentScrollPos
  }
})

async function logout(): Promise<void> {
  try {
    await auth.logout()
    profile.data = null
    isOpen.value = false
  }
  catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  }
}
</script>

<template>
  <Transition
    enter-active-class="duration-300 delay-100 ease-out"
    enter-from-class="!-translate-y-[200%]"
    enter-to-class="!translate-y-0"
    leave-active-class="duration-300 delay-100 ease-in"
    leave-from-class="!translate-y-0"
    leave-to-class="!-translate-y-[200%]"
  >
    <nav
      v-show="showNav && navVisible"
      class="bg-tracker/70 border-4 border-tracker m-4 rounded-lg"
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
            <div class="flex items-center gap-4">
              <RouteLink
                v-show="!user"
                :label="$t('components.navbar.login')"
                url="login"
              />
              <RouteLink
                v-show="!user"
                :label="$t('components.navbar.register')"
                url="register"
              />
              <NavDropdown
                ref="dropdown"
                :routes="route.playRoutes"
                :label="$t('components.navbar.play')"
                :logged-in="!!user"
              />
              <LangSwitcher v-if="!user" />
              <ProfileDropdown
                v-show="user"
                ref="profileDropdown"
                :routes="route.profileRoutes"
                @logout="logout"
              />
            </div>
          </ClientOnly>
        </div>
        <button
          class="sm:hidden"
          aria-label="Open menu"
          aria-haspopup="true"
          @click="isOpen = true"
        >
          <Icon
            name="ci:hamburger-lg"
            class="w-8 h-8 min-w-[2rem] text-white"
            aria-hidden="true"
          />
        </button>
      </div>
      <Teleport to="body">
        <SlideIn>
          <NavbarPopup
            v-if="isOpen"
            :routes="visibleRoutes"
            :drop-down-routes="[...route.playRoutes, ...route.profileRoutes]"
            :logged-in="user ? true : false"
            @logout="logout"
            @close="isOpen = false"
          />
        </SlideIn>
      </Teleport>
    </nav>
  </Transition>
</template>
