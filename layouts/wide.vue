<template>
  <div class="flex flex-col min-h-screen max-h-screen">
    <Navbar />
    <main class="px-4 no-scrollbar overflow-y-auto grow flex flex-col">
      <slot />
    </main>
    <Footer />
  </div>
</template>
