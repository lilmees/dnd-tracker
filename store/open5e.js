import { defineStore } from 'pinia'

export const useOpen5eStore = defineStore('useOpen5eStore', () => {
  async function getData (filters) {
    let url = `https://api.open5e.com/${filters.type ? filters.type + '/' : ''}?limit=20`
    Object.keys(filters.query).forEach((key) => {
      url += `&${key}=${filters.query[key]}`
    })
    return await $fetch(url)
  }

  return { getData }
})
