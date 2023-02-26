import { serverSupabaseClient } from '#supabase/server'
import Stripe from 'stripe'

const config = useRuntimeConfig()

const stripe = new Stripe(config.stripeSk, null)

export default defineEventHandler(async event => {
  const client = serverSupabaseClient(event)
  const body = await readBody(event)

  const price = await stripe.prices.retrieve(body.lookup)

  let customer

  if (!body.customer) {
    customer = await stripe.customers.create({ email: body.user.email })
    await client.from('profiles').update({ stripe_id: customer.id }).eq('id', body.user.id)
  }

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [{ price: price.id, quantity: 1 }],
    mode: 'subscription',
    success_url: `${config.public.appDomain}${body.locale === 'en' ? '/en' : ''}/subscribe-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.public.appDomain}${body.locale === 'en' ? '/en' : ''}/pricing`,
    customer: body.customer || customer.id
  });

  return { url: session.url }
})
