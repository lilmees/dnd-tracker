<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="dnd-container no-scrollbar overflow-y-auto grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>
