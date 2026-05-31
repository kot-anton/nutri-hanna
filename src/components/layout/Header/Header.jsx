import { useState, useEffect, useCallback } from 'react'
import { NAV_LINKS } from '@constants/navigation'
import { scrollToSection } from '@utils/helpers'
import Button from '@components/ui/Button/Button'
import './Header.css'

const Header = ({ onBookingOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const handleNavClick = useCallback((href) => {
    setIsMobileOpen(false)
    setActiveSection(href)
    scrollToSection(href)
  }, [])

  return (
    <header className={`header${isScrolled ? ' header--scrolled' : ''}`} role="banner">
      <div className="header__inner">
        <a href="/" className="header__logo" aria-label="Hanna Nutrition — на главную">
          <span className="header__logo-name">Hanna</span>
          <span className="header__logo-sub">Nutrition</span>
        </a>

        <nav className="header__nav" aria-label="Основная навигация">
          {NAV_LINKS.map(({ label, href }) => (
            <button
              key={href}
              className={`header__nav-link${activeSection === href ? ' header__nav-link--active' : ''}`}
              onClick={() => handleNavClick(href)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="header__cta">
          <Button size="sm" onClick={onBookingOpen}>
            Записаться
          </Button>
        </div>

        <button
          className={`header__burger${isMobileOpen ? ' header__burger--open' : ''}`}
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-expanded={isMobileOpen}
          aria-label={isMobileOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {isMobileOpen && (
        <div className="header__mobile" role="dialog" aria-modal="true" aria-label="Мобильное меню">
          <nav className="header__mobile-nav">
            {NAV_LINKS.map(({ label, href }) => (
              <button key={href} className="header__mobile-link" onClick={() => handleNavClick(href)}>
                {label}
              </button>
            ))}
          </nav>
          <div className="header__mobile-cta">
            <Button
              fullWidth
              onClick={() => {
                setIsMobileOpen(false)
                onBookingOpen?.()
              }}
            >
              Записаться на консультацию
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
