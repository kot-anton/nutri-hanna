import { useState, useCallback } from 'react'

// status machine:  idle → loading → ready → (processing inside PaymentForm) → success | error
const usePayment = () => {
  const [clientSecret, setClientSecret] = useState(null)
  const [status, setStatus]             = useState('idle')
  const [error, setError]               = useState(null)

  const initPayment = useCallback(async (packageId, signal) => {
    setStatus('loading')
    setError(null)

    try {
      const res = await fetch('/api/create-payment-intent', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ packageId }),
        signal,
      })

      if (signal?.aborted) return

      const data = await res.json().catch(() => ({}))

      if (!res.ok) throw new Error(data.error ?? 'Помилка ініціалізації платежу')

      setClientSecret(data.clientSecret)
      setStatus('ready')
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err.message)
      setStatus('error')
    }
  }, [])

  const reset = useCallback(() => {
    setClientSecret(null)
    setStatus('idle')
    setError(null)
  }, [])

  return { clientSecret, status, error, initPayment, reset, setStatus, setError }
}

export default usePayment
