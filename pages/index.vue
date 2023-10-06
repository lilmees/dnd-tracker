<script setup lang="ts">
import logRocket from 'logrocket'

const store = useTableStore()
const toast = useToastStore()

try {
  await store.getSandboxEncounter()
} catch (err) {
  logRocket.captureException(err as Error)
  toast.error()
}
</script>

<template>
  <NuxtLayout name="wide">
    <div>
      <Hero />
      <div class="flex flex-col gap-y-[100px] sm:gap-y-[150px] py-20 px-4 container-max">
        <div class="container grid gap-10 lg:grid-cols-2">
          <TitleText
            data-aos="zoom-in"
            :data-aos-once="true"
            :data-aos-mirror="false"
            :data-aos-duration="1000"
            :title="$t('pages.home.textBlock1.title')"
            :text="$t('pages.home.textBlock1.text')"
            button-link="updates/feature-request"
            :button-label="$t('pages.home.textBlock1.button')"
          />
          <div
            data-aos="zoom-in"
            :data-aos-once="true"
            :data-aos-mirror="false"
            :data-aos-duration="1000"
            class="mt-20 lg:mt-32 flex md:justify-end"
          >
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
          data-aos="zoom-in"
          :data-aos-duration="1000"
          :data-aos-once="true"
          :data-aos-mirror="false"
          class="space-y-4"
        >
          <div class="flex justify-end">
            <VisualOptions />
          </div>
          <div class="rounded-lg bg-tracker/50 border-4 border-tracker backdrop-blur-xl relative container-max">
            <div class="abolsute inset-0 z-[-0] fancy-shadow" />
            <EncounterHeader />
            <EncounterTable />
            <EncounterOptions />
          </div>
        </div>
        <div
          class="container grid md:grid-cols-2 gap-10"
          data-aos="zoom-in"
          :data-aos-once="true"
          :data-aos-mirror="false"
          :data-aos-duration="1000"
        >
          <HomeDiceRolling />
          <NuxtImg
            src="/dragon_hoard.webp"
            alt="Dragon on hoard"
            sizes="sm:500px md:500px lg:500px"
            format="webp"
            provider="imagekit"
            width="500"
            class="mx-auto"
          />
        </div>
        <TitleText
          data-aos="zoom-in"
          :data-aos-once="true"
          :data-aos-mirror="false"
          :data-aos-duration="1000"
          center
          :title="$t('pages.home.textBlock2.title')"
          :text="$t('pages.home.textBlock2.text')"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
