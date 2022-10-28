<script setup>
const emit = defineEmits(['update'])
const props = defineProps({ deathSaves: { type: Object, required: true } })

function updateDeathSave(index, save) {
  if (save) props.deathSaves.save[index] = !props.deathSaves.save[index]
  else props.deathSaves.fail[index] = !props.deathSaves.fail[index]
  emit('update', props.deathSaves)
}
</script>

<template>
  <div>
    <div class="flex gap-1">
      <div
        v-for="(save, i) in deathSaves.save"
        :key="save"
        class="w-4 h-3 rounded border-success border-2 cursor-pointer"
        :class="{ 'bg-success': save }"
        @click="updateDeathSave(i, true)"
      />
    </div>
    <div class="flex gap-1">
      <div
        v-for="(fail, i) in deathSaves.fail"
        :key="fail"
        class="w-4 h-3 rounded border-danger border-2 cursor-pointer"
        :class="{ 'bg-danger': fail }"
        @click="updateDeathSave(i, false)"
      />
    </div>
  </div>
</template>
