'use client'

import React, { useState } from 'react'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  minOrder: number
}

export function OrderModal({ isOpen, onClose, productName, minOrder }: OrderModalProps) {
  const [formData, setFormData] = useState({
    quantity: minOrder.toString(),
    name: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          quantity: formData.quantity,
          name: formData.name,
          phone: formData.phone,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setTimeout(() => {
          onClose()
          setFormData({
            quantity: minOrder.toString(),
            name: '',
            phone: '',
          })
          setSubmitStatus('idle')
        }, 2000)
      } else {
        setSubmitStatus('error')
        setErrorMessage(data.error || 'Произошла ошибка')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Ошибка соединения с сервером')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    
    // Автоматически добавляем +7
    if (value.length > 0 && !value.startsWith('7')) {
      value = '7' + value
    }
    
    // Форматируем номер
    let formatted = '+7'
    if (value.length > 1) {
      formatted += ' (' + value.substring(1, 4)
    }
    if (value.length >= 5) {
      formatted += ') ' + value.substring(4, 7)
    }
    if (value.length >= 8) {
      formatted += '-' + value.substring(7, 9)
    }
    if (value.length >= 10) {
      formatted += '-' + value.substring(9, 11)
    }
    
    setFormData({ ...formData, phone: formatted })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#282828] rounded-brand p-6 md:p-8 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitStatus === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Заказ отправлен!</h3>
            <p className="text-foreground/80">Мы свяжемся с вами в ближайшее время</p>
          </div>
        ) : (
          <>
            <h2 className="font-unbounded text-2xl font-bold mb-6">Оформить заказ</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product name */}
              <div>
                <label className="block text-sm text-foreground/60 mb-2">Товар</label>
                <div className="bg-[#3a3a3a] rounded-brand px-4 py-3 text-foreground">
                  {productName}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm text-foreground/60 mb-2">
                  Количество (мин. {minOrder} шт)
                </label>
                <input
                  type="number"
                  id="quantity"
                  min={minOrder}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  className="w-full bg-[#3a3a3a] border border-[#404040] rounded-brand px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm text-foreground/60 mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-[#3a3a3a] border border-[#404040] rounded-brand px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                  placeholder="Иван Иванов"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm text-foreground/60 mb-2">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                  className="w-full bg-[#3a3a3a] border border-[#404040] rounded-brand px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                  placeholder="+7 (999) 999-99-99"
                  maxLength={18}
                />
              </div>

              {/* Error message */}
              {submitStatus === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-brand px-4 py-3 text-red-500 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-semibold px-6 py-4 rounded-brand transition-colors"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заказ'}
              </button>

              <p className="text-xs text-foreground/60 text-center">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
