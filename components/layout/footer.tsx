import Link from 'next/link'
import { siteSettings } from '@/lib/content'
import { Logo } from '@/components/brand/logo'
import { NewsletterForm } from './newsletter'

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
            <p className="mt-8 text-xs uppercase tracking-wide-luxe text-muted-foreground">
              The Correspondence
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Private previews, new releases and stories from the atelier.
            </p>
            <NewsletterForm className="mt-4" compact />
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

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
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
          <div className="flex items-center gap-4">
            <label className="sr-only" htmlFor="footer-language">
              Language
            </label>
            <select
              id="footer-language"
              defaultValue={siteSettings.languages[0]}
              className="cursor-pointer border border-border bg-transparent px-3 py-2 text-xs uppercase tracking-wide-luxe text-muted-foreground transition-colors hover:border-gold hover:text-foreground focus:outline-none"
            >
              {siteSettings.languages.map((l) => (
                <option key={l} className="bg-card text-foreground">
                  {l}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="footer-currency">
              Currency
            </label>
            <select
              id="footer-currency"
              defaultValue={siteSettings.currencies[0]}
              className="cursor-pointer border border-border bg-transparent px-3 py-2 text-xs uppercase tracking-wide-luxe text-muted-foreground transition-colors hover:border-gold hover:text-foreground focus:outline-none"
            >
              {siteSettings.currencies.map((c) => (
                <option key={c} className="bg-card text-foreground">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteSettings.brandName}. Manufacture Horlogère. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
