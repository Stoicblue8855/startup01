import type {
  Boutique,
  HeroSection,
  JournalPost,
  Milestone,
  PressMention,
  SiteSettings,
  Testimonial,
} from './types'
import { getSupabaseClient } from './supabase'

/**
 * Non-product editorial content. Same pattern as `lib/products.ts`: typed
 * constants below, async getters at the bottom, each annotated with the
 * Supabase query that will replace it.
 */

export const siteSettings: SiteSettings = {
  brandName: 'SamayChakkra',
  tagline: 'Time, made to be inherited.',
  email: 'concierge@brandname.com',
  phone: '+1 (212) 555-0180',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
  ],
  currencies: ['USD', 'EUR', 'GBP', 'CHF', 'JPY'],
  languages: ['English', 'Français', 'Deutsch', '日本語'],
  footer: [
    {
      heading: 'Shop',
      links: [
        { label: 'All Watches', href: '/shop' },
        { label: 'Héritage', href: '/shop?collection=heritage' },
        { label: 'Meridian', href: '/shop?collection=meridian' },
        { label: 'Noir', href: '/shop?collection=noir' },
        { label: 'Atelier', href: '/shop?collection=atelier' },
      ],
    },
    {
      heading: 'About',
      links: [
        { label: 'Heritage', href: '/about' },
        { label: 'The Journal', href: '/journal' },
        { label: 'Sustainability', href: '/sustainability' },
        { label: 'Careers', href: '/careers' },
      ],
    },
    {
      heading: 'Support',
      links: [
        { label: 'Boutiques', href: '/locations' },
        { label: 'Contact', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Warranty & Service', href: '/faq#warranty' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Terms of Sale', href: '/faq#terms' },
        { label: 'Privacy', href: '/faq#privacy' },
        { label: 'Accessibility', href: '/faq#accessibility' },
      ],
    },
  ],
}

export const heroSection: HeroSection = {
  id: 'hero-home',
  eyebrow: 'Manufacture since 1874',
  headline: 'The measure of a lifetime.',
  subheadline:
    'For a century and a half, SamayChakkra has built watches meant to outlast their owners. Precision without compromise. Beauty without noise.',
  ctaLabel: 'Explore the collection',
  ctaHref: '/shop',
  secondaryCtaLabel: 'Watch the film',
  secondaryCtaHref: '#brand-film',
  video: '', // SUPABASE: cinematic MP4 URL from Supabase Storage; falls back to poster below
  poster: '/images/hero-watch-float.png',
  posterAlt: 'Luxury gold and steel automatic wristwatch on a deep charcoal background',
}

export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    quote:
      'There are watches you buy, and watches you are entrusted with. The Celestial belongs to the second kind.',
    author: 'Jonathan Vaerts',
    role: 'Collector, Geneva',
    kind: 'testimonial',
  },
  {
    id: 't-2',
    quote:
      'Nothing shouts. Every detail whispers, and every whisper is deliberate. This is restraint as a discipline.',
    author: 'Amara Okonkwo',
    role: 'Design Critic',
    kind: 'testimonial',
  },
  {
    id: 't-3',
    quote:
      'I have opened hundreds of movements. Few are finished with this kind of quiet obsession.',
    author: 'Henri Delacroix',
    role: 'Master Watchmaker',
    kind: 'testimonial',
  },
]

export const pressMentions: PressMention[] = [
  { id: 'p-1', outlet: 'HODINKEE', quote: 'A near-perfect exercise in modern classicism.' },
  { id: 'p-2', outlet: 'Financial Times', quote: 'The most quietly confident house in watchmaking.' },
  { id: 'p-3', outlet: 'Monocle', quote: 'Craft that refuses to hurry.' },
  { id: 'p-4', outlet: 'GQ', quote: 'The Meridian is the chronograph to beat this year.' },
  { id: 'p-5', outlet: 'Robb Report', quote: 'The Grand Tourbillon is a genuine grail.' },
]

