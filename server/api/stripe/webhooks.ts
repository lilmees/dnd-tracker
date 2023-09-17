import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  if (!correctWebhookType(body.type)) {
    return
  }

  const subscription = body.data.object

  let stripeData: Partial<Stripe> = {
    stripe_last_event: body.created,
    stripe_status: subscription.status,
    stripe_trail_ends_at: subscription.trail_end,
    stripe_ends_at: subscription.ended_at,
    stripe_started_at: subscription.start_date,
    subscription_type: getSubscriptionType(subscription.items?.data[0].plan.id)
  }

  const { data } = await client
    .from('profiles')
    .select('stripe_last_event')
    .eq('stripe_id', subscription.customer)
    .single() as { data: { stripe_last_event: number }}

  if (data?.stripe_last_event > body.created) {
    return `Did not handle ${body.type} because it was an old event`
  }

  const cancel = cancelSubscription(body.type)

  stripeData = {
    ...stripeData,
    paid_subscription_active: !cancel,
    subscription_id: cancel ? null : subscription.id
  }

  await client
    .from('profiles')
    .update(stripeData as never)
    .eq('stripe_id', subscription.customer)

  return `handled ${body.type}`
})

function getSubscriptionType (id?: string): StripeSubscriptionType {
  const config = useRuntimeConfig()

  if (!id) {
    return 'free'
  }

  if (id === config.public.stripeMediorMonthly || id === config.public.stripeMediorYearly) {
    return 'medior'
  } else if (id === config.public.stripeProMonthly || id === config.public.stripeProYearly) {
    return 'pro'
  } else {
    return 'free'
  }
}

function correctWebhookType (type: StripeWebhookType): boolean {
  return type === 'customer.subscription.created' ||
    type === 'customer.subscription.resumed' ||
    type === 'customer.subscription.updated' ||
    type === 'customer.subscription.deleted' ||
    type === 'customer.subscription.paused' ||
    type === 'invoice.payment_failed'
}

function cancelSubscription (type: StripeWebhookType): boolean {
  return type === 'customer.subscription.deleted' ||
    type === 'customer.subscription.paused' ||
    type === 'invoice.payment_failed'
}
