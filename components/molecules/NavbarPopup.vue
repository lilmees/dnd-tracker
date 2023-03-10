<script setup>
import { useProfileStore } from '@/store/profile'
import { useStripeStore} from '@/store/stripe'
import { useToastStore } from '@/store/toast'
import Remove from '~/assets/icons/remove.svg'

defineEmits(['logout', 'close'])
defineProps({
  routes: { type: Array, required: true },
  dropDownRoutes: { type: Array, required: true },
  loggedIn: { type: Boolean, required: true },
})

const profile = useProfileStore()
const stripe = useStripeStore()
const toast = useToastStore()
const { t } = useI18n({ useScope: 'global' })
const localePath = useLocalePath()

async function manageSubscription(){
  try {
    await stripe.createPortalSession(profile.data.stripe_session_id)
  } catch (err) {
    toast.error({ title: t('error.general.title'), text: t('error.general.text') })
  } 
}
</script>

<template>
  <div class="fixed inset-0 flex flex-col overflow-x-hidden overflow-y-auto bg-tracker p-4 z-20">
    <div class="flex justify-between items-center gap-4 pb-10">
      <NuxtLink :to="localePath('/')">
        <h1 class="font-logo">DND-TRACKER</h1>
      </NuxtLink>
      <Remove class="w-10 h-10 cursor-pointer text-danger" @click="$emit('close')" />
    </div>
    <div class="flex flex-col gap-y-2 pt-4">
      <template v-if="!loggedIn">
        <RouteLink :label="$t('navigation.login')" url="login" />
        <RouteLink :label="$t('navigation.register')" url="register" />
      </template>
      <RouteLink
        v-for="route in routes"
        :key="route.url"
        :label="$t(route.label)"
        :url="route.url"
        @click="$emit('close')"
      />
      <template v-if="loggedIn">
        <RouteLink
          v-for="route in dropDownRoutes"
          :key="route.url"
          :label="$t(route.label)"
          :url="route.url"
          @click="$emit('close')"
        />
        <ClientOnly>
          <button
            v-if="profile?.data?.stripe_session_id"
            class="text-slate-300 hover:text-white max-w-max font-bold"
            @click="manageSubscription"
          >
            {{ $t('navigation.subscription') }}
          </button>
        </ClientOnly>
        <div
          class="text-danger hover:text-white cursor-pointer duration-200 ease-in-out max-w-max font-bold pt-4"
          @click="$emit('logout')"
        >
          {{ $t('navigation.logout') }}
        </div>
      </template>
    </div>
    <LangSwitcher class="pt-5" />
  </div>
</template>
