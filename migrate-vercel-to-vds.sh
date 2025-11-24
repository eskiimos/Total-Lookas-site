#!/bin/bash
# Скрипт для копирования данных из Vercel на VDS

echo "🔄 Копируем данные из Vercel на VDS..."
echo ""

# Экспортируем данные из Vercel
echo "📥 Экспортируем данные из Vercel..."
psql "postgres://d3ba9675888ff426a548a5a64f4577047c0381126f6f62e6672673a61da1fe15:sk_x4lHo2h6THohiAkqRXFLe@db.prisma.io:5432/postgres?sslmode=require" \
  -c "COPY (SELECT * FROM \"Media\") TO STDOUT WITH CSV HEADER" > /tmp/media.csv

psql "postgres://d3ba9675888ff426a548a5a64f4577047c0381126f6f62e6672673a61da1fe15:sk_x4lHo2h6THohiAkqRXFLe@db.prisma.io:5432/postgres?sslmode=require" \
  -c "COPY (SELECT * FROM \"Product\") TO STDOUT WITH CSV HEADER" > /tmp/products.csv

psql "postgres://d3ba9675888ff426a548a5a64f4577047c0381126f6f62e6672673a61da1fe15:sk_x4lHo2h6THohiAkqRXFLe@db.prisma.io:5432/postgres?sslmode=require" \
  -c "COPY (SELECT * FROM \"ProductImage\") TO STDOUT WITH CSV HEADER" > /tmp/product_images.csv

psql "postgres://d3ba9675888ff426a548a5a64f4577047c0381126f6f62e6672673a61da1fe15:sk_x4lHo2h6THohiAkqRXFLe@db.prisma.io:5432/postgres?sslmode=require" \
  -c "COPY (SELECT * FROM \"SizeChart\") TO STDOUT WITH CSV HEADER" > /tmp/size_charts.csv

echo "✅ Данные экспортированы"
echo ""

# Копируем файлы на сервер
echo "📤 Копируем файлы на VDS..."
scp /tmp/media.csv /tmp/products.csv /tmp/product_images.csv /tmp/size_charts.csv root@91.229.11.25:/tmp/

echo "✅ Файлы скопированы"
echo ""

# Импортируем на VDS
echo "📥 Импортируем данные на VDS..."
ssh root@91.229.11.25 "
  sudo -u postgres psql -d totallookas <<EOF
\copy \"Media\" FROM '/tmp/media.csv' WITH CSV HEADER;
\copy \"Product\" FROM '/tmp/products.csv' WITH CSV HEADER;
\copy \"ProductImage\" FROM '/tmp/product_images.csv' WITH CSV HEADER;
\copy \"SizeChart\" FROM '/tmp/size_charts.csv' WITH CSV HEADER;
EOF
"

echo ""
echo "✅ Миграция завершена!"
echo ""
echo "Проверьте данные:"
echo "ssh root@91.229.11.25"
echo "sudo -u postgres psql -d totallookas -c 'SELECT COUNT(*) FROM \"Product\";'"
