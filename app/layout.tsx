import type { Metadata } from 'next'
import { Golos_Text } from 'next/font/google'
import './globals.css'

const golos = Golos_Text({ 
  subsets: ['cyrillic', 'latin'],
  variable: '--font-golos',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Total Lookas — корпоративный мерч под ключ по России',
  description: 'B2B-мерч от 7 дней: дизайн, производство, доставка. Welcome-наборы, одежда с брендингом, подарки для клиентов. Работаем по всей России.',
  openGraph: {
    title: 'Total Lookas — мерч для бизнеса',
    description: 'B2B-мерч от 7 дней. Welcome-наборы, одежда, подарки.',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={golos.variable}>
      <body>{children}</body>
    </html>
  )
}
