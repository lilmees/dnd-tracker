<script setup lang="ts">
import { useToastStore } from '@/store/toast'
import { useTableStore } from '@/store/table'

const props = defineProps<{ row: Row, index: number }>()

const toast = useToastStore()
const store = useTableStore()
const { $i18n } = useNuxtApp()

function updateLink (link: string): void {
  props.row.link = link
  store.updateRow('link', link as never, props.row, props.index)
}

function updateHealth (update: { type: string, amount: number }): void {
  if (props.row.health && props.row.maxHealth) {
    switch (update.type) {
      case 'heal':
        props.row.health + update.amount > props.row.maxHealth
          ? (props.row.health = props.row.maxHealth)
          : (props.row.health = props.row.health + update.amount)
        break
      case 'damage':
        if (props.row.tempHealth) {
          if (props.row.tempHealth >= update.amount) {
            props.row.tempHealth = props.row.tempHealth - update.amount
          } else {
            props.row.health = props.row.health - (update.amount - props.row.tempHealth)
            props.row.tempHealth = 0
          }
        } else { props.row.health = props.row.health - update.amount }
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
        title: $i18n.t('encounter.toast.died.title'),
        text: $i18n.t('encounter.toast.died.textMinHP')
      })
    }
    // when health is an negative number change it to 0
    if (props.row.health < 0) {
      props.row.health = 0
    }

    updateRow()
  }
}

function updateAc (update: { type: string, amount: number }): void {
  if (props.row.ac) {
    switch (update.type) {
      case 'reset':
        props.row.ac = props.row.maxAc
        props.row.tempAc = 0
        break
      case 'remove':
        if (props.row.tempAc) {
          if (props.row.tempAc >= update.amount) {
            props.row.tempAc = props.row.tempAc - update.amount
          } else {
            props.row.ac = props.row.ac - (update.amount - props.row.tempAc)
            props.row.tempAc = 0
          }
        } else { props.row.ac = props.row.ac - update.amount }
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
    if (props?.row?.ac && props.row.ac < 0) {
      props.row.ac = 0
    }

    updateRow()
  }
}

function updateCondition (conditions: Condition[]): void {
  props.row.conditions = conditions
  updateRow()
}

function updateRow () {
  if (store.encounter) {
    const rows = store.encounter.rows
    rows[props.index] = props.row
    store.encounterUpdate({ rows })
  }
}
</script>

<template>
  <div class="flex gap-1 justify-center">
    <LinkModal
      v-tippy="{ content: $t('encounter.tooltip.link'), animation: 'shift-away' }"
      :url="row.link"
      @update="updateLink"
    />
    <HeartModal
      v-if="!['lair'].includes(row.type)"
      v-tippy="{ content: $t('encounter.tooltip.hp'), animation: 'shift-away' }"
      :health="row.health"
      :temp-health="row.tempHealth"
      @update="updateHealth"
    />
    <AcModal
      v-if="!['lair'].includes(row.type)"
      v-tippy="{ content: $t('encounter.tooltip.ac'), animation: 'shift-away' }"
      :ac="row.ac"
      :temp-ac="row.tempAc"
      @update="updateAc"
    />
    <ConditionModal
      v-if="!['lair'].includes(row.type)"
      v-tippy="{ content: $t('encounter.tooltip.condition'), animation: 'shift-away' }"
      :conditions="row.conditions"
      @update="updateCondition"
    />
    <PossibleAttacksModal
      v-if="row.actions"
      v-tippy="{ content: $t('encounter.tooltip.attacks'), animation: 'shift-away' }"
      :monster="row"
    />
  </div>
</template>
