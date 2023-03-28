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
    toast.info({ title: t('encounter.toast.died.title'), text: t('encounter.toast.died.textMinHP') })
  }
  // when health is an negative number change it to 0
  if (props.row.health < 0) props.row.health = 0
  emit('update', props.row)
}

function updateAc(update) {
  switch (update.type) {
    case 'reset':
      props.row.ac = props.row.maxAc
      props.row.tempAc = 0
      break
    case 'remove':
      if (props.row.tempAc) {
        if (props.row.tempAc >= update.amount) props.row.tempAc = props.row.tempAc - update.amount
        else {
          props.row.ac = props.row.ac - (update.amount - props.row.tempAc)
          props.row.tempAc = 0
        }
      } else props.row.ac = props.row.ac - update.amount
      break
    case 'temp':
      props.row.tempAc = update.amount
      break
    case 'base':
      props.row.ac = update.amount
      props.row.maxAc = update.amount
      break
  }
  // when ac is an negative number change it to 0
  if (props.row.ac < 0) props.row.ac = 0
  emit('update', props.row)
}

function updateCondition(conditions) {
  props.row.conditions = conditions
  emit('update', props.row)
}
</script>

<template>
  <div class="flex gap-1 justify-center">
    <LinkModal
      v-tippy="$t('encounter.tooltip.link')"
      :link="row.link === undefined ? null : row.link"
      @update="updateLink"
    />
    <HeartModal
      v-if="!['lair'].includes(row.type)"
      v-tippy="$t('encounter.tooltip.hp')"
      :health="row.health"
      :tempHealth="row.tempHealth"
      @update="updateHealth"
    />
    <AcModal
      v-if="!['lair'].includes(row.type)"
      v-tippy="$t('encounter.tooltip.ac')"
      :ac="row.ac"
      :tempAc="row.tempAc"
      @update="updateAc"
    />
    <ConditionModal
      v-if="!['lair'].includes(row.type)"
      v-tippy="$t('encounter.tooltip.condition')"
      :conditions="row.conditions"
      @update="updateCondition"
    />
    <PossibleAttacksModal
      v-if="row.actions"
      v-tippy="$t('encounter.tooltip.attacks')"
      :actions="Array.isArray(row.actions) ? row.actions : JSON.parse(row.actions)"
    />
  </div>
</template>
