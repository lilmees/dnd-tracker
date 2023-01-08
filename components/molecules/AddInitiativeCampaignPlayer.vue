<script setup>
import { createRowObject } from '@/util/createRowObject'
import { useEncountersStore } from '@/store/encounters'
import { usePlayersStore } from '@/store/players'
import Shield from '@/assets/icons/shield.svg'
import Heart from '@/assets/icons/heart.svg'

const props = defineProps({ encounter: { type: Object, required: true } })

const store = usePlayersStore()
const encounterStore = useEncountersStore()

const isOpen = ref(false)
const isLoading = ref(false)
const players = ref()
const selected = ref([])
const id = computed(() => props.encounter.group?.id || props.encounter.group)

onMounted(async () => {
  if (id.value) players.value = await store.getPlayerByCampaignId(id.value)
})

function selectPlayer(player) {
  const index = selected.value.findIndex(p => p.id === player.id)
  if (index > -1) selected.value = selected.value.filter(p => p.id !== player.id)
  else selected.value.push(player)
}

async function addPlayers(players) {
  try {
    isLoading.value = true

    players.forEach(player => {
      const row = createRowObject(player, 'player', props.encounter.rows)
      props.encounter.rows.includes('[') ? (props.encounter.rows = [row]) : props.encounter.rows.push(row)
    })
    await encounterStore.updateEncounter({ rows: props.encounter.rows }, props.encounter.id)
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
    <Button :label="$t('encounter.addCampaignPlayer')" color="info" @click="isOpen = true" :disabled="!id" />
    <Modal v-if="isOpen" @close="closeModal">
      <h2>{{ $t('encounter.addCampaignPlayer') }}</h2>
      <div v-if="players && players.length" class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <template v-for="player in players" :key="player.id">
            <div
              class="rounded-xl w-fit bg-black p-3 space-y-1 tracker-shadow cursor-pointer"
              :class="{ ring: selected.filter(p => p.id === player.id).length }"
              @click="selectPlayer(player)"
            >
              <h3 class="text-center">{{ player.name }}</h3>
              <div class="flex gap-4 pt-2 justify-center">
                <div class="flex gap-1">
                  <p class="font-bold">{{ player.health || '_' }}</p>
                  <Heart class="w-6 h-6 text-danger" />
                </div>
                <div class="flex gap-1">
                  <p class="font-bold">{{ player.ac || '_' }}</p>
                  <Shield class="w-6 h-6 text-help" />
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="flex gap-2 flex-wrap">
          <Button
            :label="$t('encounter.addPlayers')"
            color="primary"
            @click="addPlayers(selected)"
            :disabled="isLoading"
          />
          <Button
            :label="$t('encounter.addAllPlayers')"
            color="success"
            @click="addPlayers(players)"
            :disabled="isLoading"
          />
        </div>
      </div>
      <div v-else-if="players && !players.length">
        {{ $t('players.none') }}
      </div>
      <div v-else class="pt-20">
        <div class="loader !relative" />
      </div>
    </Modal>
  </section>
</template>
