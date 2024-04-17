export function removeEmptyKeys<T> (obj: Record<string, any>): T {
  for (const k in obj) {
    if (obj[k] === '' || obj[k] === undefined || obj[k] === null) {
      delete obj[k]
    }
  }

  return obj as T
}
