<script setup lang="ts">
import logRocket from 'logrocket'

const homebrew = useHomebrewStore()
const store = useTableStore()

const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const homebrews = ref<Homebrew[] | null>(null)
const selected = ref<Homebrew[]>([])
const summoner = ref<Option | null>(null)
const search = ref<string>('')

const id = computed<number | undefined>(() => {
  if (!store.encounter?.campaign) {
    return undefined
  }

  return typeof store.encounter.campaign === 'object'
    ? store.encounter.campaign.id
    : store.encounter.campaign
}
)

const summon = computed<boolean>(() => !!selected.value.filter(s => s.type === 'summon').length)

const summonOptions = computed<Option[]>(() => {
  return store.encounter?.rows
    ? store.encounter.rows.map((r: Row) => {
      return { label: r.name, value: `${r.id}` }
    })
    : []
})

const filteredHomebrews = computed<Homebrew[]>(() => {
  let hbs: Homebrew[] = []
  if (!homebrews.value) {
    return hbs
  } else {
    hbs = homebrews.value
  }

  if (summon.value) {
    hbs = hbs.filter((h: Homebrew) => h.type === 'summon')
  }

  if (search.value) {
    hbs = hbs.filter((h: Homebrew) => h.name.toLowerCase().includes(search.value.toLowerCase()))
  }

  return hbs
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
    logRocket.captureException(err as Error)
  } finally {
    isLoading.value = false
  }
}

function closeModal (): void {
  search.value = ''
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
        content: $t('components.addInitiativeCampaignHomebrew.addCampaignHomebrew'),
        touch: false
      }"
      :aria-label="$t('components.addInitiativeCampaignHomebrew.addCampaignHomebrew')"
      class="flex gap-2 items-center disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="!id && !store.isSandbox"
      @click="isOpen = true"
    >
      <span class="md:hidden">
        {{ $t('components.addInitiativeCampaignHomebrew.addCampaignHomebrew') }}
      </span>
      <Icon
        name="material-symbols:table-chart-outline"
        class="text-primary w-10 h-10"
        aria-hidden="true"
      />
    </button>
    <Modal v-if="isOpen" @close="closeModal">
      <template #header>
        <h2>
          {{ $t('components.addInitiativeCampaignHomebrew.addCampaignHomebrew') }}
        </h2>
      </template>
      <div v-if="homebrews?.length" class="space-y-4">
        <div class="flex items-end gap-4">
          <div class="grow">
            <FormKit
              v-model="search"
              type="text"
              :label="$t('components.inputs.nameLabel')"
            />
          </div>
          <button
            v-if="search"
            class="btn-black mb-2"
            @click="search = ''"
          >
            <Icon
              name="ic:round-clear"
              size="25"
              aria-hidden="true"
            />
          </button>
        </div>
        <template v-if="summon">
          <p>
            {{ $t('components.addInitiativeCampaignHomebrew.initiative.info') }}
          </p>
          <FormKit
            type="select"
            :label="$t('components.inputs.summonerLabel')"
            :placeholder="$t('components.addInitiativeCampaignHomebrew.initiative.select')"
            :options="summonOptions"
            @input="selectedSummoner"
          />
        </template>
        <div class="flex flex-col">
          <template
            v-for="hb in filteredHomebrews"
            :key="hb.id"
          >
            <div
              class="first:rounded-t-lg last:rounded-b-lg w-full bg-black p-2 border-b border-slate-700 cursor-pointer grid grid-cols-3 px-4"
              :class="{
                'border-4 border-b-4 !border-primary': selected.filter(p => p.id === hb.id).length
              }"
              @click="selectHomebrew(hb)"
            >
              <div class="flex gap-2 items-center">
                <Icon
                  :name="useHomebrewIcon(hb.type)"
                  :class="useHomebrewColor(hb.type)"
                  aria-hidden="true"
                  size="20"
                />
                <p class="capitalize">
                  {{ hb.type || '' }}
                </p>
              </div>
              <p>
                {{ hb.name }}
              </p>
              <div class="flex gap-4">
                <div v-if="hb.health" class="flex gap-1">
                  <p>
                    {{ hb.health }}
                  </p>
                  <Icon name="mdi:cards-heart-outline" class="w-6 h-6 text-danger" />
                </div>
                <div v-if="hb.ac" class="flex gap-1">
                  <p>
                    {{ hb.ac }}
                  </p>
                  <Icon
                    name="ic:outline-shield"
                    class="w-6 h-6 text-help"
                    aria-hidden="true"
                  />
                </div>
              </div>
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
              :disabled="isLoading"
              @click="addHomebrews(homebrews as Homebrew[])"
            >
              {{ $t('actions.addAll') }}
            </button>
          </template>
          <button
            v-else
            class="btn-primary"
            :aria-label="$t('components.addInitiativeCampaignHomebrew.initiative.add')"
            :disabled="isLoading || !summoner"
            @click="addHomebrews(selected)"
          >
            {{ $t('components.addInitiativeCampaignHomebrew.initiative.add') }}
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
