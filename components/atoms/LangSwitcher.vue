<script setup>
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="flex gap-1">
    <div v-for="(lang, index) in availableLocales" :key="lang" class="uppercase flex gap-1">
      <p v-if="index > 0 && index < availableLocales.length">|</p>
      <p
        class="text-slate-300 hover:text-white duration-200 ease-in-out cursor-pointer"
        :class="{ '!text-primary': locale === lang }"
        @click="locale = lang"
      >
        {{ lang }}
      </p>
    </div>
  </div>
</template>
