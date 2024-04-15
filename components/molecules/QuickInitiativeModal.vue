<script setup lang="ts">
import logRocket from 'logrocket'
import { reset } from '@formkit/core'

const emit = defineEmits(['close'])

const store = useTableStore()
const toast = useToastStore()

const form = ref<QuickInitiativeForm>(generateForm())
const selected = ref<RowType[]>([])
const ignoreModifier = ref<boolean>(false)

const usedTypes = computed<RowType[]>(() => [...new Set(store.encounter?.rows.map(({ type }) => type))])

onMounted(() => { selected.value = usedTypes.value })

function generateForm (): QuickInitiativeForm {
  const form: QuickInitiativeForm = {}

  store.encounter?.rows.forEach((row) => {
    form[row.id] = {
      amount: undefined,
      initiative: row.initiative_modifier || undefined,
      type: row.type
    }
  })

  return form
}

function rollAllInitiatives (): void {
  for (const key in form.value) {
    if (selected.value.includes(form.value[key].type)) {
      form.value[key].amount = useDiceRoll(20) as number
    }
  }
}

async function handleSubmit ({ __init, ...rows }: Obj): Promise<void> {
  try {
    for (const key in rows) {
      if (rows[key].amount !== undefined) {
        const index = store.encounter!.rows.findIndex(({ id }) => id === +key)

        if (index >= 0) {
          let init: number = +rows[key].amount

          if (!ignoreModifier.value && !isNaN(+rows[key].initiative)) {
            init += +rows[key].initiative
          }

          store.encounter!.rows[index].initiative = Math.max(init, 0)
        }
      }
    }

    await store.encounterUpdate({ rows: store.encounter!.rows })
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  } finally {
    ignoreModifier.value = false
    reset('form')
    emit('close')
  }
}
</script>

<template>
  <Modal open @close="$emit('close')">
    <template #header>
      <h2>
        {{ $t('components.quickInitiativeModal.title') }}
      </h2>
    </template>
    <FormKit
      id="form"
      v-model="form"
      type="form"
      :actions="false"
      @submit="handleSubmit"
    >
      <div class="grid md:grid-cols-2 gap-x-10">
        <FormKit
          v-for="row in store.encounter?.rows || []"
          :key="row.id"
          :name="row.id.toString()"
          type="group"
        >
          <div class="flex gap-x-2 items-end">
            <FormKit
              name="amount"
              :label="row.name"
              validation="between:0,50|number"
              type="number"
              outer-class="grow"
              suffix-icon="dice"
              @suffix-icon-click="() => {
                form[row.id].amount = useDiceRoll(20) as number
              }"
            />
            <FormKit
              name="initiative"
              label="MOD"
              validation="between:-20,20|number"
              type="number"
              min="-20"
              max="20"
              outer-class="w-[100px]"
            />
          </div>
        </FormKit>
      </div>
      <div class="py-4">
        <FormKit
          v-model="selected"
          name="selected"
          type="checkbox"
          :label="$t('components.quickInitiativeModal.select')"
          :options="usedTypes.map((type) => ({
            label: $t(`general.${type}`),
            value: type
          }))"
          options-class="flex flex-wrap gap-y-2 gap-x-6"
        />
        <FormKit
          v-model="ignoreModifier"
          type="toggle"
          outer-class="!mb-0"
          wrapper-class="!mb-0"
          :label="$t('components.quickInitiativeModal.ignore')"
        />
      </div>
      <div class="flex gap-2 flex-wrap justify-end items-center">
        <FormKit
          :aria-label="$t('actions.update')"
          type="button"
          input-class="$reset !mb-0 btn-primary"
          outer-class="!mb-0"
          @click="rollAllInitiatives"
        >
          {{ $t('components.quickInitiativeModal.roll') }}
        </FormKit>
        <FormKit
          :aria-label="$t('actions.update')"
          outer-class="!mb-0"
          type="submit"
        >
          {{ $t('actions.update') }}
        </FormKit>
      </div>
    </FormKit>
  </Modal>
</template>
