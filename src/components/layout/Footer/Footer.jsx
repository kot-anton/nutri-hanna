import { NAV_LINKS } from '@constants/navigation'
import { CONTACTS } from '@constants/contacts'
import { scrollToSection } from '@utils/helpers'
import './Footer.css'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-name">Hanna</span>
            <span className="footer__logo-sub">Nutrition</span>
          </div>
          <p className="footer__tagline">
            Научный подход к питанию
            <br />
            для здоровья и долголетия
          </p>
          <div className="footer__socials">
            <a href={CONTACTS.instagram} target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Instagram">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth="0" />
              </svg>
            </a>
            <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Telegram">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.2 5L2 12.5l7 1M21.2 5l-5.8 15-4.2-7M21.2 5L9 13.5m0 0 4.2 6.5" />
              </svg>
            </a>
          </div>
        </div>

        <nav className="footer__nav" aria-label="Навигация футера">
          <h3 className="footer__nav-title">Навигация</h3>
          <ul className="footer__nav-list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <button className="footer__nav-link" onClick={() => scrollToSection(href)}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

      </div>

      <div className="footer__bottom">
        <p className="footer__copy">© {year} Hanna Nutrition. Все права защищены.</p>
        <p className="footer__dev">
          Developed by{' '}
          <a href="https://github.com/Blockchain-Country" target="_blank" rel="noopener noreferrer" className="footer__dev-link">
            Anton Ishchenko
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
