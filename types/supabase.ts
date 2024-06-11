type SbTables =
  | 'initiative_sheets'
  | 'homebrew_items'
  | 'campaigns'
  | 'notes'

interface SbRealTime {
  commit_timestamp: string
  errors: any
  eventType: string
  new: Obj
  old: Obj
  schema: string
  table: string
}

interface SbEq {
  field: string
  value: string | number
}

interface SbFetchOptions {
  table: SbTables
  fields?: string[]
  select?: string
  page?: number
  perPage?: number
  filters?: TableFilters
  eq?: SbEq
  fuzzy?: boolean
}

interface SbRange {
  from: number
  to: number
}

interface SbQuery<T> {
  data: T[]
  count: number | null
  pagesCount: number
}
