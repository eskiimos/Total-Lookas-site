# 🚀 Total Lookas — Быстрый старт

## ✅ Что уже готово

- ✨ Полностью работающий сайт на Next.js 15
- 🎨 Дизайн-система с фирменными цветами и шрифтом Golos Text
- 📱 Адаптивная верстка для всех устройств
- 🔍 SEO оптимизация и метатеги
- 📝 Форма обратной связи с API
- 🎯 9 секций лендинга с готовым контентом
- 🔒 Страница политики конфиденциальности

## 🏃 Быстрый запуск

```bash
# 1. Установите зависимости (уже сделано)
npm install

# 2. Запустите dev-сервер (уже запущен)
npm run dev

# 3. Откройте в браузере
# http://localhost:3000
```

## 📂 Структура проекта

```
TL-new/
├── app/
│   ├── page.tsx              # Главная страница
│   ├── layout.tsx            # Layout с метаданными
│   ├── content.ts            # ВСЕ ТЕКСТЫ ЗДЕСЬ 👈
│   ├── globals.css           # Глобальные стили
│   ├── privacy/page.tsx      # Политика конфиденциальности
│   └── api/contact/route.ts  # API для формы
├── components/
│   ├── ui/                   # Базовые компоненты
│   └── sections/             # Секции лендинга
└── public/                   # Статические файлы (картинки)
```

## ✏️ Как изменить контент

### 1. Тексты и контент
Откройте `app/content.ts` — там весь контент сайта:

```typescript
export const CONFIG = {
  lead_time_min_days: 7,    // Минимальный срок
  moq: 30,                  // Минимальный тираж
  max_qty: 10000,           // Максимальный тираж
}

export const HERO = {
  h1: [...],                // Заголовки
  subheadline: [...],       // Подзаголовки
  primaryCTA: [...],        // Тексты кнопок
  // и т.д.
}
```

### 2. Цвета и стили
Откройте `tailwind.config.ts`:

```typescript
colors: {
  background: '#303030',    // Фон
  foreground: '#f8f8f8',    // Текст
  accent: '#2928F1',        // Акцент
}
```

### 3. Метаданные (SEO)
Откройте `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Ваш заголовок',
  description: 'Ваше описание',
}
```

## 🎨 Кастомизация дизайна

### Изменить шрифт
В `app/layout.tsx` замените `Golos_Text` на другой шрифт из Google Fonts.

### Добавить картинки
1. Положите картинки в папку `public/images/`
2. Используйте компонент Next Image:

```tsx
import Image from 'next/image'

<Image 
  src="/images/logo.png" 
  alt="Logo" 
  width={200} 
  height={100} 
/>
```

## 📨 Настройка формы обратной связи

### Telegram уведомления

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите token
3. Узнайте свой chat_id (отправьте боту `/start`, затем откройте `https://api.telegram.org/bot<TOKEN>/getUpdates`)
4. Создайте `.env.local`:

```env
TELEGRAM_BOT_TOKEN=ваш_токен
TELEGRAM_CHAT_ID=ваш_chat_id
```

5. Раскомментируйте код Telegram в `app/api/contact/route.ts`

### Email уведомления
Добавьте сервис отправки email (например, SendGrid, Mailgun) в `app/api/contact/route.ts`

## 🚀 Деплой на Vercel

```bash
# Установите Vercel CLI
npm i -g vercel

# Залогиньтесь
vercel login

# Задеплойте
vercel

# Production деплой
vercel --prod
```

Vercel автоматически:
- Соберёт проект
- Настроит домен
- Выдаст SSL сертификат
- Настроит CDN

## 📊 Добавить аналитику

### Google Analytics

1. Получите GA ID на [analytics.google.com](https://analytics.google.com)
2. Добавьте в `.env.local`:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

3. Создайте `app/components/Analytics.tsx`:

```tsx
'use client'
import Script from 'next/script'

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  if (!gaId) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
```

4. Добавьте в `app/layout.tsx`:
```tsx
import { Analytics } from './components/Analytics'

// В body добавьте:
<Analytics />
```

## 🔧 Полезные команды

```bash
# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии локально
npm run start

# Проверка кода
npm run lint

# Форматирование кода (если установлен prettier)
npm run format
```

## 📱 Адаптивность

Сайт адаптирован для:
- 📱 Mobile: < 768px
- 📲 Tablet: 768px - 1024px
- 💻 Desktop: > 1024px

Все секции автоматически подстраиваются.

## 🐛 Troubleshooting

### Сайт не открывается
```bash
# Убедитесь, что порт 3000 свободен
lsof -ti:3000 | xargs kill -9

# Перезапустите
npm run dev
```

### Ошибки при сборке
```bash
# Очистите кэш и пересоберите
rm -rf .next node_modules
npm install
npm run build
```

### CSS не применяется
Перезапустите dev-сервер — Tailwind перекомпилирует стили.

## 📞 Контакты в коде

Все контакты находятся в `app/content.ts`:

```typescript
export const FOOTER = {
  company: 'ИП Ярмухаметов Д.Р.',
  phone: '+7 (843) 123-45-67',
  email: 'info@totallookas.ru',
  // ...
}
```

## ✨ Дополнительные улучшения

### Добавить блог
Создайте `app/blog/page.tsx` и используйте MDX для статей.

### Добавить галерею работ
Создайте `app/portfolio/page.tsx` с grid-сеткой изображений.

### Добавить калькулятор стоимости
Создайте интерактивную форму для расчёта заказа.

## 📚 Документация

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

## 🎯 Что дальше?

1. ✅ Замените контакты на реальные
2. ✅ Добавьте реальные изображения в `public/`
3. ✅ Настройте форму обратной связи (Telegram/Email)
4. ✅ Подключите домен
5. ✅ Задеплойте на Vercel
6. ✅ Добавьте Google Analytics
7. ✅ Протестируйте на разных устройствах

---

**Сайт готов к работе! 🎉**

Dev-сервер запущен на http://localhost:3000
