<template>
  <tippy
    v-tippy="{
      content: 'Hotkeys',
      touch: false
    }"
    trigger="click"
  >
    <Icon
      name="mingcute:hotkey-line"
      class="w-10 h-10 cursor-pointer"
      aria-hidden="true"
    />
    <template #content>
      <div class="p-4 space-y-2 overflow-auto">
        <p class="head-3 text-center pb-2">
          Hotkeys
        </p>
        <div class="grid grid-cols-3 gap-y-4">
          <p class="font-bold">
            {{ $t('actions.prev') }}
          </p>
          <div class="flex flex-col gap-2 col-span-2">
            <div>
              <kbd><Icon name="vaadin:ctrl-a" class="w-5 h-5" /></kbd>
              <span class="mx-1 font-bold">/</span>
              <kbd><Icon name="carbon:mac-command" class="w-5 h-5" /></kbd>
              <span class="mx-1 font-bold">/</span>
              <kbd><Icon name="carbon:mac-shift" class="w-5 h-5" /></kbd>
              <span class="mx-1 font-bold">+</span>
              <kbd><Icon name="carbon:arrow-left" class="w-5 h-5" /></kbd>
            </div>
            <div>
              {{ $t('general.or') }} <kbd>PageUp</kbd>
            </div>
          </div>
          <p class="font-bold">
            {{ $t('actions.next') }}
          </p>
          <div class="flex flex-col gap-2 col-span-2">
            <div>
              <kbd><Icon name="vaadin:ctrl-a" class="w-5 h-5" /></kbd>
              <span class="mx-1 font-bold">/</span>
              <kbd><Icon name="carbon:mac-command" class="w-5 h-5" /></kbd>
              <span class="mx-1 font-bold">/</span>
              <kbd><Icon name="carbon:mac-shift" class="w-5 h-5" /></kbd>
              <span class="mx-1 font-bold">+</span>
              <kbd><Icon name="carbon:arrow-right" class="w-5 h-5" /></kbd>
            </div>
            <div>
              {{ $t('general.or') }} <kbd>PageDown</kbd>
            </div>
          </div>
        </div>
      </div>
    </template>
  </tippy>
</template>
