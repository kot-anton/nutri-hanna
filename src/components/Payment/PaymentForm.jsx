import { useState, useRef, useCallback } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import Button from '@components/ui/Button/Button'

// Maps ISO 3166-1 alpha-2 country codes to Stripe's supported locales.
const COUNTRY_TO_LOCALE = {
  UA: 'uk', RU: 'ru', BY: 'ru', KZ: 'ru', UZ: 'ru', GE: 'ru',
  US: 'en', CA: 'en', AU: 'en', NZ: 'en', IN: 'en', SG: 'en', ZA: 'en',
  GB: 'en-GB', IE: 'en-GB',
  DE: 'de', AT: 'de',
  FR: 'fr', BE: 'fr',
  PL: 'pl', IT: 'it', ES: 'es', NL: 'nl', PT: 'pt',
  CZ: 'cs', SK: 'sk', HU: 'hu', RO: 'ro', BG: 'bg', HR: 'hr', SI: 'sl',
  LT: 'lt', LV: 'lv', EE: 'et',
  FI: 'fi', SE: 'sv', NO: 'nb', DK: 'da',
  GR: 'el', TR: 'tr', IL: 'he',
  JP: 'ja', KR: 'ko', CN: 'zh', HK: 'zh-HK', TW: 'zh-TW',
  TH: 'th', ID: 'id', MY: 'ms', VN: 'vi',
  SA: 'ar', AE: 'ar', EG: 'ar',
  BR: 'pt-BR', MX: 'es-419', AR: 'es-419', CO: 'es-419',
}

const formatPrice = (service) => {
  if (!service?.amount) return service?.price ?? ''
  return new Intl.NumberFormat('uk-UA', {
    style:                 'currency',
    currency:              'UAH',
    maximumFractionDigits: 0,
  }).format(service.amount / 100)
}

const PaymentForm = ({ service, onSuccess, onError }) => {
  const stripe       = useStripe()
  const elements     = useElements()
  const [processing, setProcessing] = useState(false)
  const [localError, setLocalError] = useState(null)
  const lastCountry  = useRef(null)

  const handleChange = useCallback(async (event) => {
    const country = event.value?.billingDetails?.address?.country
    if (!country || country === lastCountry.current || !elements) return
    lastCountry.current = country
    const locale = COUNTRY_TO_LOCALE[country]
    if (locale) {
      await elements.update({ locale })
    }
  }, [elements])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || processing) return

    setProcessing(true)
    setLocalError(null)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Fallback redirect URL for payment methods that require it (e.g. 3DS2).
        // The modal handles success in-place for card payments.
        return_url: window.location.href,
      },
      redirect: 'if_required',
    })

    if (error) {
      const msg = error.message ?? 'Сталася помилка. Спробуйте ще раз.'
      setLocalError(msg)
      onError?.(msg)
      setProcessing(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form" noValidate>
      <PaymentElement
        options={{
          layout: 'accordion',
          defaultValues: {
            billingDetails: { address: { country: 'UA' } },
          },
        }}
        onChange={handleChange}
      />

      {localError && (
        <div className="payment-form__error" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4.5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {localError}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        loading={processing}
        disabled={!stripe || !elements || processing}
      >
        {processing ? 'Обробка платежу…' : `Сплатити ${formatPrice(service)}`}
      </Button>

      <p className="payment-form__secure">
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true">
          <rect x="0.75" y="5.25" width="9.5" height="7.25" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
          <path d="M3 5.25V3.5a2.5 2.5 0 0 1 5 0v1.75" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
        Захищено Stripe · дані карти не зберігаються
      </p>
    </form>
  )
}

export default PaymentForm
