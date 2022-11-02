<script setup>
import { rollD100, rollD20, rollD12, rollD10, rollD8, rollD6, rollD4 } from '@/util/rollDice'

const emit = defineEmits(['result'])

const form = reactive({
  d100: null,
  d20: null,
  d12: null,
  d10: null,
  d8: null,
  d6: null,
  d4: null,
})
const results = reactive({})

function rollDice({ __init, ...dices }) {
  Object.keys(dices).forEach(dice => {
    if (!dices[dice]) return
    results[dice] = generateDiceRoll(dice, dices[dice])
  })
  if (results === {}) return
  emit(
    'result',
    Object.values(results)
      .flat()
      .reduce((t, c) => t + c, 0)
  )
}

function generateDiceRoll(type, amount) {
  switch (type) {
    case 'd100':
      return rollD100(amount)
    case 'd20':
      return rollD20(amount)
    case 'd12':
      return rollD12(amount)
    case 'd10':
      return rollD10(amount)
    case 'd8':
      return rollD8(amount)
    case 'd6':
      return rollD6(amount)
    case 'd4':
      return rollD4(amount)
  }
}
</script>

<template>
  <div class="bg-primary/10 rounded-xl p-2 mb-3">
    <FormKit v-model="form" type="form" :actions="false" message-class="error-message" @submit="rollDice">
      <div class="flex gap-2">
        <Input name="d100" type="number" label="D100" validation="between:1,20|number" />
        <Input name="d20" type="number" label="D20" validation="between:1,20|number" />
        <Input name="d12" type="number" label="D12" validation="between:1,20|number" />
        <Input name="d10" type="number" label="D10" validation="between:1,20|number" />
        <Input name="d8" type="number" label="D8" validation="between:1,20|number" />
        <Input name="d6" type="number" label="D6" validation="between:1,20|number" />
        <Input name="d4" type="number" label="D4" validation="between:1,20|number" />
      </div>
      <Button type="submit" :label="$t('actions.roll')" inline bold />
    </FormKit>
    <div class="flex flex-col mt-3">
      <div v-for="result in Object.keys(results)" class="flex flex-wrap gap-1">
        <p class="font-bold">{{ result }}:</p>
        <div v-if="Array.isArray(results[result])" class="flex flex-wrap gap-1">
          <p v-for="(amount, index) in results[result]">
            {{ results[result].length === index + 1 ? amount : `${amount},` }}
          </p>
        </div>
        <p v-else>{{ results[result] }}</p>
      </div>
    </div>
  </div>
</template>
