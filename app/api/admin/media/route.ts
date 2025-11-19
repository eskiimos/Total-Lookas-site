import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - получить все медиафайлы
export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(media)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to load media' }, { status: 500 })
  }
}

// POST - добавить медиафайл в библиотеку (используется при загрузке)
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { url, filename, size, mimeType, width, height } = body

    const media = await prisma.media.create({
      data: {
        url,
        filename,
        size,
        mimeType,
        width,
        height
      }
    })
    
    return NextResponse.json(media)
  } catch (error) {
    console.error('Error creating media:', error)
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 })
  }
}
