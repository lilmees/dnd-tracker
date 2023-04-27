interface Obj {
  [key: string]: any
}

export const useEmptyKeyRemover = (obj: Obj): Obj => {
  for (const k in obj) {
    if (obj[k] === '' || obj[k] === undefined || obj[k] === null) {
      delete obj[k]
    }
  }

  return obj
}
