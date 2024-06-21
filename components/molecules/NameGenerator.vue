<script setup lang="ts">
const { copy } = useClipboard()
const toast = useToastStore()
const { t } = useI18n()

const names = ref<string[]>([])

function generate(): void {
  names.value = []
  for (let i = 0; i < 10; i++) {
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
  <div>
    <p class="font-bold body-small mb-1">
      {{ $t('components.nameGenerator.title') }}
    </p>
    <div class="rounded-lg p-4 bg-tracker/50 space-y-4 border-4 border-tracker">
      <p
        v-if="!names.length"
        class="text-slate-300"
      >
        {{ $t('components.nameGenerator.cta') }}
      </p>
      <ul
        v-else
        class="list-disc list-outside ml-4 grid sm:grid-cols-2 gap-x-4"
      >
        <li
          v-for="name in names"
          :key="name"
          class="mb-1 last:mb-0"
        >
          <button
            class="text-left cursor-copy"
            @click="handleCopy(name)"
          >
            {{ name }}
          </button>
        </li>
      </ul>
      <div class="flex justify-end">
        <button
          class="btn-primary"
          @click="generate"
        >
          {{ $t('actions.generate') }}
        </button>
      </div>
    </div>
  </div>
</template>
