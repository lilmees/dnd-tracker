<script setup>
import { useProfileStore } from '@/store/profile'
import { useStripeStore} from '@/store/stripe'
import { useToastStore } from '@/store/toast'

defineEmits(['logout'])
defineProps({ routes: { type: Array, required: true } })

const profile = useProfileStore()
const stripe = useStripeStore()
const toast = useToastStore()
const user = useSupabaseUser()
const { t } = useI18n({ useScope: 'global' })

const isOpen = ref(false)

onBeforeMount(() => profile.fetch())

async function manageSubscription(){
  try {
    isOpen.value = false
    await stripe.createPortalSession(profile.data.stripe_session_id)
  } catch (err) {
    toast.error({ title: t('error.general.title'), text: t('error.general.text') })
  } 
}
</script>

<template>
  <div v-click-outside="() => (isOpen = false)" class="relative">
    <button
      class="bg-tracker p-2 rounded-full tracker-shadow hover:tracker-shadow-pulse cursor-pointer"
      :class="{ 'rounded-b-none': isOpen }"
      @click="isOpen = !isOpen"
    >
      <NuxtImg
        v-if="!profile.data?.avatar"
        src="/dice.webp"
        alt="D20 dice"
        sizes="sm:40px md:40px lg:40px"
        class="w-10"
        format="webp"
        provider="imagekit"
      />
      <NuxtImg
        v-else
        :src="profile.data.avatar"
        alt="Avatar image"
        sizes="sm:40px md:40px lg:40px"
        class="w-10 -scale-x-100 relative bottom-1"
        format="webp"
      />
    </button>
    <div v-if="isOpen" class="absolute z-[1] block w-max right-0">
      <div
        class="bg-tracker flex flex-col gap-y-3 p-5 pr-[30px] relative rounded-b rounded-tl box-border text-slate-300"
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
            <button
              v-if="profile?.data?.stripe_session_id"
              class="text-slate-300 hover:text-white max-w-max font-bold"
              @click="manageSubscription"
            >
              {{ $t('navigation.subscription') }}
            </button>
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
            {{ $t('navigation.logout') }}
          </button>
        </template>
        <LangSwitcher class="pt-4" @click="isOpen = false" />
      </div>
    </div>
  </div>
</template>
