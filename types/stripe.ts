type StripeSubscriptionType = 'medior'|'pro'|'free'

type StripeWebhookType = 'customer.subscription.created'|'customer.subscription.resumed'|'customer.subscription.updated'|'customer.subscription.deleted'|'customer.subscription.paused'|'invoice.payment_failed'

type StripeSubscriptionStatus = 'active'|'past_due'|'unpaid'|'canceled'|'incomplete'|'incomplete_expired'|'trialing'|'paused'

interface Stripe {
  subscription_type: StripeSubscriptionType
  subscription_id: string|null
  paid_subscription_active: boolean
  stripe_id?: string
  stripe_session_id?: string
  stripe_status: StripeSubscriptionStatus
  stripe_trail_end_at?: string
  stripe_ends_at: string
  stripe_started_at: string
  stripe_last_event: string
  stripe_trail_ends_at: string
}
