<script setup>
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n({ useScope: 'global' })
const cookieLang = useCookie('lang')
const localeLang = computed(() => cookieLang.value || locale.value)
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

// set the language when mounted if there's a cookie for it
onMounted(() => {
  if (cookieLang.value) locale.value = cookieLang.value
  else locale.value = router.currentRoute.value.fullPath.includes('/en') ? 'en' : 'nl'
})

watch(
  () => router.currentRoute.value.fullPath,
  v => (locale.value = v.includes('/en') ? 'en' : 'nl')
)

function setLang(lang) {
  cookieLang.value = lang
  locale.value = lang
}
</script>

<template>
  <div class="flex gap-1">
    <NuxtLink
      v-for="(lang, index) in availableLocales"
      :key="lang"
      :to="switchLocalePath(lang)"
      class="uppercase flex gap-1"
    >
      <p v-if="index > 0 && index < availableLocales.length">|</p>
      <p
        class="text-slate-300 hover:text-white duration-200 ease-in-out cursor-pointer"
        :class="{ '!text-primary': localeLang === lang }"
        @click="setLang(lang)"
      >
        {{ lang }}
      </p>
    </NuxtLink>
  </div>
</template>
