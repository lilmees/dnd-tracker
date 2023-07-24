<script setup lang="ts">
import { FormKitSchema } from '@formkit/vue'
import { reset } from '@formkit/core'
import logRocket from 'logrocket'
import schema from '~~/formkit/homebrew.json'

const store = useTableStore()

const isOpen = ref<boolean>(false)

const form = ref<AddInitiativeForm>({
  type: 'player' as RowType,
  name: '',
  initiative: null,
  ac: null,
  health: null,
  link: null,
  amount: null,
  summoner: null,
  data: {
    isLoading: false,
    update: false,
    encounter: true,
    error: null,
    options: [
      { label: 'Player', value: 'player' },
      { label: 'Summon', value: 'summon' },
      { label: 'Npc', value: 'npc' },
      { label: 'Monster', value: 'monster' },
      { label: 'Lair', value: 'lair' }
    ],
    summoners: [],
    rollDice
  }
})

watch(() => store.encounter?.rows, (v) => {
  if (v && form.value.data) {
    form.value.data.summoners = v
      .filter(r => r.type !== 'summon')
      .map((o) => {
        return { label: o.name, value: o.id }
      })
  }
}, { immediate: true })

watch(() => form.value.type, (v) => {
  if (v === 'summon') {
    form.value.summoner = 0
  }
})

async function addInitiative ({ __init, amount, data, slots, ...formData }: Obj): Promise<void> {
  form.value.data!.error = null
  form.value.data!.isLoading = true

  if (!store.encounter?.rows) {
    return
  }

  try {
    const rows = []

    if (!amount) {
      amount = 1
    }

    if (typeof formData.summoner === 'number') {
      const sum = store.encounter.rows.filter(r => r.id === formData.summoner)[0]
      formData.summoner = { name: sum.name, id: +sum.id }
    }

    for (let i = 0; i < amount; i++) {
      rows.push(useCreateRow(formData as Row, form.value.type as RowType, store.encounter.rows))
    }

    await store.encounterUpdate({
      rows: [...store.encounter.rows, ...rows]
    } as UpdateEncounter)

    closeModal()
  } catch (err) {
    logRocket.captureException(err as Error)
    form.value.data!.error = useErrorMessage(err)
  } finally {
    form.value.data!.isLoading = false
  }
}

function rollDice (): void {
  form.value.initiative = useDiceRoll(20) as number
}

function closeModal (): void {
  reset('form')
  isOpen.value = false
}
</script>

<template>
  <section>
    <button
      v-tippy="{
        content: $t('components.addInitiativeModal.addHomebrew'),
        animation: 'shift-away',
        touch: false
      }"
      :aria-label="$t('components.addInitiativeModal.addHomebrew')"
      class="flex gap-2 items-center disabled:opacity-40 disabled:cursor-not-allowed"
      @click="isOpen = true"
    >
      <span class="md:hidden">
        {{ $t('components.addInitiativeModal.addHomebrew') }}
      </span>
      <Icon name="ph:beer-stein" class="text-warning w-10 h-10" />
    </button>
    <Modal v-if="isOpen" @close="closeModal">
      <h2>{{ $t('components.addHomebrew.newHomebrew') }}</h2>
      <FormKit
        id="form"
        v-model="form"
        type="form"
        :actions="false"
        @submit="addInitiative"
      >
        <FormKitSchema
          :data="form"
          :schema="useI18nForm(schema)"
        />
      </FormKit>
    </Modal>
  </section>
</template>
