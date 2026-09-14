'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Magnetic } from '@/components/motion/magnetic'

type Variant = 'solid' | 'outline' | 'ghost'

const base =
  'group relative inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wide-luxe font-medium transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  solid: 'bg-gold text-background px-7 py-3.5 hover:bg-champagne',
  outline:
    'border border-border text-foreground px-7 py-3.5 hover:border-gold hover:text-gold',
  ghost: 'text-foreground px-1 py-1 hover:text-gold',
}

type CommonProps = {
  children: ReactNode
  variant?: Variant
  className?: string
  magnetic?: boolean
}

type ButtonProps = CommonProps & {
  href?: undefined
} & React.ButtonHTMLAttributes<HTMLButtonElement>

type LinkProps = CommonProps & {
  href: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export function LuxButton(props: ButtonProps | LinkProps) {
  const { children, variant = 'solid', className, magnetic = true, href, ...rest } = props

  const content = (
    <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
  )

  const classes = cn(base, variants[variant], className)

  const inner =
    href !== undefined ? (
      <Link href={href} className={classes} {...(rest as Omit<LinkProps, 'href' | keyof CommonProps>)}>
        {content}
      </Link>
    ) : (
      <button className={classes} {...(rest as Omit<ButtonProps, 'href' | keyof CommonProps>)}>
        {content}
      </button>
    )

  if (!magnetic) return inner
  return <Magnetic strength={0.25}>{inner}</Magnetic>
}

/** Text link with an animated underline that draws in from the left on hover. */
export function DrawLink({
  href,
  children,
  className,
  active = false,
}: {
  href: string
  children: ReactNode
  className?: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative inline-block text-xs uppercase tracking-wide-luxe transition-colors duration-300 hover:text-gold',
        active ? 'text-gold' : 'text-foreground/80',
        className,
      )}
    >
      {children}
      <span
        className={cn(
          'absolute -bottom-1 left-0 h-px bg-gold transition-all duration-500 ease-out',
          active ? 'w-full' : 'w-0 group-hover:w-full',
        )}
      />
    </Link>
  )
}
