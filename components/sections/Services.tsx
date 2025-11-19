import React from 'react'
import Image from 'next/image'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { SERVICES } from '@/app/content'

const serviceImages = [
  '/images/brandedclothing.webp',
  '/images/welcomesets.webp',
  '/images/eventmerch.webp',
  '/images/giftsforclients.webp',
  '/images/packagingandprinting.webp',
  '/images/customizedsolutions.webp',
]

export const Services: React.FC = () => {
  return (
    <Section id="services">
      <h2 className="text-2xl md:text-5xl font-bold mb-6 md:mb-12 text-center">Что мы делаем</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {SERVICES.map((service, index) => (
          <Card key={index} hover className="overflow-hidden group !p-0">
            {/* Image */}
            <div className="relative w-full aspect-square bg-[#3a3a3a] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 md:w-16 md:h-16 text-foreground/20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <Image
                src={serviceImages[index]}
                alt={service.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Text Content */}
            <div className="!p-[10px]">
              <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-3">{service.title}</h3>
              <p className="text-xs md:text-base text-foreground/80 leading-snug md:leading-normal">{service.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
