import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const contentPath = path.join(process.cwd(), 'app/content.ts')
    const content = await fs.readFile(contentPath, 'utf-8')
    
    // Извлекаем данные из content.ts
    const catalogMatch = content.match(/export const BLANKS = (\[[\s\S]*?\n\])/m)
    const catalog = catalogMatch ? eval(catalogMatch[1]) : []
    
    return NextResponse.json({ catalog })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { catalog } = await request.json()
    
    const contentPath = path.join(process.cwd(), 'app/content.ts')
    let content = await fs.readFile(contentPath, 'utf-8')
    
    // Обновляем BLANKS массив
    const newBlanks = JSON.stringify(catalog, null, 2)
    content = content.replace(
      /export const BLANKS = \[[\s\S]*?\n\]/m,
      `export const BLANKS = ${newBlanks}`
    )
    
    await fs.writeFile(contentPath, content, 'utf-8')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
