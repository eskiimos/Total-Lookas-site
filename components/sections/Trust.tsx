import React from 'react'
import Image from 'next/image'
import { Section } from '@/components/ui/Section'

export const Trust: React.FC = () => {
  return (
    <Section id="trust">
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-center">
        Нам доверяют
      </h2>
      <p className="text-center text-foreground/70 text-sm md:text-base mb-6 md:mb-10 max-w-2xl mx-auto">
        Мы работаем с компаниями разного масштаба — от стартапов до крупных корпораций
      </p>

      {/* Logos Image */}
      <div className="relative w-full h-64 md:h-96 lg:h-[500px] bg-[#3a3a3a] rounded-brand overflow-hidden">
        {/* Mobile Logos */}
        <div className="md:hidden absolute inset-0">
          <Image
            src="/images/trust/logos-m.png"
            alt="Логотипы компаний-клиентов"
            fill
            className="object-contain p-6"
          />
        </div>
        
        {/* Desktop Logos */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src="/images/trust/logos-d.png"
            alt="Логотипы компаний-клиентов"
            fill
            className="object-contain p-10"
          />
        </div>
      </div>
    </Section>
  )
}
