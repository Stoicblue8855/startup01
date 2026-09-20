import Link from 'next/link'
import { siteSettings } from '@/lib/content'
import { Logo } from '@/components/brand/logo'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-6 font-serif text-2xl leading-snug text-balance">
              {siteSettings.tagline}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {siteSettings.footer.map((col) => (
              <div key={col.heading}>
                <h3 className="text-xs uppercase tracking-wide-luxe text-gold">{col.heading}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-8">
          {siteSettings.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-wide-luxe text-muted-foreground transition-colors hover:text-gold"
            >
              {s.label}
            </a>
          ))}
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteSettings.brandName}. Manufacture Horlogère. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
