<script setup lang="ts">
import { Power3, gsap } from 'gsap'
import logRocket from 'logrocket'

const store = useTableStore()
const toast = useToastStore()

const hoard = ref<HTMLElement>()
const table = ref<HTMLElement>()
const hoardVisible: Ref<boolean> = useElementVisibility(hoard)
const tableVisible: Ref<boolean> = useElementVisibility(table)

try {
  await store.getSandboxEncounter()
} catch (err) {
  logRocket.captureException(err as Error)
  toast.error()
}

watch(hoardVisible, (v: boolean) => {
  if (v && hoard.value) {
    gsap.fromTo(
      hoard.value,
      { scale: 0.85 },
      { scale: 1, duration: 0.75, ease: Power3.easeOut }
    )
  }
})

watch(tableVisible, (v: boolean) => {
  if (v && table.value) {
    gsap.fromTo(
      table.value,
      { scale: 0.85 },
      { scale: 1, duration: 0.75, ease: Power3.easeOut }
    )
  }
})
</script>

<template>
  <NuxtLayout name="wide">
    <div>
      <Hero />
      <div class="flex flex-col gap-y-[100px] sm:gap-y-[150px] py-20 px-4 container-max">
        <div class="container grid gap-10 lg:grid-cols-2">
          <TitleText
            :title="$t('pages.home.textBlock1.title')"
            :text="$t('pages.home.textBlock1.text')"
            button-link="roadmap"
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
            />
          </div>
        </div>
        <div
          v-if="store.encounter"
          ref="table"
          class="rounded-lg p-4 bg-tracker tracker-shadow"
        >
          <EncounterHeader class="w-full pb-4" />
          <EncounterTable />
          <EncounterOptions class="pt-4" />
        </div>
        <div ref="hoard" class="container grid md:grid-cols-2 gap-10">
          <HomeDiceRolling />
          <NuxtImg
            src="/dragon_hoard.webp"
            alt="Dragon on hoard"
            sizes="sm:500px md:500px lg:500px"
            format="webp"
            provider="imagekit"
            class="mx-auto"
          />
        </div>
        <TitleText
          center
          :title="$t('pages.home.textBlock2.title')"
          :text="$t('pages.home.textBlock2.text')"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
