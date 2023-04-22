<script setup>
import { createRowObject } from '@/util/createRowObject'
import { useTableStore } from '@/store/table'
import { useHomebrewStore } from '@/store/homebrew'
import Shield from '@/assets/icons/shield.svg'
import Heart from '@/assets/icons/heart.svg'

const homebrew = useHomebrewStore()
const store = useTableStore()

const isOpen = ref(false)
const isLoading = ref(false)
const homebrews = ref()
const selected = ref([])
const id = computed(() => store.encounter.campaign?.id || store.encounter.campaign)

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
      <h2>{{ $t('encounter.addCampaignHomebrew') }}</h2>
      <div v-if="homebrews?.length" class="space-y-4">
        <div class="flex flex-col">
          <template v-for="hb in homebrews" :key="hb.id">
            <div
              class="first:rounded-t-xl last:rounded-b-xl w-full bg-black p-2 border-b border-slate-700 cursor-pointer grid grid-cols-3"
              :class="{
                'border-2 border-b-2 border-primary': selected.filter(p => p.id === hb.id).length
              }"
              @click="selectHomebrew(hb)"
            >
              <h3 class="text-center">
                {{ hb.name }}
              </h3>
              <div class="flex gap-4">
                <div class="flex gap-1">
                  <p class="font-bold">
                    {{ hb.health || '_' }}
                  </p>
                  <Heart class="w-6 h-6 text-danger" />
                </div>
                <div class="flex gap-1">
                  <p class="font-bold">
                    {{ hb.ac || '_' }}
                  </p>
                  <Shield class="w-6 h-6 text-help" />
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
