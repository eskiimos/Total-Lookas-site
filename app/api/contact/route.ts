// API routes для обработки форм
// Вызывается из компонента CTA

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, contact, comment } = body

    // Валидация
    if (!name || !contact) {
      return NextResponse.json(
        { error: 'Имя и контакт обязательны' },
        { status: 400 }
      )
    }

    console.log('Новая заявка:', { name, contact, comment, date: new Date() })

    // Отправка в Telegram
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID
    
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const message = `
🆕 <b>Новая заявка с сайта</b>

👤 <b>Имя:</b> ${name}
📱 <b>Контакт:</b> ${contact}
💬 <b>Комментарий:</b> ${comment || 'Не указан'}
📅 <b>Дата:</b> ${new Date().toLocaleString('ru-RU')}
      `.trim()

      try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
          })
        })
      } catch (telegramError) {
        console.error('Ошибка отправки в Telegram:', telegramError)
      }
    }

    return NextResponse.json(
      { success: true, message: 'Заявка получена' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Ошибка обработки заявки:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
