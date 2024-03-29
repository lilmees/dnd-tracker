<script setup lang="ts">
import logRocket from 'logrocket'
import { reset } from '@formkit/core'

const emit = defineEmits(['close'])

const store = useTableStore()
const toast = useToastStore()

const form = ref<QuickInitiativeForm>(generateForm())
const selected = ref<RowType[]>([])
const ignoreModifier = ref<boolean>(false)

const dice = '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="512" viewBox="0 0 480 512"><path fill="currentColor" d="M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07l-108.64-190.1zM7.41 315.43L82.7 193.08L6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9l-76.64 45.99l75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1l208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75L340.43 208H240z"/></svg>'

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
              :suffix-icon="dice"
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
