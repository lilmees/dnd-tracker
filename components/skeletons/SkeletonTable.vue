<script setup lang="ts">
defineProps<{ headers: { label: string, sort: boolean, id: string }[] }>()
</script>

<template>
  <table class="min-w-full bg-tracker/50 border-4 border-tracker">
    <thead>
      <tr>
        <th
          v-for="{ label } in headers"
          :key="label"
          class="py-3 px-2 border-b border-r last:border-r-0 border-slate-700"
        >
          <p>
            {{ label }}
          </p>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="i in 10"
        :key="i"
        class="border-b last:border-b-0 border-slate-700 animate-pulse"
      >
        <td
          v-for="j in headers.length"
          :key="j"
          class="px-2 py-1 border-r border-slate-700 relative"
        >
          <div class="w-full h-6 rounded-full bg-tracker" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
