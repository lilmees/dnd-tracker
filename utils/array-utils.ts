export function randomArrayItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function searchArray<T>(arr: T[], key: keyof T, search: string): T[] {
  return arr
    .filter(item => (item[key] as string)
      .toLowerCase()
      .includes(search.toLowerCase().trim() || ''),
    )
}

export function toggleSelection<T extends { id: number }>(item: T, selected: T[]): void {
  const index: number = selected.findIndex(s => s.id === item.id)

  index === -1 ? selected.push(item) : selected.splice(index, 1)
}
