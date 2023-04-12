<script setup>
import { useTableStore } from '@/store/table'
import Reset from '@/assets/icons/reset.svg'
import Chevron from '@/assets/icons/chevron-down.svg'

const store = useTableStore()
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center justify-between container-max">
    <div class="flex gap-2 font-bold">
      <p>{{ $t('encounter.round') }}: {{ store.encounter.round }}</p>
      <button
        v-tippy="{ content: $t('actions.reset'), animation: 'shift-away' }"
        :disabled="!store.encounter.rows.length"
        class="disabled:opacity-40 disabled:cursor-not-allowed"
        @click="store.encounterUpdate({ round: 1, activeIndex: 0 })"
      >
        <Reset class="w-5 h-5 text-danger" />
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
        <Chevron class="rotate-90" />
      </button>
      <p class="uppercase">
        {{ $t('inputs.initiativeLabel') }}
      </p>
      <button
        v-tippy="{ content: $t('encounter.next'), animation: 'shift-away' }"
        :disabled="!store.encounter.rows.length"
        @click="store.nextInitiative"
      >
        <Chevron class="-rotate-90" />
      </button>
    </div>
  </div>
</template>
