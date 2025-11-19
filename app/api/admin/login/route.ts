import { NextResponse } from 'next/server'
import { createToken } from '@/lib/auth'
import { cookies } from 'next/headers'

// Простой пароль - измените в .env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      )
    }

    const token = await createToken('admin')
    const cookieStore = await cookies()
    
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
