import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { del } from '@vercel/blob'

// DELETE - удалить медиафайл
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    
    // Получаем медиафайл
    const media = await prisma.media.findUnique({
      where: { id }
    })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Проверяем, используется ли в товарах
    const usedInProducts = await prisma.productImage.findFirst({
      where: { url: media.url }
    })

    if (usedInProducts) {
      return NextResponse.json({ 
        error: 'Файл используется в товарах и не может быть удален' 
      }, { status: 400 })
    }

    // Удаляем из Vercel Blob
    try {
      await del(media.url)
    } catch (blobError) {
      console.error('Error deleting from blob:', blobError)
      // Продолжаем даже если не удалось удалить из blob
    }

    // Удаляем из БД
    await prisma.media.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
