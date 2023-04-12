import Stripe from 'stripe'

const config = useRuntimeConfig()

const stripe = new Stripe(config.stripeSk, null)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const checkoutSession = await stripe.checkout.sessions.retrieve(body.session_id)
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: config.public.appDomain
  })

  return { url: portalSession.url }
})
