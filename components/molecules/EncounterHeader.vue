<script setup>
import { useTableStore } from '@/store/table'
import Reset from '@/assets/icons/reset.svg'

const store = useTableStore()
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center justify-between container-max">
    <div class="flex gap-2 font-bold">
      <p>{{ $t('encounter.round') }}: {{ store.encounter.round }}</p>
      <button 
        :disabled="!store.encounter.rows.length"
        class="disabled:opacity-40 disabled:cursor-not-allowed"
        @click="store.encounterUpdate({ round: 1, activeIndex: 0 })"
      >
        <Reset class="w-5 h-5 text-danger" />
      </button>
    </div>
    <h1>{{ store.encounter.title }}</h1>
    <Button 
      :label="$t('encounter.next')"
      :disabled="!store.encounter.rows.length"
      @click="store.nextInitiative" 
    />
  </div>
</template>
