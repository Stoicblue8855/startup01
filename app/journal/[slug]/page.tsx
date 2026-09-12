import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getJournalPostBySlug, getJournalPosts } from '@/lib/content'
import { Reveal } from '@/components/motion/reveal'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getJournalPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getJournalPostBySlug(slug)
  if (!post) return { title: 'Story not found' }
  return { title: post.title, description: post.excerpt }
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getJournalPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="pt-28 md:pt-36">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <Reveal>
          <Link
            href="/journal"
            className="text-xs uppercase tracking-wide-luxe text-muted-foreground transition-colors hover:text-gold"
          >
            ← The Journal
          </Link>
          <p className="mt-8 text-xs uppercase tracking-wide-luxe text-gold">{post.category}</p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.05] text-balance md:text-5xl">{post.title}</h1>
          <p className="mt-5 text-xs uppercase tracking-wide-luxe text-muted-foreground">
            {post.author} · {post.date} · {post.readTime}
          </p>
        </Reveal>
      </div>

      <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden md:mt-16">
        <Image
          src={post.image || '/placeholder.svg'}
          alt={post.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-3xl px-5 py-16 md:px-10 md:py-24">
        <div className="space-y-6">
          {post.body.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  )
}
