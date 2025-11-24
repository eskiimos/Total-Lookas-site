#!/bin/bash
# Скрипт для скачивания всех картинок из Vercel Blob на VDS

echo "🖼️  Скачиваем картинки из Vercel Blob на VDS..."
echo ""

# Получаем список всех URL картинок
ssh root@91.229.11.25 "
  mkdir -p /var/www/totallookas/public/uploads
  
  # Получаем все URL из базы
  sudo -u postgres psql -d totallookas -t -c 'SELECT url FROM \"Media\";' | while read url; do
    if [ ! -z \"\$url\" ]; then
      # Убираем пробелы
      url=\$(echo \$url | xargs)
      
      # Извлекаем имя файла
      filename=\$(basename \$url)
      
      echo \"⬇️  Скачиваю: \$filename\"
      
      # Скачиваем картинку
      wget -q -O /var/www/totallookas/public/uploads/\$filename \$url
      
      if [ \$? -eq 0 ]; then
        echo \"✅ \$filename\"
        
        # Обновляем URL в базе данных
        new_url=\"/uploads/\$filename\"
        sudo -u postgres psql -d totallookas -c \"UPDATE \\\"Media\\\" SET url = '\$new_url' WHERE url = '\$url';\" > /dev/null
      else
        echo \"❌ Ошибка загрузки \$filename\"
      fi
    fi
  done
  
  echo \"\"
  echo \"✅ Все картинки скачаны!\"
  echo \"\"
  echo \"Проверка:\"
  ls -lh /var/www/totallookas/public/uploads/ | wc -l
  echo \" файлов в /var/www/totallookas/public/uploads/\"
"
