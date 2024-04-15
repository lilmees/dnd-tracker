type SupabaseTables =
| 'initiative_sheets'
| 'homebrew_items'
| 'campaigns'
| 'notes'

interface SupabaseRealTime {
  commit_timestamp: string
  errors: any
  eventType: string
  new: Obj
  old: Obj
  schema: string
  table: string
}

interface SupabaseEq {
  field: string,
  value: string | number
}

interface SupabaseFetchOptions {
  table: SupabaseTables
  field?: string
  select?: string
  page?: number
  perPage?: number
  filters?: TableFilters
  eq?: SupabaseEq
  fuzzy?: boolean
}

interface SupabaseRange {
  from: number
  to: number
}

interface SupabaseQuery <T> {
  data: T[],
  count: number | null
}
