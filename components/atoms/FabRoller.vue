<script setup>
import { rollD100, rollD20, rollD12, rollD10, rollD8, rollD6, rollD4 } from '@/util/rollDice'
import { useTimeout, useDraggable } from '@vueuse/core'

const { ready, start } = useTimeout(5000, { controls: true })

const amount = ref(1)
const roller = ref()
const rolled = ref()
const isOpen = ref(false)

const {style } = useDraggable(roller, {
  initialValue: { x: 0, y: 400 },
})

function rollDice(dice) {
  if (amount.value < 1 || amount.value > 50) amount.value = 1
  rolled.value = { 
    dice, 
    result: generateDiceRoll(dice), 
    max: +dice.replace('d', ''),
    amount: amount.value 
  }
  amount.value = 1
  start()
}

function generateDiceRoll(type) {
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
  <div>
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
        class="bg-black border-4 rounded-xl py-2 px-6 w-fit absolute bottom-20 left-1/2 -translate-x-1/2"
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
          <span v-for="(result, index) in rolled.result" >
            {{ index !== rolled.result.length - 1 ? `${result},` : result }}
          </span>
        </p>
      </section>
    </transition>
    <section
      v-click-outside="() => (isOpen = false)"
      ref="roller"
      class="fixed group min-w-[72px]"
      :style="style"
      @mouseenter="isOpen = true"
      >
      <div 
        class="bg-transparent duration-500 ease-in-out rounded-xl p-2"
        :class="{'bg-black tracker-shadow': isOpen}"
      >
        <template v-if="isOpen">
          <div
            v-tippy="{ content: $t('actions.drag'), animation: 'shift-away' }"
            class="bg-tracker text-center pb-[6px] rounded-full cursor-grab mb-2"
          >
            <span class="pointer-events-none">
              ...
            </span>
          </div>
          <div class="flex flex-col mb-2">
            <p class="body-extra-small">
              AMOUNT
            </p>
            <input 
              v-model="amount"
              type="number"
              min="1"
              max="50"
              class="border-none outline-none text-white body-small w-[48px] bg-transparent"
            />
          </div>
        </template>
        <button
          v-if="!isOpen"
          v-tippy="{ content: $t('actions.roll'), animation: 'shift-away' }"
          class="w-14 h-14 border-4 border-primary rounded-xl p-2 bg-black"
        >
          <NuxtImg
            src="/d20.webp"
            alt="D20"
            sizes="sm:40px md:40px lg:40px"
            class="w-full h-full object-contain pointer-events-none"
            format="webp"
            provider="imagekit"
          />
        </button>
        <div class="flex flex-col gap-1">
          <template 
            v-for="dice in ['d100', 'd20', 'd12', 'd10', 'd8', 'd6', 'd4']" 
            :key="dice"
          >
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
                v-tippy="{ content: dice.toUpperCase(), placement: 'left', animation: 'shift-away' }"
                class="bg-black tracker-shadow rounded-xl p-2 border-4 w-14 h-14 z-0"
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
                  class="w-full h-full object-contain"
                  format="webp"
                  provider="imagekit"
                />
              </button>
            </transition>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>