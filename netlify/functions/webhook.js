import Stripe from 'stripe'
import nodemailer from 'nodemailer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

const sendOwnerEmail = async ({ packageName, amountFormatted, currency, paymentId, customerName, receiptEmail }) => {
  const user    = process.env.OWNER_EMAIL
  const pass    = process.env.OWNER_EMAIL_APP_PASSWORD
  if (!user || !pass) {
    console.warn('[webhook] OWNER_EMAIL or OWNER_EMAIL_APP_PASSWORD not set — skipping email')
    return
  }

  const mailer = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })

  await mailer.sendMail({
    from:    user,
    to:      user,
    subject: `New payment received — ${packageName}`,
    text: [
      'A payment was successfully completed.',
      '',
      `Package:    ${packageName}`,
      `Amount:     ${amountFormatted} ${currency}`,
      `Payment ID: ${paymentId}`,
      `Customer:   ${customerName}`,
      `Email:      ${receiptEmail}`,
    ].join('\n'),
  })
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.warn('[webhook] STRIPE_WEBHOOK_SECRET not set — skipping verification')
    return { statusCode: 200, body: JSON.stringify({ received: true }) }
  }

  // Netlify can base64-encode binary bodies — decode back to the exact raw bytes
  // that Stripe signed, otherwise signature verification fails.
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
    const packageName     = intent.metadata.packageName ?? intent.metadata.packageId ?? 'Unknown'
    const amountFormatted = (intent.amount / 100).toFixed(2)
    const currency        = intent.currency.toUpperCase()

    console.log(`[webhook] payment_intent.succeeded — id: ${intent.id}, package: ${packageName}, amount: ${amountFormatted} ${currency}`)

    let customerName = 'not provided'
    if (intent.latest_charge) {
      try {
        const charge = await stripe.charges.retrieve(intent.latest_charge)
        customerName = charge.billing_details?.name ?? 'not provided'
      } catch (err) {
        console.warn('[webhook] Could not retrieve charge:', err.message)
      }
    }

    try {
      await sendOwnerEmail({
        packageName,
        amountFormatted,
        currency,
        paymentId:     intent.id,
        customerName,
        receiptEmail:  intent.receipt_email ?? 'not provided',
      })
      console.log('[webhook] Owner notification email sent')
    } catch (err) {
      // Log but don't fail the webhook — Stripe must receive 200 quickly
      console.error('[webhook] Failed to send owner email:', err.message)
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ received: true }),
  }
}
