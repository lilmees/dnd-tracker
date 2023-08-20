<template>
  <table class="min-w-full bg-tracker/50 border-4 border-tracker">
    <thead>
      <tr>
        <th
          v-for="header in ['name', 'type', 'player', 'health', 'ac', 'link', 'actions', 'modify']"
          :key="header"
          class="py-3 px-2 border-b border-r last:border-r-0 border-slate-700"
        >
          <div class="flex gap-2 justify-center items-center">
            <p class="uppercase">
              {{ header }}
            </p>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="i in 10"
        :key="i"
        class="border-b last:border-b-0 border-slate-700 animate-pulse"
      >
        <td class="px-2 py-1 border-r border-slate-700 relative">
          <div class="w-[200px] h-6 rounded-full bg-background" />
        </td>
        <td
          class="px-2 py-1 border-r border-slate-700"
        >
          <div class="flex gap-2 items-center">
            <div class="w-6 h-6 rounded-full bg-background" />
            <div class="w-[100px] h-6 rounded-full bg-background" />
          </div>
        </td>
        <td class="px-2 py-1 border-r border-slate-700 relative">
          <div class="w-[200px] h-6 rounded-full bg-background" />
        </td>
        <td class="px-2 py-1 border-r border-slate-700">
          <div class="w-[200px] h-6 rounded-full bg-background" />
        </td>
        <td class="px-2 py-1 border-r border-slate-700">
          <div class="w-[150px] h-6 rounded-full bg-background" />
        </td>
        <td class="px-2 py-1 border-r border-slate-700">
          <div class="flex w-[100px] justify-center">
            <div class="w-6 h-6 rounded-full bg-background" />
          </div>
        </td>
        <td class="px-2 py-1 border-r border-slate-700">
          <div class="w-[200px] h-6 rounded-full bg-background" />
        </td>
        <td class="px-2 py-1">
          <div class="flex justify-center items-center gap-1">
            <div class="w-6 h-6 rounded-full bg-background" />
            <div class="w-6 h-6 rounded-full bg-background" />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
