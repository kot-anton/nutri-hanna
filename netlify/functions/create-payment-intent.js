import Stripe from 'stripe'

// Stripe instance at module level — reused across warm Lambda invocations.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

// Amounts are authoritative here — client sends only packageId.
// This prevents any price manipulation from the browser.
const PACKAGES = {
  consultation: { amount: 150000, currency: 'uah', name: 'Индивидуальная консультация' },
  plan:         { amount: 350000, currency: 'uah', name: 'Персональный план питания' },
  program:      { amount: 900000, currency: 'uah', name: 'Программа сопровождения' },
  course:       { amount: 200000, currency: 'uah', name: 'Групповой курс' },
}

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let packageId
  try {
    packageId = JSON.parse(event.body ?? '{}').packageId
  } catch {
    return json(400, { error: 'Invalid request body' })
  }

  const pkg = PACKAGES[packageId]
  if (!pkg) {
    return json(400, { error: `Unknown packageId: "${packageId}"` })
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount:   pkg.amount,
      currency: pkg.currency,
      metadata: { packageId, packageName: pkg.name },
      automatic_payment_methods: { enabled: true },
    })

    return json(200, { clientSecret: intent.client_secret })
  } catch (err) {
    console.error('[create-payment-intent]', err.message)
    return json(500, { error: 'Не удалось инициализировать платёж. Попробуйте ещё раз.' })
  }
}
