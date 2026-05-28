import { useState } from 'react'
import { cn } from '@utils/helpers'
import './FAQItem.css'

const FAQItem = ({ id, question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)
  const contentId = `faq-answer-${id}`

  return (
    <div className={cn('faq-item', isOpen && 'faq-item--open')}>
      <button
        id={`faq-trigger-${id}`}
        className="faq-item__trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span className="faq-item__question">{question}</span>
        <span className="faq-item__icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4.5 6.75L9 11.25L13.5 6.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        id={contentId}
        className="faq-item__body"
        role="region"
        aria-labelledby={`faq-trigger-${id}`}
        hidden={!isOpen}
      >
        <p className="faq-item__answer">{answer}</p>
      </div>
    </div>
  )
}

export default FAQItem
