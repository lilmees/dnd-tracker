export const useHomebrewColor = (type: string): string => {
  switch (type) {
    case 'summon': return 'text-secondary'
    case 'npc': return 'text-success'
    case 'monster': return 'text-danger'
    case 'lair': return 'text-warning'
    default: return 'text-primary'
  }
}
