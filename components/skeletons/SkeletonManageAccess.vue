<template>
  <section
    class="animate-pulse rounded-lg p-6 w-full border-4 border-tracker bg-tracker/50"
  >
    <div
      v-for="i in 5"
      :key="i"
      class="flex flex-col sm:flex-row gap-x-4 gap-y-2 sm:items-center sm:justify-between border-b border-slate-700 mb-2 pb-1 last:border-none last:mb-0 last:pb-0"
    >
      <div class="flex items-end gap-2">
        <div class="w-10 h-10 rounded-lg bg-background" />
        <div class="w-16 h-4 rounded-full bg-background sm:hidden" />
      </div>
      <div class="w-[200px] h-4 rounded-full bg-background hidden sm:block" />
      <div class="max-w-[300px] grow h-10 rounded-lg bg-background" />
      <div class="w-6 h-6 rounded-full bg-background" />
    </div>
  </section>
</template>
