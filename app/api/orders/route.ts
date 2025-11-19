import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, quantity, name, phone } = body

    // Валидация
    if (!productName || !quantity || !name || !phone) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      )
    }

    // Проверка телефона (базовая валидация российского номера)
    const phoneRegex = /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Некорректный формат телефона' },
        { status: 400 }
      )
    }

    // Формирование сообщения для Telegram
    const message = `
🛒 <b>Новый заказ!</b>

📦 <b>Товар:</b> ${productName}
📊 <b>Количество:</b> ${quantity} шт
👤 <b>Имя:</b> ${name}
📱 <b>Телефон:</b> ${phone}

⏰ <b>Дата:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
    `.trim()

    // Отправка в Telegram
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!telegramToken || !chatId) {
      console.error('Telegram credentials not configured')
      return NextResponse.json(
        { error: 'Сервис временно недоступен' },
        { status: 500 }
      )
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json()
      console.error('Telegram API error:', errorData)
      return NextResponse.json(
        { error: 'Ошибка отправки сообщения' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Заказ успешно отправлен',
    })
  } catch (error) {
    console.error('Order submission error:', error)
    return NextResponse.json(
      { error: 'Произошла ошибка при обработке заказа' },
      { status: 500 }
    )
  }
}
