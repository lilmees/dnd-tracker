<script setup lang="ts">
const emit = defineEmits(['update'])
const props = defineProps<{ deathSaves: DeathSaves, type: RowType }>()

function updateDeathSave (index: number, save: boolean): void {
  save
    ? props.deathSaves.save[index] = !props.deathSaves.save[index]
    : props.deathSaves.fail[index] = !props.deathSaves.fail[index]

  emit('update', props.deathSaves)
}
</script>

<template>
  <div class="flex gap-1 items-center">
    <p
      v-if="deathSaves.stable"
      v-tippy="$t('pages.encounter.toasts.stable.title', { type: $t(`general.${type}`) })"
      class="font-bold text-slate-300"
    >
      S
    </p>
    <div class="flex flex-wrap gap-1 justify-center items-center">
      <div
        v-for="(save, i) in [deathSaves.save, deathSaves.fail]"
        :key="`save-${i}`"
        class="flex gap-1"
      >
        <div
          v-for="(value, j) in save"
          :key="`${value}-${j}`"
          class="w-4 h-4 rounded border-2 cursor-pointer"
          :class="{
            'border-success': i === 0,
            'bg-success': value && i === 0,
            'border-danger': i === 1,
            'bg-danger': value && i === 1
          }"
          @click="updateDeathSave(j, i === 0)"
        />
      </div>
    </div>
  </div>
</template>
