<template>
  <tippy
    v-tippy="{
      content: 'Hotkeys',
      touch: false
    }"
    animation="shift-away"
    trigger="click"
  >
    <Icon name="mingcute:hotkey-line" class="w-10 h-10 cursor-pointer" />
    <template #content>
      <div class="p-4 space-y-2 overflow-auto">
        <p class="head-3 text-center pb-2">
          Hotkeys
        </p>
        <div class="grid grid-cols-2 gap-y-4">
          <p class="font-bold">
            {{ $t('actions.prev') }}
          </p>
          <div class="flex flex-col gap-2">
            <div>
              <kbd>Shift</kbd>+<kbd>ArrowLeft</kbd>
            </div>
            <div>
              {{ $t('general.or') }} <kbd>PageUp</kbd>
            </div>
          </div>
          <p class="font-bold">
            {{ $t('actions.next') }}
          </p>
          <div class="flex flex-col gap-2">
            <div>
              <kbd>Shift</kbd>+<kbd>ArrowRight</kbd>
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
