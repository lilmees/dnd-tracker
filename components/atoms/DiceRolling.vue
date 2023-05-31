<script setup lang="ts">
const emit = defineEmits(['result'])
withDefaults(
  defineProps<{ result?: boolean }>(), {
    result: false
  }
)

const form: Ref<Dices> = ref({ d100: null, d20: null, d12: null, d10: null, d8: null, d6: null, d4: null })
const results: Ref<Dices> = ref({ d100: null, d20: null, d12: null, d10: null, d8: null, d6: null, d4: null })

function rollDice ({ __init, ...dices }: Obj): void {
  Object.keys(dices).forEach((dice) => {
    results.value[dice as keyof Dices] = !dices[dice]
      ? null
      : useDiceRoll(Number(dice.replace('d', '')), dices[dice])
  })
  if (Object.keys(results.value).length) {
    emit(
      'result',
      Object.values(results.value)
        .flat()
        .reduce((t, c) => t + c, 0)
    )
  }
}

function reset (): void {
  form.value = { d100: null, d20: null, d12: null, d10: null, d8: null, d6: null, d4: null }
  results.value = { d100: null, d20: null, d12: null, d10: null, d8: null, d6: null, d4: null }
}
</script>

<template>
  <div class="bg-primary/10 rounded-lg p-2" :class="{ 'mb-3': !result }">
    <FormKit v-model="form" type="form" :actions="false" @submit="rollDice">
      <div class="flex gap-2 flex-wrap sm:flex-nowrap">
        <div>
          <Input name="d100" type="number" label="D100" validation="between:1,20|number" />
          <template v-if="result && results.d100 && Array.isArray(results.d100)">
            <div class="flex flex-wrap gap-1">
              <p v-for="(amount, index) in results.d100" :key="amount">
                {{ results.d100.length === index + 1 ? amount : `${amount},` }}
              </p>
            </div>
            <p class="mb-3">
              <span class="font-bold"> {{ $t('general.total') }}:</span>
              {{ results.d100.reduce((s, a) => s + a, 0) }}
            </p>
          </template>
          <p v-else-if="result && results.d100">
            {{ results.d100 }}
          </p>
        </div>
        <div>
          <Input name="d20" type="number" label="D20" validation="between:1,20|number" />
          <template v-if="result && results.d20 && Array.isArray(results.d20)">
            <div class="flex flex-wrap gap-1">
              <p v-for="(amount, index) in results.d20" :key="amount">
                {{ results.d20.length === index + 1 ? amount : `${amount},` }}
              </p>
            </div>
            <p class="mb-3">
              <span class="font-bold">{{ $t('general.total') }}:</span>
              {{ results.d20.reduce((s, a) => s + a, 0) }}
            </p>
          </template>
          <p v-else-if="result && results.d20">
            {{ results.d20 }}
          </p>
        </div>
        <div>
          <Input name="d12" type="number" label="D12" validation="between:1,20|number" />
          <template v-if="result && results.d12 && Array.isArray(results.d12)">
            <div class="flex flex-wrap gap-1">
              <p v-for="(amount, index) in results.d12" :key="amount">
                {{ results.d12.length === index + 1 ? amount : `${amount},` }}
              </p>
            </div>
            <p class="mb-3">
              <span class="font-bold">{{ $t('general.total') }}:</span>
              {{ results.d12.reduce((s, a) => s + a, 0) }}
            </p>
          </template>
          <p v-else-if="result && results.d12">
            {{ results.d12 }}
          </p>
        </div>
        <div>
          <Input name="d10" type="number" label="D10" validation="between:1,20|number" />
          <template v-if="result && results.d10 && Array.isArray(results.d10)">
            <div class="flex flex-wrap gap-1">
              <p v-for="(amount, index) in results.d10" :key="amount">
                {{ results.d10.length === index + 1 ? amount : `${amount},` }}
              </p>
            </div>
            <p class="mb-3">
              <span class="font-bold">{{ $t('general.total') }}:</span>
              {{ results.d10.reduce((s, a) => s + a, 0) }}
            </p>
          </template>
          <p v-else-if="result && results.d10">
            {{ results.d10 }}
          </p>
        </div>
        <div>
          <Input name="d8" type="number" label="D8" validation="between:1,20|number" />
          <template v-if="result && results.d8 && Array.isArray(results.d8)">
            <div class="flex flex-wrap gap-1">
              <p v-for="(amount, index) in results.d100" :key="amount">
                {{ results.d8.length === Number(index + 1) ? amount : `${amount},` }}
              </p>
            </div>
            <p class="mb-3">
              <span class="font-bold">{{ $t('general.total') }}:</span>
              {{ results.d8.reduce((s, a) => s + a, 0) }}
            </p>
          </template>
          <p v-else-if="result && results.d8">
            {{ results.d8 }}
          </p>
        </div>
        <div>
          <Input name="d6" type="number" label="D6" validation="between:1,20|number" />
          <template v-if="result && results.d6 && Array.isArray(results.d6)">
            <div class="flex flex-wrap gap-1">
              <p v-for="(amount, index) in results.d6" :key="amount">
                {{ results.d6.length === index + 1 ? amount : `${amount},` }}
              </p>
            </div>
            <p class="mb-3">
              <span class="font-bold">{{ $t('general.total') }}:</span>
              {{ results.d6.reduce((s, a) => s + a, 0) }}
            </p>
          </template>
          <p v-else-if="result && results.d6">
            {{ results.d6 }}
          </p>
        </div>
        <div>
          <Input name="d4" type="number" label="D4" validation="between:1,20|number" />
          <template v-if="result && results.d4 && Array.isArray(results.d4)">
            <div class="flex flex-wrap gap-1">
              <p v-for="(amount, index) in results.d4" :key="amount">
                {{ results.d4.length === index + 1 ? amount : `${amount},` }}
              </p>
            </div>
            <p class="mb-3">
              <span class="font-bold">{{ $t('general.total') }}:</span>
              {{ results.d4.reduce((s, a) => s + a, 0) }}
            </p>
          </template>
          <p v-else-if="result && results.d4">
            {{ results.d4 }}
          </p>
        </div>
      </div>
      <h3
        v-if="
          result &&
            Object.values(results)
              .flat()
              .reduce((s, a) => s + a, 0) > 0
        "
        class="font-bold mb-3"
      >
        {{ $t('general.grandTotal') }}
        {{
          Object.values(results)
            .flat()
            .reduce((s, a) => s + a, 0)
        }}
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          type="submit"
          class="btn-black grow"
          :aria-label="$t('actions.roll')"
        >
          {{ $t('actions.roll') }}
        </button>
        <button
          v-if="result"
          type="submit"
          class="btn-danger grow"
          :aria-label="$t('actions.reset')"
          @click="reset"
        >
          {{ $t('actions.reset') }}
        </button>
      </div>
    </FormKit>
  </div>
</template>
