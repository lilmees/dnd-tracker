<script setup>
import { useToastStore } from '@/store/toast'
import Info from '~/assets/icons/info.svg'
import Check from '~/assets/icons/check.svg'
import Warn from '~/assets/icons/warning.svg'
import Error from '~/assets/icons/error.svg'
import Remove from '~/assets/icons/remove.svg'

const store = useToastStore()
</script>

<template>
  <div class="fixed top-0 right-0 z-50 h-screen p-5 pointer-events-none max-w-md w-full">
    <TransitionGroup
      enter-active-class="duration-300 ease-out"
      enter-from-class="transform scale-75 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="transform scale-75 opacity-0"
    >
      <div
        v-for="toast in store.sortedToasts"
        :key="toast.key"
        class="w-full mb-1 bg-tracker tracker-shadow pointer-events-auto rounded-2xl"
      >
        <div
          class="flex p-2 items-start"
          :class="{
            'text-danger': toast.type === 'error',
            'text-warning': toast.type === 'warn',
            'text-success': toast.type === 'success',
            'text-info': toast.type === 'info',
          }"
        >
          <Info v-if="toast.type === 'info'" class="max-w-[40px] max-h-[40px] w-full h-full mr-2 pt-2" />
          <Warn v-if="toast.type === 'warn'" class="max-w-[40px] max-h-[40px] w-full h-full mr-2 pt-2" />
          <Check v-if="toast.type === 'success'" class="max-w-[40px] max-h-[40px] w-full h-full mr-2 pt-2" />
          <Error v-if="toast.type === 'error'" class="max-w-[40px] max-h-[40px] w-full h-full mr-2 pt-2" />
          <div class="grow">
            <h1 v-if="toast.title" class="font-bold">
              {{ toast.title }}
            </h1>
            <p v-if="toast.text" class="body-small">
              {{ toast.text }}
            </p>
          </div>
          <Remove
            class="max-w-[20px] max-h-[20px] w-full h-full mr-2 self-start text-danger cursor-pointer"
            @click="store.remove(toast.key)"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
