<script setup lang="ts">
import { useTableStore } from '@/store/table'

const store = useTableStore()
</script>

<template>
  <div
    v-if="store.encounter"
    class="flex flex-col md:flex-row gap-4 items-center justify-between container-max"
  >
    <div class="flex gap-2 items-center">
      <p>
        {{ $t('encounter.round') }}: {{ store.encounter.round }}
      </p>
      <button
        v-tippy="{ content: $t('actions.reset'), animation: 'shift-away' }"
        :disabled="!store.encounter.rows.length"
        aria-label="Reset rounds"
        class="disabled:opacity-40 disabled:cursor-not-allowed"
        @click="store.encounterUpdate({ round: 1, activeIndex: 0 })"
      >
        <Icon name="carbon:reset" class="w-5 h-5 text-danger" />
      </button>
    </div>
    <h1>{{ store.encounter.title }}</h1>
    <div class="flex gap-2 items-center bg-black rounded-lg border-2 border-secondary">
      <button
        v-tippy="{ content: $t('encounter.prev'), animation: 'shift-away' }"
        :disabled="store.encounter.round === 1 && store.encounter.activeIndex === 0"
        :aria-label="$t('encounter.prev')"
        class="group disabled:cursor-not-allowed duration-300 ease-in-out p-2 border-r-2 border-tracker"
        @click="store.prevInitiative"
      >
        <Icon name="tabler:chevron-left" class="group-disabled:opacity-40 w-6 h-6" />
      </button>
      <p class="uppercase font-bold px-2">
        {{ $t('inputs.initiativeLabel') }}
      </p>
      <button
        v-tippy="{ content: $t('encounter.next'), animation: 'shift-away' }"
        :disabled="!store.encounter.rows.length"
        :aria-label="$t('encounter.next')"
        class="p-2 border-l-2 border-tracker"
        @click="store.nextInitiative"
      >
        <Icon name="tabler:chevron-right" class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>
