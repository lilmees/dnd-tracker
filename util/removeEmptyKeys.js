export const removeEmptyKeys = (obj) => {
  for (let k in obj) {
    if (obj[k] === '' || obj[k] === undefined || obj[k] === null) delete obj[k]
  }

  return obj
}
