import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  const hoverStyles = hover ? 'hover:transform hover:scale-[1.02] transition-transform duration-200' : ''
  
  return (
    <div className={`bg-[#3a3a3a] rounded-brand ${hoverStyles} ${className}`}>
      {children}
    </div>
  )
}
