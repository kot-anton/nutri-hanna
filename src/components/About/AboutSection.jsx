import Section from '@components/layout/Section/Section'
import Container from '@components/layout/Container/Container'
import Badge from '@components/ui/Badge/Badge'
import Button from '@components/ui/Button/Button'
import { scrollToSection } from '@utils/helpers'
import hannaPhoto from '@assets/hanna-photo.jpg'
import './AboutSection.css'

const AboutSection = ({ onBookingOpen }) => (
  <Section id="about" background="white" className="about">
    <Container>
      <div className="about__inner">
        <div className="about__image-col">
          <div className="about__image-wrap">
            <div className="about__photo-placeholder" aria-label="Фото Ханны">
              <img src={hannaPhoto} alt="Ханна — нутрициолог" className="about__photo" />
            </div>
          </div>
        </div>

        <div className="about__content">
          <span className="overline">Обо мне</span>
          <h2 className="section-title about__title">
            Привет, я Ханна —<br />
            <em>нутрициолог с душой</em>
          </h2>
          <p className="about__text">
            Я помогаю людям выстраивать здоровые отношения с едой и телом. Мой путь начался с личного опыта. Годы диет и ограничений привели
            меня к проблемам с ЖКТ и поиску решения через нутрициологию. Пройдя этот путь сама, я поняла, что жёсткие диеты не работают в
            долгосрочной перспективе, а здоровье и красивое тело начинаются с заботы о себе, а не с ограничений.
          </p>
          <p className="about__text">
            В своей работе я придерживаюсь научного подхода, опираюсь на современные данные о питании и здоровье и подбираю рекомендации
            индивидуально для каждого клиента.
          </p>

          <Button onClick={onBookingOpen}>Записаться на консультацию</Button>
        </div>
      </div>
    </Container>
  </Section>
)

export default AboutSection
