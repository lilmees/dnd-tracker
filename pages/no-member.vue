<template>
  <NuxtLayout>
    <div
      class="space-y-6 max-w-prose mx-auto p-6 rounded-lg border-4 border-black bg-black/30"
    >
      <h2>
        {{ $t('pages.noMember.title') }}
      </h2>
      <p>
        {{ $t('pages.noMember.text') }}
      </p>
      <div class="flex justify-end">
        <RouteLink url="/">
          <button class="btn-primary">
            {{ $t('pages.error.goHome') }}
          </button>
        </RouteLink>
      </div>
    </div>
  </NuxtLayout>
</template>
