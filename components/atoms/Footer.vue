<template>
  <div class="bg-black rounded-xl p-4 flex justify-between items-center gap-4 tracker-shadow m-2">
    <NuxtLink to="/" class="max-w-[200px]">
      <img src="@/assets/images/logo.png" alt="Logo dnd tracker" />
    </NuxtLink>
    <p class="text-primary body-small">©{{ new Date().getFullYear() }} dnd-tracker</p>
  </div>
</template>
