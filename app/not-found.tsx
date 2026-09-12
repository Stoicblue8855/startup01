import Link from 'next/link'
import { LuxButton } from '@/components/brand/lux-button'
import { Reveal } from '@/components/motion/reveal'

export default function NotFound() {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-5 pt-20 text-center">
      <Reveal>
        <p className="font-serif text-[clamp(5rem,18vw,11rem)] leading-none text-gold">404</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="mt-4 font-serif text-3xl text-balance md:text-4xl">This moment has passed.</h1>
      </Reveal>
      <Reveal delay={0.15}>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
          The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved on — much like time itself.
        </p>
      </Reveal>
      <Reveal delay={0.25} className="mt-10 flex flex-wrap justify-center gap-4">
        <LuxButton href="/">Return home</LuxButton>
        <LuxButton href="/shop" variant="outline">
          View the collection
        </LuxButton>
      </Reveal>
      <Reveal delay={0.3}>
        <Link
          href="/contact"
          className="mt-8 inline-block text-xs uppercase tracking-wide-luxe text-muted-foreground transition-colors hover:text-gold"
        >
          Or get in touch
        </Link>
      </Reveal>
    </div>
  )
}
