import { cn } from '@/lib/utils'
import { Reveal } from '@/components/motion/reveal'

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 text-xs uppercase tracking-luxe text-gold',
        className,
      )}
    >
      <span className="h-px w-8 bg-gold/60" aria-hidden="true" />
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <Eyebrow className={align === 'center' ? 'justify-center' : ''}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="mt-5 font-serif text-4xl leading-[1.05] text-balance md:text-5xl lg:text-6xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
