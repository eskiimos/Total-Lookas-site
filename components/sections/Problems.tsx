'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { PROBLEMS } from '@/app/content'

const sliderImages = [
  '/images/cases/case-1.png',
  '/images/cases/case-2.jpeg',
  '/images/cases/case-3.jpeg',
  '/images/cases/case-4.jpeg',
]

export const Problems: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, 4000) // Смена слайда каждые 4 секунды

    return () => clearInterval(interval)
  }, [])

  return (
    <Section id="problems" className="bg-[#2a2a2a]">
      <Card className="overflow-hidden hover:border-accent/40 transition-colors group">
        <div className="flex flex-col lg:flex-row">
          
          {/* Content - 70% */}
          <div className="flex-[0.7] p-4 md:p-6 lg:p-8">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">{PROBLEMS.title}</h2>
            <p className="text-xs md:text-sm text-foreground/60 mb-4 md:mb-6">
              {PROBLEMS.subtitle}
            </p>
            
            {/* Compact list without emojis */}
            <div className="space-y-3 md:space-y-4">
              {PROBLEMS.items.map((item, index) => (
                <div key={index} className="flex gap-3 md:gap-4">
                  <div className="w-1.5 md:w-2 bg-accent rounded-full flex-shrink-0 mt-1"></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-bold mb-1">{item.audience}</h3>
                    <p className="text-xs md:text-sm text-foreground/70 leading-snug">
                      {item.solution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Slider - 30% */}
          <div className="relative flex-[0.3] h-48 md:h-64 lg:h-auto bg-[#3a3a3a] flex-shrink-0 rounded-brand overflow-hidden">
            {/* Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-foreground/20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Slides */}
            {sliderImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <Image
                  src={image}
                  alt={`Слайд ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}

            {/* Dots indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-accent w-6' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </Card>
    </Section>
  )
}
