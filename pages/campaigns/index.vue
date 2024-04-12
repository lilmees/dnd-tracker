<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Campaigns' })

const toast = useToastStore()
const store = useCampaignsStore()
const { t } = useI18n()

const isOpen = ref<boolean>(false)
const search = ref<string>('')
const sortedBy = ref<string>('title')
const sortACS = ref<boolean>(false)
const isBulk = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const selected = ref<Campaign[]>([])

const headers = [
  { label: t('general.name'), sort: true, id: 'title' },
  { label: t('general.members'), sort: true, id: 'team' },
  { label: t('general.encounters'), sort: true, id: 'initiative_sheets' },
  { label: t('general.homebrew'), sort: true, id: 'homebrew_items' },
  { label: t('general.modify'), sort: false, id: 'modify' }
]

onMounted(() => { store.fetch() })

whenever(() => store.error, () => { toast.error() })

const visibleItems = computed<Campaign[]>(() => {
  if (!store.allowedCampaigns) { return [] }

  const sorted = sortArray<Campaign>(store.allowedCampaigns, sortedBy.value, sortACS.value)

  return searchArray<Campaign>(sorted, 'title', search.value)
})

const noItems = computed<boolean>(() => visibleItems.value.length === 0 && !store.loading)

function resetState (): void {
  needConfirmation.value = false
  isBulk.value = false
  isUpdating.value = false
  selected.value = []
  isOpen.value = false
}
</script>

<template>
  <Layout shadow>
    <div v-if="!store.error">
      <div class="border-b-2 border-slate-700 pb-1 mb-6 flex flex-wrap gap-4 justify-between items-center">
        <h1 class="grow">
          {{ $t('pages.campaigns.campaigns') }}
        </h1>
        <div class="flex items-end gap-2 flex-wrap">
          <span
            v-if="store.campaigns"
            class="text-[12px]"
            :class="{ 'text-danger': store.campaigns.length >= store.max }"
          >
            {{ store.campaigns.length }}/{{ store.max }}
          </span>
          <button
            :aria-label="$t('pages.campaigns.add')"
            :disabled="store.loading || (store.campaigns && store.max <= store.campaigns.length) || isBulk"
            class="btn-small-primary"
            @click="isOpen = true"
          >
            <Icon
              name="material-symbols:add"
              class="h-4 w-4"
              aria-hidden="true"
            />
            {{ $t('pages.campaigns.add') }}
          </button>
          <button
            v-tippy="$t('actions.bulkRemove')"
            :aria-label="$t('actions.bulkRemove')"
            :disabled="store.loading"
            class="btn-small-danger"
            @click="() => {
              isBulk = !isBulk;
              if (!isBulk) { resetState() }
            }"
          >
            <Icon
              name="material-symbols:delete-outline-rounded"
              class="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      <template v-if="store.loading && !store.allowedCampaigns">
        <SkeletonInput :label="false" class="w-[256px]" />
        <SkeletonTable :headers="headers" />
      </template>
      <template v-else-if="store.allowedCampaigns?.length">
        <ContentHeader v-model:search="search" shadow />
        <BulkRemove
          v-model:isBulk="isBulk"
          v-model:needConfirmation="needConfirmation"
          v-model:selected="selected"
          type="campaigns"
        />
        <LimitCta
          v-if="!isBulk && store.campaigns && store.max <= store.campaigns.length"
          class="mb-10"
        />
        <Table
          v-model:sorted-by="sortedBy"
          v-model:acs="sortACS"
          :headers="headers"
          shadow
        >
          <tr
            v-for="item in visibleItems"
            :key="item.id"
            class="tr transition-colors"
            :class="{
              'bg-danger/20': selected.find(c => c.id === item.id)
            }"
          >
            <td class="td">
              <RouteLink
                :url="campaignUrl(item, 'content')"
                class="underline underline-offset-2 decoration-primary"
              >
                {{ item.title }}
              </RouteLink>
            </td>
            <td
              v-for="td in [
                (item.team?.length || 0) + 1,
                item.initiative_sheets?.length || 0,
                item.homebrew_items?.length || 0
              ]"
              :key="td"
              class="td"
            >
              {{ td }}
            </td>
            <td class="td">
              <div class="flex justify-center items-center gap-2">
                <FormKit
                  v-if="isBulk"
                  name="marketing"
                  type="checkbox"
                  :label="$t('actions.select')"
                  :value="!!selected.find(c => c.id === item.id)"
                  outer-class="$reset !pb-0"
                  @click="toggleSelection(item)"
                />
                <template v-else>
                  <button
                    v-tippy="$t('actions.update')"
                    class="icon-btn-info"
                    :aria-label="$t('actions.update')"
                    @click="() => {
                      selected = [item];
                      isUpdating = true
                    }"
                  >
                    <Icon
                      name="lucide:wrench"
                      class="w-6 h-6"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    v-tippy="$t('actions.delete')"
                    class="icon-btn-danger"
                    :aria-label="$t('actions.delete')"
                    @click="() => {
                      selected = [item];
                      needConfirmation = true
                    }"
                  >
                    <Icon
                      name="material-symbols:delete-outline-rounded"
                      class="w-6 h-6"
                      aria-hidden="true"
                    />
                  </button>
                </template>
              </div>
            </td>
          </tr>
          <template v-if="noItems" #empty>
            {{ $t('components.table.nothing', { item: $t('general.campaigns').toLowerCase() }) }}
          </template>
        </Table>
      </template>
      <NoContent
        v-else
        :content="$t('general.campaigns').toLowerCase()"
        icon="fa6-solid:dungeon"
        class="mt-20"
      />
    </div>
    <div v-else class="max-w-sm mx-auto py-20 space-y-4">
      <h2 class="text-center text-danger">
        {{ $t('general.error.text') }}
      </h2>
      <button
        class="btn-black w-full"
        :aria-label="$t('actions.tryAgain')"
        @click="store.fetch()"
      >
        {{ $t('actions.tryAgain') }}
      </button>
    </div>
    <ConfirmationModal
      :open="needConfirmation"
      :title="selected.length === 1
        ? selected[0].title
        : $t('pages.campaigns.remove.multiple', { number: selected.length })
      "
      @close="resetState"
      @delete="() => {
        store.deleteCampaign(
          selected.length === 1 ? selected[0].id : selected.map(v => v.id)
        );
        resetState()
      }"
    />
    <CampaignModal
      :open="isOpen || (isUpdating && !!selected.length)"
      :campaign="selected.length ? selected[0] : undefined"
      :update="isUpdating"
      @close="resetState"
    />
  </Layout>
</template>
