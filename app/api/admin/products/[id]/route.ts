import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - получить один товар
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        sizeChart: true
      }
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 })
  }
}

// PUT - обновить товар
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const data = await request.json()
    
    // Удаляем старые изображения если есть новые
    if (data.images) {
      await prisma.productImage.deleteMany({
        where: { productId: id }
      })
    }
    
    // Удаляем старую размерную сетку если есть новая
    if (data.sizeChartUrl) {
      await prisma.sizeChart.deleteMany({
        where: { productId: id }
      })
    }
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        sku: data.sku,
        category: data.category,
        description: data.description,
        status: data.status,
        minOrder: data.minOrder,
        leadTime: data.leadTime,
        sizes: JSON.stringify(data.sizes),
        colors: JSON.stringify(data.colors),
        fabric: data.fabric,
        density: data.density,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        slug: data.slug,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
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
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE - удалить товар
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.product.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
