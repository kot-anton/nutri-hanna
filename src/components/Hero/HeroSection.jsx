import { useEffect, useRef } from 'react'
import Button from '@components/ui/Button/Button'
import Badge from '@components/ui/Badge/Badge'
import { scrollToSection } from '@utils/helpers'
import heroDish from '@assets/hero-dish.png'
import './HeroSection.css'

const MARQUEE_ITEMS = ['Без жёстких диет', 'Индивидуально', 'Устойчивый результат', 'Научный подход']

const HeroSection = ({ onBookingOpen }) => {
  const contentRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const content = contentRef.current
    const image = imageRef.current
    if (!content || !image) return

    const t1 = setTimeout(() => content.classList.add('hero__content--visible'), 100)
    const t2 = setTimeout(() => image.classList.add('hero__image-col--visible'), 380)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <section className="hero" aria-label="Главная секция">
      <div className="hero__bg-shape" aria-hidden="true" />

      <div className="hero__inner">
        <div ref={contentRef} className="hero__content">
          <Badge variant="accent" size="md" className="hero__badge">
            Сертифицированный нутрициолог
          </Badge>

          <span className="hero__title-rule" aria-hidden="true" />

          <h1 className="hero__title">
            Твой путь
            <br />
            к здоровью
            <br />
            <em>начинается здесь</em>
          </h1>

          <p className="hero__subtitle">
            Персональная нутрициология для тех, кто хочет изменить качество жизни навсегда. Без жёстких диет - только научный подход и
            устойчивый результат.
          </p>

          <div className="hero__actions">
            <Button size="lg" onClick={onBookingOpen}>
              Записаться на консультацию
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollToSection('about')}>
              Узнать больше
            </Button>
          </div>
        </div>

        <div ref={imageRef} className="hero__image-col">
          <div className="hero__image-wrap">
            <div className="hero__image-placeholder" aria-label="Нутрициология">
              <img src={heroDish} alt="Полезное и красивое блюдо — символ здорового питания" className="hero__dish-img" />
            </div>
            <div className="hero__floating-card hero__floating-card--top" aria-hidden="true">
              <span className="hero__floating-icon">🌿</span>
              <div>
                <p className="hero__floating-title">Персональный подход</p>
                <p className="hero__floating-text">к каждому клиенту</p>
              </div>
            </div>
            <div className="hero__floating-card hero__floating-card--bottom" aria-hidden="true">
              <span className="hero__floating-icon">✨</span>
              <div>
                <p className="hero__floating-title">Устойчивый результат</p>
                <p className="hero__floating-text">без срывов и стресса</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__marquee" aria-hidden="true">
        <div className="hero__marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="hero__marquee-item">
              <span className="hero__marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
