import { useState, useCallback } from 'react'
import useModal from '@hooks/useModal'
import Header from '@components/layout/Header/Header'
import Footer from '@components/layout/Footer/Footer'
import HeroSection from '@components/Hero/HeroSection'
import AboutSection from '@components/About/AboutSection'
import ProcessSection from '@components/Process/ProcessSection'
import ServicesSection from '@components/Services/ServicesSection'
import BenefitsSection from '@components/Benefits/BenefitsSection'
import TestimonialsSection from '@components/Testimonials/TestimonialsSection'
import FAQSection from '@components/FAQ/FAQSection'
import ContactSection from '@components/Contact/ContactSection'
import BookingModal from '@components/Booking/BookingModal'
import PaymentModal from '@components/Payment/PaymentModal'
import './HomePage.css'

const HomePage = () => {
  const booking = useModal()
  const payment = useModal()
  const [paymentService, setPaymentService] = useState(null)

  const openPayment = useCallback((service) => {
    setPaymentService(service)
    payment.open()
  }, [payment.open])

  const closePayment = useCallback(() => {
    payment.close()
    setPaymentService(null)
  }, [payment.close])

  return (
    <>
      <Header onBookingOpen={booking.open} />

      <main className="home" id="main-content">
        <HeroSection     onBookingOpen={booking.open} />
        <AboutSection    onBookingOpen={booking.open} />
        <ProcessSection  />
        <ServicesSection onPaymentOpen={openPayment} />
        <BenefitsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />

      <BookingModal isOpen={booking.isOpen} onClose={booking.close} />
      <PaymentModal isOpen={payment.isOpen} onClose={closePayment} service={paymentService} />
    </>
  )
}

export default HomePage
