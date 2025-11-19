'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { CTASection } from '@/components/sections/CTA'
import { Footer } from '@/components/sections/Footer'
import { OrderModal } from '@/components/OrderModal'

interface Product {
  id: string
  name: string
  price: string
  sku: string
  category: string
  description: string
  status: string
  minOrder: number
  leadTime: string
  sizes: string
  colors: string
  fabric: string
  density: string
  metaTitle: string
  metaDescription: string
  slug: string
  isFeatured: boolean
  images: { url: string; isPrimary: boolean; order: number }[]
  sizeChart?: { imageUrl: string }
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.slug}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        }
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params.slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-xl">Загрузка...</div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Товар не найден</h1>
          <Link href="/catalog" className="text-accent hover:underline">
            ← Вернуться в каталог
          </Link>
        </div>
      </main>
    )
  }

  const sizes = JSON.parse(product.sizes)
  const colors = JSON.parse(product.colors)
  const sortedImages = [...product.images].sort((a, b) => a.order - b.order)
  const mainImage = sortedImages[selectedImage]?.url || sortedImages[0]?.url

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
          <div className="flex gap-4 md:gap-6">
            <Link 
              href="/catalog" 
              className="text-sm md:text-base text-foreground/80 hover:text-accent transition-colors"
            >
              Каталог
            </Link>
            <Link 
              href="/" 
              className="text-sm md:text-base text-foreground/80 hover:text-accent transition-colors"
            >
              Главная
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="text-sm text-foreground/60 mb-6 md:mb-8">
            <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
            {' / '}
            <Link href="/catalog" className="hover:text-accent transition-colors">Каталог</Link>
            {' / '}
            <span className="text-foreground">{product.name}</span>
          </div>

          {/* Mobile: Slider for images */}
          <div className="md:hidden mb-8">
            <div className="relative w-full aspect-[3/4] bg-[#282828] rounded-brand overflow-hidden mb-4">
              {mainImage ? (
                <Image
                  src={mainImage}
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

            {sortedImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {sortedImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 bg-[#282828] rounded-brand overflow-hidden transition-all ${
                      selectedImage === index ? 'ring-2 ring-accent' : 'hover:ring-2 hover:ring-accent/50'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop: 3 Column Layout */}
          <div className="hidden md:grid md:grid-cols-[25%_40%_35%] gap-6 lg:gap-8">
            
            {/* LEFT COLUMN - 25% */}
            <div className="sticky top-24 h-fit space-y-6">
              {/* Title */}
              <div>
                <h1 className="font-unbounded text-2xl lg:text-3xl font-bold">{product.name}</h1>
              </div>

              {/* Артикул */}
              <div>
                <div className="text-sm text-foreground/60 mb-1">Артикул:</div>
                <div className="font-semibold">{product.sku}</div>
              </div>

              {/* Размерная сетка */}
              {product.sizeChart && (
                <div>
                  <div className="text-sm font-bold mb-2">Размерная сетка</div>
                  <div className="relative w-full bg-[#282828] rounded-brand overflow-hidden">
                    <Image
                      src={product.sizeChart.imageUrl}
                      alt="Размерная сетка"
                      width={300}
                      height={225}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* CENTER COLUMN - 50% (Photos) */}
            <div>
              <div className="space-y-4">
                {sortedImages.map((image, index) => (
                  <div key={index} className="relative w-full aspect-[3/4] bg-[#282828] rounded-brand overflow-hidden">
                    <Image
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {sortedImages.length === 0 && (
                  <div className="relative w-full aspect-[3/4] bg-[#282828] rounded-brand flex items-center justify-center text-foreground/40">
                    Нет фото
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN - 25% */}
            <div className="sticky top-24 h-fit space-y-6">
              {/* Price */}
              <div>
                <div className="font-unbounded text-[#f8f8f8] text-2xl lg:text-3xl font-bold">{product.price}</div>
              </div>

              {/* Description */}
              <div>
                <p className="text-foreground/80 text-sm lg:text-base leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Characteristics */}
              <div className="bg-[#282828] rounded-brand p-4 space-y-3">
                <div className="text-sm font-bold mb-3">Характеристики</div>
                
                <div className="space-y-2 text-sm">
                  {product.fabric && (
                    <div>
                      <div className="text-foreground/60">Состав:</div>
                      <div className="font-semibold">{product.fabric}</div>
                    </div>
                  )}
                  
                  <div>
                    <div className="text-foreground/60">Минимальный заказ:</div>
                    <div className="font-semibold">От {product.minOrder} шт</div>
                  </div>
                  
                  <div>
                    <div className="text-foreground/60">Срок изготовления:</div>
                    <div className="font-semibold">{product.leadTime}</div>
                  </div>
                  
                  {product.density && (
                    <div>
                      <div className="text-foreground/60">Плотность:</div>
                      <div className="font-semibold">{product.density}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sizes */}
              {sizes.length > 0 && sizes[0] && (
                <div>
                  <div className="text-sm text-foreground/60 mb-2">Доступные размеры:</div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size: string, index: number) => (
                      <div key={index} className="bg-[#404040] px-3 py-1 rounded-brand text-xs">
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {colors.length > 0 && colors[0] && (
                <div>
                  <div className="text-sm text-foreground/60 mb-2">Доступные цвета:</div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color: string, index: number) => (
                      <div key={index} className="bg-[#404040] px-3 py-1 rounded-brand text-xs">
                        {color}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Button */}
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-4 rounded-brand transition-colors"
              >
                Заказать
              </button>
            </div>

          </div>

          {/* Mobile: Info below slider */}
          <div className="md:hidden space-y-6">
            <div>
              <h1 className="font-unbounded text-2xl font-bold mb-4">{product.name}</h1>
              <div className="font-unbounded text-[#f8f8f8] text-2xl font-bold mb-4">{product.price}</div>
              
              {/* Order Button Mobile - under price */}
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-4 rounded-brand transition-colors mb-6"
              >
                Заказать
              </button>
            </div>

            <p className="text-foreground/80 leading-relaxed">
              {product.description}
            </p>

            <div className="bg-[#282828] rounded-brand p-4 space-y-3">
              <div className="font-bold mb-3">Характеристики</div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-[#404040]">
                  <span className="text-foreground/60">Артикул:</span>
                  <span className="font-semibold">{product.sku}</span>
                </div>
                
                {product.fabric && (
                  <div className="flex justify-between py-2 border-b border-[#404040]">
                    <span className="text-foreground/60">Состав:</span>
                    <span className="font-semibold">{product.fabric}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-2 border-b border-[#404040]">
                  <span className="text-foreground/60">Минимальный заказ:</span>
                  <span className="font-semibold">От {product.minOrder} шт</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-[#404040]">
                  <span className="text-foreground/60">Срок изготовления:</span>
                  <span className="font-semibold">{product.leadTime}</span>
                </div>
                
                {product.density && (
                  <div className="flex justify-between py-2 border-b border-[#404040]">
                    <span className="text-foreground/60">Плотность:</span>
                    <span className="font-semibold">{product.density}</span>
                  </div>
                )}
              </div>
            </div>

            {sizes.length > 0 && sizes[0] && (
              <div>
                <div className="text-foreground/60 mb-2">Доступные размеры:</div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size: string, index: number) => (
                    <div key={index} className="bg-[#404040] px-4 py-2 rounded-brand text-sm">
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && colors[0] && (
              <div>
                <div className="text-foreground/60 mb-2">Доступные цвета:</div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color: string, index: number) => (
                    <div key={index} className="bg-[#404040] px-4 py-2 rounded-brand text-sm">
                      {color}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.sizeChart && (
              <div>
                <div className="font-bold mb-3">Размерная сетка</div>
                <div className="relative w-full bg-[#282828] rounded-brand overflow-hidden">
                  <Image
                    src={product.sizeChart.imageUrl}
                    alt="Размерная сетка"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CTASection />
      <Footer />

      {/* Order Modal */}
      {product && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          productName={product.name}
          minOrder={product.minOrder}
        />
      )}
    </main>
  )
}
