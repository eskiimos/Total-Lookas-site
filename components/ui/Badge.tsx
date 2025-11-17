import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent'
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const variantStyles: Record<'default' | 'accent', string> = {
    default: 'bg-[#404040] text-foreground',
    accent: 'bg-accent text-white',
  }

  return (
    <span className={`inline-block px-[10px] py-1 text-sm rounded-full ${variantStyles[variant]}`}>
      {children}
    </span>
  )
}
