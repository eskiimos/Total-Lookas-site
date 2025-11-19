'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { HERO } from '@/app/content'

const HeroImageSlider: React.FC = () => {
  const images = [
    '/images/hero/photo_2025-11-19 16.45.44.jpeg',
    '/images/hero/photo_2025-11-19 16.46.53.jpeg',
    '/images/hero/photo_2025-11-19 16.52.17.jpeg',
    '/images/hero/photo_2025-11-19 16.52.41.jpeg',
  ]
  
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative w-full h-full">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt="Мерч продукция"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* Navigation Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white w-4 md:w-6' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Слайд ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export const Hero: React.FC = () => {
  const [h1Index] = useState(0)
  const [subIndex] = useState(0)

  return (
    <section id="hero" className="min-h-[100dvh] flex items-center px-4 pt-20 pb-8 md:pt-32 md:pb-20 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background z-10"></div>
        <img 
          src="/images/hero/tlp15.webp" 
          alt="Hero background" 
          className="w-full h-full object-cover opacity-100"
        />
      </div>
      
      <div className="max-w-7xl mx-auto w-full relative z-20">
        
        {/* Compact Hero Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6">
          
          {/* Main Content - Left */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <div className="inline-block px-3 py-1 bg-accent/20 border border-accent/30 rounded-full text-xs md:text-sm text-accent mb-3 md:mb-4 w-fit">
              ⚡️ Производство от 20 дней
            </div>
            
            <h1 className="font-unbounded text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-5 leading-[1.1]">
              {HERO.h1[h1Index]}
            </h1>
            
            <p className="text-sm md:text-lg text-foreground/70 mb-4 md:mb-8 max-w-xl">
              {HERO.subheadline[subIndex]}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-5 md:mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-accent/10 border border-accent/30 rounded-full text-sm md:text-base font-medium text-foreground hover:bg-accent/20 transition-colors">
                Тираж 30–10 000+ шт
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-accent/10 border border-accent/30 rounded-full text-sm md:text-base font-medium text-foreground hover:bg-accent/20 transition-colors">
                Вся Россия
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-accent/10 border border-accent/30 rounded-full text-sm md:text-base font-medium text-foreground hover:bg-accent/20 transition-colors">
                Производство под ключ
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <Button 
                variant="primary"
                onClick={() => {
                  const ctaSection = document.getElementById('cta')
                  ctaSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-sm md:text-base py-2.5 md:py-3 px-5 md:px-6"
              >
                {HERO.primaryCTA[0]}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const casesSection = document.getElementById('cases')
                  casesSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-sm md:text-base py-2.5 md:py-3 px-5 md:px-6"
              >
                {HERO.secondaryCTA[0]}
              </Button>
            </div>
          </div>

          {/* Cards Grid - Right */}
          <div className="md:col-span-5 grid grid-cols-2 gap-2 md:gap-3">
            
            {/* Big Card - Spans 2x2 with Image Slider */}
            <div className="col-span-2 row-span-2">
              <Card className="h-full bg-gradient-to-br from-accent to-accent/80 overflow-hidden min-h-[280px] md:min-h-[240px] hover:scale-[1.02] transition-transform relative group">
                <HeroImageSlider />
              </Card>
            </div>

            {/* Small Cards */}
            <Card className="bg-[#3a3a3a] p-3 md:p-4 flex flex-col justify-center min-h-[50px] md:min-h-[85px] hover:bg-[#404040] transition-colors">
              <div className="font-unbounded text-xl md:text-3xl font-bold text-accent mb-0.5 md:mb-1">от 20 дней</div>
              <div className="text-[10px] md:text-xs text-foreground/70 leading-tight">производство<br/>и доставка</div>
            </Card>

            <Card className="bg-[#3a3a3a] p-3 md:p-4 flex flex-col justify-center min-h-[50px] md:min-h-[85px] hover:bg-[#404040] transition-colors">
              <div className="font-unbounded text-lg md:text-2xl font-bold text-accent mb-0.5 md:mb-1">30-10K+</div>
              <div className="text-[10px] md:text-xs text-foreground/70 leading-tight">любые<br/>тиражи</div>
            </Card>

            <Card className="bg-[#2a2a2a] border-2 border-accent/30 p-3 md:p-4 flex flex-col justify-center min-h-[50px] md:min-h-[85px] hover:border-accent/50 transition-colors">
              <div className="flex items-center gap-1.5 mb-0.5 md:mb-1">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="text-xs md:text-sm font-semibold">Контроль</div>
              </div>
              <div className="text-[10px] md:text-xs text-foreground/60">качества на 2 этапах</div>
            </Card>

            <Card className="bg-[#2a2a2a] border-2 border-accent/30 p-3 md:p-4 flex flex-col justify-center min-h-[50px] md:min-h-[85px] hover:border-accent/50 transition-colors">
              <div className="flex items-center gap-1.5 mb-0.5 md:mb-1">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div className="text-xs md:text-sm font-semibold">Документы</div>
              </div>
              <div className="text-[10px] md:text-xs text-foreground/60">счета, акты, УПД</div>
            </Card>

          </div>

        </div>
      </div>
    </section>
  )
}
