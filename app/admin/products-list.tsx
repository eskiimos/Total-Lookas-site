'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: string
  sku: string
  category: string
  status: string
  isFeatured: boolean
  images: { id: string; url: string; isPrimary: boolean }[]
}

export default function AdminPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await fetch('/api/admin/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products)
        setIsAuthenticated(true)
      }
    } catch (err) {
      // Not authenticated
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (res.ok) {
        setIsAuthenticated(true)
        await checkAuth()
      } else {
        setError('Неверный пароль')
      }
    } catch (err) {
      setError('Ошибка подключения')
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    setIsAuthenticated(false)
    router.push('/')
  }

  async function deleteProduct(id: string) {
    if (!confirm('Удалить товар?')) return
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (err) {
      setError('Ошибка удаления')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-[#3a3a3a] rounded-brand p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Админ-панель</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                placeholder="Введите пароль"
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-accent text-white py-3 rounded-brand font-semibold hover:bg-accent/90 transition-colors"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[#3a3a3a] border-b border-[#404040] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Управление товарами</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/products/new"
              className="bg-accent text-white px-6 py-2 rounded-brand font-semibold hover:bg-accent/90 transition-colors"
            >
              + Добавить товар
            </Link>
            <button
              onClick={handleLogout}
              className="bg-[#282828] px-6 py-2 rounded-brand hover:bg-[#404040] transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-brand text-red-500">
            {error}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground/60 mb-4">Товаров пока нет</p>
            <Link
              href="/admin/products/new"
              className="inline-block bg-accent text-white px-6 py-3 rounded-brand font-semibold hover:bg-accent/90 transition-colors"
            >
              Создать первый товар
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
              
              return (
                <div key={product.id} className="bg-[#3a3a3a] rounded-brand overflow-hidden">
                  {/* Image */}
                  {primaryImage && (
                    <div className="relative h-64 bg-[#282828]">
                      <img 
                        src={primaryImage} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      {product.isFeatured && (
                        <span className="text-xs bg-accent px-2 py-1 rounded-full">★</span>
                      )}
                    </div>
                    
                    <p className="text-accent font-bold text-lg mb-2">{product.price}</p>
                    <p className="text-sm text-foreground/60 mb-1">SKU: {product.sku}</p>
                    <p className="text-sm text-foreground/60 mb-1">Категория: {product.category}</p>
                    <p className="text-sm text-foreground/60 mb-4">Статус: {product.status}</p>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="flex-1 bg-accent text-white px-4 py-2 rounded-brand text-center hover:bg-accent/90 transition-colors"
                      >
                        Редактировать
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="bg-red-500/20 text-red-500 px-4 py-2 rounded-brand hover:bg-red-500/30 transition-colors"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
