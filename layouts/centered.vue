<template>
  <div class="w-screen min-h-screen">
    <div class="container absolute w-full max-w-xl -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
      <div class="bg-tracker tracker-shadow-pulse px-2 py-6 sm:p-8 rounded">
        <slot />
      </div>
    </div>
  </div>
</template>
