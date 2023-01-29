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
  <div>
    <transition
      enter-active-class="duration-300 ease-in-out"
      enter-from-class="opacity-0 -translate-x-full"
      enter-to-class="opacity-100"
      leave-active-class="duration-300 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 -translate-x-full"
    >
      <section
        v-if="rolled && !ready"
        class="bg-black border-4 rounded-xl py-2 px-6 w-fit absolute top-1/2 right-16 -translate-y-1/2"
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
      </section>
    </transition>
    <section class="absolute top-1/2 right-1 -translate-y-1/2" @mouseenter="isOpen = true" @mouseleave="isOpen = false">
      <transition
        enter-active-class="duration-300 ease-in-out"
        enter-from-class="opacity-0 -translate-y-full"
        enter-to-class="opacity-100"
        leave-active-class="duration-300 ease-in-out"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 -translate-y-full"
      >
        <button
          v-if="isOpen"
          v-tippy="{ content: 'D100', placement: 'left' }"
          class="bg-black tracker-shadow rounded-full p-2 border-4 border-secondary w-14 h-14 absolute top-[3.5rem]"
          @click="rollDice('d100')"
        >
          <NuxtImg src="/d100.webp" alt="D100" sizes="sm:40px md:40px lg:40px" class="w-full h-full object-contain" />
        </button>
      </transition>
      <button
        v-tippy="{ content: 'D20', placement: 'left' }"
        class="bg-black tracker-shadow rounded-full p-2 border-4 border-primary w-14 h-14 z-[1]"
        @click="rollDice('d20')"
      >
        <NuxtImg src="/d20.webp" alt="D20" sizes="sm:40px md:40px lg:40px" class="w-full h-full object-contain" />
      </button>
      <div class="flex flex-col-reverse absolute bottom-[3.5rem]">
        <template v-for="dice in ['d12', 'd10', 'd8', 'd6', 'd4']" :key="dice">
          <transition
            enter-active-class="duration-300 ease-in-out"
            enter-from-class="opacity-0 translate-y-full"
            enter-to-class="opacity-100"
            leave-active-class="duration-300 ease-in-out"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0 translate-y-full"
          >
            <button
              v-if="isOpen"
              v-tippy="{ content: dice.toUpperCase(), placement: 'left' }"
              class="bg-black tracker-shadow rounded-full p-2 border-4 w-14 h-14 z-0"
              :class="{
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
                class="w-full h-full object-contain"
              />
            </button>
          </transition>
        </template>
      </div>
    </section>
  </div>
</template>
