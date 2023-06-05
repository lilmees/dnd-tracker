<script setup lang="ts">
import { useTimeout, useDraggable, useWindowSize } from '@vueuse/core'

const props = withDefaults(defineProps<{ sandbox: boolean }>(), {
  sandbox: false
})

const { ready, start } = useTimeout(5000, { controls: true })
const { width } = useWindowSize()

const amount = ref<number>(1)
const roller = ref<HTMLElement>()
const isOpen = ref<boolean>(false)
const isShown = ref<boolean>(false)
const rolled = ref<Rolled>()

const xAxis = computed<number>(() => width.value - (props.sandbox ? 150 : 75))
const { style, x } = useDraggable(roller, { initialValue: { x: xAxis.value, y: 400 } })

// watch if the window resizes and update the fabroller x axis
watch(() => xAxis.value, (v: number) => { x.value = v })

function toggleFab (): void {
  isShown.value = !isShown.value
  isOpen.value = false
}

function rollDice (dice: string): void {
  if (amount.value < 1 || amount.value > 50) {
    amount.value = 1
  }
  rolled.value = {
    dice,
    result: useDiceRoll(+dice.replace('d', ''), amount.value),
    max: +dice.replace('d', ''),
    amount: amount.value
  }
  amount.value = 1
  start()
}
</script>

<template>
  <ClientOnly>
    <div>
      <button
        v-tippy="{
          content: $t(isShown ? 'actions.rollHide' : 'actions.rollShow'),
          animation: 'shift-away',
          touch: false
        }"
        :aria-label=" $t(isShown ? 'actions.rollHide' : 'actions.rollShow')"
        class="flex gap-2 items-center disabled:opacity-40 disabled:cursor-not-allowed"
        @click="toggleFab"
      >
        <span class="md:hidden">
          {{ $t(isShown ? 'actions.rollHide' : 'actions.rollShow') }}
        </span>
        <Icon name="iconoir:hexagon-dice" class="text-secondary w-10 h-10" />
      </button>
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
          class="bg-black border-4 rounded-lg py-2 px-6 w-fit absolute bottom-20 left-1/2 -translate-x-1/2"
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
      <transition
        enter-active-class="duration-300 ease-in-out"
        enter-from-class="scale-0"
        enter-to-class="scale-100"
        leave-active-class="duration-300 ease-out-out"
        leave-from-class="scale-100"
        leave-to-class="scale-0"
      >
        <section
          v-if="isShown"
          ref="roller"
          v-click-outside="() => (isOpen = false)"
          class="fixed z-10 group min-w-[72px]"
          :style="style"
          @mouseenter="isOpen = true"
        >
          <div
            class="bg-transparent duration-500 ease-in-out rounded-lg p-2"
            :class="{'!bg-black tracker-shadow': isOpen}"
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
                >
              </div>
            </template>
            <button
              v-if="!isOpen"
              v-tippy="{ content: $t('actions.roll'), animation: 'shift-away' }"
              class="w-14 h-14 border-4 border-secondary rounded-lg p-2 bg-black"
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
                    class="bg-black tracker-shadow rounded-lg p-2 border-4 w-14 h-14 z-0"
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
      </transition>
    </div>
  </ClientOnly>
</template>
