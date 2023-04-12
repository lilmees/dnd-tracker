<script setup>
import { useTimeout } from '@vueuse/core'
import { rollD100, rollD20, rollD12, rollD10, rollD8, rollD6, rollD4 } from '@/util/rollDice'

const { ready, start } = useTimeout(5000, { controls: true })

const amount = ref(1)
const rolled = ref()

function rollDice (dice) {
  if (amount.value < 1 || amount.value > 50) {
    amount.value = 1
  }
  rolled.value = {
    dice,
    result: generateDiceRoll(dice),
    max: +dice.replace('d', ''),
    amount: amount.value
  }
  amount.value = 1
  start()
}

function generateDiceRoll (type) {
  switch (type) {
    case 'd100':
      return rollD100(amount.value)
    case 'd20':
      return rollD20(amount.value)
    case 'd12':
      return rollD12(amount.value)
    case 'd10':
      return rollD10(amount.value)
    case 'd8':
      return rollD8(amount.value)
    case 'd6':
      return rollD6(amount.value)
    case 'd4':
      return rollD4(amount.value)
  }
}
</script>

<template>
  <section>
    <h2 class="pb-4">
      {{ $t('home.diceRoller.title') }}
    </h2>
    <p class="pb-10">
      {{ $t('home.diceRoller.text') }}
    </p>
    <div class="flex gap-1 mb-4">
      <p>
        {{ $t('inputs.amountLabel') }}:
      </p>
      <input
        v-model="amount"
        type="number"
        min="1"
        max="50"
        class="outline-none text-white font-bold w-10 bg-transparent border-b border-slate-400"
      >
    </div>
    <div class="flex gap-2 flex-wrap">
      <template v-for="dice in ['d100', 'd20', 'd12', 'd10', 'd8', 'd6', 'd4']" :key="dice">
        <button
          v-tippy="{content: dice.toUpperCase(), placement: 'bottom', animation: 'shift-away'}"
          class="bg-black tracker-shadow rounded-xl p-2 border-4 w-14 h-14"
          :class="{
            'border-secondary': dice === 'd100',
            'border-primary': dice === 'd20',
            'border-warning': dice === 'd12',
            'border-info': dice === 'd10',
            'border-danger': dice === 'd8',
            'border-help': dice === 'd6',
            'border-success': dice === 'd4',
          }"
          @click="rollDice(dice)"
        >
          <NuxtImg
            :src="`/${dice}.webp`"
            :alt="dice.toUpperCase()"
            sizes="sm:40px md:40px lg:40px"
            format="webp"
            provider="imagekit"
            class="w-full h-full object-contain"
          />
        </button>
      </template>
    </div>
    <transition
      enter-active-class="duration-300 ease-in-out"
      enter-from-class="scale-0"
      enter-to-class="scale-100"
      leave-active-class="duration-300 ease-in-out"
      leave-from-class="scale-100"
      leave-to-class="scale-0"
    >
      <section
        v-if="rolled && !ready"
        class="bg-black border-4 rounded-xl py-2 px-6 w-fit mt-4"
        :class="{
          'border-secondary': rolled.dice === 'd100',
          'border-primary': rolled.dice === 'd20',
          'border-warning': rolled.dice === 'd12',
          'border-info': rolled.dice === 'd10',
          'border-danger': rolled.dice === 'd8',
          'border-help': rolled.dice === 'd6',
          'border-success': rolled.dice === 'd4',
        }"
      >
        <h3 class="text-center">
          {{
            rolled.amount > 1
              ? `${rolled.amount}x ${rolled.dice.toUpperCase()}`
              : rolled.dice.toUpperCase()
          }}
        </h3>
        <p class="flex gap-2">
          {{ $t('general.total') }}:
          <span class="font-bold">
            {{
              Array.isArray(rolled.result)
                ? rolled.result.reduce((sum, a) => sum + a, 0)
                : rolled.result
            }}
          </span>
          <span v-if="rolled.max === rolled.result">🎉</span>
        </p>
        <p
          v-if="Array.isArray(rolled.result)"
          class="flex flex-wrap gap-1 max-w-[350px]"
        >
          <span
            v-for="(result, index) in rolled.result"
            :key="result"
          >
            {{ index !== rolled.result.length - 1 ? `${result},` : result }}
          </span>
        </p>
      </section>
    </transition>
  </section>
</template>
