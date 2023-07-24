<script setup lang="ts">
const stripe = useStripeStore()

const isYearly = ref<boolean>(false)
</script>

<template>
  <NuxtLayout>
    <section class="mt-10">
      <div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
        <h1 class="mb-4">
          {{ $t('pages.pricing.title') }}
        </h1>
        <p class="mb-5 max-w-3xl mx-auto">
          {{ $t('pages.pricing.text') }}
        </p>
        <div
          class="flex flex-row items-center gap-2 mb-3 w-fit mx-auto pt-5"
        >
          <div class="block font-bold text-lg mb-1">
            Show yearly prices
          </div>
          <FormKit
            :value="isYearly"
            type="checkbox"
            name="yearly"
          />
        </div>
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
