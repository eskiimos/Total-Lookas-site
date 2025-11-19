import React from 'react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { WHY_US } from '@/app/content'

export const WhyUs: React.FC = () => {
  return (
    <Section id="why-us">
      <h2 className="font-unbounded text-3xl md:text-5xl font-bold mb-12 text-center">Почему мы</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {WHY_US.map((item, index) => (
          <Card key={index} className="!p-4 md:!p-6">
            <div className="flex items-start gap-3 md:gap-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-foreground/80 text-sm md:text-base leading-relaxed">{item.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
