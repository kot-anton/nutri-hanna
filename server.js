import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'

const app  = express()
const PORT = process.env.PORT || 3001

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('[server] STRIPE_SECRET_KEY is not set. Payments will not work.')
  process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

// Amounts in the smallest currency unit (kopecks for UAH).
// Defined server-side so the client cannot manipulate prices.
const PACKAGES = {
  consultation: { amount: 150000, currency: 'uah', name: 'Індивідуальна консультація' },
  plan:         { amount: 350000, currency: 'uah', name: 'Персональний план харчування' },
  program:      { amount: 900000, currency: 'uah', name: 'Програма супроводу' },
  course:       { amount: 200000, currency: 'uah', name: 'Груповий курс' },
}

// ── Webhook must receive the raw body BEFORE express.json() middleware ──────
app.post(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const sig = req.headers['stripe-signature']

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn('[webhook] STRIPE_WEBHOOK_SECRET not set — skipping signature check')
      return res.json({ received: true })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error('[webhook] Signature verification failed:', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object
      console.log(`[webhook] payment_intent.succeeded — id: ${intent.id}, package: ${intent.metadata.packageId}`)
      // TODO: persist to database, trigger fulfillment email, etc.
    }

    // Acknowledge quickly; Stripe retries if response takes > ~30 s
    res.json({ received: true })
  }
)

// ── Regular JSON middleware (applied AFTER the raw-body webhook route) ────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173']

app.use(cors({ origin: allowedOrigins, credentials: false }))
app.use(express.json())

// ── Create PaymentIntent ──────────────────────────────────────────────────────
app.post('/api/create-payment-intent', async (req, res) => {
  const { packageId } = req.body ?? {}

  const pkg = PACKAGES[packageId]
  if (!pkg) {
    return res.status(400).json({ error: `Unknown packageId: "${packageId}"` })
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount:   pkg.amount,
      currency: pkg.currency,
      metadata: { packageId, packageName: pkg.name },
      automatic_payment_methods: { enabled: true },
    })

    res.json({ clientSecret: intent.client_secret })
  } catch (err) {
    console.error('[create-payment-intent] Stripe error:', err.message)
    res.status(500).json({ error: 'Не вдалося ініціалізувати платіж. Спробуйте ще раз.' })
  }
})

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`[server] Payment server running at http://localhost:${PORT}`)
})
