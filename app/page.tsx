import { Header } from '@/components/Header'
import { Hero } from '@/components/sections/Hero'
import { Problems } from '@/components/sections/Problems'
import { HowWeWork } from '@/components/sections/HowWeWork'
import { Services } from '@/components/sections/Services'
import { Blanks } from '@/components/sections/Blanks'
import { Cases } from '@/components/sections/Cases'
import { WhyUs } from '@/components/sections/WhyUs'
import { Trust } from '@/components/sections/Trust'
import { FAQSection } from '@/components/sections/FAQ'
import { CTASection } from '@/components/sections/CTA'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Problems />
      <HowWeWork />
      <Services />
      <Blanks />
      <Cases />
      <WhyUs />
      <CTASection />
      <Trust />
      <FAQSection />
      <Footer />
    </main>
  )
}
