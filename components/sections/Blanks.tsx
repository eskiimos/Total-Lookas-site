import React from 'react'
import Image from 'next/image'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BLANKS, CONFIG } from '@/app/content'

const blankImages = [
  '/images/blanks/tshirt.jpg',
  '/images/blanks/longsleeve.jpg',
  '/images/blanks/sweatshirt.jpg',
  '/images/blanks/hoodie.jpg',
  '/images/blanks/halfzip.jpg',
  '/images/blanks/shopper.jpg',
]

export const Blanks: React.FC = () => {
  return (
    <Section id="blanks" className="bg-[#282828]">
      <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 text-center">Готовые бланки</h2>
      <p className="text-center text-foreground/80 text-sm md:text-base mb-6 md:mb-12 max-w-2xl mx-auto">
        Наши лекала — проверенные модели с предсказуемой посадкой
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-[10px] md:gap-6">
        {BLANKS.map((blank, index) => (
          <Card key={index} hover className="overflow-hidden p-0">
            {/* Image */}
            <div className="relative w-full h-40 md:h-64 bg-[#404040] overflow-hidden">
              <Image
                src={blankImages[index]}
                alt={blank.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="!p-[10px]">
              <h3 className="text-sm md:text-xl font-semibold mb-1 md:mb-2">{blank.name}</h3>
              <div className="text-accent font-bold text-base md:text-lg mb-2 md:mb-3">{blank.price}</div>
              <p className="text-foreground/70 text-xs md:text-base mb-3 md:mb-4 leading-snug">{blank.benefit}</p>
              <div className="flex gap-1.5 md:gap-2 flex-wrap text-[10px] md:text-xs">
                <Badge>От {CONFIG.moq} шт</Badge>
                <Badge>{CONFIG.lead_time_min_days}+ дней</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
