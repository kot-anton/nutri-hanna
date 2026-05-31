import Section from '@components/layout/Section/Section'
import Container from '@components/layout/Container/Container'
import ServiceCard from './ServiceCard'
import { SERVICES } from './services.data'
import './ServicesSection.css'

const ServicesSection = ({ onPaymentOpen }) => (
  <Section id="services" background="default" className="services">
    <Container>
      <div className="services__header">
        <span className="overline">Услуги</span>
        <h2 className="section-title">Найди свой<br /><em>формат работы</em></h2>
        <p className="section-subtitle services__subtitle">
          Каждая программа разработана для разных ситуаций и запросов.
          Выбери подходящий формат или напиши мне — подберём вместе.
        </p>
      </div>

      <div className="services__grid">
        {SERVICES.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            onPaymentOpen={onPaymentOpen}
          />
        ))}
      </div>
    </Container>
  </Section>
)

export default ServicesSection
