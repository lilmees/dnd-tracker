<script setup>
import { reset } from '@formkit/core'
import { useTableStore } from '@/store/table'

const emit = defineEmits(['close'])
const props = defineProps({ type: { type: String, required: true } })

const store = useTableStore()

const error = ref()
const isLoading = ref(false)
const form = ref({ name: null, initiative: null, link: null })

watch(
  () => props.type,
  (v) => {
    if (v === 'lair') {
      reset('form')
    }
  }
)

async function addInitiative ({ __init, ...formData }) {
  error.value = null
  try {
    isLoading.value = true
    const row = useCreateRow(formData, props.type, store.encounter.rows)
    await store.encounterUpdate({
      rows: [...store.encounter.rows, row]
    })
    reset('form')
    emit('close')
  } catch (err) {
    useBugsnag().notify(`Handeld in catch: ${useError(err)}`)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

function rollDice () {
  form.value.initiative = useDiceRoll(20)
}
</script>

<template>
  <div v-if="type === 'lair'">
    <p v-if="error" class="text-danger text-center">
      {{ error }}
    </p>
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"
      message-class="error-message"
      @submit="addInitiative"
    >
      <Input
        focus
        name="name"
        :label="$t('inputs.nameLabel')"
        validation="required|length:3,30"
        required
      />
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
      <Input
        name="link"
        :label="$t('inputs.linkLabel')"
        validation="length10,200|url"
      />
      <Button
        type="submit"
        :label="$t('encounter.addInInitiative')"
        :loading="isLoading"
        inline
      />
    </FormKit>
  </div>
</template>
