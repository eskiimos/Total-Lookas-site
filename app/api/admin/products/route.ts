import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - получить все товары
export async function GET(request: Request) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        sizeChart: true
      },
      orderBy: { sortOrder: 'asc' }
    })
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}

// POST - создать новый товар
export async function POST(request: Request) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        sku: data.sku,
        category: data.category,
        description: data.description,
        status: data.status || 'available',
        minOrder: data.minOrder || 30,
        leadTime: data.leadTime || '7+ дней',
        sizes: JSON.stringify(data.sizes || []),
        colors: JSON.stringify(data.colors || []),
        fabric: data.fabric || '',
        density: data.density || '',
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        slug: data.slug,
        isFeatured: data.isFeatured || false,
        sortOrder: data.sortOrder || 0,
        relatedProducts: JSON.stringify(data.relatedProducts || []),
        images: data.images ? {
          create: data.images.map((url: string, index: number) => ({
            url,
            isPrimary: index === 0,
            order: index
          }))
        } : undefined,
        sizeChart: data.sizeChartUrl ? {
          create: {
            imageUrl: data.sizeChartUrl
          }
        } : undefined
      },
      include: {
        images: true,
        sizeChart: true
      }
    })
    
    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
