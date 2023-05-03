<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main
      class="max-w-[3000px] mx-auto w-full px-4 no-scrollbar overflow-y-auto grow flex flex-col"
    >
      <slot />
    </main>
    <Footer />
  </div>
</template>
