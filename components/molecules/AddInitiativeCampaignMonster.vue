<script setup>
import { createRowObject } from '@/util/createRowObject'
import { useTableStore } from '@/store/table'
import { useMonstersStore } from '@/store/monsters'
import Dragon from '@/assets/icons/dragon.svg'
import Shield from '@/assets/icons/shield.svg'
import Heart from '@/assets/icons/heart.svg'

const monster = useMonstersStore()
const store = useTableStore()

const isOpen = ref(false)
const isLoading = ref(false)
const monsters = ref()
const selected = ref([])
const id = computed(() => store.encounter.campaign?.id || store.encounter.campaign)

onMounted(async () => {
  if (id.value) {
    monsters.value = await monster.getMonsterByCampaignId(id.value)
  } else if (store.isSandbox) {
    monsters.value = monster.sandboxMonsters
  }
})

function selectMonster (monster) {
  const index = selected.value.findIndex(p => p.id === monster.id)
  if (index > -1) {
    selected.value = selected.value.filter(p => p.id !== monster.id)
  } else {
    selected.value.push(monster)
  }
}

async function addMonsters (monsters) {
  try {
    isLoading.value = true
    const monsterRows = []
    monsters.forEach((monster) => {
      monsterRows.push(createRowObject(monster, 'monster', store.encounter.rows))
    })
    await store.encounterUpdate({
      rows: store.encounter.rows.includes('[')
        ? monsterRows
        : [...store.encounter.rows, ...monsterRows]
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
      v-tippy="{ content: $t('encounter.addCampaignMonster'), animation: 'shift-away' }"
      class="flex gap-2 items-center disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="!id && !store.isSandbox"
      @click="isOpen = true"
    >
      <span class="md:hidden">
        {{ $t('encounter.addCampaignMonster') }}
      </span>
      <Dragon class="text-danger w-10 h-10" />
    </button>
    <Modal v-if="isOpen" @close="closeModal">
      <h2>{{ $t('encounter.addCampaignMonster') }}</h2>
      <div v-if="monsters && monsters.length" class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <template v-for="mnstr in monsters" :key="mnstr.id">
            <div
              class="rounded-xl w-fit bg-black p-3 space-y-1 tracker-shadow cursor-pointer"
              :class="{ ring: selected.filter(p => p.id === mnstr.id).length }"
              @click="selectMonster(mnstr)"
            >
              <h3 class="text-center">
                {{ mnstr.name }}
              </h3>
              <div class="flex gap-4 pt-2 justify-center">
                <div class="flex gap-1">
                  <p class="font-bold">
                    {{ mnstr.health || '_' }}
                  </p>
                  <Heart class="w-6 h-6 text-danger" />
                </div>
                <div class="flex gap-1">
                  <p class="font-bold">
                    {{ mnstr.ac || '_' }}
                  </p>
                  <Shield class="w-6 h-6 text-help" />
                </div>
              </div>
            </div>
          </template>
        </div>
        <Button
          :label="$t('encounter.addMonsters')"
          color="primary"
          :disabled="isLoading || !selected.length"
          @click="addMonsters(selected)"
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
