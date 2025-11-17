import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = 'px-8 py-4 rounded-brand font-medium transition-all duration-200 text-base'
  
  const variantStyles: Record<'primary' | 'secondary', string> = {
    primary: 'bg-accent text-white hover:bg-[#ea580c] active:transform active:scale-95',
    secondary: 'bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background',
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
