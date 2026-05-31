import { useState, useCallback } from 'react'

const useForm = (initialValues, validators = {}) => {
  const [values,      setValues]      = useState(initialValues)
  const [errors,      setErrors]      = useState({})
  const [touched,     setTouched]     = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted,  setIsSubmitted]  = useState(false)
  const [submitError,  setSubmitError]  = useState(null)

  const validateField = useCallback((name, value) => {
    return validators[name]?.(value, values) ?? null
  }, [validators, values])

  const validateAll = useCallback((fieldValues = values) => {
    const errs = {}
    Object.keys(validators).forEach(name => {
      const error = validators[name](fieldValues[name], fieldValues)
      if (error) errs[name] = error
    })
    return errs
  }, [validators, values])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error ?? '' }))
    }
  }, [touched, validateField])

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error ?? '' }))
  }, [validateField])

  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault()
    const allTouched = Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)
    const errs = validateAll()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit(values)
      setIsSubmitted(true)
      setValues(initialValues)
      setTouched({})
      setErrors({})
    } catch {
      setSubmitError('Не удалось отправить заявку. Попробуйте ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validateAll, initialValues])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitted(false)
  }, [initialValues])

  return { values, errors, touched, isSubmitting, isSubmitted, submitError, handleChange, handleBlur, handleSubmit, reset }
}

export default useForm
