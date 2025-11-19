'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Media {
  id: string
  url: string
  filename: string
  size: number
  mimeType: string
  width?: number
  height?: number
  usedInProducts: boolean
  createdAt: string
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) {
        const data = await res.json()
        setMedia(data)
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (res.ok) {
          await fetchMedia() // Обновляем список
        }
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }
    
    setUploading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить файл из медиатеки?')) return

    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        setMedia(media.filter(m => m.id !== id))
        setSelectedMedia(null)
      } else {
        const data = await res.json()
        alert(data.error || 'Ошибка удаления')
      }
    } catch (error) {
      console.error('Error deleting media:', error)
      alert('Ошибка удаления файла')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('URL скопирован в буфер обмена')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">Загрузка...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Медиатека</h1>
            <p className="text-foreground/60">
              Всего файлов: {media.length}
            </p>
          </div>
          <div className="flex gap-4">
            <label className="bg-accent hover:bg-accent/90 text-background px-6 py-3 rounded-brand font-semibold cursor-pointer transition-colors">
              {uploading ? 'Загрузка...' : 'Загрузить файлы'}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <Link
              href="/admin"
              className="bg-[#404040] hover:bg-[#505050] text-foreground px-6 py-3 rounded-brand font-semibold transition-colors"
            >
              ← Назад
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="relative aspect-square bg-[#282828] rounded-brand overflow-hidden cursor-pointer hover:ring-2 hover:ring-accent transition-all group"
            >
              {item.mimeType.startsWith('image/') ? (
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-foreground/40">
                  Файл
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-xs text-center px-2">
                  <div className="font-semibold truncate">{item.filename}</div>
                  <div className="text-white/80">{formatFileSize(item.size)}</div>
                  {item.width && item.height && (
                    <div className="text-white/80">{item.width}×{item.height}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {media.length === 0 && (
          <div className="text-center py-20 text-foreground/60">
            <p className="text-xl mb-4">Медиатека пуста</p>
            <p>Загрузите первый файл, чтобы начать</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="bg-[#282828] rounded-brand p-6 max-w-3xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview */}
            {selectedMedia.mimeType.startsWith('image/') && (
              <div className="relative w-full aspect-video mb-6 bg-[#404040] rounded-brand overflow-hidden">
                <Image
                  src={selectedMedia.url}
                  alt={selectedMedia.filename}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Info */}
            <div className="space-y-3 mb-6">
              <div>
                <div className="text-sm text-foreground/60 mb-1">Имя файла</div>
                <div className="font-semibold">{selectedMedia.filename}</div>
              </div>
              
              <div>
                <div className="text-sm text-foreground/60 mb-1">URL</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedMedia.url}
                    readOnly
                    className="flex-1 bg-[#404040] px-3 py-2 rounded-brand text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedMedia.url)}
                    className="bg-accent hover:bg-accent/90 text-background px-4 py-2 rounded-brand text-sm font-semibold transition-colors"
                  >
                    Копировать
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Размер</div>
                  <div>{formatFileSize(selectedMedia.size)}</div>
                </div>
                
                {selectedMedia.width && selectedMedia.height && (
                  <div>
                    <div className="text-sm text-foreground/60 mb-1">Разрешение</div>
                    <div>{selectedMedia.width}×{selectedMedia.height}</div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Тип</div>
                  <div>{selectedMedia.mimeType}</div>
                </div>
                
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Загружен</div>
                  <div>{new Date(selectedMedia.createdAt).toLocaleDateString('ru-RU')}</div>
                </div>
              </div>

              {selectedMedia.usedInProducts && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-brand px-4 py-3 text-sm">
                  ⚠️ Файл используется в товарах
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSelectedMedia(null)}
                className="bg-[#404040] hover:bg-[#505050] text-foreground px-6 py-3 rounded-brand font-semibold transition-colors"
              >
                Закрыть
              </button>
              <button
                onClick={() => handleDelete(selectedMedia.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-brand font-semibold transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
