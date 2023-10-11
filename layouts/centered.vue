<script setup lang="ts">
const localePath = useLocalePath()
const showNav = useState<boolean>('showNavigation', () => true)

const blob = ref<HTMLDivElement>()

onBeforeMount(() => { showNav.value = false })

if (process.client) {
  document.body.onmousemove = (event) => {
    if (blob.value) {
      const { clientX, clientY } = event

      blob.value.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
      }, { duration: 3000, fill: 'forwards' })
    }
  }
}
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <div
      ref="blob"
      class="hidden md:block -z-[1] h-[200px] w-[200px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full from-info to-secondary bg-gradient-to-r rotates blur-[100px]"
    />
    <div
      class="absolute inset-0 bg-transparent cursor-pointer"
      @click="navigateTo(localePath('/'))"
    />
    <div
      class="container absolute w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
    >
      <div class="abolsute inset-0 z-[-0] fancy-shadow" />
      <div
        class="bg-tracker/50 px-2 py-6 sm:p-8 rounded-lg relative border-4 border-tracker"
      >
        <NuxtLink :to="localePath('/')" class="group">
          <Icon
            name="ic:round-clear"
            class="w-8 h-8 text-danger cursor-pointer absolute right-4 top-4 rounded-full ring-danger group-focus-within:ring"
            aria-hidden="true"
          />
        </NuxtLink>
        <div class="px-4 sm:px-8">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
