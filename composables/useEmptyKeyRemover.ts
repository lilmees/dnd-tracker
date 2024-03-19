export function useEmptyKeyRemover<T extends Record<string, any>> (obj: T): T {
  for (const k in obj) {
    if (obj[k] === '' || obj[k] === undefined || obj[k] === null) {
      delete obj[k]
    }
  }

  return obj
}
