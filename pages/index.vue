<script setup lang="ts">
import logRocket from 'logrocket'

const store = useTableStore()
const toast = useToastStore()

const blob = ref<HTMLDivElement>()

try {
  await store.getSandboxEncounter()
} catch (err) {
  logRocket.captureException(err as Error)
  toast.error()
}

if (process.client) {
  document.body.onmousemove = (event) => {
    if (blob.value) {
      const { clientX, clientY } = event

      blob.value.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
      }, { duration: 3000, fill: 'forwards' })
    }
  }
}
</script>

<template>
  <NuxtLayout name="wide">
    <div>
      <div
        ref="blob"
        class="hidden md:block -z-[1] h-[200px] w-[200px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full from-info to-secondary bg-gradient-to-r rotates blur-[100px]"
      />
      <Hero />
      <div class="flex flex-col gap-y-[100px] sm:gap-y-[150px] py-20 px-4 container-max">
        <div class="container grid gap-10 lg:grid-cols-2">
          <TitleText
            :title="$t('pages.home.textBlock1.title')"
            :text="$t('pages.home.textBlock1.text')"
            :text2="$t('pages.home.textBlock1.text2')"
            button-link="playground"
            :button-label="$t('pages.home.textBlock1.button')"
          />
          <div class="mt-20 lg:mt-32 flex md:justify-end">
            <Summary
              :title="$t('pages.home.summary.title')"
              :items="[
                $t('pages.home.summary.item1'),
                $t('pages.home.summary.item2'),
                $t('pages.home.summary.item3'),
                $t('pages.home.summary.item4'),
                $t('pages.home.summary.item5'),
                $t('pages.home.summary.item6'),
              ]"
              class="max-w-[500px]"
            />
          </div>
        </div>
        <div
          v-if="store.encounter"
          class="space-y-4"
        >
          <div class="flex justify-end relative z-[1]">
            <VisualOptions />
          </div>
          <div class="rounded-lg bg-tracker/50 border-4 border-tracker backdrop-blur-xl relative z-0 container-max">
            <div class="abolsute inset-0 z-[-1] fancy-shadow" />
            <EncounterHeader />
            <EncounterTable />
            <EncounterOptions />
          </div>
        </div>
        <div class="container grid md:grid-cols-2 gap-y-10 gap-x-20">
          <div class="flex flex-col justify-center items-center h-full">
            <NuxtImg
              src="/team.png"
              alt="Dragon on hoard"
              sizes="sm:1000px md:1000px lg:1000px"
              format="webp"
              provider="imagekit"
              width="500"
              class="rounded-lg tracker-shadow-pulse"
            />
          </div>
          <div class="flex flex-col justify-center h-full">
            <TitleText
              :title="$t('pages.home.textBlock2.title')"
              :text="$t('pages.home.textBlock2.text')"
            />
          </div>
        </div>
        <div class="container grid md:grid-cols-2 gap-y-10 gap-x-20">
          <div class="flex flex-col justify-center h-full">
            <TitleText
              :title="$t('pages.home.textBlock3.title')"
              :text="$t('pages.home.textBlock3.text')"
            />
          </div>
          <div class="flex flex-col justify-center items-center h-full">
            <NuxtImg
              src="/link.png"
              alt="Dragon on hoard"
              sizes="sm:1000px md:1000px lg:1000px"
              format="webp"
              provider="imagekit"
              width="500"
              class="rounded-lg tracker-shadow-pulse"
            />
          </div>
        </div>
        <TitleText
          center
          :title="$t('pages.home.textBlock4.title')"
          :text="$t('pages.home.textBlock4.text')"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
