'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'

/**
 * A 30-second animated "brand film" built from still photography — six
 * Ken Burns panels, each paired with a line about the making of a watch,
 * standing in until real video footage is available (swap this component
 * out for a <video> then).
 */
const SLIDE_SECONDS = 5

const slides = [
  {
    image: '/images/journal-1.png',
    alt: 'Vintage watchmaking tools and blueprints on a dark wooden workbench',
    quote: 'Every great thing begins with a single idea.',
    label: 'Design',
  },
  {
    image: '/images/journal-3.png',
    alt: 'Molten gold being poured in a workshop with sparks against a dark background',
    quote: 'From fire and metal, precision is born.',
    label: 'Casting',
  },
  {
    image: '/images/craftsmanship.png',
    alt: 'Watchmaker placing a tiny gear into an exposed mechanical watch movement with tweezers',
    quote: 'Patience is the first tool of any master.',
    label: 'Assembly',
  },
  {
    image: '/images/brand-film.png',
    alt: "Master watchmaker's atelier at night, finishing a watch by lamplight",
    quote: 'Perfection is never rushed. It is earned.',
    label: 'Finishing',
  },
  {
    image: '/images/journal-2.png',
    alt: 'Sapphire crystal case back revealing an engraved gold rotor and movement',
    quote: 'The smallest details define the greatest work.',
    label: 'Inspection',
  },
  {
    image: '/images/hero-watch.png',
    alt: 'Finished luxury automatic watch, complete and ready to be worn',
    quote: 'Some things are not made. They are crafted, for a lifetime.',
    label: 'The Reveal',
  },
]

export function BrandFilm() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const startRef = useRef<number>(Date.now())
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!playing) return
    startRef.current = Date.now() - progress * SLIDE_SECONDS * 1000

    let frame: number
    const tick = () => {
      const elapsed = (Date.now() - startRef.current) / 1000
      const p = Math.min(1, elapsed / SLIDE_SECONDS)
      setProgress(p)
      if (p >= 1) {
        setIndex((i) => (i + 1) % slides.length)
        startRef.current = Date.now()
        setProgress(0)
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index])

  function togglePlay() {
    setPlaying((p) => !p)
  }

  function jumpTo(i: number) {
    setIndex(i)
    setProgress(0)
    startRef.current = Date.now()
  }

  const slide = slides[index]

  return (
    <section id="brand-film" className="relative h-dvh w-full overflow-hidden bg-foreground">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: 1.12 }}
            transition={{ duration: SLIDE_SECONDS + 1, ease: 'linear' }}
          >
            <Image
              src={slide.image || '/placeholder.svg'}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-[linear-gradient(to_top,black_0%,rgba(0,0,0,0.55)_28%,rgba(0,0,0,0.15)_50%,transparent_68%)]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-28 text-center md:px-10 md:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs uppercase tracking-luxe text-gold">
              The Making · {slide.label}
            </span>
            <h2 className="mt-5 max-w-3xl font-serif text-3xl leading-[1.15] text-balance text-white md:text-5xl">
              {slide.quote}
            </h2>
          </motion.div>
        </AnimatePresence>

        <Reveal delay={0.2}>
          <button
            onClick={togglePlay}
            aria-label={playing ? 'Pause film' : 'Play film'}
            className="group mt-10 flex size-16 items-center justify-center rounded-full border border-white/40 backdrop-blur-sm transition-colors hover:border-gold md:size-20"
          >
            {playing ? (
              <Pause className="size-6 text-white transition-colors group-hover:text-gold" />
            ) : (
              <Play className="ml-1 size-6 text-white transition-colors group-hover:text-gold" />
            )}
          </button>
        </Reveal>

        <div className="mt-10 flex w-full max-w-md items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.label}
              onClick={() => jumpTo(i)}
              aria-label={`Jump to ${s.label}`}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
            >
              <span
                className="block h-full bg-gold"
                style={{
                  width: i < index ? '100%' : i === index ? `${progress * 100}%` : '0%',
                  transition: i === index ? 'none' : 'width 0.3s ease',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
