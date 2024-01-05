import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (body.type !== 'checkout.session.completed') {
    return
  }

  const client = await serverSupabaseClient(event)

  const subscription = body.data.object

  await client
    .from('profiles')
    .update({ paid_subscription_active: true } as never)
    .eq('stripe_id', subscription.customer)

  return `handled ${body.type}`
})
