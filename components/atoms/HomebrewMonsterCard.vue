<script setup>
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'
import { useMonstersStore } from '@/store/monsters'
import Shield from '@/assets/icons/shield.svg'
import Heart from '@/assets/icons/heart.svg'
import Link from '@/assets/icons/link.svg'
import Settings from '@/assets/icons/settings.svg'

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
  <section class="rounded-xl w-fit bg-black p-3 relative space-y-1 tracker-shadow">
    <div class="flex gap-2 items-center justify-between">
      <h3>{{ monster.name }}</h3>
      <Settings
        v-tooltip="$t('actions.update')"
        @click="isSettings = !isSettings"
        class="w-4 h-4 cursor-pointer hover:scale-110 duration-200 ease-in-out text-primary"
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
    <div v-if="isSettings" class="flex flex-wrap gap-2 pt-4">
      <Button :label="$t('actions.update')" color="success" bold @click="isUpdating = true" />
      <Button :label="$t('actions.delete')" color="danger" bold @click="needConfirmation = true" />
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
