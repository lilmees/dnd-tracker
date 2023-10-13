<template>
  <div class="border-4 border-black bg-black/50 p-6 rounded-lg flex justify-between items-start gap-4 flex-wrap">
    <p class="max-w-prose">
      {{ $t('components.limitCta.text') }}
    </p>
    <RouteLink url="/pricing" class="btn-primary">
      {{ $t('components.limitCta.cta') }}
    </RouteLink>
  </div>
</template>
