<script setup lang="ts">
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

function diceRoll () {
  form.value.amount = useDiceRoll(20) as number
}

function updateInitiative ({ __init, initiative, amount }: Obj): void {
  if (!amount) { emit('update', -1) }
  const init: number = +amount + +initiative
  emit('update', init < 0 ? 0 : init)
  isOpen.value = false
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
          />
          <div class="w-[120px]">
            <FormKit
              name="initiative"
              :label="`${$t('components.inputs.initiativeLabel')} (DEX)`"
              validation="between:-10,10|number"
              type="number"
            />
          </div>
          <button
            class="btn-black mt-6"
            type="button"
            :aria-label="$t('actions.roll')"
            @click="diceRoll"
          >
            {{ $t('actions.roll') }}
          </button>
        </div>
        <FormKit :aria-label="$t('actions.update')" type="submit">
          {{ $t('actions.update') }}
        </FormKit>
      </FormKit>
    </Modal>
  </div>
</template>
