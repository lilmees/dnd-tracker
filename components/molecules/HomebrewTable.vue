<script setup lang="ts">
import { useCurrentCampaignStore } from '@/store/currentCampaign'

const store = useCurrentCampaignStore()
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between border-b border-slate-700 pb-1">
      <div class="flex gap-4 items-end">
        <h2>{{ $t('general.homebrew') }}</h2>
        <div class="hidden md:flex gap-1 text-[10px]">
          <p>(Monsters,</p>
          <p>Players,</p>
          <p>Npc's,</p>
          <p>Summons &</p>
          <p>Lair)</p>
        </div>
      </div>
      <AddHomebrew />
    </div>
    <div
      v-if="store?.campaign?.homebrew_items?.length"
      class="inline-block rounded-lg overflow-x-auto overflow-y-hidden w-full"
    >
      <table class="min-w-full bg-tracker">
        <thead>
          <tr>
            <th
              v-for="header in ['name', 'type', 'health', 'ac', 'link', 'actions', 'modify']"
              :key="header"
              class="py-3 px-2 border-b border-r last:border-r-0 border-slate-700 uppercase"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-auto-animate>
          <tr
            v-for="item in store.campaign.homebrew_items"
            :key="item.id"
            class="border-b last:border-b-0 border-slate-700"
          >
            <td class="px-2 py-1 border-r border-slate-700 relative">
              {{ item.name }}
            </td>
            <td
              class="flex gap-2 items-center px-2 py-1 border-r border-slate-700"
            >
              <Icon
                :name="useHomebrewIcon(item.type)"
                :class="useHomebrewColor(item.type)"
                size="20"
              />
              <p>
                {{ item.type || '' }}
              </p>
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              {{ item.type === 'lair' ? '' : item.health || '' }}
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              {{ item.type === 'lair' ? '' : item.ac || '' }}
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              <div class="flex justify-center">
                <NuxtLink
                  v-if="item.link"
                  :to="item.link"
                  target="_blank"
                  rel="noreferrer noopener"
                  class="w-fit"
                >
                  <Icon
                    name="ph:link-simple-horizontal"
                    class="w-8 h-8 cursor-pointer text-info"
                  />
                </NuxtLink>
              </div>
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              <p class="text-slate-400 text-center">
                coming soon
              </p>
            </td>
            <td class="px-2 py-1 flex justify-center gap-1">
              <UpdateHomebrew :item="item" />
              <button
                v-tippy="{ content: $t('actions.delete'), animation: 'shift-away' }"
                @click="store.removeHomebrew(item.id)"
              >
                <Icon
                  name="material-symbols:delete-outline-rounded"
                  class="w-6 h-6 text-danger outline-none"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="grid md:grid-cols-2 gap-4 pt-6">
      <div class="flex flex-col justify-center gap-4">
        <h2 class="pb-2">
          {{ $t('campaign.homebrew.title') }}
        </h2>
        <p class="max-w-prose">
          {{ $t('campaign.homebrew.text') }}
        </p>
      </div>
      <NuxtImg
        src="/dragon_hoard.webp"
        alt="Dragon on hoard"
        sizes="sm:500px md:500px lg:500px"
        format="webp"
        provider="imagekit"
        class="mx-auto"
      />
    </div>
  </section>
</template>
