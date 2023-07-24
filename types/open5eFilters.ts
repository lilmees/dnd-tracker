type Open5eType = 'spells' | 'monsters' | 'backgrounds' | 'planes' | 'feats' | 'conditions' | 'races' | 'classes' | 'magicitems' | 'weapons' | 'armor'

interface Open5eQuery {
  search?: string
  page?: number
  limit?: number
 }

interface Open5eFilters {
  type?: Open5eType
  limit?: number
  query?: Open5eQuery
}
