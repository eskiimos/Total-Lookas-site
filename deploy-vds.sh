#!/bin/bash

# Скрипт автоматической настройки VDS для Total Lookas
# Запустите на сервере: bash deploy-vds.sh

set -e

echo "🚀 Начинаем настройку сервера для Total Lookas..."

# Обновление системы
echo "📦 Обновление системы..."
apt update && apt upgrade -y

# Установка Node.js 20.x
echo "📦 Установка Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Установка PostgreSQL
echo "🗄️  Установка PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Установка Nginx
echo "🌐 Установка Nginx..."
apt install -y nginx

# Установка PM2
echo "⚙️  Установка PM2..."
npm install -g pm2

# Установка Git
echo "📦 Установка Git..."
apt install -y git

# Настройка PostgreSQL
echo "🗄️  Настройка базы данных..."
sudo -u postgres psql -c "CREATE DATABASE totallookas;" || echo "База уже существует"
sudo -u postgres psql -c "CREATE USER tluser WITH PASSWORD 'TL2024SecurePass';" || echo "Пользователь уже существует"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE totallookas TO tluser;"
sudo -u postgres psql -c "ALTER DATABASE totallookas OWNER TO tluser;"

# Клонирование проекта
echo "📥 Клонирование проекта..."
cd /var/www
if [ -d "totallookas" ]; then
    echo "Папка уже существует, обновляем..."
    cd totallookas
    git pull
else
    git clone https://github.com/eskiimos/Total-Lookas-site.git totallookas
    cd totallookas
fi

# Создание .env.local
echo "⚙️  Создание конфигурации..."
cat > .env.local << 'EOL'
DATABASE_URL="postgresql://tluser:TL2024SecurePass@localhost:5432/totallookas"
POSTGRES_PRISMA_URL="postgresql://tluser:TL2024SecurePass@localhost:5432/totallookas"
TELEGRAM_BOT_TOKEN=7997286328:AAHajRFeNAdWTKlg9WN58oiKl0iKIoWIaR4
TELEGRAM_CHAT_ID=-1003271157475
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://totallookas.ru
NODE_ENV=production
EOL

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

# Настройка Prisma
echo "🗄️  Настройка Prisma..."
npx prisma generate
npx prisma db push

# Сборка проекта
echo "🔨 Сборка проекта..."
npm run build

# Остановка старого процесса если есть
pm2 delete totallookas 2>/dev/null || true

# Запуск приложения
echo "🚀 Запуск приложения..."
pm2 start npm --name "totallookas" -- start
pm2 save
pm2 startup | tail -n 1 | bash

# Настройка Nginx
echo "🌐 Настройка Nginx..."
cat > /etc/nginx/sites-available/totallookas << 'EOL'
server {
    listen 80;
    server_name totallookas.ru www.totallookas.ru;

    client_max_body_size 10M;

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
EOL

# Активация конфигурации Nginx
ln -sf /etc/nginx/sites-available/totallookas /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# Установка Certbot для SSL
echo "🔒 Установка Certbot для SSL..."
apt install -y certbot python3-certbot-nginx

echo ""
echo "✅ Базовая настройка завершена!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Настройте DNS A-запись в REG.RU: totallookas.ru -> $(curl -s ifconfig.me)"
echo "2. Подождите 5-10 минут для распространения DNS"
echo "3. Установите SSL сертификат: certbot --nginx -d totallookas.ru -d www.totallookas.ru"
echo ""
echo "🌐 Сайт будет доступен на: http://totallookas.ru"
echo "📊 Управление приложением: pm2 status"
echo "📋 Логи приложения: pm2 logs totallookas"
echo ""
