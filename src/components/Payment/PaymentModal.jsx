import { useEffect, useCallback, useRef } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Modal from '@components/ui/Modal/Modal'
import usePayment from '@hooks/usePayment'
import PaymentForm from './PaymentForm'
import PaymentSuccess from './PaymentSuccess'
import './PaymentModal.css'

// Stripe.js loads once at module level — never inside a render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const STRIPE_APPEARANCE = {
  theme: 'stripe',
  variables: {
    colorPrimary:    '#8b6347',
    colorBackground: '#ffffff',
    colorText:       '#2c2c2c',
    colorDanger:     '#b85a5a',
    fontFamily:      '"Jost", system-ui, sans-serif',
    fontSizeBase:    '15px',
    spacingUnit:     '4px',
    borderRadius:    '8px',
  },
  rules: {
    '.Input': {
      border:    '1.5px solid #e8e1d7',
      boxShadow: 'none',
      padding:   '10px 14px',
    },
    '.Input::placeholder': {
      color: '#c8c0b8',
    },
    '.Input:focus': {
      border:    '1.5px solid #8b6347',
      boxShadow: '0 0 0 3px rgba(139, 99, 71, 0.12)',
      outline:   'none',
    },
    '.Label': {
      fontWeight:    '500',
      color:         '#555555',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      fontSize:      '11px',
      marginBottom:  '6px',
    },
    '.Tab': {
      border:    '1.5px solid #e8e1d7',
      boxShadow: 'none',
    },
    '.Tab:hover': {
      border: '1.5px solid #c09a7b',
    },
    '.Tab--selected': {
      border:    '1.5px solid #8b6347',
      boxShadow: '0 0 0 1px #8b6347',
    },
    '.Error': {
      color: '#b85a5a',
    },
  },
}

const PaymentModal = ({ isOpen, onClose, service }) => {
  const {
    clientSecret,
    status,
    error,
    initPayment,
    reset,
    setStatus,
    setError,
  } = usePayment()

  const retryAbortRef = useRef(null)

  // Fetch a PaymentIntent whenever the modal opens for a service.
  // AbortController cancels the in-flight request if the modal closes early.
  useEffect(() => {
    if (!isOpen) {
      reset()
      return
    }
    if (!service?.id) return

    const controller = new AbortController()
    initPayment(service.id, controller.signal)
    return () => controller.abort()
  }, [isOpen, service?.id, initPayment, reset])

  const handleClose = useCallback(() => {
    retryAbortRef.current?.abort()
    retryAbortRef.current = null
    reset()
    onClose()
  }, [reset, onClose])

  const handleSuccess = useCallback(() => setStatus('success'), [setStatus])
  const handleError   = useCallback((msg) => setError(msg), [setError])

  const modalTitle = status === 'success' ? 'Оплата успішна' : 'Оформлення оплати'

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle} size="md">
      {status === 'success' ? (
        <PaymentSuccess service={service} onClose={handleClose} />
      ) : (
        <div className="payment-modal__body">
          {service && (
            <div className="payment-summary">
              <span className="payment-summary__icon" aria-hidden="true">
                {service.icon}
              </span>
              <div className="payment-summary__info">
                <p className="payment-summary__name">{service.title}</p>
                <p className="payment-summary__meta">{service.duration}</p>
              </div>
              <span className="payment-summary__price">{service.price}</span>
            </div>
          )}

          {status === 'loading' && (
            <div className="payment-modal__loader">
              <span className="payment-modal__spinner" aria-hidden="true" />
              <p>Підготовка форми оплати…</p>
            </div>
          )}

          {status === 'error' && (
            <div className="payment-modal__error" role="alert">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="8.75" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="payment-modal__error-text">{error}</p>
              <button
                className="payment-modal__retry"
                onClick={() => {
                  if (!service) return
                  retryAbortRef.current?.abort()
                  const controller = new AbortController()
                  retryAbortRef.current = controller
                  initPayment(service.id, controller.signal)
                }}
              >
                Спробувати знову
              </button>
            </div>
          )}

          {status === 'ready' && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: STRIPE_APPEARANCE,
                locale: 'uk',
              }}
            >
              <PaymentForm
                service={service}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </Elements>
          )}
        </div>
      )}
    </Modal>
  )
}

export default PaymentModal
