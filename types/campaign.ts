interface Campaign {
  id: number
  created_at: string
  created_by: string
  admins: string[]
  homebrew_items?: Homebrew[]
  notes?: Note[]
  title: string
  background: string
  color: string
}
