<template>
  <article class="flex flex-col gap-4 rounded-lg border-4 border-black p-4 bg-black/30 animate-pulse">
    <div class="flex gap-x-4 flex-1">
      <div class="flex flex-col gap-y-1">
        <div class="w-10 h-14 rounded-lg bg-tracker" />
        <div class="w-10 h-14 rounded-lg bg-tracker" />
      </div>

      <div class="flex flex-col w-full flex-1 items-start justify-between gap-y-3">
        <div class="flex items-end gap-2">
          <div class="w-10 h-10 rounded-lg bg-tracker" />
          <div class="w-16 h-4 rounded-full bg-tracker" />
        </div>
        <div class="flex items-end gap-2">
          <div class="w-[200px] h-6 rounded-full bg-tracker" />
          <div class="w-10 h-3 rounded-full bg-tracker" />
        </div>
        <div class="w-full h-[100px] rounded-lg bg-tracker" />
      </div>
    </div>
  </article>
</template>
