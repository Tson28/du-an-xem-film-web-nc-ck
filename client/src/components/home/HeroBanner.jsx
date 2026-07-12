import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '@/utils/media';
import StarRating, { getMovieDisplayRating } from '@/components/common/StarRating';
import { motion, AnimatePresence } from 'framer-motion';

// ── Icon helpers (tránh import thêm lib) ───────────────────────
function PlayIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  )
}
function TicketIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  )
}

// ── Sub-components ─────────────────────────────────────────────

function AgeRatingBadge({ rating }) {
  const colors = {
    P:   'border-green-500 text-green-400',
    T13: 'border-yellow-500 text-yellow-400',
    T16: 'border-orange-500 text-orange-400',
    T18: 'border-red-500 text-red-400',
  }
  return (
    <span className={`text-xs font-bold px-1.5 py-0.5 border rounded ${colors[rating] ?? 'border-gray-500 text-gray-400'}`}>
      {rating}
    </span>
  )
}

// ── Slide dots indicator ───────────────────────────────────────
function SlideDots({ total, current, onDotClick }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className="transition-all duration-300 rounded-full"
          style={{
            width:   i === current ? '24px' : '6px',
            height:  '6px',
            background: i === current ? '#E50914' : 'rgba(255,255,255,0.25)',
          }}
          aria-label={`Slide ${i + 1}`}
        />
      ))}
    </div>
  )
}

// ── Progress bar ───────────────────────────────────────────────
function ProgressBar({ duration = 5000, active }) {
  return (
    <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          background: '#E50914',
          width: active ? '100%' : '0%',
          transition: active ? `width ${duration}ms linear` : 'none',
        }}
      />
    </div>
  )
}

