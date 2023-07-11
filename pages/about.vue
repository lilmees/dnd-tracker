<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import { Power3, gsap } from 'gsap'

const cat: Ref = ref()
const catVisible: Ref<boolean> = useElementVisibility(cat)

watch(catVisible, (v: boolean) => {
  if (v) {
    gsap.fromTo(
      cat.value,
      { scale: 0.85 },
      { scale: 1, duration: 0.75, ease: Power3.easeOut }
    )
  }
})
</script>

<template>
  <NuxtLayout>
    <div class="flex flex-col gap-y-[100px] sm:gap-y-[150px] py-20 container-max">
      <div class="container grid gap-10 lg:grid-cols-2">
        <TitleText
          :title="$t('about.story')"
          :text="$t('about.text1')"
        />
        <div class="mt-20 lg:mt-32 flex md:justify-end">
          <TitleText :text="$t('about.text2')" />
        </div>
      </div>
      <div ref="cat" class="container grid md:grid-cols-2 gap-10">
        <div class="space-y-6">
          <TitleText :text="$t('about.text3')" />
          <TitleText :text="$t('about.text4')" />
        </div>
        <NuxtImg
          src="/cat.webp"
          alt="Wizard cat"
          sizes="sm:500px md:500px lg:500px"
          class="h-[300px] mx-auto"
          format="webp"
          provider="imagekit"
        />
      </div>
      <TitleText class="container" :text="$t('about.text5')" />
      <p class="max-w-prose text-center mx-auto">
        {{ $t('about.end') }}
      </p>
    </div>
  </NuxtLayout>
</template>
