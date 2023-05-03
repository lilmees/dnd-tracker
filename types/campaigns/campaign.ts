interface Campaign {
  id: number
  created_at: string
  created_by: string
  admins: string[]
  homebrew_items?: Homebrew[]
  initiative_sheets?: Encounter[]
  notes?: Note[]
  title: string
  background: string
  color: string
}