// ── Interactive 3D Floating Poster component ──────────────────
function FloatingPoster3D({ movie }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setCoords({ x: x / (box.width / 2), y: y / (box.height / 2) });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  const rotateX = -coords.y * 18;
  const rotateY = coords.x * 18;

  return (
    <div 
      className="hidden md:flex justify-center items-center perspective-2000 w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotateY: 25, y: 15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, rotateY: -25, y: -15 }}
        transition={{ type: "spring", stiffness: 70, damping: 14 }}
        className="relative w-[300px] h-[450px] preserve-3d animate-float-y cursor-pointer"
        style={{
          transform: isHovered 
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)` 
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'none' : 'transform 0.4s ease-out',
        }}
      >
        {/* Soft neon backing glow */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#E50914] to-orange-500 rounded-2xl opacity-25 blur-2xl group-hover:opacity-45 transition-opacity duration-500 pointer-events-none" />
        
        {/* Glass plate frame */}
        <div className="absolute inset-0 bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.85)] preserve-3d">
          <img 
            src={getMediaUrl(movie.posterUrl)} 
            alt={movie.title} 
            className="w-full h-full object-cover rounded-2xl pointer-events-none" 
            style={{
              transform: isHovered ? 'scale(1.04) translateZ(8px)' : 'scale(1) translateZ(0px)',
              transition: 'transform 0.3s ease',
            }}
          />
          
          {/* Dynamic reflection shine overlay */}
          <div 
            className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${(coords.x + 1) * 50}% ${(coords.y + 1) * 50}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

// ── MAIN HeroBanner ────────────────────────────────────────────
const AUTOPLAY_DURATION = 5000

export default function HeroBanner({ movies = [] }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0)
  const [prevIdx, setPrevIdx] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [paused, setPaused] = useState(false)
  const total = movies.length

  if (!movies || movies.length === 0) return null;

  // Go to a specific slide
  const goTo = useCallback((idx) => {
    if (isTransitioning || idx === current) return
    setIsTransitioning(true)
    setPrevIdx(current)
    setCurrent(idx)
    setTimeout(() => {
      setPrevIdx(null)
      setIsTransitioning(false)
    }, 700)
  }, [current, isTransitioning])

  const goNext = useCallback(() => goTo((current + 1) % total), [goTo, current, total])
  const goPrev = useCallback(() => goTo((current - 1 + total) % total), [goTo, current, total])

  // Autoplay
  useEffect(() => {
    if (paused) return
    const timer = setInterval(goNext, AUTOPLAY_DURATION)
    return () => clearInterval(timer)
  }, [goNext, paused])

  const movie    = movies[current] || {}
  const prevMovie = prevIdx !== null ? movies[prevIdx] : null
  
  // Xử lý ảnh backdrop và poster với URL thật
  const getBackdrop = (m) => m?.backdropUrl ? `url(${getMediaUrl(m.backdropUrl)})` : 'none';
  const getPoster = (m) => getMediaUrl(m?.posterUrl);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(100vh - 0px)', minHeight: '580px', maxHeight: '860px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      {/* ── BACKDROP LAYERS ─────────────────────────────────────
          Prev slide fades out, current slides in
      ────────────────────────────────────────────────────────── */}

      {/* Previous backdrop (fade out) */}
      {prevMovie && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: getBackdrop(prevMovie),
            opacity: 0,
            transition: 'opacity 700ms ease',
            filter: 'brightness(0.5) blur(4px)',
          }}
        />
      )}

      {/* Current backdrop */}
      <div
        key={`backdrop-${current}`}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: getBackdrop(movie),
          animation: 'hero-scale-in 8s ease-out forwards',
          filter: 'brightness(0.5)',
        }}
      />

      {/* ── GRADIENT OVERLAYS ────────────────────────────────── */}
      {/* Left-to-right: Fade content in from left */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(to right, rgba(5,5,5,1) 0%, rgba(5,5,5,0.85) 35%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.05) 100%)',
        }}
      />
      {/* Bottom-to-top: Fade-to-black at the bottom */}
      <div
        className="absolute bottom-0 inset-x-0 z-10"
        style={{
          height: '45%',
          background: 'linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.75) 50%, transparent 100%)',
        }}
      />

      {/* ── CONTENT ─────────────────────────────────────────────── */}
      <div className="relative z-20 h-full flex flex-col justify-center py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Movie Info Details */}
            <div className="col-span-12 md:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`info-${current}`}
                  initial={{ opacity: 0, x: -50, rotateY: -10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: 50, rotateY: 10 }}
                  transition={{ type: "spring", stiffness: 90, damping: 15 }}
                  className="preserve-3d"
                >
                  {/* Slide counter */}
                  <div className="flex items-center gap-2.5 mb-5">
                    <span
                      className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider text-white"
                      style={{ background: '#E50914', boxShadow: '0 0 15px rgba(229,9,20,0.5)' }}
                    >
                      Nổi Bật
                    </span>
                    <span className="text-xs text-gray-500 font-bold">
                      {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </span>
                    <AgeRatingBadge rating={movie.ageRating} />
                  </div>

                  {/* Title */}
                  <h1
                    className="font-black tracking-tight leading-none mb-3 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                    style={{
                      fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                      transform: 'translateZ(30px)',
                      lineHeight: '1.05'
                    }}
                  >
                    {movie.title}
                  </h1>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
                    <StarRating rating={getMovieDisplayRating(movie)} />
                    <span className="text-gray-600">•</span>
                    <span className="text-sm text-gray-400 font-medium">
                      {movie.details?.find(d => d.name.toLowerCase().includes('thời lượng'))?.value || '120 phút'}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-sm text-gray-400 line-clamp-1 font-medium">
                      Đạo diễn: {movie.details?.find(d => d.name.toLowerCase().includes('đạo diễn'))?.value || 'Đang cập nhật'}
                    </span>
                    <span className="text-gray-600">•</span>
                    {movie.categories?.map(c => (
                      <span
                        key={c._id}
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          color: '#b2bec3',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>

                  {/* Synopsis */}
                  <p className="text-sm text-gray-300 leading-relaxed mb-8 max-w-lg font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {movie.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      className="btn-primary flex items-center gap-2"
                      onClick={() => navigate(`/phim/${movie.slug}`)}
                    >
                      <TicketIcon />
                      Đặt Vé Ngay
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column: Interactive 3D Poster */}
            <div className="col-span-12 md:col-span-5 flex justify-center">
              <AnimatePresence mode="wait">
                <FloatingPoster3D key={`poster-${current}`} movie={movie} />
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>

      {/* ── BOTTOM CONTROLS ─────────────────────────────────────── */}
      <div className="absolute bottom-8 inset-x-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">

            {/* Dots + progress */}
            <div className="flex flex-col gap-3">
              <SlideDots total={total} current={current} onDotClick={goTo} />
              <div className="w-40">
                <ProgressBar key={current} active={!paused} duration={AUTOPLAY_DURATION} />
              </div>
            </div>

            {/* Poster thumbnails — right side */}
            <div className="hidden sm:flex items-end gap-2.5 bg-black/30 backdrop-blur-md p-2 rounded-2xl border border-white/5 shadow-xl">
              {movies.map((m, i) => (
                <button
                  key={m._id}
                  onClick={() => goTo(i)}
                  className="relative rounded-xl overflow-hidden shrink-0 transition-all duration-300 bg-[#111] cursor-pointer"
                  style={{
                    width:   i === current ? '52px' : '40px',
                    height:  i === current ? '76px' : '58px',
                    opacity: i === current ? 1 : 0.4,
                    outline: i === current ? '2px solid #E50914' : 'none',
                    outlineOffset: '2px',
                  }}
                >
                  <img src={getPoster(m)} alt={m.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── ARROW CONTROLS ──────────────────────────────────────── */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        aria-label="Slide trước"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        aria-label="Slide tiếp"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

    </section>
  )
}

