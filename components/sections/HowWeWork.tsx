import React from 'react'
import { Section } from '@/components/ui/Section'
import { HOW_WE_WORK } from '@/app/content'

export const HowWeWork: React.FC = () => {
  return (
    <Section id="how-we-work" className="bg-[#282828]">
      <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Как мы работаем</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {HOW_WE_WORK.map((step) => (
          <div key={step.step} className="relative">
            <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
              {step.step}
            </div>
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-foreground/80">{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
