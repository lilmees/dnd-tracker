<script setup lang='ts'>
import logRocket from 'logrocket'

useHead({ title: 'Feature request' })

const features = useFeaturesStore()
const profile = useProfileStore()
const toast = useToastStore()
const localePath = useLocalePath()

const isOpen = ref<boolean>(false)

async function vote (id: string, votes: FeatureRequestVotes): Promise<void> {
  try {
    await features.vote(id, votes)
  } catch (err) {
    logRocket.captureException(err as Error)
    toast.error()
  }
}
</script>

<template>
  <Layout shadow>
    <section class="max-w-4xl mx-auto">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 pb-6">
        <FormKit
          v-model="features.search"
          :disabled="features.loading"
          type="search"
          name="search"
          :label="$t('components.inputs.titleLabel')"
          outer-class="$reset grow !pb-0"
        />
        <FormKit
          v-if="profile.data"
          v-model="features.createdBy"
          :disabled="features.loading"
          :label="$t('pages.featureRequest.filter.title')"
          name="created by"
          type="select"
          :options="[
            { label: $t('pages.featureRequest.filter.options.my'), value: 'my' },
            { label: $t('pages.featureRequest.filter.options.all'), value: 'all' }
          ]"
          outer-class="$reset !pb-0"
        />
        <FormKit
          v-model="features.sortBy"
          :disabled="features.loading"
          :label="$t('pages.featureRequest.sort.title')"
          name="sortBy"
          type="select"
          :options="[
            { label: $t('pages.featureRequest.sort.options.mostVotes'), value: 'voted_most' },
            { label: $t('pages.featureRequest.sort.options.leastVotes'), value: 'voted_least' },
            { label: $t('pages.featureRequest.sort.options.newestFirst'), value: 'first_new' },
            { label: $t('pages.featureRequest.sort.options.oldestFirst'), value: 'first_old' }
          ]"
          outer-class="$reset !pb-0"
        />
        <button
          class="btn-primary tracker-shadow-pulse mt-[18px]"
          :aria-label="$t('pages.featureRequest.request')"
          :disabled="features.loading"
          @click="profile.data ? isOpen = true : navigateTo(localePath('/login'))"
        >
          {{ $t('pages.featureRequest.request') }}
        </button>
      </div>
      <template v-if="features.data?.length">
        <!-- Feature requests -->
        <div v-if="!features.loading && features.sortedFeatures.length" class="flex flex-col gap-4">
          <template
            v-for="feature in features.sortedFeatures"
            :key="feature.id"
          >
            <FeatureRequestCard
              v-if="
                feature.status !== 'review'
                  || (feature.status === 'review' && feature.created_by.id === profile.data?.id)
              "
              :feature="feature"
              @update="vote(feature.id, $event)"
              @login="navigateTo(localePath('/login'))"
            />
          </template>
        </div>
        <!-- Nothing found while sorting -->
        <div
          v-else-if="features.sortedFeatures.length === 0 && !features.loading && features.activeFilters"
          class="flex flex-col justify-center gap-4 border-4 border-black bg-black/30 rounded-lg p-4"
        >
          <p>
            {{ $t('pages.featureRequest.nothing') }}
          </p>
        </div>
      </template>
      <!-- Loading feature request -->
      <div v-else-if="features.loading" class="flex flex-col gap-4">
        <SkeletonFeatureRequestCard v-for="i in 5" :key="i" />
      </div>
      <!-- No feature request found -->
      <div
        v-else-if="features.data?.length === 0 && !features.loading && !features.activeFilters"
        class="flex flex-col justify-center gap-4 border-4 border-black bg-black/30 rounded-lg p-4"
      >
        <h3 class="pb-2">
          {{ $t('pages.featureRequest.cta.title') }}
        </h3>
        <p>
          {{ $t('pages.featureRequest.cta.text') }}
        </p>
      </div>
    </section>
    <AddFeatureRequestModal
      v-if="profile.data"
      :open="isOpen"
      @close="isOpen = false"
    />
  </Layout>
</template>
