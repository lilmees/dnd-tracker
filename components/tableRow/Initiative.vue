<script setup lang="ts">
import { reset } from '@formkit/core'

const emit = defineEmits(['update'])
const props = defineProps<{
  initiative: number|null,
  index: number
}>()

const store = useTableStore()

const isOpen = ref<boolean>(false)
const form = ref<{
  initiative: number|null,
  amount: number|null
}>({
  initiative: null,
  amount: null
})

const dice = '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="512" viewBox="0 0 480 512"><path fill="currentColor" d="M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07l-108.64-190.1zM7.41 315.43L82.7 193.08L6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9l-76.64 45.99l75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1l208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75L340.43 208H240z"/></svg>'

function updateInitiative ({ __init, initiative, amount }: Obj): void {
  if (amount < 0) { emit('update', -1) }
  const init: number = +amount + +initiative
  emit('update', init < 0 ? 0 : init)
  isOpen.value = false
  reset('form')
}

async function moveRow (up: boolean): Promise<void> {
  if (store?.encounter) {
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
    await store.encounterUpdate({
      rows: rows.sort((a, b) => a.index - b.index)
    })
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between gap-2">
      <div class="flex gap-2 items-center">
        <p
          v-if="initiative !== null && initiative >= 0"
          class="peer cursor-pointer"
          @click="isOpen = true"
        >
          {{ initiative }}
        </p>
        <p v-else class="text-slate-600 cursor-pointer" @click="isOpen = true">
          Add
        </p>
        <Icon
          name="lucide:wrench"
          class="w-4 h-4 opacity-0 peer-hover:opacity-100 duration-200 ease-in-out"
          :class="{ hidden: !initiative }"
          aria-hidden="true"
        />
      </div>
      <div
        v-if="initiative !== null && initiative >= 0"
        class="flex gap-1 items-center"
      >
        <Icon
          v-if="
            store.encounter
              && store.encounter.rows.length !== index + 1
              && store.encounter.rows[index + 1].initiative === initiative
          "
          name="ph:arrow-down"
          class="w-6 h-6 cursor-pointer text-secondary"
          aria-hidden="true"
          @click="moveRow(false)"
        />
        <Icon
          v-if="store.encounter
            && index > 0
            && store.encounter.rows[index - 1]?.initiative === initiative"
          name="ph:arrow-up"
          class="w-6 h-6 cursor-pointer text-secondary"
          aria-hidden="true"
          @click="moveRow(true)"
        />
      </div>
    </div>
    <Modal v-if="isOpen" @close="isOpen = false">
      <template #header>
        <h2>{{ $t('pages.encounter.update.initiative') }}</h2>
      </template>
      <FormKit
        id="form"
        v-model="form"
        type="form"
        :actions="false"
        @submit="updateInitiative"
      >
        <div class="flex gap-x-3 flex-wrap items-start">
          <FormKit
            name="amount"
            :label="$t('components.inputs.amountLabel')"
            validation="required|between:0,50|number"
            type="number"
            outer-class="grow"
            :suffix-icon="dice"
            @suffix-icon-click="() => {
              form.amount = useDiceRoll(20) as number
            }"
          />
          <FormKit
            name="initiative"
            :label="`${$t('components.inputs.initiativeLabel')} (MODIFIER)`"
            validation="between:-10,10|number"
            type="number"
            outer-class="grow"
          />
        </div>
        <FormKit :aria-label="$t('actions.update')" type="submit">
          {{ $t('actions.update') }}
        </FormKit>
      </FormKit>
    </Modal>
  </div>
</template>
