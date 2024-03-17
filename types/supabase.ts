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
