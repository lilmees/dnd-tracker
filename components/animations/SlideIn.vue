<template>
  <Transition
    enter-active-class="duration-300 ease-in-out"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-0 opacity-100"
    leave-active-class="duration-300 ease-in-out"
    leave-from-class="translate-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <slot />
  </Transition>
</template>
