import { cn } from '@/lib/utils'
import { siteSettings } from '@/lib/content'

/** Wordmark: a minimal watch-crown emblem beside the [BRAND NAME] wordmark. */
export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="size-6 text-gold" />
      {showText && (
        <span className="font-serif text-lg tracking-wide-luxe uppercase">
          {siteSettings.brandName}
        </span>
      )}
    </span>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="20" cy="21" r="13.5" strokeWidth="1.25" />
      <path d="M20 4.5v4M17 4.5h6" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M20 21V13.5M20 21l5 3" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="20" cy="21" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}
