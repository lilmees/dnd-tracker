import { serverSupabaseClient } from '#supabase/server'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event)
  const body = await readBody(event)

  const subscription = body.data.object
  const typeId = subscription.items.data[0].plan.id
  let productName
  let stripeData = {
    stripe_last_event: body.created,
    stripe_status: subscription.status,
    stripe_trail_ends_at: subscription.trail_end,
    stripe_ends_at: subscription.ended_at,
    stripe_started_at: subscription.start_date
  }

  if (typeId === config.public.stripeMediorMonthly || typeId === config.public.stripeMediorYearly) {
    productName = 'medior'
  } else if (typeId === config.public.stripeProMonthly || typeId === config.public.stripeProYearly) {
    productName = 'pro'
  }

  const { data } = await client
    .from('profiles')
    .select('stripe_last_event')
    .eq('stripe_id', subscription.customer)
    .single()

  if (data?.stripe_last_event > body.created) {
    return `Did not handle ${body.type} because it was an old event`
  }

  if (
    body.type === 'customer.subscription.created' ||
    body.type === 'customer.subscription.resumed' ||
    body.type === 'customer.subscription.updated'
  ) {
    stripeData = {
      ...stripeData,
      paid_subscription_active: true,
      subscription_id: subscription.id,
      subscription_type: productName
    }
  } else if (body.type === 'customer.subscription.deleted' || body.type === 'customer.subscription.paused') {
    stripeData = {
      ...stripeData,
      paid_subscription_active: false,
      subscription_id: null,
      subscription_type: 'free'
    }
  }

  await client.from('profiles').update(stripeData).eq('stripe_id', subscription.customer)

  return `handled ${body.type}`
})
