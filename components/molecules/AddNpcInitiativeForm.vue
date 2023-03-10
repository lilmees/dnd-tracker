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
const form = ref({ name: null, initiative: null, ac: null, health: null, link: null })

watch(
  () => props.type,
  v => {
    if (v === 'npc') reset('form')
  }
)

async function addInitiative({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    const row = createRowObject(formData, props.type, props.encounter.rows)
    await store.updateEncounter(
      props.encounter.rows.includes('[') ? { rows: [row] } : { rows: [...props.encounter.rows, row] },
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
</script>

<template>
  <div v-if="type === 'npc'">
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
      <div class="flex gap-2 items-end">
        <div class="grow">
          <Input
            name="initiative"
            type="number"
            :label="$t('inputs.initiativeLabel')"
            validation="between:1,50|number"
          />
        </div>
        <Button :label="$t('actions.roll')" inline class="mb-2" @click="rollDice" />
      </div>
      <Input name="ac" type="number" :label="$t('inputs.acLabel')" validation="between:1,100|number" />
      <Input name="health" type="number" :label="$t('inputs.hpLabel')" validation="between:1,1000|number" />
      <Input name="link" :label="$t('inputs.linkLabel')" validation="length10,200|url" />
      <Button type="submit" :label="$t('encounter.addInInitiative')" :loading="isLoading" inline />
    </FormKit>
  </div>
</template>
