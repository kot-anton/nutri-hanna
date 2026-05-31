import Stripe from 'stripe'

// Stripe instance at module level — reused across warm Lambda invocations.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.warn('[webhook] STRIPE_WEBHOOK_SECRET not set — skipping verification')
    return { statusCode: 200, body: JSON.stringify({ received: true }) }
  }

  // Netlify can base64-encode binary bodies; decode back to the exact raw bytes
  // that Stripe signed — otherwise signature verification fails.
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64')
    : event.body

  const sig = event.headers['stripe-signature']

  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err.message)
    return { statusCode: 400, body: `Webhook Error: ${err.message}` }
  }

  if (stripeEvent.type === 'payment_intent.succeeded') {
    const intent = stripeEvent.data.object
    console.log(
      `[webhook] payment_intent.succeeded — id: ${intent.id}`,
      `package: ${intent.metadata.packageId}`,
      `amount: ${intent.amount / 100} ${intent.currency.toUpperCase()}`
    )
    // TODO: send confirmation email, update database, trigger fulfillment
  }

  // Respond quickly — Stripe retries if we take > ~30 s
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ received: true }),
  }
}
