<template>
  <div class="bg-black rounded-xl p-4 flex justify-between items-center gap-4 tracker-shadow m-2">
    <NuxtLink to="/" class="flex gap-4 items-center">
      <img  src="@/assets/images/icon.webp" alt="Logo dnd tracker" class="w-10"/>
      <h2>DND-TRACKER</h2>
    </NuxtLink>
    <p class="text-primary body-small">©{{ new Date().getFullYear() }} dnd-tracker</p>
  </div>
</template>