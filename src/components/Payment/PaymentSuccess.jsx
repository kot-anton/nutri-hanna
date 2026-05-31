import Button from '@components/ui/Button/Button'
import './PaymentModal.css'

const PaymentSuccess = ({ service, onClose }) => (
  <div className="payment-success">
    <div className="payment-success__circle" aria-hidden="true">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path
          d="M7 15.5l5.5 5.5L23 10"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    <div className="payment-success__content">
      <h3 className="payment-success__title">Дякуємо за оплату!</h3>
      {service && (
        <p className="payment-success__service">«{service.title}»</p>
      )}
      <p className="payment-success__note">
        Ганна зв'яжеться з вами протягом&nbsp;24&nbsp;годин
        та погодить зручний час для початку роботи.
      </p>
    </div>

    <Button variant="primary" size="md" fullWidth onClick={onClose}>
      Чудово, до зустрічі!
    </Button>
  </div>
)

export default PaymentSuccess
