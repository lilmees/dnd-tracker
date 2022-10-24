<script setup>
import { useAuthStore } from '@/store/auth'

const store = useAuthStore()
</script>

<template>
  <NuxtLayout>
    <Button @click="store.logout()">logout</Button>
  </NuxtLayout>
</template>
