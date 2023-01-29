<script setup>
import { rollD100, rollD20, rollD12, rollD10, rollD8, rollD6, rollD4 } from '@/util/rollDice'
import { useTimeout } from '@vueuse/core'

const { ready, start } = useTimeout(3000, { controls: true })

const rolled = ref()
const isOpen = ref(false)

function rollDice(dice) {
  rolled.value = { dice, result: generateDiceRoll(dice), max: +dice.replace('d', '') }
  start()
}

function generateDiceRoll(type, amount = 1) {
  switch (type) {
    case 'd100':
      return rollD100(amount)
    case 'd20':
      return rollD20(amount)
    case 'd12':
      return rollD12(amount)
    case 'd10':
      return rollD10(amount)
    case 'd8':
      return rollD8(amount)
    case 'd6':
      return rollD6(amount)
    case 'd4':
      return rollD4(amount)
  }
}
</script>

<template>
  <section>
    <transition
      enter-active-class="duration-300 ease-in-out"
      enter-from-class="opacity-0 -translate-x-full"
      enter-to-class="opacity-100"
      leave-active-class="duration-300 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 -translate-x-full"
    >
      <div
        v-if="rolled && !ready"
        class="bg-black border-4 rounded-xl py-2 px-6 w-fit absolute top-16 left-1/2 -translate-x-1/2"
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
          {{ rolled.dice.toUpperCase() }}
        </h3>
        <p class="flex gap-2">
          {{ $t('general.total') }}:
          <span class="font-bold">{{ rolled.result }}</span>
          <span v-if="rolled.max === rolled.result">🎉</span>
        </p>
      </div>
    </transition>
    <div class="flex gap-2 flex-wrap justify-center">
      <template v-for="dice in ['d100', 'd20', 'd12', 'd10', 'd8', 'd6', 'd4']" :key="dice">
        <button
          v-tippy="dice.toUpperCase()"
          class="bg-black tracker-shadow rounded-full p-2 border-4 w-14 h-14"
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
  </section>
</template>
