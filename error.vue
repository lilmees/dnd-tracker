<script setup>
const localePath = useLocalePath()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="flex flex-col gap-y-6 items-center max-w-prose px-8">
      <NuxtImg
        src="/logo.svg"
        alt="DnD Tracker logo"
        sizes="sm:500px md:500px lg:500px"
        provider="imagekit"
        class="max-w-[300px]"
      />
      <h1 class="text-primary text-5xl">
        {{ $t('pages.error.404') }}
      </h1>
      <p class="sm:text-center">
        {{ $t('pages.error.text') }}
      </p>
      <div class="flex flex-wrap gap-x-4 pb-10">
        <NuxtLink
          :to="localePath('/')"
          class="w-fit"
        >
          <button class="btn-primary">
            {{ $t('pages.error.goHome') }}
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
