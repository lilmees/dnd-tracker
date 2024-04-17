<template>
  <Transition
    name="expand"
    @enter="start"
    @after-enter="end"
    @before-leave="start"
    @after-leave="end"
  >
    <slot />
  </Transition>
</template>

<style scoped>
 .expand-leave-active, .expand-enter-active {
    @apply duration-300 transition-all overflow-hidden;
  }

  .expand-leave-to, .expand-enter-from {
    @apply !h-0 opacity-0;
  }
</style>
