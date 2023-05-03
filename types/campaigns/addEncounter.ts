interface AddEncounter {
  created_by: string
  title: string
  rows: Row[]
  campaign: number | undefined
  admins: string[]
  round: number
  owner?: string
  info?: string
  activeIndex: number
  color: string
  background: string
}
