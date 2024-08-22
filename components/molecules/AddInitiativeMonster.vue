<script setup lang="ts">
import logRocket from 'logrocket'
import { _0 } from '#tailwind-config/theme/backdropBlur'

const store = useTableStore()
const toast = useToastStore()
const open5e = useOpen5eStore()

const isLoading = ref<boolean>(false)
const isOpen = ref<boolean>(false)

whenever(() => isOpen.value, () => {
  if (!open5e.hits.length) {
    open5e.fetchMonsters({}, 0)
  }
})

async function addMonster(monster: Open5eItem) {
  isLoading.value = true

  try {
    if (store.encounter) {
      const row = useCreateRow({
        ...monster,
        initiative_modifier: initiativeModifierFromDEX(monster.dexterity),
      } as unknown as Row, 'monster', store.encounter.rows)
      await store.encounterUpdate({
        rows: [...store.encounter.rows, row],
      })
      reset()
    }
  }
  catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  }
  finally {
    isLoading.value = false
  }
}

function reset() {
  open5e.form = { search: '', cr: undefined }
  open5e.hits = []
  isOpen.value = false
}
</script>

<template>
  <section>
    <button
      v-tippy="{
        content: $t('components.addInitiativeMonster.bestiary'),
        touch: false,
      }"
      :aria-label="$t('components.addInitiativeMonster.bestiary')"
      class="flex gap-2 items-center"
      @click="isOpen = true"
    >
      <span class="md:hidden text-right">
        {{ $t('components.addInitiativeMonster.bestiary') }}
      </span>
      <Icon
        name="la:dragon"
        class="text-info w-10 h-10"
        aria-hidden="true"
      />
    </button>
    <FullScreenSearch
      :open="isOpen"
      @close="reset"
    >
      <div class="flex flex-col max-h-screen py-6">
        <h1 class="pb-4 text-center">
          {{ $t('components.addInitiativeMonster.bestiary') }}
        </h1>
        <div
          id="el"
          class="flex w-full items-start gap-4 max-w-prose mx-auto"
        >
          <FormKit
            v-model="open5e.form.search"
            type="search"
            name="search"
            :label="$t('components.inputs.nameLabel')"
            validation="length:0,50"
            placeholder="Copper dragon"
            outer-class="grow"
          />
          <FormKit
            v-model="open5e.form.cr"
            name="cr"
            type="number"
            :label="$t('components.inputs.challengeLabel')"
            validation="number|between:0,30"
            min="0"
            max="30"
            outer-class="grow"
          />
          <FormKit
            v-model="open5e.sortBy"
            :disabled="open5e.isLoading"
            :label="$t('components.addInitiativeMonster.sort.title')"
            name="sortBy"
            type="select"
            :options="[
              { label: $t('components.addInitiativeMonster.sort.options.alphabet'), value: 'name' },
              { label: $t('components.addInitiativeMonster.sort.options.mostHP'), value: '-hit_points' },
              { label: $t('components.addInitiativeMonster.sort.options.leastHP'), value: 'hit_points' },
              { label: $t('components.addInitiativeMonster.sort.options.mostAC'), value: '-armor_class' },
              { label: $t('components.addInitiativeMonster.sort.options.leastAC'), value: 'armor_class' },
              { label: $t('components.addInitiativeMonster.sort.options.mostCR'), value: '-cr' },
              { label: $t('components.addInitiativeMonster.sort.options.leastCR'), value: 'cr' },
            ]"
            outer-class="$reset !pb-0"
          />
        </div>
        <div class="overflow-y-auto max-h-full">
          <div class="grid lg:grid-cols-2 gap-4 items-start">
            <template v-if="open5e.isLoading">
              <SkeletonMonsterCard
                v-for="i in 20"
                :key="i"
              />
            </template>
            <template v-else-if="open5e.hits.length">
              <MonsterCard
                v-for="hit in open5e.hits"
                :key="hit.slug"
                :monster="hit"
                addable
                @add="addMonster"
              />
            </template>
          </div>
          <p
            v-if="!open5e.isLoading && !open5e.hits.length && (open5e.form.search || open5e.form.cr)"
            class="text-center max-w-prose mx-auto"
          >
            {{ $t('components.addInitiativeMonster.notFound') }}
          </p>
        </div>
        <Pagination
          v-if="!open5e.isLoading && open5e.hits.length && open5e.pages > 1"
          v-model="open5e.page"
          :total-pages="open5e.pages"
          @paginate="open5e.paginate"
        />
      </div>
    </FullScreenSearch>
  </section>
</template>
