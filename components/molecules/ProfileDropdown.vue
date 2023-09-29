<script setup lang="ts">
import { start, end } from '@/utils/animation-helpers'

defineExpose({ close })
defineEmits(['logout'])
defineProps<{ routes: Route[] }>()

const profile = useProfileStore()
const user = useSupabaseUser()

const isOpen = ref<boolean>(false)

onKeyStroke('Escape', () => close())

onBeforeMount(() => profile.fetch())

function close (): void {
  isOpen.value = false
}
</script>

<template>
  <div v-click-outside="() => (isOpen = false)" class="relative">
    <button
      class="border-4 border-secondary bg-secondary/50 rounded-lg shadow shadow-primary hover:tracker-shadow-pulse cursor-pointer"
      :class="{ 'rounded-b-none': isOpen }"
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
          src="/dice.webp"
          alt="D20 dice"
          sizes="sm:40px md:40px lg:40px"
          class="w-12"
          format="webp"
          provider="imagekit"
        />
      </ClientOnly>
    </button>
    <Transition
      name="expand"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
      @after-leave="end"
    >
      <div v-if="isOpen" class="absolute z-[1] block w-max right-0 top-[55px]">
        <div
          class="border-4 border-secondary bg-secondary/50 backdrop-blur-xl flex flex-col gap-y-3 p-5 pr-[30px] relative rounded-b-lg rounded-tl-lg box-border text-slate-300"
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
              class="text-danger hover:text-white max-w-max font-bold"
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
          <LangSwitcher class="pt-4" @click="isOpen = false" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-leave-active, .expand-enter-active {
    @apply duration-200 ease-in-out overflow-hidden;
  }

  .expand-leave-to, .expand-enter-from {
    @apply !h-0 opacity-0;
  }
</style>
