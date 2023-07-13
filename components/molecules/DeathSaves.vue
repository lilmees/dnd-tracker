<script setup lang="ts">
const emit = defineEmits(['update'])
const props = defineProps<{ deathSaves: DeathSaves }>()

function updateDeathSave (index: number, save: boolean): void {
  save
    ? props.deathSaves.save[index] = !props.deathSaves.save[index]
    : props.deathSaves.fail[index] = !props.deathSaves.fail[index]

  emit('update', props.deathSaves)
}
</script>

<template>
  <div class="flex flex-wrap gap-1 justify-center items-center">
    <p
      v-if="deathSaves.stable"
      v-tippy="{ content: $t('pages.encounter.toasts.stable.title'), animation: 'shift-away' }"
      class="font-bold"
    >
      S
    </p>
    <div class="flex gap-1">
      <div
        v-for="(save, i) in deathSaves.save"
        :key="`${save}-${i}`"
        class="w-4 h-4 rounded border-success border-2 cursor-pointer"
        :class="{ 'bg-success': save }"
        @click="updateDeathSave(i, true)"
      />
    </div>
    <div class="flex gap-1">
      <div
        v-for="(fail, i) in deathSaves.fail"
        :key="`${fail}-${i}`"
        class="w-4 h-4 rounded border-danger border-2 cursor-pointer"
        :class="{ 'bg-danger': fail }"
        @click="updateDeathSave(i, false)"
      />
    </div>
  </div>
</template>
