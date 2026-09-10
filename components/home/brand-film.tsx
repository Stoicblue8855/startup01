'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'

/**
 * Full-screen brand film. Uses a real <video> when a source is provided
 * (swap `videoSrc` for a Supabase Storage URL) and gracefully falls back to a
 * cinematic still with functional play/mute controls otherwise.
 */
export function BrandFilm({
  poster,
  posterAlt,
  videoSrc = '',
}: {
  poster: string
  posterAlt: string
  videoSrc?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  const hasVideo = Boolean(videoSrc)

  function togglePlay() {
    const v = videoRef.current
    if (hasVideo && v) {
      if (v.paused) {
        v.play()
        setPlaying(true)
      } else {
        v.pause()
        setPlaying(false)
      }
    } else {
      setPlaying((p) => !p)
    }
  }

  function toggleMute() {
    const v = videoRef.current
    const next = !muted
    setMuted(next)
    if (v) v.muted = next
  }

  return (
    <section id="brand-film" className="relative h-dvh w-full overflow-hidden">
      {hasVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          poster={poster}
          muted={muted}
          loop
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <motion.div
          className="absolute inset-0"
          animate={playing ? { scale: 1.08 } : { scale: 1 }}
          transition={{ duration: 8, ease: 'easeOut' }}
        >
          <Image src={poster || '/placeholder.svg'} alt={posterAlt} fill sizes="100vw" className="object-cover" />
        </motion.div>
      )}

      <div className="absolute inset-0 bg-background/40" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center px-5 text-center md:px-10">
        <Reveal>
          <span className="text-xs uppercase tracking-luxe text-gold">The Film</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.02] text-balance md:text-6xl lg:text-7xl">
            Where seconds are shaped into a lifetime.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <button
            onClick={togglePlay}
            aria-label={playing ? 'Pause film' : 'Play film'}
            className="group mt-12 flex size-20 items-center justify-center rounded-full border border-foreground/40 backdrop-blur-sm transition-colors hover:border-gold md:size-24"
          >
            {playing ? (
              <Pause className="size-7 text-foreground transition-colors group-hover:text-gold" />
            ) : (
              <Play className="ml-1 size-7 text-foreground transition-colors group-hover:text-gold" />
            )}
          </button>
        </Reveal>
      </div>

      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute film' : 'Mute film'}
        className="absolute bottom-8 right-5 z-10 flex size-11 items-center justify-center border border-foreground/40 backdrop-blur-sm transition-colors hover:border-gold md:right-10"
      >
        {muted ? (
          <VolumeX className="size-4 text-foreground" />
        ) : (
          <Volume2 className="size-4 text-gold" />
        )}
      </button>
    </section>
  )
}
