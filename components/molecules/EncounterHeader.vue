<script setup lang="ts">
import { useTableStore } from '@/store/table'

const store = useTableStore()
</script>

<template>
  <div
    v-if="store.encounter"
    class="flex flex-wrap gap-4 items-center justify-between container-max"
  >
    <div class="flex gap-2 font-bold">
      <p>
        {{ $t('encounter.round') }}: {{ store.encounter.round }}
      </p>
      <button
        v-tippy="{ content: $t('actions.reset'), animation: 'shift-away' }"
        :disabled="!store.encounter.rows.length"
        class="disabled:opacity-40 disabled:cursor-not-allowed"
        @click="store.encounterUpdate({ round: 1, activeIndex: 0 })"
      >
        <Icon name="carbon:reset" class="w-5 h-5 text-danger" />
      </button>
    </div>
    <h1>{{ store.encounter.title }}</h1>
    <div class="flex gap-2 items-center bg-black rounded-xl p-2">
      <button
        v-tippy="{ content: $t('encounter.prev'), animation: 'shift-away' }"
        :disabled="store.encounter.round === 1 && store.encounter.activeIndex === 0"
        class="disabled:opacity-40 disabled:cursor-not-allowed duration-300 ease-in-out"
        @click="store.prevInitiative"
      >
        <Icon name="tabler:chevron-left" class="w-6 h-6" />
      </button>
      <p class="uppercase">
        {{ $t('inputs.initiativeLabel') }}
      </p>
      <button
        v-tippy="{ content: $t('encounter.next'), animation: 'shift-away' }"
        :disabled="!store.encounter.rows.length"
        @click="store.nextInitiative"
      >
        <Icon name="tabler:chevron-right" class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>
