<template>
  <div class="space-y-4">
    <Encounters campaign-view />
    <NuxtLazyHydrate when-idle>
      <Homebrews class="py-10" />
      <Notes />
    </NuxtLazyHydrate>
  </div>
</template>
