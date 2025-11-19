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
      orderBy: { sortOrder: 'asc' },
      take: 6 // Берем только 6 товаров для главной
    })
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ products: [], error: 'Failed to load products' }, { status: 200 })
  }
}
