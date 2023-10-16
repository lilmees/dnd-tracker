<script setup lang="ts">
const rolled = useState<Rolled | null>('rolled', () => null)

const amount = ref<number>(1)
const isOpen = ref<boolean>(false)

function rollDice (dice: string): void {
  if (amount.value < 1 || amount.value > 50) {
    amount.value = 1
  }

  rolled.value = {
    id: Date.now(),
    dice,
    result: useDiceRoll(+dice.replace('d', ''), amount.value),
    max: +dice.replace('d', ''),
    amount: amount.value
  }

  amount.value = 1
}
</script>

<template>
  <ClientOnly>
    <div
      class="relative"
      @mouseenter="isOpen = true"
      @mouseleave="isOpen = false"
    >
      <button
        :aria-label="$t('actions.roll')"
        class="flex gap-2 items-center"
      >
        <span class="md:hidden">
          {{ $t('actions.roll') }}
        </span>
        <Icon
          name="iconoir:hexagon-dice"
          class="text-secondary w-10 h-10"
          aria-hidden="true"
        />
      </button>
      <transition
        enter-active-class="duration-300 ease-in-out"
        enter-from-class="translate-y-[150px] scale-y-0"
        enter-to-class="translate-y-0 scale-y-100"
        leave-active-class="duration-200 ease-in-out"
        leave-from-class="scale-100"
        leave-to-class="scale-0"
      >
        <section
          v-if="isOpen"
          class="absolute bottom-0 right-0 z-10"
        >
          <div class="bg-black border-4 border-primary rounded-lg p-2">
            <div class="flex flex-col gap-1">
              <template
                v-for="dice in ['d100', 'd20', 'd12', 'd10', 'd8', 'd6', 'd4']"
                :key="dice"
              >
                <button
                  v-tippy="{
                    content: dice.toUpperCase(),
                    placement: 'left',

                  }"
                  class="bg-black rounded-lg p-2 border-2 w-10 h-10 z-0"
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
              </template>
            </div>
            <div class="flex flex-col pt-2">
              <label for="amount" class="body-extra-small">
                AMOUNT
              </label>
              <input
                id="amount"
                v-model="amount"
                name="Amount"
                type="number"
                min="1"
                max="50"
                class="border-none outline-none text-white body-small w-[40px] bg-transparent"
              >
            </div>
          </div>
        </section>
      </transition>
    </div>
  </ClientOnly>
</template>
