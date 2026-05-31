import Section from '@components/layout/Section/Section'
import Container from '@components/layout/Container/Container'
import { CONTACTS } from '@constants/contacts'
import ContactForm from './ContactForm'
import './ContactSection.css'

const CONTACT_DETAILS = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.2 5L2 12.5l7 1M21.2 5l-5.8 15-4.2-7M21.2 5L9 13.5m0 0 4.2 6.5" />
      </svg>
    ),
    label: 'Telegram',
    value: CONTACTS.telegram.replace('https://t.me/', '@'),
    href: CONTACTS.telegram,
    external: true,
  },
]

const ContactSection = () => (
  <Section id="contact" background="default" className="contact">
    <Container>
      <div className="contact__inner">
        <div className="contact__info">
          <span className="overline">Контакт</span>
          <h2 className="section-title contact__title">
            Готова помочь
            <br />
            <em>именно тебе</em>
          </h2>
          <p className="contact__text">
            Оставь заявку — я отвечу в течение 24 часов и мы обсудим, как именно я могу помочь в твоей ситуации. Первый шаг — самый важный.
          </p>

          <ul className="contact__details">
            {CONTACT_DETAILS.map(({ icon, label, value, href, external }) => {
              const linkProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
              return (
                <li key={label} className="contact__detail">
                  <a href={href} className="contact__detail-icon" aria-label={label} {...linkProps}>
                    {icon}
                  </a>
                  <div>
                    <p className="contact__detail-label">{label}</p>
                    <a href={href} className="contact__detail-value" {...linkProps}>
                      {value}
                    </a>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="contact__promise">
            <div className="contact__promise-icon" aria-hidden="true">
              🌿
            </div>
            <p className="contact__promise-text">Все вопросы, рекомендации и обратную связь вы получаете лично от меня.</p>
          </div>
        </div>

        <div className="contact__form-wrap">
          <ContactForm />
        </div>
      </div>
    </Container>
  </Section>
)

export default ContactSection
