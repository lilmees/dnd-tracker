<template>
  <div class="space-y-4">
    <Encounters campaign-view />
    <NuxtLazyHydrate when-visible>
      <Homebrews class="py-10" />
      <Notes />
    </NuxtLazyHydrate>
  </div>
</template>
