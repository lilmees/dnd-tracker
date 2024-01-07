type StripeSubscriptionType = 'medior' | 'pro' | 'free' | 'upgrade to pro'

type StripeSubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'unpaid'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'paused'

type StripeFields =
  | 'subscription_type'
  | 'temp_subscription'
  | 'subscription_id'

interface Stripe {
  subscription_type: StripeSubscriptionType
  temp_subscription: StripeSubscriptionType
  subscription_id: string | null
}

interface StripeProduct {
  name: string
  price: number
  id: string
}

interface ProductPricing {
  type: StripeSubscriptionType
  title: string
  description: string
  price?: number
  id?: string
  items: {
    icon: string,
    number?: number
  }[]
}
