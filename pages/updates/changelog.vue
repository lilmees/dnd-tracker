<script setup lang="ts">
useHead({ title: 'Changelogs' })

const { data } = await useAsyncData('changelog', async () => {
  const logs = await queryContent('changelogs').find()
  return (logs || []).reverse()
})

const { locale } = useI18n()
const blob = ref<HTMLDivElement>()

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
  <Layout shadow>
    <div
      ref="blob"
      class="hidden md:block -z-[1] h-[200px] w-[200px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full from-info to-secondary bg-gradient-to-r rotates blur-[100px]"
    />
    <ul
      aria-label="Changelog feed"
      role="feed"
      class="relative flex flex-col max-w-4xl mx-auto gap-16 py-12 pl-6 before:absolute before:top-0 before:left-6 before:h-full before:border-2 before:-translate-x-1/2 before:border-black"
    >
      <li
        v-for="item in data"
        :id="item.version"
        :key="item.version"
        role="article"
        class="relative pl-10"
      >
        <span class="absolute z-[1] inline-flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/50 left-0 -translate-x-1/2 border-4 border-secondary backdrop-blur">
          <Icon
            aria-hidden="true"
            name="ph:lightning"
            class="h-5 w-5 z-20"
          />
        </span>
        <div class="flex flex-col flex-1 gap-4 border-4 border-black bg-black/50 rounded-lg p-5 relative -mt-2">
          <div class="flex items-end gap-4 relative">
            <Icon
              aria-hidden="true"
              name="teenyicons:left-solid"
              class="h-10 w-10 absolute -left-12 text-black"
            />
            <p class="font-bold head-2">
              {{ item.version }}
            </p>
            <div class="text-xs bg-slate-700 w-fit px-2 py-1 rounded-lg">
              {{ new Date(item.date).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US') }}
            </div>
          </div>

          <div class="flex flex-col gap-6">
            <div
              v-for="(feature, i) in item.features"
              :key="i"
              class="flex flex-col gap-1.5"
            >
              <h4
                class="border-4 rounded-lg w-fit px-2"
                :class="{
                  'border-primary bg-primary/50': feature.title === 'New',
                  'border-warning bg-warning/50': feature.title === 'Bug fixes',
                  'border-help bg-help/50': feature.title === 'Improvements',
                }"
              >
                {{ feature.title }}
              </h4>

              <ul class="pl-6 space-y-1.5 list-disc body-small marker:text-slate-700 md:text-base">
                <template
                  v-for="(element, k) in feature.items"
                  :key="k"
                >
                  <li v-if="!element.adminOnly">
                    {{ element.text }}
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </Layout>
</template>
