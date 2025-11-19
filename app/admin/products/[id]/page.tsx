'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface ProductForm {
  name: string
  price: string
  sku: string
  category: string
  description: string
  status: string
  minOrder: number
  leadTime: string
  sizes: string[]
  colors: string[]
  fabric: string
  density: string
  metaTitle: string
  metaDescription: string
  slug: string
  isFeatured: boolean
  sortOrder: number
}

export default function ProductEditPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [form, setForm] = useState<ProductForm>({
    name: '',
    price: '',
    sku: '',
    category: 'Футболки',
    description: '',
    status: 'available',
    minOrder: 30,
    leadTime: '7+ дней',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Черный', 'Белый'],
    fabric: '100% хлопок',
    density: '180 г/м²',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    isFeatured: false,
    sortOrder: 0
  })
  
  const [images, setImages] = useState<string[]>([])
  const [sizeChartUrl, setSizeChartUrl] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Медиатека
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [mediaLibraryMode, setMediaLibraryMode] = useState<'product' | 'sizeChart'>('product')
  const [mediaFiles, setMediaFiles] = useState<any[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [selectedMediaUrls, setSelectedMediaUrls] = useState<string[]>([])

  useEffect(() => {
    if (!isNew) {
      loadProduct()
    }
  }, [params.id])

  useEffect(() => {
    if (showMediaLibrary) {
      loadMediaLibrary()
    }
  }, [showMediaLibrary])

  async function loadProduct() {
    try {
      const res = await fetch(`/api/admin/products/${params.id}`)
      if (res.ok) {
        const { product } = await res.json()
        setForm({
          name: product.name,
          price: product.price,
          sku: product.sku,
          category: product.category,
          description: product.description,
          status: product.status,
          minOrder: product.minOrder,
          leadTime: product.leadTime,
          sizes: JSON.parse(product.sizes),
          colors: JSON.parse(product.colors),
          fabric: product.fabric,
          density: product.density,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
          slug: product.slug,
          isFeatured: product.isFeatured,
          sortOrder: product.sortOrder
        })
        setImages(product.images.map((img: any) => img.url))
        if (product.sizeChart) {
          setSizeChartUrl(product.sizeChart.imageUrl)
        }
      }
    } catch (err) {
      setError('Ошибка загрузки товара')
    } finally {
      setLoading(false)
    }
  }

  async function loadMediaLibrary() {
    setLoadingMedia(true)
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) {
        const data = await res.json()
        setMediaFiles(data)
      }
    } catch (err) {
      console.error('Error loading media:', err)
    } finally {
      setLoadingMedia(false)
    }
  }

  function toggleMediaSelection(url: string) {
    if (mediaLibraryMode === 'sizeChart') {
      // Для размерной сетки - одиночный выбор
      setSizeChartUrl(url)
      setShowMediaLibrary(false)
    } else {
      // Для фото товара - множественный выбор
      setSelectedMediaUrls(prev => 
        prev.includes(url) 
          ? prev.filter(u => u !== url)
          : [...prev, url]
      )
    }
  }

  function confirmMediaSelection() {
    if (mediaLibraryMode === 'product') {
      const newImages = [...images]
      selectedMediaUrls.forEach(url => {
        if (!newImages.includes(url) && newImages.length < 10) {
          newImages.push(url)
        }
      })
      setImages(newImages)
    }
    setSelectedMediaUrls([])
    setShowMediaLibrary(false)
  }

  function openMediaLibrary(mode: 'product' | 'sizeChart') {
    setMediaLibraryMode(mode)
    setSelectedMediaUrls([])
    setShowMediaLibrary(true)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      
      if (res.ok) {
        const { url } = await res.json()
        setImages([...images, url])
      }
    } catch (err) {
      setError('Ошибка загрузки изображения')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSizeChartUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      
      if (res.ok) {
        const { url } = await res.json()
        setSizeChartUrl(url)
      }
    } catch (err) {
      setError('Ошибка загрузки размерной сетки')
    }
  }

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index))
  }

  function generateSlug() {
    const slug = form.name
      .toLowerCase()
      .replace(/[^а-яёa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    setForm({ ...form, slug })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const url = isNew 
        ? '/api/admin/products'
        : `/api/admin/products/${params.id}`
      
      const method = isNew ? 'POST' : 'PUT'
      
      const payload = {
        ...form,
        images,
        sizeChartUrl
      }
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        setSuccess('Товар сохранен!')
        setTimeout(() => router.push('/admin'), 1000)
      } else {
        setError('Ошибка сохранения')
      }
    } catch (err) {
      setError('Ошибка подключения')
    } finally {
      setSaving(false)
    }
  }

  const categories = ['Футболки', 'Лонгсливы', 'Свитшоты', 'Худи', 'Халфзипы', 'Шопперы', 'Зип худи', 'Штаны', 'Джинсы', 'Шорты']
  const statuses = [
    { value: 'available', label: 'В наличии' },
    { value: 'pre-order', label: 'Под заказ' },
    { value: 'out-of-stock', label: 'Нет в наличии' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[#3a3a3a] border-b border-[#404040] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-foreground/60 hover:text-foreground">
              ← Назад
            </Link>
            <h1 className="text-2xl font-bold">
              {isNew ? 'Новый товар' : 'Редактирование товара'}
            </h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-accent text-white px-6 py-2 rounded-brand font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-brand text-green-500">
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-brand text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Основная информация */}
          <div className="bg-[#3a3a3a] rounded-brand p-6">
            <h2 className="text-xl font-bold mb-4">Основная информация</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Название *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Цена *</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="от 900₽"
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Артикул (SKU) *</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="TL-TSHIRT-001"
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Категория *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-2">Статус</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                >
                  {statuses.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-2">Порядок сортировки</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm mb-2">Описание *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                required
              />
            </div>
            
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-5 h-5"
                />
                <span>Популярный товар (показывать на главной)</span>
              </label>
            </div>
          </div>

          {/* Характеристики */}
          <div className="bg-[#3a3a3a] rounded-brand p-6">
            <h2 className="text-xl font-bold mb-4">Характеристики</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Минимальный заказ (шт)</label>
                <input
                  type="number"
                  value={form.minOrder}
                  onChange={(e) => setForm({ ...form, minOrder: parseInt(e.target.value) || 30 })}
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Срок производства</label>
                <input
                  type="text"
                  value={form.leadTime}
                  onChange={(e) => setForm({ ...form, leadTime: e.target.value })}
                  placeholder="7+ дней"
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Состав ткани</label>
                <input
                  type="text"
                  value={form.fabric}
                  onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                  placeholder="100% хлопок"
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Плотность ткани</label>
                <input
                  type="text"
                  value={form.density}
                  onChange={(e) => setForm({ ...form, density: e.target.value })}
                  placeholder="180 г/м²"
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm mb-2">Доступные размеры (через запятую)</label>
              <input
                type="text"
                value={form.sizes.join(', ')}
                onChange={(e) => setForm({ ...form, sizes: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="S, M, L, XL, XXL"
                className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm mb-2">Доступные цвета (через запятую)</label>
              <input
                type="text"
                value={form.colors.join(', ')}
                onChange={(e) => setForm({ ...form, colors: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Черный, Белый, Серый"
                className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
              />
            </div>
          </div>

          {/* Фотографии */}
          <div className="bg-[#3a3a3a] rounded-brand p-6">
            <h2 className="text-xl font-bold mb-4">Фотографии товара</h2>
            
            <div className="mb-4 flex gap-3">
              <label className="block">
                <span className="bg-accent text-white px-4 py-2 rounded-brand cursor-pointer inline-block hover:bg-accent/90 transition-colors">
                  {uploadingImage ? 'Загрузка...' : '+ Загрузить новое'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
              <button
                type="button"
                onClick={() => openMediaLibrary('product')}
                className="bg-[#282828] text-foreground px-4 py-2 rounded-brand hover:bg-[#404040] transition-colors"
              >
                📁 Выбрать из медиатеки
              </button>
            </div>
            <p className="text-sm text-foreground/60 mb-4">Максимум 10 фотографий</p>
            
            {images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={url} 
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-brand"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Размерная сетка */}
          <div className="bg-[#3a3a3a] rounded-brand p-6">
            <h2 className="text-xl font-bold mb-4">Размерная сетка</h2>
            
            <div className="mb-4 flex gap-3">
              <label className="block">
                <span className="bg-accent text-white px-4 py-2 rounded-brand cursor-pointer inline-block hover:bg-accent/90 transition-colors">
                  {sizeChartUrl ? 'Загрузить новую' : 'Загрузить'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSizeChartUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => openMediaLibrary('sizeChart')}
                className="bg-[#282828] text-foreground px-4 py-2 rounded-brand hover:bg-[#404040] transition-colors"
              >
                📁 Выбрать из медиатеки
              </button>
            </div>
            
            {sizeChartUrl && (
              <div className="mt-4">
                <img 
                  src={sizeChartUrl} 
                  alt="Size chart"
                  className="max-w-full h-auto rounded-brand"
                />
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-[#3a3a3a] rounded-brand p-6">
            <h2 className="text-xl font-bold mb-4">SEO</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Meta заголовок</label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                  placeholder={form.name}
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Meta описание</label>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  rows={3}
                  placeholder={form.description}
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm">URL (slug)</label>
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="text-xs bg-accent/20 text-accent px-2 py-1 rounded"
                  >
                    Сгенерировать
                  </button>
                </div>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="futbolka-tl"
                  className="w-full px-4 py-2 rounded-brand bg-[#282828] border border-[#404040] focus:border-accent outline-none"
                />
                <p className="text-sm text-foreground/60 mt-1">
                  /products/{form.slug || 'url-tovara'}
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-accent text-white py-3 rounded-brand font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Сохранение...' : 'Сохранить товар'}
            </button>
            <Link
              href="/admin"
              className="px-6 py-3 bg-[#282828] rounded-brand hover:bg-[#404040] transition-colors"
            >
              Отмена
            </Link>
          </div>
        </form>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowMediaLibrary(false)}
        >
          <div
            className="bg-[#282828] rounded-brand p-6 max-w-5xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {mediaLibraryMode === 'product' ? 'Выберите фото товара' : 'Выберите размерную сетку'}
              </h2>
              <button
                onClick={() => setShowMediaLibrary(false)}
                className="text-foreground/60 hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            {loadingMedia ? (
              <div className="text-center py-20">Загрузка медиатеки...</div>
            ) : mediaFiles.length === 0 ? (
              <div className="text-center py-20 text-foreground/60">
                <p className="text-xl mb-4">Медиатека пуста</p>
                <p>Загрузите файлы через кнопку "Загрузить новое" или посетите раздел Медиатека</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {mediaFiles.map((media) => {
                  const isSelected = mediaLibraryMode === 'product' 
                    ? selectedMediaUrls.includes(media.url)
                    : false
                  
                  return (
                    <div
                      key={media.id}
                      onClick={() => toggleMediaSelection(media.url)}
                      className={`relative aspect-square bg-[#404040] rounded-brand overflow-hidden cursor-pointer transition-all group ${
                        isSelected ? 'ring-4 ring-accent' : 'hover:ring-2 hover:ring-accent'
                      }`}
                    >
                      {media.mimeType.startsWith('image/') ? (
                        <img
                          src={media.url}
                          alt={media.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-foreground/40">
                          Файл
                        </div>
                      )}
                      
                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          ✓
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-xs text-center px-2">
                          <div className="font-semibold truncate">{media.filename}</div>
                          {media.width && media.height && (
                            <div className="text-white/80">{media.width}×{media.height}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            
            {/* Confirm Button */}
            {mediaLibraryMode === 'product' && selectedMediaUrls.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={confirmMediaSelection}
                  className="bg-accent text-white px-6 py-3 rounded-brand font-semibold hover:bg-accent/90 transition-colors"
                >
                  Добавить выбранные ({selectedMediaUrls.length})
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
