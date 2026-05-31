import emailjs from '@emailjs/browser'
import useForm from '@hooks/useForm'
import { required, email, phone, composeValidators } from '@utils/validators'
import Input from '@components/ui/Input/Input'
import Textarea from '@components/ui/Textarea/Textarea'
import Button from '@components/ui/Button/Button'
import './ContactForm.css'

const INITIAL_VALUES = { name: '', phone: '', email: '', message: '' }

const VALIDATORS = {
  name:    required,
  phone:   composeValidators(required, phone),
  email:   composeValidators(required, email),
  message: required,
}

const sendEmail = async (values) => {
  await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      name:    values.name,
      email:   values.email,
      phone:   values.phone,
      message: values.message,
      time:    new Date().toLocaleString('ru-RU'),
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  )
}

const ContactForm = () => {
  const { values, errors, touched, isSubmitting, isSubmitted, submitError, handleChange, handleBlur, handleSubmit } = useForm(
    INITIAL_VALUES,
    VALIDATORS
  )

  if (isSubmitted) {
    return (
      <div className="contact-form__success animate-scale-in">
        <div className="contact-form__success-icon" aria-hidden="true">✓</div>
        <h3 className="contact-form__success-title">Заявка отправлена!</h3>
        <p className="contact-form__success-text">
          Я свяжусь с вами в течение 24 часов и мы договоримся об удобном
          времени для консультации.
        </p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit(sendEmail)} noValidate>
      <div className="contact-form__row">
        <Input
          label="Ваше имя"
          name="name"
          value={values.name}
          placeholder="Как к вам обращаться?"
          error={touched.name ? errors.name : ''}
          required
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Номер телефона"
          name="phone"
          type="tel"
          value={values.phone}
          placeholder="+38 (0__) ___ __ __"
          error={touched.phone ? errors.phone : ''}
          required
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        value={values.email}
        placeholder="your@email.com"
        error={touched.email ? errors.email : ''}
        required
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Textarea
        label="Ваш запрос"
        name="message"
        value={values.message}
        placeholder="Расскажите о своей цели или вопросе..."
        rows={4}
        error={touched.message ? errors.message : ''}
        required
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {submitError && <p className="contact-form__error">{submitError}</p>}

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Отправляю...' : 'Отправить заявку'}
      </Button>

      <p className="contact-form__note">
        Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных.
      </p>
    </form>
  )
}

export default ContactForm
