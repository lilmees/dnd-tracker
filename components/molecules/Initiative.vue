<script setup>
import { correctRowItemIndexes } from '@/util/correctRowItemIndexes'
import { useTableStore } from '@/store/table'
import { rollD20 } from '@/util/rollDice'
import Update from '@/assets/icons/update.svg'
import ArrowDown from '@/assets/icons/arrow-down.svg'
import ArrowUp from '@/assets/icons/arrow-up.svg'

const emit = defineEmits(['update'])
const props = defineProps({
  initiative: { type: [Number, null], required: true },
  index: { type: Number, required: true },
})

const store = useTableStore()

const isOpen = ref(false)
const form = ref({ initiative: null })

function diceRoll() {
  form.value.initiative = rollD20()
}

function updateInitiative({ __init, initiative }) {
  emit('update', Number(initiative) || -1)
  isOpen.value = false
}

async function moveRow(up) {
  const rows = store.encounter.rows
  const lowestIndex = rows.findIndex(r => r.index === props.index)
  if (up) {
    rows[lowestIndex].index = lowestIndex - 1
    rows[lowestIndex - 1].index = lowestIndex
    // update the follwing indexes
    for (let i = lowestIndex + 1; i < rows.length; i++) {
      rows[i].index = i
    }
  } else {
    rows[lowestIndex].index = lowestIndex + 1
    rows[lowestIndex + 1].index = lowestIndex
  }
  await store.encounterUpdate({ rows : rows.sort((a, b) => a.index - b.index) })
}
</script>

<template>
  <div>
    <div class="flex justify-between gap-2">
      <div class="flex gap-2 items-center">
        <p v-if="initiative >= 0" class="peer cursor-pointer" @click="isOpen = true">
          {{ initiative }}
        </p>
        <p v-else class="text-slate-600 cursor-pointer" @click="isOpen = true">
          {{ $t('actions.add') }}
        </p>
        <Update
          class="w-4 h-4 opacity-0 peer-hover:opacity-100 duration-200 ease-in-out"
          :class="{ hidden: !initiative }"
        />
      </div>
      <div v-if="initiative" class="flex gap-2 items-center">
        <ArrowDown
          v-if="store.encounter.rows.length !== index + 1 && store.encounter.rows[index + 1].initiative === initiative"
          class="w-4 h-4 cursor-pointer text-primary"
          @click="moveRow(false)"
        />
        <ArrowUp
          v-if="index > 0 && store.encounter.rows[index - 1]?.initiative === initiative"
          class="w-4 h-4 cursor-pointer text-primary"
          @click="moveRow(true)"
        />
      </div>
    </div>
    <Modal v-if="isOpen" @close="isOpen = false">
      <h2>{{ $t('encounter.update.initiative') }}</h2>
      <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="updateInitiative">
        <div class="flex gap-2 items-end">
          <div class="grow">
            <Input
              focus
              name="initiative"
              :label="$t('inputs.initiativeLabel')"
              validation="required|between:1,50|number"
              type="number"
              required
            />
          </div>
          <div class="mb-3">
            <Button :label="$t('actions.roll')" bold @click="diceRoll" />
          </div>
        </div>
        <Button type="submit" :label="$t('actions.update')" inline />
      </FormKit>
    </Modal>
  </div>
</template>
