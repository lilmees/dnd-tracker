interface EncounterUpdate {
  name?: string
  rows?: string | Row[]
  campaign?: number
  admins?: string[]
  round?: number
  owner?: string
  info?: string
  activeIndex?: number
}
