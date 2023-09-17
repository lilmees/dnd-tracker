interface Pricing {
  type: StripeSubscriptionType
  title: string
  description: string
  prices: number[]
  items: { label: string, icon: string }[]
  monthId?: string
  yearId?: string
}
