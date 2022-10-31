<script setup>
import Copy from '@/assets/icons/copy.svg'
import Delete from '@/assets/icons/delete.svg'

defineEmits(['copy', 'delete'])
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <Copy v-tooltip="'Copy row'" class="w-6 h-6 cursor-pointer text-primary" @click="$emit('copy')" />
    <VDropdown>
      <Delete v-tooltip="'Delete row'" class="w-6 h-6 cursor-pointer text-danger" />
      <template #popper>
        <div class="flex flex-col gap-2 p-4 !bg-black text-white !border-none">
          <p>{{ $t('encounter.confirmDelete') }}</p>
          <Button :label="$t('actions.delete')" color="danger" bold inline @click="$emit('delete')" />
        </div>
      </template>
    </VDropdown>
  </div>
</template>
