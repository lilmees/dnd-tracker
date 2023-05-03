interface Pricing {
  title: string
  description: string
  prices: number[]
  items: { label: string, icon: string }[]
  monthId?: string
  yearId?: string
}
