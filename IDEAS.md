# 💡 Советы по развитию сайта Total Lookas

## 🎯 Быстрые победы (можно сделать сразу)

### 1. Добавить изображения
```bash
public/
  images/
    hero-bg.jpg          # Фон для hero-секции
    logo.png            # Логотип компании
    blanks/             # Фото готовых изделий
      tshirt.jpg
      hoodie.jpg
      polo.jpg
      apron.jpg
      totebag.jpg
      pyjama.jpg
    cases/              # Фото кейсов
      case-1.jpg
      case-2.jpg
      case-3.jpg
```

### 2. Добавить favicon и иконки
```
public/
  favicon.ico
  apple-touch-icon.png
  icon-192.png
  icon-512.png
```

Генератор: [favicon.io](https://favicon.io/)

### 3. Настроить уведомления в Telegram
1. Создайте бота через @BotFather
2. Раскомментируйте код в `app/api/contact/route.ts`
3. Добавьте переменные в `.env.local`

## 🚀 Средний приоритет (первые 2 недели)

### 1. Страница "О компании"
```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <Section>
        <h1>О Total Lookas</h1>
        <p>История компании...</p>
        <p>Наша команда...</p>
        <p>Производственные мощности...</p>
      </Section>
    </main>
  )
}
```

### 2. Галерея работ / Портфолио
```tsx
// app/portfolio/page.tsx
import Image from 'next/image'

const projects = [
  { id: 1, title: 'Проект 1', image: '/images/portfolio/1.jpg' },
  // ...
]

export default function PortfolioPage() {
  return (
    <Section>
      <h1>Наши работы</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id}>
            <Image src={project.image} alt={project.title} />
            <h3>{project.title}</h3>
          </Card>
        ))}
      </div>
    </Section>
  )
}
```

### 3. Калькулятор стоимости
```tsx
// components/Calculator.tsx
'use client'
import { useState } from 'react'

export function Calculator() {
  const [quantity, setQuantity] = useState(50)
  const [product, setProduct] = useState('tshirt')
  
  const prices = {
    tshirt: 500,
    hoodie: 1200,
    polo: 700,
  }
  
  const total = quantity * prices[product]
  
  return (
    <Card>
      <h3>Рассчитать стоимость</h3>
      <select onChange={(e) => setProduct(e.target.value)}>
        <option value="tshirt">Футболка</option>
        <option value="hoodie">Худи</option>
        <option value="polo">Поло</option>
      </select>
      <input 
        type="number" 
        value={quantity} 
        onChange={(e) => setQuantity(+e.target.value)}
      />
      <p>Итого: {total.toLocaleString('ru-RU')} ₽</p>
    </Card>
  )
}
```

### 4. Отзывы клиентов
```tsx
// components/sections/Reviews.tsx
const reviews = [
  {
    author: 'Мария Петрова',
    company: 'Digital Agency',
    text: 'Отличное качество, быстрая доставка!',
    rating: 5,
  },
]

export function Reviews() {
  return (
    <Section>
      <h2>Отзывы клиентов</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, i) => (
          <Card key={i}>
            <div className="flex mb-2">
              {[...Array(review.rating)].map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
            <p>{review.text}</p>
            <p className="font-semibold mt-4">{review.author}</p>
            <p className="text-sm text-foreground/60">{review.company}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
```

## 🎨 Улучшения дизайна

### 1. Анимации
```bash
npm install framer-motion
```

```tsx
// components/ui/FadeIn.tsx
'use client'
import { motion } from 'framer-motion'

export function FadeIn({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
```

### 2. Градиенты и эффекты
```css
/* app/globals.css */
.gradient-accent {
  background: linear-gradient(135deg, #2928F1 0%, #5d5cff 100%);
}

.glow-accent {
  box-shadow: 0 0 20px rgba(41, 40, 241, 0.5);
}
```

### 3. Темная/светлая тема
```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <ThemeProvider attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## 📊 Маркетинг и конверсия

### 1. A/B тестирование заголовков
```tsx
// components/sections/Hero.tsx
const h1Variants = [
  'Корпоративный мерч для бизнеса',
  'B2B-мерч под ключ за 7 дней',
  'Мерч для команд и клиентов',
]

// Выбирать случайный при загрузке
const [h1] = useState(() => 
  h1Variants[Math.floor(Math.random() * h1Variants.length)]
)
```

### 2. Всплывающие окна (осторожно!)
```tsx
// components/ExitIntentPopup.tsx
'use client'
import { useState, useEffect } from 'react'

export function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY < 50) setShow(true)
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])
  
  if (!show) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-md">
        <h3>Подождите!</h3>
        <p>Оставьте контакт — пришлём спецпредложение</p>
        <Button onClick={() => setShow(false)}>Получить</Button>
      </Card>
    </div>
  )
}
```

### 3. Чат-виджет
```tsx
// Интеграция Jivo, Bitrix24, или Telegram
// Добавить в app/layout.tsx перед </body>
<Script id="jivosite">
  {`(function(){ var widget_id = 'YOUR_ID'; /* ... */ })()`}
