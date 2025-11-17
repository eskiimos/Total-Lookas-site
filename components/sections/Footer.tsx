import React from 'react'
import { FOOTER } from '@/app/content'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#282828] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Total Lookas</h3>
            <p className="text-foreground/80 mb-2">{FOOTER.tagline}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Контакты</h4>
            <div className="space-y-2 text-foreground/80">
              <p>{FOOTER.phone}</p>
              <p>{FOOTER.email}</p>
              <p>{FOOTER.address}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Реквизиты</h4>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>{FOOTER.company}</p>
              <p>{FOOTER.inn}</p>
              <p>{FOOTER.ogrn}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-foreground/60">
          <p>© 2025 Total Lookas. Все права защищены.</p>
          <a href="/privacy" className="hover:text-accent transition-colors">
            {FOOTER.privacyLink}
          </a>
        </div>
      </div>
    </footer>
  )
}
