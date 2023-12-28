<script setup lang="ts">
import logRocket from 'logrocket'

const { locale } = useI18n({ useScope: 'global' })
const stripe = useStripeStore()
const profile = useProfileStore()
const user = useSupabaseUser()
const localePath = useLocalePath()
const toast = useToastStore()

const isYearly = ref<boolean>(false)

async function subscribe (id: string): Promise<void> {
  await stripe.subscribe(id, locale.value)
}

async function handleFreeTier (): Promise<void> {
  if (!user.value) {
    navigateTo(localePath('/register'))
  } else {
    try {
      if (profile?.data?.stripe_session_id) {
        await stripe.createPortalSession(profile.data.stripe_session_id)
      }
    } catch (err) {
      logRocket.captureException(err as Error)
      toast.error()
    }
  }
}
</script>

<template>
  <NuxtLayout shadow>
    <section class="mx-auto max-w-screen-md mb-8 lg:mb-12">
      <h1 class="mb-4 sm:text-4xl xl:text-5xl text-center">
        {{ $t('pages.pricing.title') }}
      </h1>
      <p class="mb-5 max-w-3xl mx-auto text-center">
        {{ $t('pages.pricing.text') }}
      </p>
      <div class="flex justify-center">
        <FormKit
          v-model="isYearly"
          type="togglebuttons"
          name="annually"
          :options="[
            { value: false, label: $t('general.monthly') },
            { value: true, label: $t('general.annually') }
          ]"
          validation="required"
        />
      </div>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <PricingCard
          v-for="(product, i) in stripe.products"
          :key="product.title"
          :product="product"
          :loading="stripe.loading"
          :yearly="isYearly"
          :popular="i === 1 ? $t('pages.pricing.popular') : undefined"
          :current="product.type === profile?.data?.subscription_type"
          @subscribe="subscribe"
          @free="handleFreeTier"
        />
      </div>
    </section>
  </NuxtLayout>
</template>
