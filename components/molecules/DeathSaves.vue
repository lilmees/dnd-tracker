<script setup>
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['update'])
const props = defineProps({ deathSaves: { type: Object, required: true } })

const toast = useToastStore()
const { t } = useI18n({ useScope: 'global' })

function updateDeathSave(index, save) {
  if (save) props.deathSaves.save[index] = !props.deathSaves.save[index]
  else props.deathSaves.fail[index] = !props.deathSaves.fail[index]
  // show toast when player died
  if (JSON.stringify(props.deathSaves.fail) === JSON.stringify([true, true, true])) {
    toast.info({
      title: t('encounter.toast.died.title'),
      text: t('encounter.toast.died.textDeathSaves'),
    })
  }
  emit('update', props.deathSaves)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex gap-1">
      <div
        v-for="(save, i) in deathSaves.save"
        :key="save"
        class="w-4 h-4 rounded border-success border-2 cursor-pointer"
        :class="{ 'bg-success': save }"
        @click="updateDeathSave(i, true)"
      />
    </div>
    <div class="flex gap-1">
      <div
        v-for="(fail, i) in deathSaves.fail"
        :key="fail"
        class="w-4 h-4 rounded border-danger border-2 cursor-pointer"
        :class="{ 'bg-danger': fail }"
        @click="updateDeathSave(i, false)"
      />
    </div>
  </div>
</template>
