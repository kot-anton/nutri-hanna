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
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const handleNavClick = useCallback((href) => {
    setIsMobileOpen(false)
    setActiveSection(href)
    scrollToSection(href)
  }, [])

  return (
    <>
      <header className={`header${isScrolled ? ' header--scrolled' : ''}`} role="banner">
        <div className="header__inner">
          <a href="/" className="header__logo" aria-label="Hanna Nutrition — на головну">
            <span className="header__logo-name">Hanna</span>
            <span className="header__logo-sub">Nutrition</span>
          </a>

          <nav className="header__nav" aria-label="Основна навігація">
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
              Записатися
            </Button>
          </div>

          <button
            className={`header__burger${isMobileOpen ? ' header__burger--open' : ''}`}
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-expanded={isMobileOpen}
            aria-label={isMobileOpen ? 'Закрити меню' : 'Відкрити меню'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {isMobileOpen && (
        <div className="header__mobile" role="dialog" aria-modal="true" aria-label="Мобільне меню">
          <div className="header__mobile-topbar">
            <div className="header__mobile-logo" aria-hidden="true">
              <span className="header__mobile-logo-name">Hanna</span>
              <span className="header__mobile-logo-sub">Nutrition</span>
            </div>

            <button
              className="header__mobile-close"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Закрити меню"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="header__mobile-body">
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
                Записатися на консультацію
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
