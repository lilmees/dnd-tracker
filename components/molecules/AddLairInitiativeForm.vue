<script setup>
import { rollD20 } from '@/util/rollDice'
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
const form = ref({ name: null, initiative: null, link: null })

watch(
  () => props.type,
  v => {
    if (v === 'lair') reset('form')
  }
)

async function addInitiative({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    const row = createRowObject(formData)
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

function createRowObject(formData) {
  const form = {
    ...formData,
    initiative: Number(formData.initiative) || null,
  }
  return {
    ...form,
    id: Date.now() + Math.floor(Math.random() * 100),
    type: props.type,
    conditions: [],
    curses: [],
  }
}

function rollDice() {
  form.value.initiative = rollD20()
}
</script>

<template>
  <div v-if="type === 'lair'">
    <p v-if="error" class="text-danger text-center">{{ error }}</p>
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"
      message-class="error-message"
      @submit="addInitiative"
    >
      <Input name="name" :label="$t('inputs.nameLabel')" validation="required|length:3,30" required />
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
      <Input name="link" :label="$t('inputs.linkLabel')" validation="length10,200|url" />
      <Button type="submit" :label="$t('encounter.addInInitiative')" :loading="isLoading" inline bold />
    </FormKit>
  </div>
</template>
