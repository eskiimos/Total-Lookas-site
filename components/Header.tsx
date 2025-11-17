'use client'

import React, { useState, useEffect } from 'react'

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const navItems = [
    { label: 'Услуги', id: 'services' },
    { label: 'Бланки', id: 'blanks' },
    { label: 'Кейсы', id: 'cases' },
    { label: 'FAQ', id: 'faq' },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md py-3' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Bento Grid Container */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Logo Card */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="px-2 py-2 md:py-3 hover:opacity-80 transition-all duration-200"
          >
            <img 
              src="/images/header/logo-TL.svg" 
              alt="Total Lookas" 
              className="h-6 md:h-9 w-auto"
            />
          </button>

          {/* Desktop Navigation Cards */}
          <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 rounded-brand text-sm bg-[#3a3a3a] hover:bg-accent hover:text-white 
                  text-foreground/80 transition-all duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Card */}
          <button
            onClick={() => scrollToSection('cta')}
            className={`hidden md:block px-4 md:px-6 py-2 md:py-3 rounded-brand font-medium text-sm md:text-base
              bg-accent text-white hover:bg-[#ea580c] transition-all duration-200
              ${isScrolled ? 'shadow-lg shadow-accent/20' : ''}`}
          >
            Оставить заявку
          </button>

          {/* Mobile Menu Button Card */}
          <button 
            className="lg:hidden px-4 py-2 rounded-brand bg-[#3a3a3a] hover:bg-accent transition-colors ml-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Bento Cards */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 grid grid-cols-2 gap-2 animate-in slide-in-from-top duration-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-3 rounded-brand text-sm bg-[#3a3a3a] hover:bg-accent hover:text-white 
                  text-foreground/80 transition-all duration-200 text-center"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('cta')}
              className="col-span-2 px-4 py-3 rounded-brand font-medium text-sm
                bg-accent text-white hover:bg-[#ea580c] transition-all duration-200"
            >
              Оставить заявку
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
