import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Генерируем уникальное имя файла
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Загружаем в Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    })

    // Получаем размеры изображения, если это изображение
    let width: number | undefined
    let height: number | undefined
    
    if (file.type.startsWith('image/')) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        // Простое определение размеров для JPEG и PNG
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          // JPEG размеры
          for (let i = 0; i < buffer.length - 9; i++) {
            if (buffer[i] === 0xff && buffer[i + 1] === 0xc0) {
              height = buffer.readUInt16BE(i + 5)
              width = buffer.readUInt16BE(i + 7)
              break
            }
          }
        } else if (file.type === 'image/png') {
          // PNG размеры
          width = buffer.readUInt32BE(16)
          height = buffer.readUInt32BE(20)
        }
      } catch (err) {
        console.error('Error reading image dimensions:', err)
      }
    }
    
    // Сохраняем в медиатеку
    const media = await prisma.media.create({
      data: {
        url: blob.url,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
        width,
        height
      }
    })
    
    return NextResponse.json({ url: blob.url, mediaId: media.id })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
