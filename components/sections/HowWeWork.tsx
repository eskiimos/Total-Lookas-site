import React from 'react'
import { Section } from '@/components/ui/Section'
import { HOW_WE_WORK } from '@/app/content'

export const HowWeWork: React.FC = () => {
  return (
    <Section id="how-we-work" className="bg-[#282828]">
      <h2 className="font-unbounded text-3xl md:text-5xl font-bold mb-12 text-center">Как мы работаем</h2>
      
      {/* Desktop: Horizontal Timeline */}
      <div className="hidden md:block">
        <div className="relative max-w-6xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-7 left-0 right-0 h-0.5 bg-accent/20"></div>
          
          <div className="grid grid-cols-4 gap-8">
            {HOW_WE_WORK.map((step) => (
              <div key={step.step} className="relative">
                {/* Step number */}
                <div className="relative z-10 bg-accent text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-foreground/80 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="md:hidden max-w-xl mx-auto space-y-6">
        {HOW_WE_WORK.map((step, index) => (
          <div key={step.step} className="relative">
            {/* Connecting line */}
            {index < HOW_WE_WORK.length - 1 && (
              <div className="absolute left-6 top-16 w-0.5 h-full bg-accent/20"></div>
            )}
            
            <div className="flex gap-4">
              {/* Step number */}
              <div className="flex-shrink-0">
                <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold relative z-10">
                  {step.step}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-6">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-foreground/80 text-sm">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
