import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
    { value: '500+', label: 'Bộ phim' },
    { value: '50+', label: 'Rạp chiếu' },
    { value: '1M+', label: 'Khách hàng' },
    { value: '4.9★', label: 'Đánh giá' },
];

function StatCard({ value, label }) {
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

  const rotateX = -coords.y * 12;
  const rotateY = coords.x * 12;

  return (
    <div
      className="perspective-1000 w-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
        }}
        className="text-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm cursor-default select-none preserve-3d transition-all duration-300"
        style={{
          transform: isHovered 
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)` 
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          boxShadow: isHovered 
            ? '0 15px 30px rgba(0,0,0,0.7), 0 0 15px rgba(255,255,255,0.08)' 
            : '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        <div 
          className="text-4xl font-black bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent mb-1"
          style={{ transform: 'translateZ(15px)' }}
        >
          {value}
        </div>
        <div 
          className="text-gray-400 text-sm font-semibold"
          style={{ transform: 'translateZ(10px)' }}
        >
          {label}
        </div>
      </motion.div>
    </div>
  );
}

function MainCTABox() {
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

  const rotateX = -coords.y * 6;
  const rotateY = coords.x * 6;

  return (
    <div
      className="perspective-2000 w-full group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer border container */}
      <div 
        className="relative rounded-3xl p-[1px] overflow-hidden transition-all duration-300"
        style={{
          boxShadow: isHovered 
            ? '0 30px 60px rgba(0,0,0,0.9), 0 0 35px rgba(229,9,20,0.25)' 
            : '0 15px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Animated Neon Border Background */}
        <div className="absolute inset-0 border-gradient-glow opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Inner Content Card */}
        <motion.div 
          className="relative text-center rounded-3xl p-12 bg-[#090909]/95 backdrop-blur-md preserve-3d"
          style={{
            transform: isHovered 
              ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` 
              : 'rotateX(0deg) rotateY(0deg)',
            transition: isHovered ? 'none' : 'transform 0.4s ease-out',
          }}
        >
          {/* Subtle hover neon radial flare */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${(coords.x + 1) * 50}% ${(coords.y + 1) * 50}%, rgba(229,9,20,0.3) 0%, transparent 60%)`,
            }}
          />

          <h2 
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-none"
            style={{ transform: 'translateZ(25px)' }}
          >
            Sẵn sàng cho<br />
            <span className="bg-gradient-to-r from-[#E50914] to-orange-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(229,9,20,0.25)]">đêm phim tuyệt vời?</span>
          </h2>
          <p 
            className="text-gray-400 text-lg mb-10 max-w-xl mx-auto"
            style={{ transform: 'translateZ(15px)' }}
          >
            Hàng trăm bộ phim bom tấn đang chờ bạn. Đặt vé ngay hôm nay, nhận ưu đãi thành viên hấp dẫn!
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ transform: 'translateZ(20px)' }}
          >
            <Link
                to="/movies/now-showing"
                className="inline-flex items-center justify-center gap-2 bg-[#E50914] hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_35px_rgba(229,9,20,0.6)] text-base"
            >
                <Play size={20} fill="white" /> Đặt vé ngay
            </Link>
            <Link
                to="/movies/coming-soon"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white hover:bg-white/5 font-bold px-8 py-4 rounded-xl transition-all duration-200 text-base"
            >
                Phim sắp ra mắt
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CTABanner() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background neon blurs */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/10 via-[#050505] to-[#1a0a0a] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E50914]/5 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <motion.div 
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.08
                            }
                        }
                    }}
                >
                    {stats.map(({ value, label }) => (
                        <StatCard key={label} value={value} label={label} />
                    ))}
                </motion.div>

                {/* Main CTA interactive panel */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
                >
                    <MainCTABox />
                </motion.div>
            </div>
        </section>
    );
}