export const boutiques: Boutique[] = [
  {
    id: 'b-mumbai',
    city: 'Mumbai',
    country: 'India',
    region: 'West',
    address: 'Kala Ghoda, Fort, Mumbai 400001',
    phone: '+91 22 6155 0180',
    hours: 'Mon–Sat 11:00–20:00',
    lat: 18.9296,
    lng: 72.8323,
  },
  {
    id: 'b-delhi',
    city: 'New Delhi',
    country: 'India',
    region: 'North',
    address: 'Khan Market, New Delhi 110003',
    phone: '+91 11 4155 0142',
    hours: 'Mon–Sat 11:00–20:00',
    lat: 28.5992,
    lng: 77.2266,
  },
  {
    id: 'b-bangalore',
    city: 'Bengaluru',
    country: 'India',
    region: 'South',
    address: 'UB City, Vittal Mallya Road, Bengaluru 560001',
    phone: '+91 80 4155 0120',
    hours: 'Mon–Sat 11:00–20:00',
    lat: 12.9716,
    lng: 77.5980,
  },
  {
    id: 'b-hyderabad',
    city: 'Hyderabad',
    country: 'India',
    region: 'South',
    address: 'Road No. 36, Jubilee Hills, Hyderabad 500033',
    phone: '+91 40 4155 0199',
    hours: 'Daily 11:00–20:00',
    lat: 17.4239,
    lng: 78.4738,
  },
  {
    id: 'b-chennai',
    city: 'Chennai',
    country: 'India',
    region: 'South',
    address: 'Khader Nawaz Khan Road, Nungambakkam, Chennai 600006',
    phone: '+91 44 4155 0166',
    hours: 'Daily 11:00–20:00',
    lat: 13.0569,
    lng: 80.2425,
  },
  {
    id: 'b-kolkata',
    city: 'Kolkata',
    country: 'India',
    region: 'East',
    address: 'Park Street, Kolkata 700016',
    phone: '+91 33 4155 0133',
    hours: 'Mon–Sat 11:00–19:30',
    lat: 22.5535,
    lng: 88.3524,
  },
]

export const milestones: Milestone[] = [
  {
    year: '1874',
    title: 'The first workshop',
    description:
      'A single bench in the Jura mountains. One watchmaker, one lathe, and a refusal to sign anything imperfect.',
  },
  {
    year: '1911',
    title: 'The caliber that endured',
    description:
      'The house movement is finalised. Its architecture still beats inside the Héritage line more than a century later.',
  },
  {
    year: '1948',
    title: 'To the depths',
    description:
      'The first Marine is certified for professional divers, establishing the tool-watch discipline of the Meridian line.',
  },
  {
    year: '1979',
    title: 'The atelier is founded',
    description:
      'A dedicated workshop for grand complications opens. Every tourbillon since has been assembled by a single master.',
  },
  {
    year: '2004',
    title: 'Ceramic and shadow',
    description:
      'The house masters high-density ceramic, giving rise to the contemporary Noir collection.',
  },
  {
    year: 'Today',
    title: 'The next hundred years',
    description:
      'Still independent. Still in the mountains. Still refusing to sign anything imperfect.',
  },
]

