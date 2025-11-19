import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
      // Без ограничения take - возвращаем все товары для каталога
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching catalog products:', error)
    return NextResponse.json({ error: 'Failed to load catalog' }, { status: 500 })
  }
}
