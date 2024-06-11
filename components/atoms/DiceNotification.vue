<script setup lang="ts">
const rolled = useState<Rolled | null>('rolled', () => null)

const timeout = 5000

let timer: any = null
const remaining = ref<number>(timeout)

const progressStyle = computed(() => {
  const remainingPercent = remaining.value / timeout * 100
  return { width: `${remainingPercent || 0}%` }
})

watch(() => rolled.value, (v) => {
  if (v) {
    onClose()
    startTimer()
  }
}, { immediate: true })

function startTimer(): void {
  timer = useTimer(() => onClose(), timeout)
  watchEffect(() => {
    remaining.value = timer.remaining.value
    if (timer.remaining.value === 0) {
      rolled.value = null
    }
  })
}

function onMouseover(): void {
  if (timer) {
    timer.pause()
  }
}

function onMouseleave(): void {
  if (timer) {
    timer.resume()
  }
}

function onClose(): void {
  if (timer) {
    timer.stop()
  }
}

onUnmounted(() => onClose())
</script>

<template>
  <Scale>
    <section
      v-if="rolled"
      class="backdrop-blur border-4 rounded-lg overflow-hidden w-full max-w-lg fixed bottom-5 z-[1] left-1/2 -translate-x-1/2"
      :class="{
        'border-secondary bg-secondary/50': rolled.dice === 'd100',
        'border-primary bg-primary/50': rolled.dice === 'd20',
        'border-warning bg-warning/50': rolled.dice === 'd12',
        'border-info bg-info/50': rolled.dice === 'd10',
        'border-danger bg-danger/50': rolled.dice === 'd8',
        'border-help bg-help/50': rolled.dice === 'd6',
        'border-success bg-success/50': rolled.dice === 'd4',
      }"
      @mouseover="onMouseover"
      @mouseleave="onMouseleave"
    >
      <div class="py-4 px-6 space-y-2">
        <h3>
          {{
            rolled.amount > 1
              ? `${rolled.dice.toUpperCase()} x${rolled.amount}`
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
          <span v-if="rolled.result === 1">😿</span>
        </p>
        <p
          v-if="Array.isArray(rolled.result)"
          class="flex flex-wrap gap-1 text-slate-300 body-small"
        >
          <span
            v-for="(result, index) in rolled.result"
            :key="result"
          >
            {{ index !== rolled.result.length - 1 ? `${result},` : result }}
          </span>
        </p>
      </div>
      <div class="h-2 w-full">
        <div
          class="h-full ease-in-out"
          :style="progressStyle"
          :class="{
            'bg-secondary': rolled.dice === 'd100',
            'bg-primary': rolled.dice === 'd20',
            'bg-warning': rolled.dice === 'd12',
            'bg-info': rolled.dice === 'd10',
            'bg-danger': rolled.dice === 'd8',
            'bg-help': rolled.dice === 'd6',
            'bg-success': rolled.dice === 'd4',
          }"
        />
      </div>
    </section>
  </Scale>
</template>
