import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@utils/helpers'
import './Modal.css'

const Modal = ({ isOpen, onClose, title, size = 'md', className = '', children }) => {
  const backdropRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const el = backdropRef.current
    const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const getFocusable = () => Array.from(el?.querySelectorAll(FOCUSABLE) ?? [])

    getFocusable()[0]?.focus()

    const handleTab = (e) => {
      if (e.key !== 'Tab') return
      const nodes = getFocusable()
      const first = nodes[0]
      const last  = nodes[nodes.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus() }
      }
    }

    el?.addEventListener('keydown', handleTab)
    return () => el?.removeEventListener('keydown', handleTab)
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose?.()
  }

  return createPortal(
    <div
      ref={backdropRef}
      className="modal-backdrop animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={cn('modal', `modal--${size}`, 'animate-scale-in', className)}>
        <div className="modal__header">
          {title && <h2 className="modal__title">{title}</h2>}
          <button className="modal__close" onClick={onClose} aria-label="Закрыть">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
