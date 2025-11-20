# Инструкция по деплою на REG.RU

## Что нужно заказать на REG.RU

1. **Виртуальный хостинг Linux** с поддержкой Node.js (тариф "Старт" или выше)
   - Или **VPS/VDS** (если нужна база данных PostgreSQL)

## Вариант 1: Виртуальный хостинг (проще, но ограничения)

### Ограничения:
- Нет PostgreSQL (придется отключить функции с БД: каталог товаров, админка)
- Только базовый функционал: лендинг + форма обратной связи

### Шаги:

#### 1. Подготовка проекта (выполните на своем компьютере):

```bash
cd /Users/bahtiarmingazov/Desktop/TL-new

# Создайте production build
npm run build

# Архивируйте проект
tar -czf totallookas.tar.gz .next public package.json package-lock.json next.config.js
```

#### 2. Загрузка на REG.RU:

1. Войдите в панель управления хостингом REG.RU
2. Откройте Файловый менеджер
3. Перейдите в папку `public_html` (или `www`)
4. Загрузите файл `totallookas.tar.gz`
5. Распакуйте архив

#### 3. Настройка Node.js на REG.RU:

1. В панели управления найдите раздел **"Node.js"**
2. Создайте новое приложение:
   - Версия Node.js: **18.x или 20.x**
   - Режим запуска: **Production**
   - Точка входа: `node_modules/next/dist/bin/next`
   - Аргументы: `start`
   - Порт: автоматический

3. Установите зависимости через SSH или интерфейс:
```bash
npm install --production
```

#### 4. Настройка переменных окружения:

В панели REG.RU добавьте переменные:
```
TELEGRAM_BOT_TOKEN=7997286328:AAHajRFeNAdWTKlg9WN58oiKl0iKIoWIaR4
TELEGRAM_CHAT_ID=-1003271157475
NODE_ENV=production
```

#### 5. Настройка домена:

1. В разделе "Домены" привяжите totallookas.ru к приложению Node.js
2. Настройте SSL-сертификат (Let's Encrypt - бесплатно)

---

## Вариант 2: VDS/VPS на REG.RU (рекомендую, полный функционал)

### Преимущества:
- ✅ Полный контроль
- ✅ PostgreSQL для каталога товаров
- ✅ Все функции работают

### Что заказать:
- VDS тариф "START" или выше (от 300₽/мес)
- ОС: Ubuntu 22.04

### Шаги настройки:

#### 1. Подключитесь к серверу по SSH:

```bash
ssh root@ваш_ip_адрес
```

#### 2. Установите необходимое ПО:

```bash
# Обновите систему
apt update && apt upgrade -y

# Установите Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Установите PostgreSQL
apt install -y postgresql postgresql-contrib

# Установите Nginx
apt install -y nginx

# Установите PM2 (менеджер процессов)
npm install -g pm2
```

#### 3. Настройте PostgreSQL:

```bash
# Войдите в PostgreSQL
sudo -u postgres psql

# Создайте базу данных и пользователя
CREATE DATABASE totallookas;
CREATE USER tluser WITH PASSWORD 'ваш_пароль';
GRANT ALL PRIVILEGES ON DATABASE totallookas TO tluser;
\q
```

#### 4. Клонируйте проект:

```bash
cd /var/www
git clone https://github.com/eskiimos/Total-Lookas-site.git totallookas
cd totallookas
```

#### 5. Настройте переменные окружения:

```bash
nano .env.local
```

Добавьте:
```env
DATABASE_URL="postgresql://tluser:ваш_пароль@localhost:5432/totallookas"
TELEGRAM_BOT_TOKEN=7997286328:AAHajRFeNAdWTKlg9WN58oiKl0iKIoWIaR4
TELEGRAM_CHAT_ID=-1003271157475
NEXTAUTH_SECRET=создайте_случайную_строку_32_символа
NEXTAUTH_URL=https://totallookas.ru
NODE_ENV=production
```

#### 6. Установите зависимости и соберите проект:

```bash
npm install
npx prisma generate
npx prisma db push
npm run build
```

#### 7. Запустите приложение с PM2:

```bash
pm2 start npm --name "totallookas" -- start
pm2 save
pm2 startup
```

#### 8. Настройте Nginx:

```bash
nano /etc/nginx/sites-available/totallookas
```

Добавьте:
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте конфигурацию:
```bash
ln -s /etc/nginx/sites-available/totallookas /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 9. Настройте SSL (Let's Encrypt):

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d totallookas.ru -d www.totallookas.ru
```

#### 10. Настройте DNS:

В панели REG.RU (или Cloudflare) измените A-запись:
```
A  @  ваш_ip_vds
```

---

## Обновление сайта

### На виртуальном хостинге:
1. Соберите новую версию локально: `npm run build`
2. Загрузите `.next` через FTP
3. Перезапустите приложение в панели REG.RU

### На VDS:
```bash
cd /var/www/totallookas
git pull
npm install
npm run build
pm2 restart totallookas
```

---

## Проверка работы

```bash
# Проверьте статус приложения
pm2 status

# Просмотрите логи
pm2 logs totallookas

# Проверьте Nginx
systemctl status nginx
```

---

## Полезные команды

```bash
# Перезапуск приложения
pm2 restart totallookas

# Просмотр логов
pm2 logs

# Остановка приложения
pm2 stop totallookas

# Перезапуск Nginx
systemctl restart nginx

# Просмотр логов Nginx
tail -f /var/log/nginx/error.log
```

---

## Что выбрать?

- **Виртуальный хостинг**: если нужен только лендинг + форма обратной связи (без каталога товаров)
- **VDS/VPS**: если нужен полный функционал с каталогом товаров и админкой

**Рекомендую VDS** - больше контроля и все функции работают.
