<script setup lang="ts">
withDefaults(
  defineProps<{ label?: string, routes?: Route[] }>(), {
    label: '',
    routes: () => []
  }
)

const localePath = useLocalePath()

const isOpen = ref<boolean>(false)
</script>

<template>
  <div v-click-outside="() => (isOpen = false)" class="relative">
    <button
      class="border-2 border-primary flex flex-row items-center px-4 py-3 cursor-pointer gap-x-2 group bg-black rounded-lg group"
      :class="{ 'rounded-b-none': isOpen }"
      @click="isOpen = !isOpen"
    >
      <span class="duration-200 font-bold text-slate-300 group-hover:text-white">
        {{ label }}
      </span>
      <Icon
        class="duration-200 ease-in-out w-6 h-6"
        :class="{ 'rotate-180': isOpen }"
        name="tabler:chevron-down"
      />
    </button>
    <div
      class="absolute z-[1] block w-max right-0"
      :class="{ 'invisible top-0': !isOpen }"
    >
      <div
        class="bg-black border-2 border-primary flex flex-col gap-y-3 p-5 pr-[30px] relative rounded-b-lg rounded-tl-lg box-border text-slate-300"
      >
        <NuxtLink
          v-for="route in routes"
          :key="route.label"
          :to="localePath(`/${route.url}`)"
          class="hover:text-white"
          active-class="active-link"
          @click="isOpen = false"
        >
          {{ $t(route.label) }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.active-link {
  @apply text-primary underline;
}
</style>
