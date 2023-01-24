<script setup>
const anchor = ref()
const eyeLeft = ref()
const eyeRight = ref()

function calculateEyes(e) {
  const mouseX = e.clientX
  const mouseY = e.clientY
  const rekt = anchor.value.getBoundingClientRect()
  const anchorX = rekt.left + rekt.width / 2
  const anchorY = rekt.top + rekt.height / 2
  const angleDeg = angle(mouseX, mouseY, anchorX, anchorY)
  eyeLeft.value.style.transform = `rotate(${90 + angleDeg}deg)`
  eyeRight.value.style.transform = `rotate(${90 + angleDeg}deg)`
}

function angle(cx, cy, ex, ey) {
  return (Math.atan2(ey - cy, ex - cx) * 180) / Math.PI
}
</script>

<template>
  <div class="relative" @mousemove="calculateEyes">
    <div class="w-full h-[80vh] lg:h-[70vh] md:h-[50vh] overflow-hidden rounded-lg blur-md pt-6">
      <NuxtImg
        src="/images/background.webp"
        alt="Hero image"
        sizes="sm:100vw md:100vw lg:100vw"
        format="webp"
        class="w-full h-full object-cover"
      />
    </div>
    <div class="absolute inset-0 flex flex-wrap justify-center items-center p-4 gap-x-20 container-max">
      <div class="flex flex-col items-start gap-4">
        <h1
          v-motion-slide-bottom
          class="mt-4 sm:mt-16 lg:mt-0 text-[3rem] lg:text-[4rem] leading-[3.5rem] lg:leading-[4rem] max-w-sm lg:max-w-lg uppercase"
        >
          {{ $t('home.start') }}
        </h1>
      </div>
      <div
        v-motion
        :initial="{ y: 10 }"
        :enter="{ y: 0, transition: { repeat: Infinity, repeatType: 'mirror', duration: 1500 } }"
        class="max-w-[500px] relative"
      >
        <div ref="eyeLeft" class="absolute top-[55%] left-[55%] pt-1 sm:pt-2">
          <div class="rounded-full bg-black h-2 w-2 sm:h-4 sm:w-4" />
        </div>
        <div ref="eyeRight" class="absolute top-[54%] right-[60%] pt-1 sm:pt-2">
          <div class="rounded-full bg-black h-2 w-2 sm:h-4 sm:w-4" />
        </div>
        <div ref="anchor">
          <NuxtImg
            src="/images/draakje.webp"
            alt="Hero image"
            sizes="sm:500px md:500px lg:500px"
            format="webp"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>
