import { cn } from '@utils/helpers'
import Button from '@components/ui/Button/Button'
import Badge from '@components/ui/Badge/Badge'
import './ServiceCard.css'

const ServiceCard = ({ service, onPaymentOpen }) => {
  const { icon, title, description, features, price, duration, popular } = service

  return (
    <article className={cn('service-card', popular && 'service-card--popular')}>
      {popular && (
        <div className="service-card__popular-label">Популярно</div>
      )}

      <div className="service-card__icon" aria-hidden="true">{icon}</div>

      <div className="service-card__meta">
        <Badge variant="neutral" size="sm">{duration}</Badge>
      </div>

      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__desc">{description}</p>

      <ul className="service-card__features">
        {features.map(feature => (
          <li key={feature} className="service-card__feature">
            <svg className="service-card__check" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <div className="service-card__footer">
        <span className="service-card__price">{price}</span>
        <Button
          variant={popular ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onPaymentOpen?.(service)}
        >
          Pay
        </Button>
      </div>
    </article>
  )
}

export default ServiceCard
