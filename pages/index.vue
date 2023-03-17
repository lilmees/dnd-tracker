<script setup>
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'
import { useElementVisibility } from '@vueuse/core'
import { useTableStore } from '@/store/table'
import { Power3, gsap } from 'gsap'

const store = useTableStore()
const toast = useToastStore()
const { t } = useI18n({ useScope: 'global' })

const hoard = ref()
const table = ref()
const hoardVisible = useElementVisibility(hoard)
const tableVisible = useElementVisibility(table)

try{
  await store.getSandboxEncounter()
} catch (err) {
  toast.error({ title: t('error.general.title'), text: t('error.general.text') })
}   

watch(hoardVisible, v => {
  if(v) gsap.fromTo(hoard.value, { scale: 0.85 }, { scale:1, duration: 0.75, ease: Power3.easeOut })
})

watch(tableVisible, v => {
  if(v) gsap.fromTo(table.value, { scale: 0.85 }, { scale:1, duration: 0.75, ease: Power3.easeOut })
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
            buttonLink="roadmap"
            :buttonLabel="'Go to the roadmap'"
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
        <div v-if="store.encounter" ref="table" class="rounded-xl px-4 py-2 bg-tracker tracker-shadow">
          <EncounterHeader class="w-full pb-4"/>
          <EncounterTable />
          <EncounterOptions class="pt-4" />
        </div>
        <div ref="hoard" class="container flex justify-center items-center flex-wrap gap-x-10">
        <div class="pt-10">
          <h2 class="pb-10 text-center">{{ $t('home.diceRoller.title') }}</h2>
          <HomeDiceRolling />
        </div>
          <NuxtImg
            src="/dragon_hoard.webp"
            alt="Dragon on hoard"
            sizes="sm:500px md:500px lg:500px"
            format="webp"
            provider="imagekit"
          />
        </div>
        <TitleText center :title="$t('home.textBlock2.title')" :text="$t('home.textBlock2.text')"/>
      </div>
    </div>
  </NuxtLayout>
</template>
