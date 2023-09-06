<script setup lang="ts">
const props = defineProps<{ row: Row, index: number }>()

const toast = useToastStore()
const store = useTableStore()
const { t } = useI18n()

function updateLink (link: string): void {
  props.row.link = link
  store.updateRow('link', link as never, props.row, props.index)
}

function updateHealth (update: { type: HPActionType, amount: number }): void {
  handleDeathSaves(update)

  switch (update.type) {
    case 'heal':
      if (typeof props.row.health === 'number' && typeof props.row.maxHealth === 'number') {
        props.row.health + update.amount > props.row.maxHealth
          ? (props.row.health = props.row.maxHealth)
          : (props.row.health = props.row.health + update.amount)
      }
      break
    case 'damage':
      if (typeof props.row.tempHealth === 'number') {
        if (props.row.tempHealth >= update.amount) {
          props.row.tempHealth = props.row.tempHealth - update.amount
        } else if (props.row.health) {
          props.row.health = props.row.health - (update.amount - props.row.tempHealth)
          props.row.tempHealth = 0
        }
      } else if (props.row.health) {
        props.row.health = props.row.health - update.amount
      }
      if (typeof props.row.health === 'number' && props.row.health <= 0) {
        resetDeathSaves()
      }
      break
    case 'temp':
      if (props.row?.health && props.row.health > 0) {
        props.row.tempHealth = update.amount
      }
      break
    case 'override':
      if (props.row.health && props.row.maxHealth) {
        props.row.health = update.amount < props.row.maxHealth
          ? update.amount
          : update.amount - (props.row.maxHealth - props.row.health)
      } else {
        props.row.health = update.amount
      }

      props.row.maxHealthOld = props.row.maxHealth || update.amount
      props.row.maxHealth = update.amount
      break
    case 'override-reset':
      if (props.row.health && props.row.maxHealth && props.row.maxHealthOld) {
        props.row.health = props.row.maxHealthOld < props.row.maxHealth
          ? update.amount
          : update.amount - (props.row.maxHealth - props.row.health)
      }

      props.row.maxHealthOld = undefined
      props.row.maxHealth = update.amount
      break
  }

  // when user is dies because of going to much in the negative hp
  if (
    (
      props.row.health &&
      props.row.maxHealth &&
      props.row.health < 0 &&
      Math.abs(props.row.health) >= props.row.maxHealth
    ) ||
    props.row.deathSaves.fail.every(v => v === true)
  ) {
    toast.info({
      title: t('pages.encounter.toasts.died.title'),
      text: t('pages.encounter.toasts.died.textMinHP')
    })
  }

  // when health is an negative number change it to 0
  if (props.row.health && props.row.health < 0) {
    props.row.health = 0
  }

  updateRow()
}

function updateAc (update: { type: ACActionType, amount: number }): void {
  switch (update.type) {
    case 'reset':
      props.row.ac = props.row.maxAc
      props.row.tempAc = 0
      break
    case 'remove':
      if (props.row.tempAc) {
        if (props.row.tempAc >= update.amount) {
          props.row.tempAc = props.row.tempAc - update.amount
        } else if (props.row.ac) {
          props.row.ac = props.row.ac - (update.amount - props.row.tempAc)
          props.row.tempAc = 0
        }
      } else if (props.row.ac) {
        props.row.ac = props.row.ac - update.amount
      }
      break
    case 'temp':
      props.row.tempAc = update.amount
      break
    case 'override':
      if (props.row.ac && props.row.maxAc) {
        props.row.ac = update.amount < props.row.maxAc
          ? update.amount
          : update.amount - (props.row.maxAc - props.row.ac)
      } else {
        props.row.ac = update.amount
      }

      props.row.maxAcOld = props.row.maxAc || update.amount
      props.row.maxAc = update.amount
      break
    case 'override-reset':
      if (props.row.ac && props.row.maxAc && props.row.maxAcOld) {
        props.row.ac = props.row.maxAcOld < props.row.maxAc
          ? update.amount
          : update.amount - (props.row.maxAc - props.row.ac)
      }

      props.row.maxAcOld = undefined
      props.row.maxAc = update.amount
      break
  }
  // when ac is an negative number change it to 0
  if (props?.row?.ac && props.row.ac < 0) {
    props.row.ac = 0
  }

  updateRow()
}

function handleDeathSaves (update: { type: string, amount: number }): void {
  if (props.row.health === 0) {
    props.row.deathSaves.stable = false
    if (update.type !== 'heal' && update.type !== 'base') {
      let updatedFails = 0
      props.row.deathSaves.fail.forEach((s, i) => {
        if (!s && updatedFails < 2) {
          props.row.deathSaves.fail[i] = true
          updatedFails++
        }
      })
      store.checkDeathSaves(props.row.deathSaves)
    } else {
      resetDeathSaves()
    }
  }
}

function resetDeathSaves (): void {
  props.row.deathSaves.fail = [false, false, false]
  props.row.deathSaves.save = [false, false, false]
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
      v-tippy="{ content: $t('components.actions.link') }"
      :url="row.link"
      @update="updateLink"
    />
    <AcModal
      v-if="!['lair'].includes(row.type)"
      v-tippy="{ content: $t('components.actions.ac') }"
      :ac="row.ac"
      :temp="row.tempAc"
      :max="row.maxAc"
      :max-old="row.maxAcOld"
      @update="updateAc"
    />
    <HpModal
      v-if="!['lair'].includes(row.type)"
      v-tippy="{ content: $t('components.actions.hp') }"
      :hp="row.health"
      :temp="row.tempHealth"
      :max="row.maxHealth"
      :max-old="row.maxHealthOld"
      @update="updateHealth"
    />
    <ConditionModal
      v-if="!['lair'].includes(row.type)"
      v-tippy="{ content: $t('components.actions.condition') }"
      :conditions="row.conditions"
      @update="updateCondition"
    />
    <PossibleAttacksModal
      v-if="
        row.actions?.length
          || row.legendary_actions?.length
          || row.reactions?.length
          || row.special_abilities?.length
      "
      v-tippy="{ content: $t('components.actions.attacks') }"
      :row="row"
    />
  </div>
</template>
