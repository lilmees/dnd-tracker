<template>
  <div class="flex flex-col min-h-screen">
    <Navbar class="absolute z-10 left-0 right-0 backdrop-blur-2xl" />
    <main
      class="max-w-[3000px] mx-auto w-full px-4 no-scrollbar overflow-y-auto grow flex flex-col"
    >
      <slot />
    </main>
    <Footer />
  </div>
</template>
