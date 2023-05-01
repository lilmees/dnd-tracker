<script setup>
import { useStripeStore } from '@/store/stripe'

const stripe = useStripeStore()

const isYearly = ref(false)
</script>

<template>
  <NuxtLayout>
    <section class="mt-10">
      <div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
        <h1 class="mb-4">
          {{ $t('pricing.title') }}
        </h1>
        <p class="mb-5 max-w-3xl mx-auto">
          {{ $t('pricing.text') }}
        </p>
        <Checkbox
          v-model="isYearly"
          label="Show yearly prices"
          name="yearly"
          class="w-fit mx-auto pt-5"
        />
      </div>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <PricingCard
          v-for="product in stripe.products"
          :key="product.title"
          :product="product"
          :yearly="isYearly"
        />
      </div>
    </section>
  </NuxtLayout>
</template>