</Script>
```

## 🔧 Технические улучшения

### 1. База данных для заявок
```bash
npm install prisma @prisma/client
```

```prisma
// prisma/schema.prisma
model Lead {
  id        Int      @id @default(autoincrement())
  name      String
  contact   String
  comment   String?
  createdAt DateTime @default(now())
}
```

### 2. API для получения списка заявок
```tsx
// app/api/leads/route.ts
import { prisma } from '@/lib/prisma'

export async function GET() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return Response.json(leads)
}
```

### 3. Админ-панель для заявок
```tsx
// app/admin/leads/page.tsx
export default async function AdminLeads() {
  const leads = await fetch('/api/leads').then(r => r.json())
  
  return (
    <Section>
      <h1>Заявки</h1>
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Имя</th>
            <th>Контакт</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td>{new Date(lead.createdAt).toLocaleString('ru')}</td>
              <td>{lead.name}</td>
              <td>{lead.contact}</td>
              <td>{lead.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}
```

## 📱 Мобильное приложение

### PWA (Progressive Web App)
```tsx
// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Total Lookas',
    short_name: 'TL',
    description: 'Корпоративный мерч под ключ',
    start_url: '/',
    display: 'standalone',
    background_color: '#303030',
    theme_color: '#2928F1',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

## 🎓 Контент-маркетинг

### 1. Блог
```tsx
// app/blog/page.tsx
const posts = [
  {
    slug: 'kak-vybrat-merch',
    title: 'Как выбрать мерч для команды',
    date: '2025-11-01',
    excerpt: 'Практические советы...',
  },
]

export default function BlogPage() {
  return (
    <Section>
      <h1>Блог</h1>
      {posts.map(post => (
        <Card key={post.slug}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <Link href={`/blog/${post.slug}`}>Читать →</Link>
        </Card>
      ))}
    </Section>
  )
}
```

### 2. Идеи для статей
- "Топ-5 ошибок при заказе корпоративного мерча"
- "Как welcome-набор повышает лояльность сотрудников"
- "Тренды корпоративной одежды 2025"
- "Гайд по выбору тканей для брендированных футболок"

## 📈 Масштабирование

### 1. Интеграция с CRM
```tsx
// app/api/contact/route.ts
// Отправка в Bitrix24, amoCRM, Salesforce
await fetch('https://your-crm.com/api/leads', {
  method: 'POST',
  body: JSON.stringify(formData),
})
```

### 2. Email-маркетинг
```tsx
// Интеграция с Mailchimp, SendGrid, Unisender
import { mailchimp } from '@/lib/mailchimp'

await mailchimp.lists.addListMember('list_id', {
  email_address: formData.contact,
  status: 'subscribed',
})
```

### 3. Автоматизация
- Автоответ на email
- Напоминание через 3 дня если не ответили
- Рассылка новостей и акций
- Опросы удовлетворённости

## 🎁 Бонусы для конверсии

1. **Бесплатная доставка** при заказе от X рублей
2. **Скидка 10%** для новых клиентов
3. **Программа лояльности** — кэшбэк за повторные заказы
4. **Реферальная программа** — приведи друга
5. **Сезонные акции** — например, к Новому году

---

**Главное — не делать всё сразу. Выберите 2-3 направления и реализуйте качественно! 🚀**
