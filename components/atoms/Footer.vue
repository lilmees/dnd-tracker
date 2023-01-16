<template>
  <div class="bg-black rounded-xl p-4 flex justify-between items-center gap-4 tracker-shadow m-2">
    <NuxtLink to="/" class="flex gap-4 items-center">
      <NuxtImg
        src="/images/icon.webp"
        alt="Logo dnd tracker"
        sizes="sm:40px md:40px lg:40px"
        format="webp"
        class="w-10"
      />
      <h2>DND-TRACKER</h2>
    </NuxtLink>
    <p class="text-primary body-small">©{{ new Date().getFullYear() }} dnd-tracker</p>
  </div>
</template>
