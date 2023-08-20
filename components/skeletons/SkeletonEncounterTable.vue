<script setup lang="ts">
</script>

<template>
  <div class="pb-[100px] animate-pulse">
    <div class="flex justify-end">
      <div class="flex gap-y-2 gap-x-6 items-center flex-wrap">
        <div class="w-[200px] h-8 bg-tracker rounded-full" />
        <div class="w-12 h-10 bg-tracker rounded-lg" />
      </div>
    </div>
    <div class="rounded-lg p-4 bg-tracker/50 space-y-4 mt-4 border-4 border-tracker max-w-full  overflow-hidden">
      <div
        class="flex flex-col md:flex-row gap-4 items-center justify-between container-max"
      >
        <div class="w-[100px] h-6 bg-tracker rounded-full" />
        <div class="w-[250px] h-10 bg-tracker rounded-full" />
        <div class="w-[200px] h-10 bg-backtrackerground rounded-full" />
      </div>

      <table class="min-w-full">
        <thead>
          <tr>
            <th
              v-for="header in [
                '',
                'components.encounterTable.headers.name',
                'components.encounterTable.headers.init',
                'components.encounterTable.headers.ac',
                'components.encounterTable.headers.health',
                'components.encounterTable.headers.actions',
                'components.encounterTable.headers.conditions',
                'components.encounterTable.headers.note',
                'components.encounterTable.headers.deathSaves',
                'components.encounterTable.headers.concentration',
                'components.encounterTable.headers.modify'
              ]"
              :key="header"
              class="py-3 px-2 bg-background border-b border-r last:border-r-0 border-slate-700 uppercase"
            >
              {{ $t(header) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="i in 10"
            :key="i"
            class="border-b last:border-b-0 border-slate-700"
          >
            <td class="px-2 py-1 border-r border-slate-700 text-center max-w-[30px]">
              <div class="w-6 h-6 bg-background rounded-full" />
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              <div class="w-[100px] h-8 bg-background rounded-full" />
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              <div class="w-[100px] h-8 bg-background rounded-full" />
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              <div class="w-[100px] h-8 bg-background rounded-full" />
            </td>
            <td class="p-2 border-r border-slate-700">
              <div class="w-[100px] h-8 bg-background rounded-full" />
            </td>
            <td class="p-2 border-r border-slate-700">
              <div class="flex gap-1">
                <div class="w-6 h-6 bg-background rounded-full" />
                <div class="w-6 h-6 bg-background rounded-full" />
                <div class="w-6 h-6 bg-background rounded-full" />
                <div class="w-6 h-6 bg-background rounded-full" />
              </div>
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              <div class="w-[100px] h-8 bg-background rounded-full" />
            </td>
            <td class="border-r border-slate-700 min-w-[150px] min-h-[50px] relative">
              <div class="w-full h-8 bg-background rounded-full" />
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              <div class="flex gap-1 flex-wrap">
                <div class="flex gap-1">
                  <div class="w-6 h-6 bg-background rounded-full" />
                  <div class="w-6 h-6 bg-background rounded-full" />
                  <div class="w-6 h-6 bg-background rounded-full" />
                </div>
                <div class="flex gap-1">
                  <div class="w-6 h-6 bg-background rounded-full" />
                  <div class="w-6 h-6 bg-background rounded-full" />
                  <div class="w-6 h-6 bg-background rounded-full" />
                </div>
              </div>
            </td>
            <td class="px-2 py-1 border-r border-slate-700">
              <div class="w-6 h-6 bg-background rounded-full" />
            </td>
            <td class="px-2 py-1">
              <div class="flex gap-1">
                <div class="w-6 h-6 bg-background rounded-full" />
                <div class="w-6 h-6 bg-background rounded-full" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        class="flex flex-wrap flex-col md:flex-row items-end md:items-center justify-end gap-2"
      >
        <div class="h-10 w-10 bg-tracker rounded-full" />
        <div class="h-10 w-10 bg-tracker rounded-full" />
        <div class="h-10 w-10 bg-tracker rounded-full" />
        <div class="h-10 w-10 bg-tracker rounded-full" />
        <div class="h-10 w-10 bg-tracker rounded-full" />
      </div>
    </div>
  </div>
</template>
