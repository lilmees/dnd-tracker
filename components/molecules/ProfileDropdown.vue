<script setup lang="ts">
defineExpose({ close })
defineEmits(['logout'])
defineProps<{ routes: Route[] }>()

const profile = useProfileStore()
const user = useSupabaseUser()

const isOpen = ref<boolean>(false)

onKeyStroke('Escape', () => close())

onBeforeMount(() => profile.fetch())

function close(): void {
  isOpen.value = false
}
</script>

<template>
  <div
    v-click-outside="() => (isOpen = false)"
    class="relative"
  >
    <button
      class="border-4 border-secondary bg-secondary/50 rounded-lg shadow shadow-primary hover:tracker-shadow-pulse cursor-pointer transition-all duration-200 ease-in-out"
      :class="{ 'rounded-b-none !bg-secondary/80': isOpen }"
      @click="isOpen = !isOpen"
    >
      <ClientOnly>
        <NuxtImg
          v-if="profile.data?.avatar"
          :src="profile.data.avatar"
          alt="Avatar image"
          sizes="sm:40px md:40px lg:40px"
          class="w-12 -scale-x-100"
          format="webp"
        />
        <NuxtImg
          v-else
          src="/pixel-d20.png"
          alt="D20 dice"
          sizes="sm:40px md:40px lg:40px"
          class="w-10 m-[6px]"
          format="webp"
          provider="imagekit"
        />
      </ClientOnly>
    </button>
    <Expand>
      <div
        v-if="isOpen"
        class="absolute z-[1] block w-max right-0 top-[55px]"
      >
        <div
          class="border-4 border-secondary bg-secondary/80 flex flex-col gap-y-3 p-5 pr-[30px] relative rounded-b-lg rounded-tl-lg box-border text-slate-300"
        >
          <RouteLink
            v-for="route in routes"
            :key="route.url"
            :label="$t(route.label)"
            :url="route.url"
            @click="isOpen = false"
          />
          <template v-if="user">
            <button
              class="text-warning hover:text-white max-w-max font-bold"
              @click="
                () => {
                  isOpen = false
                  $emit('logout')
                }
              "
            >
              {{ $t('components.navbar.logout') }}
            </button>
          </template>
          <LangSwitcher
            class="pt-4"
            @click="isOpen = false"
          />
        </div>
      </div>
    </Expand>
  </div>
</template>
