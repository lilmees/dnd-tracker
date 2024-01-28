export function randomArrayItem<T> (arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function searchArray<T> (arr: T[], key: keyof T, search: string): T[] {
  return arr
    .filter(item => (item[key] as string).toLowerCase().includes(search.toLowerCase().trim() || ''))
}
