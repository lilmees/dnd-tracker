<script setup>
import { Power3, gsap } from 'gsap'

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

onMounted(() => {
  const wrapper = document.querySelector('[data-wrapper]')
  const image = document.querySelector('[data-image]')
  const container = document.querySelector('[data-container]')
  const title = document.querySelector('[data-title]')
  const dragon = document.querySelector('[data-dragon]')

  gsap.from(wrapper, { duration: 1.5, scale: 1.5, x: '25vw', ease: Power3.easeOut})

  gsap.to(image, {
    scrollTrigger: {
      trigger: container,
      toggleActions: 'restart none none none',
      start: 'top 5%',
      end: 'bottom 0%',
      scrub: 2,
    },
    scale: 1.3,
  })

  gsap.from(title, { duration: 0.6, delay: 0.2, y: 100, opacity: 0, ease: Power3.easeOut})

  gsap.fromTo(dragon,
    { y: '100%', scale: 0.5, opacity: 0.5},
    { 
      scrollTrigger: {trigger: container, toggleActions: "restart none none none", scrub: 2},
      y: '-20%',
      scale: 1,
      opacity: 1
    }
  )
})
</script>

<template>
  <div data-container class="relative" @mousemove="calculateEyes">
    <div 
      data-wrapper
      class="w-full h-[90vh] lg:h-[70vh] md:h-[50vh] overflow-hidden rounded-lg blur-md pt-6 overflow-hidden"
    >
      <NuxtImg
        data-image
        src="/background.webp"
        alt="Background image"
        sizes="sm:500px md:1000px lg:1500px"
        class="w-full h-full object-cover"
        format="webp"
        provider="imagekit"
      />
    </div>
    <div class="absolute inset-0 flex flex-col md:flex-row justify-center items-center p-4 md:gap-x-20 container-max">
      <div class="flex flex-col items-start gap-4">
        <h1
          data-title
          class="mt-4 sm:mt-16 lg:mt-0 text-[3rem] lg:text-[4rem] leading-[3.5rem] lg:leading-[4rem] max-w-sm lg:max-w-lg uppercase text-center md:text-left"
        >
          {{ $t('home.start') }}
        </h1>
      </div>
      <div
        data-dragon
        class="max-w-[500px] relative"
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
