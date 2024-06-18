<script setup type="ts">
import { Power2, Power3, gsap } from 'gsap'

const scrollOptions = { trigger: '[data-hero]', toggleActions: 'restart none none none' }
const toOptions = { ease: Power2.easeOut, opacity: 1, marginTop: 0 }
const animations = [
  { element: '[data-hero-d12]', scrub: 2, y: '-100%' },
  { element: '[data-hero-d10]', scrub: 3, y: '-100%' },
  { element: '[data-hero-d4]', scrub: 4, y: '-150%' },
  { element: '[data-hero-d20]', scrub: 1, y: '-150%' },
  { element: '[data-hero-d8]', scrub: 3, y: '-100%' },
  { element: '[data-hero-d6]', scrub: 5, y: '-50%' },
]

onMounted(() => {
  nextTick()

  // intro
  gsap.timeline()
    .fromTo('[data-hero-title]',
      { opacity: 0, y: 100 },
      { duration: 0.6, delay: 0.4, y: 0, opacity: 1, ease: Power3.easeOut },
    )
    .fromTo('[data-hero-d12]',
      { opacity: 0, marginTop: 150 },
      { ...toOptions, duration: 1.3 },
      '-=0.5',
    )
    .fromTo('[data-hero-d10]',
      { opacity: 0, marginTop: 100 },
      { ...toOptions, duration: 1 },
      '-=1.3',
    )
    .fromTo('[data-hero-d4]',
      { marginTop: 100, opacity: 0 },
      { ...toOptions, duration: 1.1 },
      '-=1.1',
    )
    .fromTo('[data-hero-d20]',
      { opacity: 0, marginTop: 200 },
      { ...toOptions, duration: 0.95 },
      '-=0.95',
    )
    .fromTo('[data-hero-d8]',
      { opacity: 0, marginTop: 100 },
      { ...toOptions, duration: 1.2 },
      '-=1.2',
    )
    .fromTo('[data-hero-d6]',
      { opacity: 0, marginTop: 150 },
      { ...toOptions, duration: 1.25 },
      '-=1',
    )

  // Parallax

  animations.forEach(({ element, scrub, y }) => {
    gsap.fromTo(
      element,
      { y: '0%' },
      { scrollTrigger: { ...scrollOptions, scrub }, y },
    )
  })
})
</script>

<template>
  <section class="w-full py-16 md:py-48 mt-[15rem] no-scrollbar overflow-x-clip">
    <div
      class="flex justify-center items-center relative mx-auto md:max-w-[78vw]"
      data-hero
    >
      <h1
        data-hero-title
        class="z-[3] mx-auto text-[60px] leading-[60px] md:text-[100px] md:leading-[100px] lg:text-[120px] lg:leading-[120px] text-center max-w-md md:max-w-[1032px] opacity-0"
      >
        {{ $t('components.hero.start') }}
        <div class="fancy-shadow" />
      </h1>
      <div class="absolute left-0 right-0 bottom-0 top-1/4 md:top-1/2 max-w-2xl mx-auto">
        <NuxtImg
          data-hero-d12
          src="/pixel-d12.png"
          alt="D12"
          class="absolute w-[70px] md:w-[100px] -top-[8%] lg:-top-[15%] left-[0%] md:-left-[30%] min-[1260px]:-left-[40%] z-[4] opacity-0"
          sizes="70px md:100px"
          provider="imagekit"
          format="webp"
        />
        <NuxtImg
          data-hero-d10
          src="/pixel-d10.png"
          alt="D10"
          class="absolute w-[50px] md:w-[100px] top-[160%] md:top-[250%] lg:top-[130%] left-[15%] md:left-[4%] lg:-left-[10%] z-[1] opacity-0"
          sizes="50px md:100px"
          format="webp"
          provider="imagekit"
        />
        <NuxtImg
          data-hero-d4
          src="/pixel-d4.png"
          alt="D4"
          class="absolute w-[54px] md:w-[8Opx] top-[200%] md:top-[280%] lg:top-[200%] left-[72%] md:left-[83%] lg:left-[86%] z-[2] opacity-0"
          sizes="54px md:80px"
          format="webp"
          provider="imagekit"
        />
        <NuxtImg
          data-hero-d20
          src="/pixel-d20.png"
          alt="D20"
          sizes="sm:100px md:130px"
          format="webp"
          provider="imagekit"
          class="absolute w-[100px] md:w-[130px] top-[65%] md:top-[50%] left-[85%] md:left-[110%] min-[1260px]:left-[130%] z-[4] opacity-0"
        />
        <NuxtImg
          data-hero-d8
          src="/pixel-d8.png"
          alt="D8"
          sizes="50px md:80px"
          format="webp"
          provider="imagekit"
          class="absolute w-[50px] md:w-[80px] -top-[60%] md:-top-[130%] left-[62%]  md:left-[70%] z-[4] opacity-0"
        />
        <NuxtImg
          data-hero-d6
          src="/pixel-d6.png"
          alt="D6"
          sizes="60px md:90px"
          format="webp"
          provider="imagekit"
          class="absolute w-[60px] md:w-[90px] -top-[120%] md:-top-[280%] lg:-top-[230%] left-[30%] md:left-[20%] z-[4] opacity-0"
        />
      </div>
    </div>
  </section>
</template>
