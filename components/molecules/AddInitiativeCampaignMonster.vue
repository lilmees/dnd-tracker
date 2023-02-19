<script setup>
import { createRowObject } from '@/util/createRowObject'
import { useEncountersStore } from '@/store/encounters'
import { useMonstersStore } from '@/store/monsters'
import Shield from '@/assets/icons/shield.svg'
import Heart from '@/assets/icons/heart.svg'

const props = defineProps({
  encounter: { type: Object, required: true },
  sandbox: { type: Boolean, default: false },
})

const store = useMonstersStore()
const encounterStore = useEncountersStore()

const isOpen = ref(false)
const isLoading = ref(false)
const monsters = ref()
const selected = ref([])
const id = computed(() => props.encounter.campaign?.id || props.encounter.campaign)

onMounted(async () => {
  if (id.value) monsters.value = await store.getMonsterByCampaignId(id.value)
  else if (props.sandbox) monsters.value = store.sandboxMonsters
})

function selectMonster(monster) {
  const index = selected.value.findIndex(p => p.id === monster.id)
  if (index > -1) selected.value = selected.value.filter(p => p.id !== monster.id)
  else selected.value.push(monster)
}

async function addMonsters(monsters) {
  try {
    isLoading.value = true

    monsters.forEach(monster => {
      const row = createRowObject(monster, 'monster', props.encounter.rows)
      props.encounter.rows.includes('[') ? (props.encounter.rows = [row]) : props.encounter.rows.push(row)
    })
    if (!props.sandbox) await encounterStore.updateEncounter({ rows: props.encounter.rows }, props.encounter.id)
    closeModal()
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

function closeModal() {
  isOpen.value = false
  selected.value = []
}
</script>

<template>
  <section>
    <Button
      :label="$t('encounter.addCampaignMonster')"
      color="warning"
      @click="isOpen = true"
      :disabled="!id && !sandbox"
    />
    <Modal v-if="isOpen" @close="closeModal">
      <h2>{{ $t('encounter.addCampaignMonster') }}</h2>
      <div v-if="monsters && monsters.length" class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <template v-for="monster in monsters" :key="monster.id">
            <div
              class="rounded-xl w-fit bg-black p-3 space-y-1 tracker-shadow cursor-pointer"
              :class="{ ring: selected.filter(p => p.id === monster.id).length }"
              @click="selectMonster(monster)"
            >
              <h3 class="text-center">{{ monster.name }}</h3>
              <div class="flex gap-4 pt-2 justify-center">
                <div class="flex gap-1">
                  <p class="font-bold">{{ monster.health || '_' }}</p>
                  <Heart class="w-6 h-6 text-danger" />
                </div>
                <div class="flex gap-1">
                  <p class="font-bold">{{ monster.ac || '_' }}</p>
                  <Shield class="w-6 h-6 text-help" />
                </div>
              </div>
            </div>
          </template>
        </div>
        <Button
          :label="$t('encounter.addMonsters')"
          color="primary"
          @click="addMonsters(selected)"
          :disabled="isLoading || !selected.length"
        />
      </div>
      <div v-else-if="monsters && !monsters.length">
        {{ $t('monsters.none') }}
      </div>
      <div v-else class="pt-20">
        <div class="loader !relative" />
      </div>
    </Modal>
  </section>
</template>
