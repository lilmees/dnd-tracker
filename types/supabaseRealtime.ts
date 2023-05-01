interface SupabaseRealTime {
  commit_timestamp: string
  errors: any
  eventType: string
  new: { [key: string]: any }
  old: { [key: string]: any }
  schema: string
  table: string
}
