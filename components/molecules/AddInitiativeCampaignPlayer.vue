<script setup>
import { createRowObject } from '@/util/createRowObject'
import { useTableStore } from '@/store/table'
import { usePlayersStore } from '@/store/players'
import Sword from '@/assets/icons/sword.svg'
import Shield from '@/assets/icons/shield.svg'
import Heart from '@/assets/icons/heart.svg'

const player = usePlayersStore()
const store = useTableStore()

const isOpen = ref(false)
const isLoading = ref(false)
const players = ref()
const selected = ref([])
const id = computed(() => store.encounter.campaign?.id || store.encounter.campaign)

onMounted(async () => {
  if (id.value) {
    players.value = await player.getPlayerByCampaignId(id.value)
  } else if (store.isSandbox) {
    players.value = player.sandboxPlayers
  }
})

function selectPlayer (player) {
  const index = selected.value.findIndex(p => p.id === player.id)
  if (index > -1) {
    selected.value = selected.value.filter(p => p.id !== player.id)
  } else {
    selected.value.push(player)
  }
}

async function addPlayers (players) {
  try {
    isLoading.value = true
    const playerRows = []
    players.forEach((player) => {
      playerRows.push(createRowObject(player, 'player', store.encounter.rows))
    })
    await store.encounterUpdate({
      rows: store.encounter.rows.includes('[')
        ? playerRows
        : [...store.encounter.rows, ...playerRows]
    })
    closeModal()
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

function closeModal () {
  isOpen.value = false
  selected.value = []
}
</script>

<template>
  <section>
    <button
      v-tippy="{ content: $t('encounter.addCampaignPlayer'), animation: 'shift-away' }"
      class="flex gap-2 items-center disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="!id && !store.isSandbox"
      @click="isOpen = true"
    >
      <span class="md:hidden">
        {{ $t('encounter.addCampaignPlayer') }}
      </span>
      <Sword class="text-primary w-10 h-10" />
    </button>
    <Modal v-if="isOpen" @close="closeModal">
      <h2>{{ $t('encounter.addCampaignPlayer') }}</h2>
      <div v-if="players && players.length" class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <template v-for="plyr in players" :key="plyr.id">
            <div
              class="rounded-xl w-fit bg-black p-3 space-y-1 tracker-shadow cursor-pointer"
              :class="{ ring: selected.filter(p => p.id === plyr.id).length }"
              @click="selectPlayer(plyr)"
            >
              <h3 class="text-center">
                {{ plyr.name }}
              </h3>
              <div class="flex gap-4 pt-2 justify-center">
                <div class="flex gap-1">
                  <p class="font-bold">
                    {{ plyr.health || '_' }}
                  </p>
                  <Heart class="w-6 h-6 text-danger" />
                </div>
                <div class="flex gap-1">
                  <p class="font-bold">
                    {{ plyr.ac || '_' }}
                  </p>
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
            :disabled="isLoading || !selected.length"
            @click="addPlayers(selected)"
          />
          <Button
            :label="$t('encounter.addAllPlayers')"
            color="success"
            :disabled="isLoading"
            @click="addPlayers(players)"
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
