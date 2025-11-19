'use client'

import React, { useState } from 'react'
import { Section } from '@/components/ui/Section'
import { FAQ } from '@/app/content'

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <Section id="faq" className="bg-[#282828]">
      <h2 className="font-unbounded text-3xl md:text-5xl font-bold mb-12 text-center">Частые вопросы</h2>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {FAQ.map((item, index) => (
          <div 
            key={index} 
            className="bg-[#3a3a3a] rounded-brand overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-[#404040] transition-colors"
            >
              <span className="font-semibold pr-4">{item.question}</span>
              <svg 
                className={`w-5 h-5 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-5 text-foreground/80">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}
