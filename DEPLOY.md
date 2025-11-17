# Деплой Total Lookas

## Деплой на Vercel (рекомендуется)

1. Создайте аккаунт на [Vercel](https://vercel.com)
2. Установите Vercel CLI:
```bash
npm i -g vercel
```

3. Залогиньтесь:
```bash
vercel login
```

4. Задеплойте проект:
```bash
vercel
```

5. Для продакшен-деплоя:
```bash
vercel --prod
```

## Деплой на собственный сервер

### 1. Сборка проекта

```bash
npm run build
```

### 2. Запуск на сервере

```bash
npm start
```

Приложение будет доступно на порту 3000.

### 3. Использование PM2 (для production)

```bash
# Установка PM2
npm install -g pm2

# Запуск
pm2 start npm --name "total-lookas" -- start

# Автозапуск при перезагрузке сервера
pm2 startup
pm2 save
```

## Nginx конфигурация

```nginx
server {
    listen 80;
    server_name totallookas.ru www.totallookas.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Переменные окружения

Создайте файл `.env.local`:

```env
# URL сайта (для метатегов)
NEXT_PUBLIC_SITE_URL=https://totallookas.ru

# Email для формы (опционально)
CONTACT_EMAIL=info@totallookas.ru
```

## SSL сертификат (Let's Encrypt)

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d totallookas.ru -d www.totallookas.ru
```

## Оптимизация для production

1. **Image Optimization**: используйте next/image для всех картинок
2. **Caching**: настройте кэширование статики в Nginx
3. **Compression**: включите gzip в Nginx:

```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

## Мониторинг

```bash
# Логи PM2
pm2 logs total-lookas

# Статус
pm2 status

# Перезапуск
pm2 restart total-lookas
```

## Резервное копирование

Создайте cron задачу для бэкапа:

```bash
# Каждый день в 3:00
0 3 * * * tar -czf /backups/tl-$(date +\%Y\%m\%d).tar.gz /var/www/total-lookas
```

## Обновление проекта

```bash
# Получить изменения
git pull origin main

# Установить зависимости
npm install

# Пересобрать проект
npm run build

# Перезапустить PM2
pm2 restart total-lookas
```

## Troubleshooting

### Проблема: сайт не открывается

1. Проверьте, что процесс запущен: `pm2 status`
2. Проверьте логи: `pm2 logs total-lookas`
3. Проверьте Nginx: `sudo nginx -t`

### Проблема: медленная загрузка

1. Включите компрессию в next.config.js
2. Оптимизируйте изображения
3. Включите кэширование статики

### Проблема: ошибки после обновления

1. Очистите кэш Next.js: `rm -rf .next`
2. Переустановите зависимости: `rm -rf node_modules && npm install`
3. Пересоберите: `npm run build`
