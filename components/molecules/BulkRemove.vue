<script setup lang="ts">
defineProps<{ type: 'campaigns'|'encounters'|'homebrews'|'notes' }>()

const selected = defineModel<any[]>('selected', { default: [] })
const isBulk = defineModel<boolean>('isBulk', { default: false })
const needConfirmation = defineModel<boolean>('needConfirmation', { default: false })
</script>

<template>
  <Expand>
    <div v-if="isBulk">
      <h2 class="text-danger">
        {{ $t('components.bulkRemove.title', { type: $t(`general.${type}`).toLowerCase() }) }}
      </h2>
      <p class="pt-2 pb-6">
        {{ $t('components.bulkRemove.subtitle', { type: $t(`general.${type}`).toLowerCase() }) }}
      </p>
      <div class="flex gap-2 mb-12">
        <button
          class="btn-danger"
          :disabled="!selected.length"
          :aria-label="$t('components.bulkRemove.amount', {
            number: selected.length,
            type: $t(`general.${type}`).toLowerCase()
          })"
          @click="needConfirmation = true"
        >
          {{ $t('components.bulkRemove.amount', { number: selected.length, type: $t(`general.${type}`).toLowerCase() }) }}
        </button>
        <button
          class="btn-success"
          :aria-label="$t('actions.cancel')"
          @click="isBulk = false, selected = []"
        >
          {{ $t('actions.cancel') }}
        </button>
      </div>
    </div>
  </Expand>
</template>
