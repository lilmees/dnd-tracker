export const useHomebrewIcon = (type: string): string => {
  switch (type) {
    case 'summon': return 'jam:magic'
    case 'npc': return 'carbon:person'
    case 'monster': return 'la:dragon'
    case 'lair': return 'material-symbols:castle-outline-rounded'
    default: return 'lucide:sword'
  }
}
