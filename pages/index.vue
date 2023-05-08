<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import { Power3, gsap } from 'gsap'
import { useTableStore } from '@/store/table'
import { useToastStore } from '@/store/toast'

const store = useTableStore()
const toast = useToastStore()

const hoard: Ref = ref()
const table : Ref = ref()
const hoardVisible: Ref<boolean> = useElementVisibility(hoard)
const tableVisible: Ref<boolean> = useElementVisibility(table)

try {
  await store.getSandboxEncounter()
} catch (err) {
  useBugsnag().notify(`Handeld in catch: ${useError(err)}`)
  toast.error()
}

watch(hoardVisible, (v: boolean) => {
  if (v) {
    gsap.fromTo(
      hoard.value,
      { scale: 0.85 },
      { scale: 1, duration: 0.75, ease: Power3.easeOut }
    )
  }
})

watch(tableVisible, (v: boolean) => {
  if (v) {
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
            :title="$t('home.textBlock1.title')"
            :text="$t('home.textBlock1.text')"
            button-link="roadmap"
            :button-label="'Go to the roadmap'"
          />
          <div class="mt-20 lg:mt-32 flex md:justify-end">
            <Summary
              :title="$t('home.summary.title')"
              :items="[
                $t('home.summary.item1'),
                $t('home.summary.item2'),
                $t('home.summary.item3'),
                $t('home.summary.item4'),
                $t('home.summary.item5'),
                $t('home.summary.item6'),
              ]"
            />
          </div>
        </div>
        <div
          v-if="store.encounter"
          ref="table"
          class="rounded-xl px-4 py-2 bg-tracker tracker-shadow"
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
          :title="$t('home.textBlock2.title')"
          :text="$t('home.textBlock2.text')"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
