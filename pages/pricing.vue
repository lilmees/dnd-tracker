<script setup lang="ts">
useHead({ title: 'Pricing' })

const { locale } = useI18n({ useScope: 'global' })
const stripe = useStripeStore()
const profile = useProfileStore()

async function subscribe (id: string, type: StripeSubscriptionType): Promise<void> {
  await stripe.subscribe(id, locale.value, type)
}

function isCurrent (type: StripeSubscriptionType): boolean {
  if (!profile.data) { return false }

  const current = profile.data.subscription_type || 'free'

  return type === current
}

function isUpgradeable (type: StripeSubscriptionType): boolean {
  const current = profile.data?.subscription_type || 'free'

  if (current === 'free') {
    return true
  }

  return type === 'upgrade to pro' && current === 'medior'
}
</script>

<template>
  <Layout shadow>
    <section class="mx-auto max-w-screen-md mb-8 lg:mb-12">
      <h1 class="mb-4 sm:text-4xl xl:text-5xl text-center">
        {{ $t('pages.pricing.title') }}
      </h1>
      <p class="mb-16 max-w-3xl mx-auto text-center">
        {{ $t('pages.pricing.description') }}
      </p>
      <div class="relative">
        <img
          src="/gifs/dragon.gif"
          loading="lazy"
          class="w-8 h-8 absolute -top-8 left-20"
        >
        <div class="inline-block overflow-x-auto w-full">
          <div class="bg-tracker/50 border-4 border-tracker rounded-lg overflow-y-hidden">
            <table class="min-w-full">
              <thead>
                <tr>
                  <th
                    v-for="(header, index) in [
                      undefined,
                      ...stripe.shownProduct.map(({ title, price }) => { return { title, price } })
                    ]"
                    :key="index"
                    class="py-3 px-2 border-b border-r last:border-r-0 border-slate-700"
                  >
                    <div v-if="header" class="flex flex-col text-xl">
                      <span>
                        {{ header.title }}
                      </span>
                      <div v-if="stripe.loading" class="w-[140px] mx-auto h-8 rounded-lg bg-tracker animate-pulse relative top-1" />
                      <div v-else-if="header.price" class="font-extrabold flex items-baseline justify-center">
                        {{ header.price }}€ <span class="body-small"> /{{ $t('general.oneTime') }} </span>
                      </div>
                      <div v-else class="font-extrabold flex items-baseline justify-center">
                        0€ <span class="body-small"> /{{ $t('general.forever') }} </span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in stripe.labels"
                  :key="item"
                  class="border-b last:border-b-0 border-slate-700"
                >
                  <td class="px-2 py-1 border-r border-slate-700 font-bold">
                    {{ $t(item) }}
                  </td>
                  <td
                    v-for="product in stripe.shownProduct"
                    :key="product.type"
                    class="px-2 py-1 border-r last:border-r-0 border-slate-700 text-center font-bold"
                  >
                    <span v-if="product.items[index].number">
                      {{ product.items[index].number }}
                    </span>
                    <Icon
                      v-else
                      :name="product.items[index].icon === 'check' ? 'material-symbols:check-small-rounded' : 'ic:round-clear'"
                      class="w-8 h-8"
                      :class="[product.items[index].icon === 'check' ? 'text-success' : 'text-danger  ']"
                      aria-hidden="true"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="px-2 py-1 border-r border-slate-700" />
                  <td
                    v-for="product in stripe.shownProduct"
                    :key="product.type"
                    class="px-2 py-1 border-r last:border-r-0 border-slate-700 text-center font-bold"
                  >
                    <SkeletonButton v-if="stripe.loading" block />
                    <div v-else-if="isCurrent(product.type)" class="btn-secondary w-full">
                      {{ $t('general.current') }}
                    </div>
                    <button
                      v-else-if="!profile.data || (product.id && product.price !== 0 && isUpgradeable(product.type))"
                      class="btn-primary w-full"
                      :aria-label="$t('pages.pricing.cta')"
                      :disabled="stripe.loading"
                      @click="subscribe(product?.id || '', product.type)"
                    >
                      {{ $t('pages.pricing.cta') }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <p class="mb-5 max-w-3xl mx-auto text-center pt-12">
        {{ $t('pages.pricing.text') }}
      </p>
      <div class="flex justify-center">
        <a href="https://ko-fi.com/B0B2SSBBQ" target="_blank">
          <div class="btn-primary flex items-center gap-4">
            <span>
              {{ $t('actions.buyCoffee') }}
            </span>
            <Icon
              name="simple-icons:kofi"
              class="w-5 h-5"
              aria-hidden="true"
            />
          </div>
        </a>
      </div>
    </section>
  </Layout>
</template>
