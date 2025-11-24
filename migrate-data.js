// Скрипт для копирования данных из Vercel в новую базу
const { PrismaClient } = require('@prisma/client');

// Vercel база
const vercelDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.VERCEL_DATABASE_URL || "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza194NGxIbzJoNlRIb2hpQWtxUlhGTGUiLCJhcGlfa2V5IjoiMDFLQURDSkY3RFRFMjg2N05NQVpEQjZTMU0iLCJ0ZW5hbnRfaWQiOiJkM2JhOTY3NTg4OGZmNDI2YTU0OGE1YTY0ZjQ1NzcwNDdjMDM4MTEyNmY2ZjYyZTY2NzI2NzNhNjFkYTFmZTE1IiwiaW50ZXJuYWxfc2VjcmV0IjoiZDhlYmZlNmYtY2M3MC00OGZhLWJlNGMtYjE1NDViMDAyOTA2In0.4yKFSSyZS9DwWbAK-saMEAPU18cMNFI8Gfo8yUjSjX4"
    }
  }
});

// Новая база на VDS (подключаемся через SSH туннель или напрямую)
const newDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.NEW_DATABASE_URL || "postgresql://tluser:TL2024SecurePass@91.229.11.25:5432/totallookas"
    }
  }
});

async function migrateData() {
  try {
    console.log('🔄 Начинаем миграцию данных...\n');

    // 1. Копируем Media
    console.log('📁 Копируем Media...');
    const media = await vercelDb.media.findMany();
    console.log(`Найдено ${media.length} файлов`);
    
    for (const item of media) {
      await newDb.media.upsert({
        where: { id: item.id },
        update: item,
        create: item
      });
    }
    console.log('✅ Media скопированы\n');

    // 2. Копируем Products
    console.log('📦 Копируем Products...');
    const products = await vercelDb.product.findMany({
      include: {
        images: true,
        sizeChart: true
      }
    });
    console.log(`Найдено ${products.length} товаров`);

    for (const product of products) {
      const { images, sizeChart, ...productData } = product;
      
      // Создаём товар
      await newDb.product.upsert({
        where: { id: product.id },
        update: productData,
        create: productData
      });

      // Копируем изображения
      for (const image of images) {
        await newDb.productImage.upsert({
          where: { id: image.id },
          update: image,
          create: image
        });
      }

      // Копируем таблицу размеров
      if (sizeChart) {
        await newDb.sizeChart.upsert({
          where: { id: sizeChart.id },
          update: sizeChart,
          create: sizeChart
        });
      }
    }
    console.log('✅ Products скопированы\n');

    console.log('🎉 Миграция завершена успешно!');
    console.log(`\nСтатистика:`);
    console.log(`- Media: ${media.length}`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Images: ${products.reduce((sum, p) => sum + p.images.length, 0)}`);
    console.log(`- Size Charts: ${products.filter(p => p.sizeChart).length}`);

  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
  } finally {
    await vercelDb.$disconnect();
    await newDb.$disconnect();
  }
}

migrateData();