export const journalPosts: JournalPost[] = [
  {
    id: 'j-1',
    slug: 'anatomy-of-a-caliber',
    title: 'The anatomy of a caliber',
    excerpt:
      'Three hundred and twelve components, assembled by a single pair of hands. A look inside the movement that defines the house.',
    category: 'Craft',
    author: 'The Atelier',
    date: 'March 2025',
    readTime: '6 min',
    image: '/images/journal-1.png',
    imageAlt: 'Vintage watchmaking tools and blueprints on a dark wooden workbench',
    body: [
      'A movement is a small country. It has its own laws, its own weather, its own sense of time. To assemble one is to negotiate with all three at once.',
      'We begin where we always have: at a single bench, with a single watchmaker. No caliber leaves the atelier having passed through more than two pairs of hands. This is not efficient. It is not meant to be.',
      'What follows is a study in patience — the bevelling of a bridge, the polishing of a screw head no larger than a grain of sand, the setting of a balance that will beat some four billion times in its first decade alone.',
    ],
  },
  {
    id: 'j-2',
    slug: 'why-we-still-finish-by-hand',
    title: 'Why we still finish by hand',
    excerpt:
      'A machine can cut a component in seconds. It cannot decide when a surface is beautiful. On the case for the human eye.',
    category: 'Philosophy',
    author: 'The Atelier',
    date: 'February 2025',
    readTime: '5 min',
    image: '/images/journal-2.png',
    imageAlt: 'Sapphire crystal case back revealing an engraved gold rotor and movement',
    body: [
      'There is a moment, invisible to any instrument, when a surface stops being finished and starts being beautiful. Only a person can find it.',
      'We have never been interested in doing things the slow way for its own sake. We do them by hand because the hand knows something the machine does not: when to stop.',
      'This is the quiet argument at the centre of everything we make. Not nostalgia. Judgement.',
    ],
  },
  {
    id: 'j-3',
    slug: 'the-colour-of-gold',
    title: 'The colour of gold',
    excerpt:
      'Every house has its own gold. Ours is cast in-house to a single, unrepeatable tone. A short history of a warm metal.',
    category: 'Materials',
    author: 'The Atelier',
    date: 'January 2025',
    readTime: '4 min',
    image: '/images/journal-3.png',
    imageAlt: 'Molten gold being poured in a workshop with sparks against a dark background',
    body: [
      'Gold is never simply gold. Its warmth is a recipe — a few points of copper here, a whisper of silver there — and every house guards its own.',
      'Ours is cast in the foundry beneath the atelier, in batches small enough to hold in two hands. The tone is warmer than most, closer to candlelight than to sunlight.',
      'It is the first thing you notice across a room, and the last thing you tire of across a lifetime.',
    ],
  },
]

/* ----------------------------- Getter functions ----------------------------- */

function mapJournalPost(row: any): JournalPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    author: row.author,
    date: row.date,
    readTime: row.read_time,
    image: row.image,
    imageAlt: row.image_alt,
    body: row.body ?? [],
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single()
    if (data) {
      return {
        brandName: data.brand_name,
        tagline: data.tagline,
        email: data.email,
        phone: data.phone,
        socials: data.socials ?? [],
        currencies: data.currencies ?? [],
        languages: data.languages ?? [],
        footer: data.footer ?? [],
      }
    }
  }
  return siteSettings
}

export async function getHeroContent(): Promise<HeroSection> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('hero_sections').select('*').eq('id', 'hero-home').single()
    if (data) {
      return {
        id: data.id,
        eyebrow: data.eyebrow,
        headline: data.headline,
        subheadline: data.subheadline,
        ctaLabel: data.cta_label,
        ctaHref: data.cta_href,
        secondaryCtaLabel: data.secondary_cta_label,
        secondaryCtaHref: data.secondary_cta_href,
        video: data.video,
        poster: data.poster,
        posterAlt: data.poster_alt,
      }
    }
  }
  return heroSection
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('testimonials').select('*')
    if (data) return data as Testimonial[]
  }
  return testimonials
}

export async function getPressMentions(): Promise<PressMention[]> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('press_mentions').select('*')
    if (data) return data as PressMention[]
  }
  return pressMentions
}

export async function getBoutiques(): Promise<Boutique[]> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('boutiques').select('*')
    if (data) return data as Boutique[]
  }
  return boutiques
}

export async function getMilestones(): Promise<Milestone[]> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase
      .from('milestones')
      .select('year, title, description')
      .order('sort_order', { ascending: true })
    if (data) return data as Milestone[]
  }
  return milestones
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('journal_posts').select('*').order('date', { ascending: false })
    if (data) return data.map(mapJournalPost)
  }
  return journalPosts
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | undefined> {
  const supabase = getSupabaseClient()
  if (supabase) {
    const { data } = await supabase.from('journal_posts').select('*').eq('slug', slug).single()
    if (data) return mapJournalPost(data)
  }
  return journalPosts.find((p) => p.slug === slug)
}
