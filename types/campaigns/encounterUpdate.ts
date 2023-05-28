interface EncounterUpdate {
  created_by?: string
  title?: string
  rows?: string | Row[]
  campaign?: number
  admins?: string[]
  round?: number
  owner?: string
  info?: string
  activeIndex?: number
  color?: string
  background?: string
}
