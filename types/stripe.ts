type StripeSubscriptionType = 'medior' | 'pro' | 'free' | 'upgrade to pro'

type StripeFields =
  | 'subscription_type'
  | 'temp_subscription'

interface Stripe {
  subscription_type: StripeSubscriptionType
  temp_subscription: StripeSubscriptionType
  stripe_session_id?: string
  stripe_id?: string
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
    icon: string
    number?: number
  }[]
}
