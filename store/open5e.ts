export const useOpen5eStore = defineStore('useOpen5eStore', () => {
  async function getData (filters: Open5eFilters): Promise<any> {
    let url = `https://api.open5e.com/${filters.type ? filters.type + '/' : ''}?limit=${filters.limit || '20'}`

    if (filters.query) {
      Object.keys(filters.query).forEach((key: string) => {
        url += `&${key}=${filters.query![key as keyof Open5eQuery]}`
      })
    }

    return await $fetch(url)
  }

  const options: Open5eType[] = [
    'spells',
    'backgrounds',
    'planes',
    'feats',
    'conditions',
    'magicitems',
    'weapons',
    'armor'
  ]

  return {
    options,
    getData
  }
})
