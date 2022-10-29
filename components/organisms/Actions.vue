<script setup>
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['update'])
const props = defineProps({ row: { type: Object, required: true } })

const toast = useToastStore()
const { t } = useI18n({ useScope: 'global' })

function updateLink(link) {
  props.row.link = link
  emit('update', props.row)
}

function updateHealth(update) {
  switch (update.type) {
    case 'heal':
      props.row.health + update.amount > props.row.maxHealth
        ? (props.row.health = props.row.maxHealth)
        : (props.row.health = props.row.health + update.amount)
      break
    case 'damage':
      if (props.row.tempHealth) {
        if (props.row.tempHealth >= update.amount) props.row.tempHealth = props.row.tempHealth - update.amount
        else {
          props.row.health = props.row.health - (update.amount - props.row.tempHealth)
          props.row.tempHealth = 0
        }
      } else props.row.health = props.row.health - update.amount
      break
    case 'temp':
      props.row.tempHealth = update.amount
      break
    case 'base':
      props.row.health = update.amount
      props.row.maxHealth = update.amount
      break
  }
  // when user is dies because of going to much in the negative hp
  if (props.row.health < 0 && Math.abs(props.row.health) >= props.row.maxHealth) {
    toast.info({
      title: t('encounter.toast.died.title'),
      text: t('encounter.toast.died.text'),
    })
  }
  // when health is an negative number change it to 0
  if (props.row.health < 0) props.row.health = 0
  emit('update', props.row)
}
</script>

<template>
  <div class="flex gap-2">
    <LinkModal :link="row.link" @update="updateLink" />
    <HeartModal :health="row.health" :tempHealth="row.tempHealth" @update="updateHealth" />
  </div>
</template>
