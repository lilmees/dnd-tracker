<script setup lang="ts">
import { useTableStore } from '@/store/table'
import { useHomebrewStore } from '@/store/homebrew'

const homebrew = useHomebrewStore()
const store = useTableStore()
const { $logRocket } = useNuxtApp()

const isOpen: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(false)
const homebrews: Ref<Homebrew[] | null> = ref(null)
const selected: Ref<Homebrew[]> = ref([])
const summoner: Ref<Option | null> = ref(null)

const id: ComputedRef<number> = computed(() => typeof store.encounter!.campaign === 'object'
  ? store.encounter!.campaign.id
  : store.encounter!.campaign
)
const summon: ComputedRef<boolean> = computed(() => !!selected.value.filter(s => s.type === 'summon').length)
const summonOptions: ComputedRef<Option[]> = computed(() => {
  return store.encounter?.rows
    ? store.encounter.rows.map((r: Row) => {
      return { label: r.name, value: `${r.id}` }
    })
    : []
})

// delete selections that are not from the summon type when a summon is selected
watch(() => summon.value, () => {
  selected.value = selected.value.filter(s => s.type === 'summon')
})

onMounted(async () => {
  if (id.value) {
    homebrews.value = await homebrew.getHomebrewByCampaignId(id.value)
  } else if (store.isSandbox) {
    homebrews.value = homebrew.sandbox
  }
})

function selectHomebrew (homebrew: Homebrew): void {
  const index = selected.value.findIndex(h => h.id === homebrew.id)
  if (index > -1) {
    selected.value = selected.value.filter(h => h.id !== homebrew.id)
  } else {
    selected.value.push(homebrew)
  }
}

async function addHomebrews (homebrews: RowUpdate[] | Homebrew[]): Promise<void> {
  try {
    isLoading.value = true
    const homebrewRows: Row[] = []

    homebrews.forEach((hb: RowUpdate) => {
      if (summoner.value && hb.type === 'summon') {
        hb.summoner = {
          name: summoner.value.label,
          id: +summoner.value.value
        }
      }

      if (store?.encounter?.rows) {
        homebrewRows.push(useCreateRow(hb as Row, hb.type, store.encounter.rows))
      }
    })

    if (store?.encounter?.rows) {
      await store.encounterUpdate({
        rows: [...store.encounter.rows, ...homebrewRows]
      })
    }

    closeModal()
  } catch (err) {
    $logRocket.captureException(err as Error)
  } finally {
    isLoading.value = false
  }
}

function closeModal (): void {
  isOpen.value = false
  summoner.value = null
  selected.value = []
}

function selectedSummoner (value: number): void {
  const filtered = summonOptions.value.find(s => s.value === value)
  summoner.value = filtered || null
}
</script>

<template>
  <section>
    <button
      v-tippy="{
        content: $t('encounter.addCampaignHomebrew'),
        animation: 'shift-away'
      }"
      class="flex gap-2 items-center disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="!id && !store.isSandbox"
      @click="isOpen = true"
    >
      <span class="md:hidden">
        {{ $t('encounter.addCampaignHomebrew') }}
      </span>
      <Icon
        name="material-symbols:table-chart-outline"
        class="text-primary w-10 h-10"
      />
    </button>
    <Modal v-if="isOpen" @close="closeModal">
      <h2>
        {{ $t('encounter.addCampaignHomebrew') }}
      </h2>
      <div v-if="homebrews?.length" class="space-y-4">
        <template v-if="summon">
          <p>
            {{ $t('homebrews.initiative.selectSummoner') }}
          </p>
          <FormKit
            type="select"
            :label="$t('inputs.summonerLabel')"
            :placeholder="$t('homebrews.initiative.select')"
            :options="summonOptions"
            @input="selectedSummoner"
          />
        </template>
        <div class="flex flex-col">
          <template
            v-for="hb in summon ? homebrews.filter(h => h.type === 'summon') : homebrews"
            :key="hb.id"
          >
            <div
              class="first:rounded-t-lg last:rounded-b-lg w-full bg-black p-2 border-b border-slate-700 cursor-pointer grid grid-cols-3 px-4"
              :class="{
                'border-2 border-b-2 border-primary': selected.filter(p => p.id === hb.id).length
              }"
              @click="selectHomebrew(hb)"
            >
              <h3>
                {{ hb.name }}
              </h3>
              <div class="flex gap-4">
                <div class="flex gap-1">
                  <p class="font-bold">
                    {{ hb.health || '_' }}
                  </p>
                  <Icon name="mdi:cards-heart-outline" class="w-6 h-6 text-danger" />
                </div>
                <div class="flex gap-1">
                  <p class="font-bold">
                    {{ hb.ac || '_' }}
                  </p>
                  <Icon name="ic:outline-shield" class="w-6 h-6 text-help" />
                </div>
              </div>
              <p
                :class="{
                  'text-white': hb.type === 'player',
                  'text-primary': hb.type === 'summon',
                  'text-success': hb.type === 'npc',
                  'text-danger': hb.type === 'monster',
                  'text-warning': hb.type === 'lair',
                }"
              >
                {{ hb.type }}
              </p>
            </div>
          </template>
        </div>
        <div class="flex gap-2 flex-wrap">
          <template v-if="!summon">
            <button
              class="btn-primary"
              :aria-label="$t('actions.addSelected')"
              :disabled="isLoading || !selected.length"
              @click="addHomebrews(selected)"
            >
              {{ $t('actions.addSelected') }}
            </button>
            <button
              class="btn-success"
              :aria-label="$t('actions.addAll')"
              :disabled="isLoading || !selected.length"
              @click="addHomebrews(homebrews as Homebrew[])"
            >
              {{ $t('actions.addAll') }}
            </button>
          </template>
          <button
            v-else
            class="btn-primary"
            :aria-label="$t('homebrews.initiative.add')"
            :disabled="isLoading || !summoner"
            @click="addHomebrews(selected)"
          >
            {{ $t('homebrews.initiative.add') }}
          </button>
        </div>
      </div>
      <div v-else-if="homebrews && !homebrews.length">
        {{ $t('homebrew.none') }}
      </div>
      <div v-else class="pt-20">
        <div class="loader !relative" />
      </div>
    </Modal>
  </section>
</template>
