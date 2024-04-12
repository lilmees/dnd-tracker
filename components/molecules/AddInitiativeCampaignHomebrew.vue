<script setup lang="ts">
import logRocket from 'logrocket'

const homebrew = useHomebrewStore()
const store = useTableStore()
const { t } = useI18n()

const isFetched = ref<boolean>(false)
const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const selected = ref<Homebrew[]>([])
const summoner = ref<Option | null>(null)

const summon = computed<boolean>(() => !!selected.value.filter(s => s.type === 'summon').length)

const headers: TableHeader[] = [
  { label: '', sort: false, id: 'type' },
  { label: t('general.name'), sort: false, id: 'name' },
  { label: t('general.player'), sort: false, id: 'player' },
  { label: t('general.stats'), sort: false, id: 'stats' }
]

const summonOptions = computed<Option[]>(() => {
  return store.encounter?.rows
    ? store.encounter.rows.filter(row => row.type !== 'summon').map((r: Row) => {
      return { label: r.name, value: `${r.id}` }
    })
    : []
})

whenever(() => isOpen.value, () => {
  if (store.encounter?.campaign?.id && !isFetched.value && !store.isSandbox) {
    homebrew.encounterModal = true
    homebrew.perPage = 10

    homebrew.fetch({ field: 'campaign', value: store.encounter.campaign.id })

    isFetched.value = true
  } else if (store.isSandbox) {
    homebrew.data = homebrew.sandbox
    homebrew.loading = false
  }
})

watch(() => summon.value, () => {
  selected.value = selected.value.filter(s => s.type === 'summon')
})

onMounted(() => {
  if (store.isSandbox) {
    homebrew.data = homebrew.sandbox
  }
})

onBeforeUnmount(() => homebrew.reset())

function selectHomebrew (homebrew: Homebrew): void {
  selected.value.findIndex(h => h.id === homebrew.id) > -1
    ? selected.value = selected.value.filter(h => h.id !== homebrew.id)
    : selected.value.push(homebrew)
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
  homebrew.filters.search = ''
  isOpen.value = false
  summoner.value = null
  selected.value = []
}

function selectedSummoner (value: unknown): void {
  if (!isNaN(Number(value))) {
    const filtered = summonOptions.value.find(s => s.value === value)
    summoner.value = filtered || null
  }
}

function paginate (p: number): void {
  if (store.encounter?.campaign?.id) {
    homebrew.paginate(p, { field: 'campaign', value: store.encounter.campaign.id })
  }
}
</script>

<template>
  <section>
    <button
      v-tippy="{
        content: $t('components.addInitiativeCampaignHomebrew.title'),
        touch: false
      }"
      :aria-label="$t('components.addInitiativeCampaignHomebrew.title')"
      class="flex gap-2 items-center disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="!store.encounter?.campaign?.id && !store.isSandbox && !store.isPlayground"
      @click="isOpen = true"
    >
      <span class="md:hidden">
        {{ $t('components.addInitiativeCampaignHomebrew.title') }}
      </span>
      <Icon
        name="material-symbols:table-chart-outline"
        class="text-primary w-10 h-10"
        aria-hidden="true"
      />
    </button>
    <Modal :open="isOpen" @close="closeModal">
      <template #header>
        <h2>
          {{ $t('components.addInitiativeCampaignHomebrew.title') }}
        </h2>
      </template>
      <div class="space-y-4">
        <FormKit
          v-if="!summon && !store.isSandbox"
          v-model="homebrew.filters.search"
          type="search"
          prefix-icon="search"
        />
        <FormKit
          v-else-if="summon"
          type="select"
          :label="$t('components.inputs.summonerLabel')"
          :placeholder="$t('components.addInitiativeCampaignHomebrew.initiative.select')"
          :help="$t('components.addInitiativeCampaignHomebrew.initiative.info')"
          :options="summonOptions"
          @input="selectedSummoner"
        />
        <SkeletonTable v-if="homebrew.loading" :headers="headers" :rows="10" />
        <Table
          v-else
          v-model:page="homebrew.page"
          :headers="headers"
          :pages="homebrew.pages"
          :searching="homebrew.searching"
          @paginate="paginate"
        >
          <tr
            v-for="hb in summon ? homebrew.data.filter(h => h.type === 'summon') : homebrew.data"
            :key="hb.id"
            class="tr transition-colors cursor-pointer"
            :class="{
              '!bg-primary/30': selected.filter(p => p.id === hb.id).length
            }"
            @click="selectHomebrew(hb)"
          >
            <td class="px-2 py-1 border-r border-slate-700 flex justify-center">
              <Icon
                v-tippy="$t(`general.${hb.type}`)"
                :name="useHomebrewIcon(hb.type)"
                :class="useHomebrewColor(hb.type)"
                aria-hidden="true"
                size="20"
              />
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              {{ hb.name }}
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              {{ hb.player || '' }}
            </td>
            <td class="px-2 py-1 flex gap-4">
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
            </td>
          </tr>

          <template v-if="!homebrew.data?.length" #empty>
            <span>
              {{ $t('components.addInitiativeCampaignHomebrew.initiative.nothing') }}
            </span>
          </template>
        </Table>
        <div class="flex gap-2 flex-wrap justify-end">
          <template v-if="!summon">
            <button
              class="btn-primary"
              :aria-label="$t('actions.addSelected')"
              :disabled="isLoading || !selected.length"
              @click="addHomebrews(selected)"
            >
              {{ $t('actions.addSelected') }} ({{ selected.length }})
            </button>
            <button
              class="btn-black"
              :aria-label="$t('actions.addAll')"
              :disabled="isLoading"
              @click="addHomebrews(homebrew.data)"
            >
              {{ $t('actions.addAll') }}
            </button>
          </template>
          <button
            v-else
            class="btn-black"
            :aria-label="$t('components.addInitiativeCampaignHomebrew.initiative.add')"
            :disabled="isLoading || !summoner"
            @click="addHomebrews(selected)"
          >
            {{ $t('components.addInitiativeCampaignHomebrew.initiative.add') }}
          </button>
        </div>
      </div>
    </Modal>
  </section>
</template>
