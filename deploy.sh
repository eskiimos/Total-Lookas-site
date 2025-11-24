#!/bin/bash
# Скрипт быстрого деплоя на production

set -e

echo "🚀 Начинаем деплой на production..."
echo ""

# 1. Проверяем, что все изменения закоммичены
if [[ -n $(git status -s) ]]; then
    echo "⚠️  У вас есть незакоммиченные изменения!"
    echo ""
    git status -s
    echo ""
    read -p "Закоммитить их сейчас? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Введите описание коммита: " commit_msg
        git add .
        git commit -m "$commit_msg"
    else
        echo "❌ Отменяем деплой. Сначала закоммитьте изменения."
        exit 1
    fi
fi

# 2. Пушим в GitHub
echo "📤 Отправляем изменения в GitHub..."
git push origin main
echo "✅ Код отправлен в GitHub"
echo ""

# 3. Обновляем на сервере
echo "📥 Обновляем код на сервере..."
ssh root@91.229.11.25 << 'ENDSSH'
    set -e
    cd /var/www/totallookas
    
    echo "📥 Git pull..."
    git pull origin main
    
    echo "📦 Устанавливаем зависимости..."
    npm install
    
    echo "🔨 Собираем проект..."
    npm run build
    
    echo "🔄 Перезапускаем PM2..."
    pm2 restart totallookas
    
    echo ""
    echo "✅ Деплой завершён!"
    echo ""
    pm2 status
ENDSSH

echo ""
echo "🎉 Сайт обновлён: https://totallookas.ru"
echo ""
