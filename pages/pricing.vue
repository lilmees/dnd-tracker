<script setup></script>

<template>
  <NuxtLayout>
    <section class="mt-10">
      <div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
        <h1 class="mb-4">{{ $t('pricing.title') }}</h1>
        <p class="mb-5">
          {{ $t('pricing.text') }}
        </p>
      </div>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <PricingCard
          title="Starter"
          :description="$t('pricing.starter')"
          :price="0"
          :items="[
            { label: $t('pricing.encounters', { number: 10 }), icon: 'check' },
            { label: $t('pricing.campaigns', { number: 3 }), icon: 'check' },
            { label: $t('pricing.multiple'), icon: 'cross' },
            { label: $t('pricing.setup'), icon: 'check' },
            { label: $t('pricing.update'), icon: 'check' },
          ]"
          current
        />
        <PricingCard
          title="Medior"
          :description="$t('pricing.medior')"
          :price="3"
          :items="[
            { label: $t('pricing.encounters', { number: 50 }), icon: 'check' },
            { label: $t('pricing.campaigns', { number: 10 }), icon: 'check' },
            { label: 'Multiple campaign admins', icon: 'cross' },
            { label: 'No setup, or hidden fees', icon: 'check' },
            { label: 'Updates: always free', icon: 'check' },
          ]"
        />
        <PricingCard
          title="Pro"
          :description="$t('pricing.pro')"
          :price="5"
          :items="[
            { label: $t('pricing.encounters', { number: 'infinite' }), icon: 'check' },
            { label: $t('pricing.campaigns', { number: 'infinite' }), icon: 'check' },
            { label: 'Multiple campaign admins', icon: 'check' },
            { label: 'No setup, or hidden fees', icon: 'check' },
            { label: 'Updates: always free', icon: 'check' },
          ]"
        />
      </div>
    </section>
  </NuxtLayout>
</template>
