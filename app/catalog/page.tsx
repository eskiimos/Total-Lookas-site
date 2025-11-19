'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CTASection } from '@/components/sections/CTA'
import { Footer } from '@/components/sections/Footer'

interface Product {
  id: string
  name: string
  price: string
  category: string
  description: string
  minOrder: number
  leadTime: string
  slug: string
  images: { url: string; isPrimary: boolean }[]
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/catalog')
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-[#404040]">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img 
              src="/images/header/logo-TL.svg" 
              alt="Total Lookas" 
              className="h-6 md:h-9 w-auto"
            />
          </Link>
          <Link 
            href="/" 
            className="text-sm md:text-base text-foreground/80 hover:text-accent transition-colors"
          >
            ← Назад на главную
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 text-center">
            Каталог товаров
          </h1>
          <p className="text-center text-foreground/80 text-sm md:text-lg mb-8 md:mb-16 max-w-3xl mx-auto">
            Наши лекала — проверенные модели с предсказуемой посадкой. Минимальный заказ от 30 штук.
          </p>

          {loading ? (
            <div className="text-center py-20 text-foreground/60">
              Загрузка товаров...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-foreground/60">
              Пока нет товаров в каталоге. Добавьте товары через админ-панель.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[10px] md:gap-6">
              {products.map((product) => {
                const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
                
                return (
                  <Link key={product.id} href={`/products/${product.slug}`}>
                    <Card hover className="overflow-hidden !p-0">
                    {/* Image */}
                    <div className="relative w-full aspect-[3/4] bg-[#404040] overflow-hidden">
                      {primaryImage ? (
                        <Image
                          src={primaryImage}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-foreground/40">
                          Нет фото
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="!p-[10px]">
                      <h3 className="font-unbounded text-sm md:text-xl font-semibold mb-1 md:mb-2">
                        {product.name}
                      </h3>
                      <div className="font-unbounded text-[#f8f8f8] font-bold text-sm md:text-base mb-2 md:mb-4">
                        {product.price}
                      </div>
                      {product.description && (
                        <p className="text-xs md:text-sm text-foreground/80 mb-2 md:mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex gap-1.5 md:gap-2 flex-wrap text-[10px] md:text-xs">
                        <Badge>От {product.minOrder} шт</Badge>
                        <Badge>{product.leadTime}</Badge>
                      </div>
                    </div>
                  </Card>
                  </Link>
                )
              })}
            </div>
          )}

        </div>
      </div>
      
      <CTASection />
      <Footer />
    </main>
  )
}
