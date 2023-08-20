const isBulk = ref<boolean>(false)
const isUpdating = ref<boolean>(false)
const needConfirmation = ref<boolean>(false)
const selected = ref<any[]>([])

function toggleSelection (item: Encounter|Campaign): void {
  const index: number = selected.value.findIndex(s => s.id === item.id)
  if (index === -1) {
    selected.value.push(item)
  } else {
    selected.value.splice(index, 1)
  }
}

function reset (): void {
  needConfirmation.value = false
  isBulk.value = false
  isUpdating.value = false
  selected.value = []
}

export const useBulkEditing = () => {
  return {
    isBulk,
    isUpdating,
    needConfirmation,
    selected,
    toggleSelection,
    reset
  }
}
