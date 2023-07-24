<script setup lang="ts">
import logRocket from 'logrocket'

defineEmits(['logout'])
defineProps<{ routes: Route[] }>()

const profile = useProfileStore()
const stripe = useStripeStore()
const toast = useToastStore()
const user = useSupabaseUser()

const isOpen = ref<boolean>(false)

onBeforeMount(() => profile.fetch())

async function manageSubscription () {
  isOpen.value = false
  try {
    if (profile?.data?.stripe_session_id) {
      await stripe.createPortalSession(profile.data.stripe_session_id)
    }
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  }
}
</script>

<template>
  <div v-click-outside="() => (isOpen = false)" class="relative">
    <button
      class="border-2 border-secondary bg-black p-2 rounded-full tracker-shadow hover:tracker-shadow-pulse cursor-pointer w-14 h-14"
      :class="{ 'rounded-b-none': isOpen }"
      @click="isOpen = !isOpen"
    >
      <ClientOnly>
        <NuxtImg
          v-if="profile.data?.avatar"
          :src="profile.data.avatar"
          alt="Avatar image"
          sizes="sm:40px md:40px lg:40px"
          class="w-10 -scale-x-100 relative bottom-1"
          format="webp"
        />
        <NuxtImg
          v-else
          src="/dice.webp"
          alt="D20 dice"
          sizes="sm:40px md:40px lg:40px"
          class="w-10"
          format="webp"
          provider="imagekit"
        />
      </ClientOnly>
    </button>
    <div v-if="isOpen" class="absolute z-[1] block w-max right-0">
      <div
        class="border-2 border-secondary bg-black flex flex-col gap-y-3 p-5 pr-[30px] relative rounded-b-lg rounded-tl-lg box-border text-slate-300"
      >
        <RouteLink
          v-for="route in routes"
          :key="route.url"
          :label="$t(route.label)"
          :url="route.url"
          @click="isOpen = false"
        />
        <template v-if="user">
          <ClientOnly>
            <!-- <button
              v-if="profile?.data?.stripe_session_id"
              class="text-slate-300 hover:text-white max-w-max font-bold"
              @click="manageSubscription"
            >
              {{ $t('components.navbar.subscription') }}
            </button> -->
          </ClientOnly>
          <button
            class="text-danger hover:text-white max-w-max font-bold"
            @click="
              () => {
                isOpen = false
                $emit('logout')
              }
            "
          >
            {{ $t('components.navbar.logout') }}
          </button>
        </template>
        <LangSwitcher class="pt-4" @click="isOpen = false" />
      </div>
    </div>
  </div>
</template>
