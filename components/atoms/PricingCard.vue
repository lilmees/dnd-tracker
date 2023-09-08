<script setup lang="ts">
const props = withDefaults(
  defineProps<{
  product: Pricing,
  current?: boolean,
  yearly?: boolean
  popular?: string
}>(), {
    current: false,
    yearly: false,
    popular: undefined
  }
)

const { locale } = useI18n({ useScope: 'global' })
const stripe = useStripeStore()

async function subscribe () {
  if (props.product.yearId && props.product.monthId) {
    await stripe.subscribe(
      props.yearly ? props.product.yearId : props.product.monthId,
      locale.value
    )
  }
}
</script>

<template>
  <div
    class="flex flex-col p-6 bg-black/50 border-4 border-black rounded-lg justify-between cursor-pointer"
    :class="{'border-primary': current }"
    @click="subscribe"
  >
    <div class="flex justify-between items-start">
      <h2 class="mb-5">
        {{ product.title }}
      </h2>
      <div v-if="popular" class="bg-primary px-2 py-1 rounded-lg font-bold body-small tracker-shadow-pulse">
        {{ popular }}
      </div>
    </div>
    <p class="body-small grow">
      {{ product.description }}
    </p>
    <div class="flex items-baseline my-8">
      <span class="mr-2 text-5xl font-extrabold">
        {{ product.prices[yearly && product.prices.length > 1 ? 1 : 0] }}€
      </span>
      <span>/{{ $t(yearly ? 'general.year' : 'general.month') }}</span>
    </div>
    <button
      class="btn-primary w-full"
      :aria-label="current ? $t('components.pricingCard.current') : $t('components.pricingCard.start')"
      :disabled="current"
    >
      {{ current ? $t('components.pricingCard.current') : $t('components.pricingCard.start') }}
    </button>
    <ul class="mt-8 space-y-4 text-left">
      <li
        v-for="item in product.items"
        :key="item.label"
        class="flex items-center space-x-3"
      >
        <icon
          v-if="item.icon === 'check'"
          name="material-symbols:check-small-rounded"
          class="text-success w-8 h-8"
          aria-hidden="true"
        />
        <Icon
          v-else
          name="ic:round-clear"
          class="text-danger w-8 h-8"
          aria-hidden="true"
        />
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>
