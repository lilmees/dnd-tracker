import { useServerStripe } from '#stripe/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = await useServerStripe(event)
  const body: { session_id: string } = await readBody(event)

  const checkoutSession = await stripe.checkout.sessions.retrieve(body.session_id)

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer as string,
    return_url: config.public.appDomain
  })

  return {
    url: portalSession.url
  }
})
