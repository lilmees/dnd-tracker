<script setup lang="ts">
const anchor = ref<HTMLElement>()
const eyeLeft = ref<HTMLElement>()
const eyeRight = ref<HTMLElement>()

function calculateEyes (e: MouseEvent) {
  if (!anchor.value || !eyeLeft.value || !eyeRight.value) {
    return
  }
  const mouseX = e.clientX
  const mouseY = e.clientY
  const rekt = anchor.value.getBoundingClientRect()
  const anchorX = rekt.left + rekt.width / 2
  const anchorY = rekt.top + rekt.height / 2
  const angleDeg = angle(mouseX, mouseY, anchorX, anchorY)
  eyeLeft.value.style.transform = `rotate(${90 + angleDeg}deg)`
  eyeRight.value.style.transform = `rotate(${90 + angleDeg}deg)`
}

function angle (cx: number, cy: number, ex: number, ey: number): number {
  return (Math.atan2(ey - cy, ex - cx) * 180) / Math.PI
}
</script>

<template>
  <div class="relative" @mousemove="calculateEyes">
    <div
      class="w-full h-screen md:h-[80vh] md:min-h-[800px] rounded-lg blur-md pt-6 overflow-hidden"
    >
      <NuxtImg
        data-aos="zoom-out"
        :data-aos-duration="1000"
        :data-aos-mirror="true"
        src="/background.webp"
        alt="Background image"
        sizes="sm:500px md:1000px lg:1500px"
        class="w-full h-full object-cover scale-150 !opacity-100"
        format="webp"
        provider="imagekit"
      />
    </div>
    <div class="absolute inset-0 flex flex-col md:flex-row justify-center items-center p-4 md:gap-x-20 container-max">
      <div class="flex flex-col items-start gap-4">
        <h1
          data-aos="zoom-in-up"
          :data-aos-duration="300"
          :data-aos-mirror="true"
          class="mt-20 lg:mt-0 text-[3rem] lg:text-[4rem] leading-[3.5rem] lg:leading-[4rem] max-w-sm lg:max-w-lg uppercase text-center md:text-left opacity-0"
        >
          {{ $t('components.hero.start') }}
        </h1>
      </div>
      <div
        data-aos="zoom-in-up"
        :data-aos-duration="700"
        :data-aos-mirror="true"
        data-dragon
        class="max-w-[500px] relative opacity-0"
      >
        <div ref="eyeLeft" class="absolute top-[55%] left-[54%] pt-1 sm:pt-2">
          <div class="rounded-full bg-black h-2 w-2 sm:h-4 sm:w-4" />
        </div>
        <div ref="eyeRight" class="absolute top-[55%] right-[61%] pt-1 sm:pt-2">
          <div class="rounded-full bg-black h-2 w-2 sm:h-4 sm:w-4" />
        </div>
        <div ref="anchor">
          <NuxtImg
            src="/dragon.webp"
            alt="Hero image"
            sizes="sm:500px md:500px lg:500px"
            class="w-full h-full object-cover"
            format="webp"
            provider="imagekit"
          />
        </div>
      </div>
    </div>
  </div>
</template>
