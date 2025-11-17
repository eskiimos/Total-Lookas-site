import React from 'react'
import Image from 'next/image'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { CASES } from '@/app/content'

const caseImages = [
  '/images/cases/case-1.png',
  '/images/cases/case-2.jpeg',
  '/images/cases/case-3.jpeg',
  '/images/cases/case-4.jpeg',
]

export const Cases: React.FC = () => {
  return (
    <Section id="cases">
      <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Кейсы</h2>
      <p className="text-center text-foreground/80 mb-12 max-w-2xl mx-auto">
        Проекты, которые мы реализовали для бизнеса
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CASES.map((caseItem, index) => (
          <Card key={index} className="overflow-hidden p-0">
            {/* Image */}
            <div className="relative w-full h-56 bg-[#404040] overflow-hidden">
              <Image
                src={caseImages[index]}
                alt={caseItem.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-accent">{caseItem.title}</h3>
              <p className="text-foreground/90 mb-3 font-medium">{caseItem.task}</p>
              <p className="text-foreground/70">{caseItem.result}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
