<template>
  <tippy
    v-tippy="{
      content: 'Hotkeys',
      touch: false,
    }"
    trigger="click"
  >
    <Icon
      name="mingcute:hotkey-line"
      class="w-6 h-6"
      aria-hidden="true"
    />
    <template #content>
      <div class="p-4 space-y-2 overflow-auto">
        <p class="head-3 text-center pb-2">
          Hotkeys
        </p>
        <div class="grid grid-cols-3 gap-y-4">
          <p class="font-bold">
            {{ $t('actions.panMap') }}
          </p>
          <div class="flex flex-col gap-2 col-span-2">
            <div class="flex justify-wrap items-center gap-y-2">
              <kbd><Icon
                name="carbon:mac-shift"
                class="w-5 h-5"
              /></kbd>
              <span class="mx-1 font-bold">+</span>
              <kbd><Icon
                name="ph:mouse-duotone"
                class="w-5 h-5"
              /></kbd>
            </div>
          </div>
          <p class="font-bold">
            {{ $t('actions.pasteSelected') }}
          </p>
          <div class="flex flex-col gap-2 col-span-2">
            <div>
              <kbd><Icon
                name="vaadin:ctrl-a"
                class="w-5 h-5"
              /></kbd>
              <span class="mx-1 font-bold">/</span>
              <kbd><Icon
                name="carbon:mac-command"
                class="w-5 h-5"
              /></kbd>
              <span class="mx-1 font-bold">/</span>
              <kbd><Icon
                name="vaadin:alt-a"
                class="w-5 h-5"
              /></kbd>
              <span class="mx-1 font-bold">+</span>
              <kbd>V</kbd>
            </div>
          </div>
          <p class="font-bold">
            {{ $t('actions.moveSelected') }}
          </p>
          <div class="flex flex-col gap-2 col-span-2">
            <div>
              <kbd><Icon
                name="vaadin:arrow-left"
                class="w-5 h-5"
              /></kbd>
              <span class="mx-1 font-bold">/</span>
              <kbd><Icon
                name="vaadin:arrow-up"
                class="w-5 h-5"
              /></kbd>
              <span class="mx-1 font-bold">/</span>
              <kbd><Icon
                name="vaadin:arrow-down"
                class="w-5 h-5"
              /></kbd>
              <span class="mx-1 font-bold">/</span>
              <kbd><Icon
                name="vaadin:arrow-right"
                class="w-5 h-5"
              /></kbd>
            </div>
          </div>
        </div>
      </div>
    </template>
  </tippy>
</template>
