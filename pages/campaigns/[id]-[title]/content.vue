<template>
  <div class="space-y-4">
    <Encounters campaign-view />
    <NuxtLazyHydrate when-visible>
      <Homebrews class="py-10" />
    </NuxtLazyHydrate>
    <NuxtLazyHydrate when-visible>
      <Notes />
    </NuxtLazyHydrate>
  </div>
</template>
