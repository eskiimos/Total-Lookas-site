'use client'

import React, { useState } from 'react'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { CTA_FORM } from '@/app/content'

export const CTASection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    comment: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', contact: '', comment: '' })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert('Ошибка отправки. Попробуйте позже или свяжитесь напрямую.')
      }
    } catch (error) {
      console.error('Ошибка:', error)
      alert('Ошибка отправки. Попробуйте позже или свяжитесь напрямую.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Phone mask
    if (name === 'contact') {
      const cleaned = value.replace(/\D/g, '')
      let formatted = '+7 '
      
      if (cleaned.length > 1) {
        formatted += cleaned.substring(1, 4)
        if (cleaned.length > 4) {
          formatted += ' ' + cleaned.substring(4, 7)
          if (cleaned.length > 7) {
            formatted += '-' + cleaned.substring(7, 9)
            if (cleaned.length > 9) {
              formatted += '-' + cleaned.substring(9, 11)
            }
          }
        }
      }
      
      setFormData({
        ...formData,
        [name]: formatted.trim(),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  return (
    <section id="cta" className="relative py-16 md:py-24 px-4">
      {/* Background Image - Full Width */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/90 to-background z-10"></div>
        <img 
          src="/images/cta/TL-12.png" 
          alt="CTA background" 
          className="w-full h-full object-cover object-[center_top] opacity-100"
        />
      </div>

      <div className="max-w-2xl mx-auto relative z-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Обсудим ваш проект</h2>
        <p className="text-center text-foreground/80 mb-8">
          {CTA_FORM.pretext}
        </p>

        {submitted ? (
          <div className="bg-accent/10 border-2 border-accent rounded-brand p-8 text-center">
            <svg className="w-16 h-16 text-accent mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-lg font-medium">{CTA_FORM.success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium">
                {CTA_FORM.fields.name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-brand bg-[#3a3a3a] border-2 border-transparent focus:border-accent outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact" className="block mb-2 font-medium">
                Телефон
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                required
                value={formData.contact}
                onChange={handleChange}
                placeholder="+7 999 123-45-67"
                className="w-full px-4 py-3 rounded-brand bg-[#3a3a3a] border-2 border-transparent focus:border-accent outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="comment" className="block mb-2 font-medium">
                {CTA_FORM.fields.comment}
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-brand bg-[#3a3a3a] border-2 border-transparent focus:border-accent outline-none transition-colors resize-none"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              {CTA_FORM.button[0]}
            </Button>

            <p className="text-xs text-foreground/60 text-center">
              {CTA_FORM.privacy}
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
