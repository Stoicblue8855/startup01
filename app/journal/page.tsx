import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getJournalPosts } from '@/lib/content'
import { SectionHeading } from '@/components/common/section-heading'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'The Journal',
  description: 'Notes on craft, materials and philosophy from the atelier.',
}

export default async function JournalPage() {
  const posts = await getJournalPosts()

  return (
    <div className="pt-28 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 pb-20 md:px-10 md:pb-28">
        <SectionHeading
          eyebrow="The Journal"
          title="Notes from the atelier."
          description="Short, occasional writing on craft, materials and the philosophy behind what we make."
        />

        <RevealGroup className="mt-16 grid gap-x-7 gap-y-16 md:grid-cols-3">
          {posts.map((post) => (
            <RevealItem key={post.id}>
              <Link href={`/journal/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <Image
                    src={post.image || '/placeholder.svg'}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 text-xs uppercase tracking-wide-luxe text-gold">{post.category}</p>
                <h3 className="mt-2 font-serif text-2xl leading-tight text-balance transition-colors group-hover:text-gold">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <p className="mt-4 text-xs uppercase tracking-wide-luxe text-muted-foreground">
                  {post.date} · {post.readTime}
                </p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  )
}
