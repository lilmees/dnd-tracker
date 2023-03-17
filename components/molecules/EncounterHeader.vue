<script setup>
import { useTableStore } from '@/store/table'
import Reset from '@/assets/icons/reset.svg'

const store = useTableStore()
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center justify-between container-max">
    <div class="flex gap-2 font-bold">
      <p>{{ $t('encounter.round') }}: {{ store.encounter.round }}</p>
      <Reset class="w-5 h-5 text-danger cursor-pointer" @click="store.encounterUpdate({ round: 1, activeIndex: 0 })" />
    </div>
    <h1>{{ store.encounter.title }}</h1>
    <div :class="{'tracker-shadow-pulse': !store.isSandbox}">
      <Button :label="$t('encounter.next')" @click="store.nextInitiative" />
    </div>
  </div>
</template>
