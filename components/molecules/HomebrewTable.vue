<script setup>
import { useCurrentCampaignStore } from '@/store/currentCampaign'
import Copy from '@/assets/icons/copy.svg'
import Delete from '@/assets/icons/delete.svg'
import Update from '@/assets/icons/update.svg'
import Link from '@/assets/icons/link.svg'

const store = useCurrentCampaignStore()
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between border-b border-slate-700 pb-1">
      <div class="flex gap-4 items-end">
        <h2>{{ $t('general.homebrew') }}</h2>
        <div class="flex gap-1 text-[10px]">
          <p>(Monsters,</p>
          <p>Players,</p>
          <p>Npc's,</p>
          <p>Summons &</p>
          <p>Lair)</p>
        </div>
      </div>
      <AddHomebrew />
    </div>
    <div class="inline-block rounded-xl overflow-x-auto overflow-y-hidden w-full">
      <table class="min-w-full bg-tracker">
        <thead>
          <tr>
            <th 
              v-for="header in ['name', 'type', 'health', 'ac', 'link', 'actions']" 
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
            <td class="px-2 py-1 border-r border-slate-700">
              {{ item.name || '' }}
            </td>
            <td 
              class="px-2 py-1 border-r border-slate-700"
              :class="{
                'text-white': item.type === 'player',
                'text-primary': item.type === 'summon',
                'text-success': item.type === 'npc',
                'text-danger': item.type === 'monster',
                'text-warning': item.type === 'lair',
              }"
            >
              {{ item.type || '' }}
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              {{ item.health || '' }}
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              {{ item.ac || '' }}
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              <NuxtLink
                v-if="item.link"
                :to="item.link" 
                target="_blank" 
                rel="noreferrer noopener"
              >
                <Link class="w-6 h-6 cursor-pointer text-info mx-auto" />
              </NuxtLink>
            </td>
            <td class="px-2 py-1 border-r border-slate-700 flex gap-1 flex-wrap justify-center">
              <Update 
                v-tippy="{ content: $t('actions.update'), animation: 'shift-away' }"
                class="w-6 h-6 cursor-pointer text-warning outline-none" 
                @click="$emit('copy')" 
              />
              <Copy
                v-tippy="{ content: $t('actions.copy'), animation: 'shift-away' }"
                class="w-6 h-6 cursor-pointer text-primary outline-none" 
                @click="$emit('copy')" 
              />
              <Delete 
                v-tippy="{ content: $t('actions.delete'), animation: 'shift-away' }" 
                class="w-6 h-6 cursor-pointer text-danger outline-none" 
                @click="$emit('delete')" 
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
