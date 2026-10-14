import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/content'
import { SectionHeading } from '@/components/common/section-heading'
import { ContactForm } from '@/components/contact/contact-form'
import { Reveal } from '@/components/motion/reveal'
import { RequireSignIn } from '@/components/layout/auth-gate'
import { getText } from '@/lib/page-text-server'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const t = await getText()
  return { title: 'Contact', description: t('contact.meta.description') }
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>
}) {
  const { intent } = await searchParams
  const settings = await getSiteSettings()
  const t = await getText()
  const isAccount = intent === 'account'

  const page = (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title={isAccount ? t('contact.account.title') : t('contact.title')}
          description={
            isAccount
              ? t('contact.account.description')
              : t('contact.description')
          }
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="space-y-8 border-t border-border pt-8">
              <div>
                <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">{t('contact.label.email')}</p>
                <a href={`mailto:${settings.email}`} className="mt-2 block text-lg transition-colors hover:text-gold">
                  {settings.email}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">{t('contact.label.phone')}</p>
                <a href={`tel:${settings.phone}`} className="mt-2 block text-lg transition-colors hover:text-gold">
                  {settings.phone}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">{t('contact.label.hours')}</p>
                <p className="mt-2 text-base text-muted-foreground">{settings.contactHours}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm defaultTopic={isAccount ? 'My account' : 'General enquiry'} />
          </Reveal>
        </div>
      </div>
    </div>
  )

  // Placing an order needs a signed-in customer; everything else on this page is public.
  if (intent === 'order') {
    return <RequireSignIn redirectTo="/contact?intent=order">{page}</RequireSignIn>
  }
  return page
}
