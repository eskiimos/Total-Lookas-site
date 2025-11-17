import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-9xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Страница не найдена
        </h2>
        <p className="text-lg text-foreground/80 mb-8">
          Похоже, вы перешли по несуществующей ссылке или страница была удалена.
        </p>
        <Link href="/">
          <Button variant="primary">
            Вернуться на главную
          </Button>
        </Link>
      </div>
    </main>
  )
}
