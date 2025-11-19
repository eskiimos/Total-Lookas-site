/**
 * Скрипт для получения Chat ID
 * 
 * Использование:
 * 1. Вставьте ваш токен от BotFather ниже
 * 2. Запустите: node get-chat-id.js
 * 3. Отправьте любое сообщение боту в Telegram
 * 4. Скрипт покажет ваш Chat ID
 */

const TELEGRAM_BOT_TOKEN = 'ВСТАВЬТЕ_ВАШ_ТОКЕН_СЮДА'

async function getChatId() {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`
    )
    
    const data = await response.json()
    
    if (!data.ok) {
      console.error('❌ Ошибка:', data.description)
      return
    }
    
    if (data.result.length === 0) {
      console.log('📭 Нет сообщений')
      console.log('💡 Отправьте боту любое сообщение в Telegram и запустите скрипт снова')
      return
    }
    
    console.log('✅ Найдены чаты:\n')
    
    const uniqueChats = new Map()
    
    data.result.forEach(update => {
      if (update.message?.chat) {
        const chat = update.message.chat
        uniqueChats.set(chat.id, {
          id: chat.id,
          type: chat.type,
          title: chat.title || `${chat.first_name || ''} ${chat.last_name || ''}`.trim(),
          username: chat.username
        })
      }
    })
    
    uniqueChats.forEach(chat => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`📱 Тип: ${chat.type}`)
      console.log(`👤 Название: ${chat.title}`)
      if (chat.username) console.log(`🔗 Username: @${chat.username}`)
      console.log(`🆔 Chat ID: ${chat.id}`)
      console.log('')
      console.log('📋 Добавьте в .env.local:')
      console.log(`TELEGRAM_CHAT_ID="${chat.id}"`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  }
}

getChatId()
