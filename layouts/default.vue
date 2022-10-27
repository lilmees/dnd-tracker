<template>
  <div class="flex flex-col min-h-screen max-h-screen">
    <Navbar />
    <main class="max-w-[1800px] mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-16 no-scrollbar overflow-y-auto grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>
