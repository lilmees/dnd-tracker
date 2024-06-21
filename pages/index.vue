<script setup lang="ts">
import logRocket from 'logrocket'

const store = useTableStore()
const toast = useToastStore()

const blob = ref<HTMLDivElement>()
const dragon = ref()

try {
  await store.getSandboxEncounter()
}
catch (err) {
  logRocket.captureException(err as Error)
  toast.error()
}

if (import.meta.client) {
  document.body.onmousemove = (event) => {
    if (blob.value) {
      const { clientX, clientY } = event

      blob.value.animate({
        left: `${clientX}px`,
        top: `${clientY}px`,
      }, { duration: 3000, fill: 'forwards' })
    }
  }
}
</script>

<template>
  <Layout name="wide">
    <div>
      <div
        ref="blob"
        class="hidden md:block -z-[1] h-[200px] w-[200px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full from-info to-secondary bg-gradient-to-r rotates blur-[100px]"
      />
      <Hero />
      <div class="flex flex-col gap-y-[100px] sm:gap-y-[150px] pb-20 pt-28 relative">
        <div
          data-skills
          class="space-y-20 container"
          @mousemove="dragon.calculateEyes"
        >
          <Summary
            :title="$t('pages.home.summary.title')"
            sprite="icons/flame.svg"
            :items="[
              $t('pages.home.summary.item1'),
              $t('pages.home.summary.item2'),
              $t('pages.home.summary.item3'),
              $t('pages.home.summary.item4'),
              $t('pages.home.summary.item5'),
              $t('pages.home.summary.item6'),
            ]"
            class="max-w-prose"
          />
          <TitleText
            :title="$t('pages.home.textBlock1.title')"
            :text="$t('pages.home.textBlock1.text')"
            :text2="$t('pages.home.textBlock1.text2')"
            button-link="playground"
            :button-label="$t('pages.home.textBlock1.button')"
            sprite="icons/hearth.svg"
          />
        </div>
        <Dragon ref="dragon" />
        <NuxtLazyHydrate when-visible>
          <div v-if="store.encounter">
            <div class="flex justify-end relative z-[1] container-max">
              <EncounterPet />
              <VisualOptions class="mb-4" />
            </div>
            <div class="relative z-0 container-max">
              <div class="space-y-4 relative rounded-lg bg-tracker/50 border-4 border-tracker">
                <EncounterHeader />
                <EncounterTable />
                <div class="inset-0 z-[-1] fancy-shadow" />
              </div>
              <EncounterOptions home />
            </div>
          </div>
          <div class="container grid md:grid-cols-2 gap-y-10 gap-x-20">
            <div class="flex flex-col justify-center items-center h-full">
              <div class="relative">
                <div class="inset-0 z-[-1] fancy-shadow" />
                <NuxtImg
                  src="/team.png"
                  alt="Dragon on hoard"
                  sizes="sm:1000px md:1000px lg:1000px"
                  format="webp"
                  provider="imagekit"
                  width="500"
                  class="rounded-lg"
                />
              </div>
            </div>
            <div class="flex flex-col justify-center h-full">
              <TitleText
                :title="$t('pages.home.textBlock2.title')"
                :text="$t('pages.home.textBlock2.text')"
                sprite="monsters/orc-mage.svg"
              />
            </div>
          </div>
          <TitleText
            center
            :title="$t('pages.home.textBlock4.title')"
            :text="$t('pages.home.textBlock4.text')"
            sprite="animals/bedbug.svg"
          />
        </NuxtLazyHydrate>
      </div>
    </div>
  </Layout>
</template>
