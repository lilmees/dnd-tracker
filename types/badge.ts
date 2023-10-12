interface BadgeI18n {
  nl: string
  en: string
}

interface Badge {
  id: number
  created_at?: string
  code?: string
  label: BadgeI18n
  icon: string
  background: string
  color: string
  description: BadgeI18n
}

interface EarnedBadge extends Omit<Badge, 'created_at'|'code'> {
  earned: number
}
