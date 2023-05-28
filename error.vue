<script setup>
const localePath = useLocalePath()

const { data, refresh } = useFetch('https://meme-api.com/gimme')
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="flex flex-col space-y-6">
      <h1 class="text-primary max-w-2xl">
        {{ $t('error.404') }}
      </h1>
      <div class="flex flex-wrap gap-x-4 pb-10">
        <NuxtLink :to="localePath('/')" class="w-fit">
          <button class="btn-primary">
            {{ $t('error.goHome') }}
          </button>
        </NuxtLink>
        <button class="btn-secondary" @click="refresh">
          {{ $t('error.meme') }}
        </button>
      </div>
      <NuxtImg
        v-if="data"
        :src="data.url"
        :alt="data.title"
        sizes="sm:100vw md:50vw lg:50vw"
        class="max-w-md mx-auto tracker-shadow-pulse"
      />
      <NuxtLink v-if="data" :to="data.postLink" target="_blank" rel="noreferrer noopener" class="w-fit mx-auto">
        <TextButton> Visit the meme on reddit </TextButton>
      </NuxtLink>
    </div>
  </div>
</template>
