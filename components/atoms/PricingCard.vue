<script setup>
import { useStripeStore } from '@/store/stripe'

const props = defineProps({
  product: { type: Object, required: true },
  current: { type: Boolean, default: false },
  yearly: { type: Boolean, default: false },
  user: { type: Object, default: () => {} }
})

const { locale } = useI18n({ useScope: 'global' })
const stripe = useStripeStore()

async function subscribe () {
  await stripe.subscribe(
    props.user,
    props.yearly ? props.product.yearId : props.product.monthId,
    locale.value
  )
}
</script>

<template>
  <div
    class="flex flex-col p-6 text-center bg-tracker rounded-lg justify-between tracker-shadow cursor-pointer hover:scale-105 duration-200 ease-in-out"
    :class="{ 'ring-primary ring': current }"
    @click="subscribe"
  >
    <div class="flex flex-col">
      <h1 class="mb-4">
        {{ product.title }}
      </h1>
      <p class="">
        {{ product.description }}
      </p>
      <div class="flex justify-center items-baseline my-8">
        <span class="mr-2 text-5xl font-extrabold">
          {{ product.prices[yearly && product.prices.length > 1 ? 1 : 0] }}€
        </span>
        <span>/{{ $t(yearly ? 'pricing.year' : 'pricing.month') }}</span>
      </div>
      <ul class="mb-8 space-y-4 text-left">
        <li v-for="item in product.items" :key="item" class="flex items-center space-x-3">
          <icon
            v-if="item.icon === 'check'"
            name="material-symbols:check-small-rounded"
            class="text-success w-8 h-8"
          />
          <Icon v-else name="ic:round-clear" class="text-danger w-8 h-8" />
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </div>
    <Button :label="current ? $t('pricing.current') : $t('pricing.start')" inline color="primary" :disabled="current" />
  </div>
</template>
