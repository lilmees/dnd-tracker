<template>
  <div class="mx-auto max-w-prose border-4 border-black bg-black/50 p-6 rounded-lg flex flex-col sm:flex-row sm:items-center gap-4">
    <p class="body-small">
      {{ $t('components.limitCta.text') }}
    </p>
    <div class="flex justify-end">
      <RouteLink url="/pricing" class="btn-primary whitespace-nowrap">
        {{ $t('components.limitCta.cta') }}
      </RouteLink>
    </div>
  </div>
</template>
