<script setup lang="ts">
useHead({ title: 'Fantasy name generator' })

const { copy } = useClipboard()
const toast = useToastStore()
const { t } = useI18n()
const isSmall = useMediaQuery('(max-width: 768px)')

const names = ref<string[]>([])

const nameColumns = computed<string[][]>(() => {
  const amount = isSmall.value ? 1 : 2
  return splitArray<string>(names.value, amount)
})

onMounted(() => generate())

function generate(): void {
  names.value = []

  for (let i = 0; i < 30; i++) {
    names.value.push(useRandomName())
  }
}

function handleCopy(name: string): void {
  copy(name)

  toast.info({
    title: t('components.nameGenerator.toast.title', { name }),
    timeout: 2000,
  })
}
</script>

<template>
  <Layout>
    <div class="flex flex-col pt-6 pb-16 gap-10">
      <h1 class="mb-4 sm:text-4xl xl:text-5xl text-center">
        {{ $t('pages.fantasyNameGenerator.title') }}
      </h1>
      <p class="mb-5 max-w-3xl mx-auto text-center pb-10">
        {{ $t('pages.fantasyNameGenerator.description') }}
      </p>
      <div class="relative p-6 border-4 border-tracker bg-tracker/50 rounded-lg max-w-prose mx-auto w-full">
        <ol
          v-if="names.length"
          class="grid list-disc list-inside gap-x-6"
          :style="{
            gridTemplateColumns: `repeat(${nameColumns.length}, minmax(0, 1fr))`,
          }"
        >
          <div
            v-for="(column, i) in nameColumns"
            :key="i"
            class="flex flex-col gap-1"
          >
            <li
              v-for="(name, j) in column"
              :key="name"
              class="cursor-copy"
              @click="handleCopy(name)"
            >
              {{ name }}
            </li>
          </div>
        </ol>
        <SkeletonList v-else />
        <div class="flex justify-end gap-2 items-end pt-6">
          <button
            :disabled="!names.length"
            class="btn-primary"
            @click="generate"
          >
            {{ $t('actions.generate') }}
          </button>
        </div>
        <div class="abolsute inset-0 z-[-1] fancy-shadow" />
      </div>
    </div>
  </Layout>
</template>
