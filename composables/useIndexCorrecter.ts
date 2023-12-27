export const useIndexCorrecter = (rows: Row[]): Row[] => {
  const sortedObjects = [...rows] // Make shallow copy
  const corrected: Row[] = []

  // Sort the array based on the initiative value in descending order
  sortedObjects.sort((a, b) => b.initiative - a.initiative)

  // Add the index to each object
  sortedObjects.forEach((obj, index) => {
    corrected.push({ ...obj, index })
  })

  return corrected
}
