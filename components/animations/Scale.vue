<template>
  <Transition
    enter-active-class="duration-300 ease-in-out"
    enter-from-class="scale-0"
    enter-to-class="scale-100"
    leave-active-class="duration-300 ease-in-out"
    leave-from-class="scale-100"
    leave-to-class="scale-0"
  >
    <slot />
  </Transition>
</template>
