'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CONFIG } from '@/app/content'

interface Product {
  id: string
  name: string
  price: string
  description: string
  minOrder: number
  leadTime: string
  images: { url: string; isPrimary: boolean }[]
}

export const Blanks: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        console.log('Products API response:', data)
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading products:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Section id="blanks" className="bg-[#282828]">
        <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 text-center">Готовые бланки</h2>
        <div className="text-center text-foreground/60">Загрузка...</div>
      </Section>
    )
  }

  return (
    <Section id="blanks" className="bg-[#282828]">
      <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 text-center">Готовые бланки</h2>
      <p className="text-center text-foreground/80 text-sm md:text-base mb-6 md:mb-12 max-w-2xl mx-auto">
        Наши лекала — проверенные модели с предсказуемой посадкой
      </p>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground/60 mb-4">Товаров пока нет</p>
          <p className="text-sm text-foreground/40">Добавьте товары через админ-панель</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px] md:gap-6">
            {products.map((product) => {
              const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
              
              return (
                <Card key={product.id} hover className="overflow-hidden !p-0">
                  {primaryImage && (
                    <div className="relative w-full aspect-[3/4] bg-[#404040] overflow-hidden">
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="!p-[10px]">
                    <h3 className="text-sm md:text-xl font-semibold mb-1 md:mb-2">{product.name}</h3>
                    <div className="text-accent font-bold text-base md:text-lg mb-2 md:mb-3">{product.price}</div>
                    <p className="text-foreground/70 text-xs md:text-base mb-3 md:mb-4 leading-snug line-clamp-2">{product.description}</p>
                    <div className="flex gap-1.5 md:gap-2 flex-wrap text-[10px] md:text-xs">
                      <Badge>От {product.minOrder} шт</Badge>
                      <Badge>{product.leadTime}</Badge>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
          
          <div className="text-center mt-8 md:mt-12">
            <Link 
              href="/catalog"
              className="inline-block bg-accent text-white px-8 py-3 rounded-brand font-semibold hover:bg-accent/90 transition-colors"
            >
              Смотреть весь каталог
            </Link>
          </div>
        </>
      )}
    </Section>
  )
}
