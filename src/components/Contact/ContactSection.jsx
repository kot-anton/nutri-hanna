import Section from '@components/layout/Section/Section'
import Container from '@components/layout/Container/Container'
import { CONTACTS } from '@constants/contacts'
import ContactForm from './ContactForm'
import './ContactSection.css'

const CONTACT_DETAILS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 4.5h3l1.5 3.5-1.75 1.25a9 9 0 004.5 4.5L12 11.5l3.5 1.5v3a1 1 0 01-1.037 1C5.498 16.486 2.5 8.5 2.5 5.5a1 1 0 011-1z"/>
      </svg>
    ),
    label: 'Телефон',
    value: CONTACTS.phone,
    href:  `tel:${CONTACTS.phone.replace(/\s/g, '')}`,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="16" height="13" rx="2"/>
        <path d="M2 7l8 5 8-5"/>
      </svg>
    ),
    label: 'Email',
    value: CONTACTS.email,
    href:  `mailto:${CONTACTS.email}`,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 3.5L11 10m0 0L4.5 3.5M11 10l6.5 6.5M11 10l-6.5 6.5"/>
      </svg>
    ),
    label: 'Telegram',
    value: CONTACTS.telegram,
    href:  `https://t.me/${CONTACTS.telegram.replace('@', '')}`,
  },
]

const ContactSection = () => (
  <Section id="contact" background="default" className="contact">
    <Container>
      <div className="contact__inner">

        <div className="contact__info">
          <span className="overline">Контакт</span>
          <h2 className="section-title contact__title">
            Готова помочь<br /><em>именно тебе</em>
          </h2>
          <p className="contact__text">
            Оставь заявку — я отвечу в течение 24 часов и мы обсудим, как
            именно я могу помочь в твоей ситуации. Первый шаг — самый
            важный.
          </p>

          <ul className="contact__details">
            {CONTACT_DETAILS.map(({ icon, label, value, href }) => (
              <li key={label} className="contact__detail">
                <span className="contact__detail-icon" aria-hidden="true">{icon}</span>
                <div>
                  <p className="contact__detail-label">{label}</p>
                  <a href={href} className="contact__detail-value">{value}</a>
                </div>
              </li>
            ))}
          </ul>

          <div className="contact__promise">
            <div className="contact__promise-icon" aria-hidden="true">🌿</div>
            <p className="contact__promise-text">
              Я отвечаю лично. Никаких автоответов и менеджеров —
              только прямое общение.
            </p>
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
