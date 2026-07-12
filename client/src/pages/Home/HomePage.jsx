import { useState, useEffect } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import HowItWorks from '@/components/home/HowItWorks';
import CTABanner from '@/components/home/CTABanner';
import { requestGetAllMovies } from '@/config/MovieRequest';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { getMediaUrl } from '@/utils/media';
import PosterRibbon, { getMovieRibbon } from '@/components/common/PosterRibbon';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await requestGetAllMovies();
        if (res && res.metadata) {
          setMovies(res.metadata);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const nowShowing = movies.filter(m => m.status === 'Đang chiếu');
  const comingSoon = movies.filter(m => m.status === 'Sắp chiếu');
  const heroMovies = nowShowing.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Đang tải...</span>
        </div>
      </div>
    );
  }

  const MovieCard = ({ movie, showRibbon = false, rank = null }) => {
    const ribbon = showRibbon ? getMovieRibbon(movie) : null;
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left - box.width / 2;
      const y = e.clientY - box.top - box.height / 2;
      
      const normalizedX = x / (box.width / 2);
      const normalizedY = y / (box.height / 2);
      
      setCoords({ x: normalizedX, y: normalizedY });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setCoords({ x: 0, y: 0 });
    };

    const rotateX = -coords.y * 15;
    const rotateY = coords.x * 15;
    
    const glareX = (coords.x + 1) * 50;
    const glareY = (coords.y + 1) * 50;

    return (
      <div 
        className="perspective-1000 w-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <Link 
          to={`/phim/${movie.slug}`} 
          className="group relative rounded-xl overflow-hidden cursor-pointer block transition-all duration-300 preserve-3d shadow-2xl"
          style={{
            transform: isHovered 
              ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)` 
              : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            boxShadow: isHovered 
              ? '0 25px 50px rgba(0,0,0,0.8), 0 0 25px rgba(229,9,20,0.3)' 
              : '0 10px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div className="aspect-[2/3] w-full bg-[#111] relative overflow-hidden">
            <img
              src={getMediaUrl(movie.posterUrl)}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{
                transform: isHovered ? 'scale(1.08) translateZ(15px)' : 'scale(1) translateZ(0px)',
              }}
            />

            {/* 3D Glare overlay */}
            <div 
              className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35) 0%, transparent 60%)`,
              }}
            />

            {/* Glowing inner border */}
            <div 
              className="absolute inset-0 z-30 pointer-events-none border border-white/5 group-hover:border-[#E50914]/40 transition-colors duration-300"
            />

            {ribbon && <PosterRibbon label={ribbon.label} color={ribbon.color} />}

            {movie.ageRating && (
              <div className="absolute top-2.5 right-2.5 z-10" style={{ transform: 'translateZ(25px)' }}>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border shadow-lg backdrop-blur-md ${
                    movie.ageRating === 'T18' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    movie.ageRating === 'T16' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                    movie.ageRating === 'T13' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-green-500/20 text-green-400 border-green-500/30'
                }`}>
                    {movie.ageRating}
                </span>
              </div>
            )}

            {rank && rank <= 10 && (
              <span
                className="absolute bottom-2 left-2.5 z-10 font-black text-white leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                style={{ 
                  fontSize: rank <= 3 ? '3.5rem' : '2.2rem', 
                  opacity: rank <= 3 ? 1 : 0.7,
                  transform: 'translateZ(30px)',
                }}
              >
                {rank}
              </span>
            )}

          </div>
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20"
            style={{ transform: 'translateZ(20px)' }}
          >
            <h3 className="text-white font-bold text-base leading-tight mb-1 line-clamp-2">{movie.title}</h3>
            <p className="text-gray-300 text-xs mb-3 line-clamp-2">{movie.description}</p>
            <div className="bg-[#E50914] text-white py-2 px-4 rounded-lg font-bold text-sm text-center flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(229,9,20,0.5)] group-hover:bg-[#FF0044] transition-colors duration-200">
              <Play size={14} fill="white" /> {movie.status === 'Đang chiếu' ? 'Mua Vé' : 'Xem Thêm'}
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const SectionHeader = ({ title, to }) => (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl md:text-3xl font-black text-white relative pl-4 border-l-4 border-[#E50914]">
        {title}
      </h2>
      <Link to={to} className="text-gray-400 hover:text-[#E50914] transition-colors text-sm font-medium flex items-center gap-1 group">
        Xem tất cả
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  );

  const ITEMS_PER_PAGE = 10;

  const PaginatedSection = ({ title, to, movieList, withRibbon = false }) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(movieList.length / ITEMS_PER_PAGE);
    const paginated = movieList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
      setPage(newPage);
      document.getElementById(`section-${to}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const getPageNumbers = () => {
      const pages = [];
      for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
          pages.push(p);
        } else if (p === page - 2 || p === page + 2) {
          pages.push('...');
        }
      }
      return pages.filter((v, i, arr) => !(v === '...' && arr[i - 1] === '...'));
    };

    return (
      <section id={`section-${to}`} className="scroll-mt-20">
        <SectionHeader title={title} to={to} />
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {paginated.map((movie, idx) => {
            const globalIndex = (page - 1) * ITEMS_PER_PAGE + idx;
            return (
              <motion.div
                key={movie._id}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    transition: { type: "spring", stiffness: 80, damping: 14 } 
                  }
                }}
              >
                <MovieCard
                  movie={movie}
                  showRibbon={withRibbon}
                  rank={withRibbon ? globalIndex + 1 : null}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10"
            >
              ←
            </button>

            {getPageNumbers().map((p, idx) =>
              p === '...'
                ? <span key={`ellipsis-${idx}`} className="text-gray-600 px-1 text-sm">…</span>
                : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all border ${
                      p === page
                        ? 'bg-[#E50914] border-[#E50914] text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]'
                        : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {p}
                  </button>
                )
            )}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10"
            >
              →
            </button>

            <span className="text-gray-500 text-xs ml-2">
              {page}/{totalPages} trang · {movieList.length} phim
            </span>
          </div>
        )}
      </section>
    );
  };

  return (
    <main className="bg-[#050505] min-h-screen">
      {heroMovies.length > 0 && <HeroBanner movies={heroMovies} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {nowShowing.length > 0 && (
          <PaginatedSection title="PHIM ĐANG CHIẾU" to="/movies/now-showing" movieList={nowShowing} withRibbon />
        )}

        {comingSoon.length > 0 && (
          <PaginatedSection title="PHIM SẮP CHIẾU" to="/movies/coming-soon" movieList={comingSoon} withRibbon />
        )}
      </div>

      {/* Extra sections */}
      <WhyChooseUs />
      <HowItWorks />
      <CTABanner />
    </main>
  );
}
