'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { HERO } from '@/app/content'

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
              ⚡️ Производство от 7 дней
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-5 leading-[1.1]">
              {HERO.h1[h1Index]}
            </h1>
            
            <p className="text-sm md:text-lg text-foreground/70 mb-4 md:mb-8 max-w-xl">
              {HERO.subheadline[subIndex]}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 md:gap-4 mb-5 md:mb-8">
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span className="text-foreground/80">Тираж 30–10 000+ шт</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span className="text-foreground/80">Вся Россия</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span className="text-foreground/80">Производство под ключ</span>
              </div>
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
            
            {/* Big Card - Spans 2x2 */}
            <div className="col-span-2 row-span-2">
              <Card className="h-full bg-gradient-to-br from-accent to-accent/80 p-4 md:p-6 flex flex-col justify-center min-h-[140px] md:min-h-[240px] hover:scale-[1.02] transition-transform">
                <div>
                  <div className="text-white text-base md:text-xl font-bold mb-2 md:mb-3">
                    Производим мерч под ключ
                  </div>
                  <div className="text-white/90 text-xs md:text-sm">
                    Шьем, брендируем и доставляем футболки, худи, сумки и другой текстиль
                  </div>
                </div>
              </Card>
            </div>

            {/* Small Cards */}
            <Card className="bg-[#3a3a3a] p-3 md:p-4 flex flex-col justify-center min-h-[65px] md:min-h-[110px] hover:bg-[#404040] transition-colors">
              <div className="text-xl md:text-3xl font-bold text-accent mb-0.5 md:mb-1">от 7 дней</div>
              <div className="text-[10px] md:text-xs text-foreground/70 leading-tight">производство<br/>и доставка</div>
            </Card>

            <Card className="bg-[#3a3a3a] p-3 md:p-4 flex flex-col justify-center min-h-[65px] md:min-h-[110px] hover:bg-[#404040] transition-colors">
              <div className="text-lg md:text-2xl font-bold text-accent mb-0.5 md:mb-1">30-10K</div>
              <div className="text-[10px] md:text-xs text-foreground/70 leading-tight">любые<br/>тиражи</div>
            </Card>

            <Card className="bg-[#2a2a2a] border-2 border-accent/30 p-3 md:p-4 flex flex-col justify-center min-h-[65px] md:min-h-[110px] hover:border-accent/50 transition-colors">
              <div className="flex items-center gap-1.5 mb-0.5 md:mb-1">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="text-xs md:text-sm font-semibold">Контроль</div>
              </div>
              <div className="text-[10px] md:text-xs text-foreground/60">качества на 2 этапах</div>
            </Card>

            <Card className="bg-[#2a2a2a] border-2 border-accent/30 p-3 md:p-4 flex flex-col justify-center min-h-[65px] md:min-h-[110px] hover:border-accent/50 transition-colors">
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
