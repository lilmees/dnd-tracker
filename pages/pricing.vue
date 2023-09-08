<script setup lang="ts">
const stripe = useStripeStore()

const isYearly = ref<boolean>(false)
</script>

<template>
  <NuxtLayout>
    <section class="mx-auto max-w-screen-md mb-8 lg:mb-12">
      <h1 class="mb-4 sm:text-4xl xl:text-5xl text-center">
        {{ $t('pages.pricing.title') }}
      </h1>
      <p class="mb-5 max-w-3xl mx-auto text-center">
        {{ $t('pages.pricing.text') }}
      </p>
      <div class="flex gap-x-3 p-2 border-4 border-black bg-black/50 rounded-lg w-fit mx-auto my-10 font-bold">
        <button
          class="py-1 px-2 rounded-lg duration-300 ease-in-out"
          :class="{ 'bg-primary': !isYearly }"
          @click="isYearly = false"
        >
          {{ $t('general.monthly') }}
        </button>
        <button
          class="py-1 px-2 rounded-lg duration-300 ease-in-out"
          :class="{ 'bg-primary': isYearly }"
          @click="isYearly = true"
        >
          {{ $t('general.annually') }}
        </button>
      </div>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <PricingCard
          v-for="(product, i) in stripe.products"
          :key="product.title"
          data-aos="zoom-in-up"
          :data-aos-once="true"
          :data-aos-duration="600"
          :data-aos-delay="(i + 1) * 150"
          :product="product"
          :yearly="isYearly"
          :popular="i === 1 ? $t('pages.pricing.popular') : undefined"
          class="opacity-0"
        />
      </div>
    </section>
  </NuxtLayout>
</template>
