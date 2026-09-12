import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/content'
import { SectionHeading } from '@/components/common/section-heading'
import { ContactForm } from '@/components/contact/contact-form'
import { Reveal } from '@/components/motion/reveal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach the house directly — general enquiries, orders, warranty and press.',
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>
}) {
  const { intent } = await searchParams
  const settings = await getSiteSettings()
  const isAccount = intent === 'account'

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading
          eyebrow="Contact"
          title={isAccount ? 'Your account, by way of a person.' : 'Reach the house directly.'}
          description={
            isAccount
              ? 'We keep accounts by hand, through a member of the house — no passwords to lose. Tell us what you need and we will take it from here.'
              : 'For orders, warranty, press or simply a question — write to us, or reach a boutique directly.'
          }
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="space-y-8 border-t border-border pt-8">
              <div>
                <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Email</p>
                <a href={`mailto:${settings.email}`} className="mt-2 block text-lg transition-colors hover:text-gold">
                  {settings.email}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Phone</p>
                <a href={`tel:${settings.phone}`} className="mt-2 block text-lg transition-colors hover:text-gold">
                  {settings.phone}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide-luxe text-muted-foreground">Hours</p>
                <p className="mt-2 text-base text-muted-foreground">Monday–Friday, 9:00–18:00 CET</p>
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
}
