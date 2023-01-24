<script setup>
import { rollD20 } from '@/util/rollDice'
import { createRowObject } from '@/util/createRowObject'
import { useEncountersStore } from '@/store/encounters'
import { reset } from '@formkit/core'

const emit = defineEmits(['form'])
const props = defineProps({
  type: { type: String, required: true },
  encounter: { type: Object, required: true },
})

const store = useEncountersStore()
const error = ref()
const isLoading = ref(false)
const form = ref({ name: null, initiative: null, amount: 1, ac: null, health: null, link: null, summoner: null })

const optionalSummoners = computed(() =>
  props.encounter.rows
    .filter(r => r.type !== 'summon')
    .map(o => {
      return { label: o.name, id: o.id }
    })
)

watch(
  () => props.type,
  v => {
    if (v === 'summon') reset('form')
  }
)

async function addInitiative({ __init, amount, ...formData }) {
  error.value = null
  if (!formData.summoner) return
  try {
    isLoading.value = true
    const rows = []
    for (let i = 0; i < amount; i++) rows.push(createRowObject(formData, props.type, props.encounter.rows))
    await store.updateEncounter(
      props.encounter.rows.includes('[') ? { rows: [...rows] } : { rows: [...props.encounter.rows, ...rows] },
      props.encounter.id
    )
    reset('form')
    emit('close')
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

function rollDice() {
  form.value.initiative = rollD20()
}

function addPlayerInit() {
  const sum = props.encounter.rows.filter(r => r.id === form.value.summoner.id)[0]
  form.value.initiative = sum.initiative
}

function selectedSummoner(id) {
  const sum = props.encounter.rows.filter(r => r.id === id)[0]
  form.value.summoner = { name: sum.name, id: sum.id }
}
</script>

<template>
  <div v-if="type === 'summon'">
    <p v-if="error" class="text-danger text-center">{{ error }}</p>
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"
      message-class="error-message"
      @submit="addInitiative"
    >
      <Input focus name="name" :label="$t('inputs.nameLabel')" validation="required|length:3,30" required />
      <Select
        :absolute="false"
        :inputLabel="$t('inputs.summonerLabel')"
        :label="form.summoner?.name || $t('inputs.nothing')"
        bold
        required
        :options="optionalSummoners"
        @selected="selectedSummoner"
      />
      <Input
        name="amount"
        type="number"
        :label="$t('inputs.amountLabel')"
        validation="between:1,15|number|required"
        required
      />
      <div class="flex gap-2 items-end">
        <div class="max-w-[80px]">
          <Input
            name="initiative"
            type="number"
            :label="$t('inputs.initiativeLabel')"
            validation="between:1,50|number"
          />
        </div>
        <Button :label="$t('actions.roll')" inline class="mb-2 grow" @click="rollDice" />
        <Button
          v-if="form.summoner"
          :label="$t('encounter.copyPlayerInit')"
          inline
          class="mb-2 grow"
          @click="addPlayerInit"
        />
      </div>
      <Input name="ac" type="number" :label="$t('inputs.acLabel')" validation="between:1,100|number" />
      <Input name="health" type="number" :label="$t('inputs.hpLabel')" validation="between:1,1000|number" />
      <Input name="link" :label="$t('inputs.linkLabel')" validation="length10,200|url" />
      <Button type="submit" :label="$t('encounter.addInInitiative')" :loading="isLoading" inline />
    </FormKit>
  </div>
</template>
