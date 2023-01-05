<script setup>
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'
import { useMonstersStore } from '@/store/monsters'
import Shield from '@/assets/icons/shield.svg'
import Heart from '@/assets/icons/heart.svg'
import Link from '@/assets/icons/link.svg'
import Settings from '@/assets/icons/settings.svg'
import Delete from '@/assets/icons/delete.svg'
import Update from '@/assets/icons/update.svg'
import Remove from '@/assets/icons/remove.svg'

const emit = defineEmits(['deleted', 'updated'])
const props = defineProps({ monster: { type: Object, required: true } })

const toast = useToastStore()
const { t } = useI18n({ useScope: 'global' })
const store = useMonstersStore()

const isSettings = ref(false)
const isUpdating = ref(false)
const needConfirmation = ref(false)

async function deleteMonster() {
  try {
    await store.deleteMonster(props.monster.id)
    emit('deleted', props.monster.id)
  } catch (error) {
    toast.error({ title: t('error.general.title'), text: t('error.general.text') })
  }
}

async function updateMonster(monster) {
  emit('updated', monster)
  isSettings.value = false
  isUpdating.value = false
}
</script>

<template>
  <section class="rounded-xl w-fit bg-black p-3 relative space-y-1 tracker-shadow group">
    <div class="flex gap-2 items-center justify-between">
      <h3>{{ monster.name }}</h3>
      <Settings
        v-if="!isSettings"
        v-tooltip="$t('actions.openSettings')"
        @click="isSettings = !isSettings"
        class="w-4 h-4 cursor-pointer text-primary opacity-0 group-hover:opacity-100 duration-200 ease-in-out"
      />
      <Remove
        v-else
        v-tooltip="$t('actions.closeSettings')"
        class="w-8 h-8 cursor-pointer text-primary"
        @click="isSettings = false"
      />
    </div>
    <div class="flex gap-4 pt-2 justify-center">
      <div class="flex gap-1">
        <p class="font-bold">{{ monster.health || '_' }}</p>
        <Heart class="w-6 h-6 text-danger" />
      </div>
      <div class="flex gap-1">
        <p class="font-bold">{{ monster.ac || '_' }}</p>
        <Shield class="w-6 h-6 text-help" />
      </div>
      <NuxtLink v-if="monster.link" :to="monster.link" target="_blank" rel="noreferrer noopener">
        <Link class="w-6 h-6 text-info" />
      </NuxtLink>
    </div>
    <div v-if="isSettings" class="flex flex-col gap-2 pt-4">
      <div class="flex gap-2 cursor-pointer max-w-max" @click="isUpdating = true">
        <Update class="h-6 w-6" />
        <p>{{ $t('actions.update') }}</p>
      </div>
      <div class="flex gap-2 cursor-pointer max-w-max" @click="needConfirmation = true">
        <Delete class="h-6 w-6" />
        <p>{{ $t('actions.delete') }}</p>
      </div>
    </div>
    <ConfirmationModal
      :open="needConfirmation"
      :title="monster.name"
      @close="needConfirmation = false"
      @delete="deleteMonster"
    />
    <UpdateCampaignMonster :open="isUpdating" :monster="monster" @close="isUpdating = false" @updated="updateMonster" />
  </section>
</template>
