<script setup>
import { createRowObject } from '@/util/createRowObject'
import { useTableStore } from '@/store/table'
import { useHomebrewStore } from '@/store/homebrew'

const homebrew = useHomebrewStore()
const store = useTableStore()

const isOpen = ref(false)
const isLoading = ref(false)
const homebrews = ref()
const selected = ref([])
const summoner = ref()

const id = computed(() => store.encounter.campaign?.id || store.encounter.campaign)
const summon = computed(() => !!selected.value.filter(s => s.type === 'summon').length)
const summonOptions = computed(() => {
  return [
    ...store.encounter.rows.map((r) => {
      return { label: r.name, id: r.id }
    })
  ]
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

function selectHomebrew (homebrew) {
  const index = selected.value.findIndex(h => h.id === homebrew.id)
  if (index > -1) {
    selected.value = selected.value.filter(h => h.id !== homebrew.id)
  } else {
    selected.value.push(homebrew)
  }
}

async function addHomebrews (homebrews) {
  try {
    isLoading.value = true
    const homebrewRows = []

    homebrews.forEach((hb) => {
      if (summon.value && summoner.value && hb.type === 'summon') {
        hb.summoner = {
          name: summoner.value.label,
          id: summoner.value.id
        }
      }

      homebrewRows.push(createRowObject(hb, hb.type, store.encounter.rows))
    })

    await store.encounterUpdate({
      rows: store.encounter.rows.includes('[')
        ? homebrewRows
        : [...store.encounter.rows, ...homebrewRows]
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

function selectedSummoner (id) {
  const filtered = summonOptions.value.filter(s => s.id === id && s.id !== 'none')
  summoner.value = filtered[0] || null
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
          <Select
            :input-label="$t('inputs.summonerLabel')"
            :label="summoner?.name || $t('homebrews.initiative.select')"
            bold
            :options="summonOptions"
            @selected="selectedSummoner"
          />
        </template>
        <div class="flex flex-col">
          <template
            v-for="hb in summon ? homebrews.filter(h => h.type === 'summon') : homebrews"
            :key="hb.id"
          >
            <div
              class="first:rounded-t-xl last:rounded-b-xl w-full bg-black p-2 border-b border-slate-700 cursor-pointer grid grid-cols-3 px-4"
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
            <Button
              :label="$t('actions.addSelected')"
              color="primary"
              :disabled="isLoading || !selected.length"
              @click="addHomebrews(selected)"
            />
            <Button
              :label="$t('actions.addAll')"
              color="success"
              :disabled="isLoading"
              @click="addHomebrews(homebrews)"
            />
          </template>
          <Button
            v-else
            :label="$t('homebrews.initiative.add')"
            color="primary"
            :disabled="isLoading || !summoner"
            @click="addHomebrews(selected)"
          />
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
