import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Smartphone, Ticket, Gift, Clock } from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Đặt vé siêu tốc',
        desc: 'Chỉ 3 bước đơn giản — chọn phim, chọn ghế, thanh toán. Xong ngay trong vòng 1 phút!',
        gradient: 'from-yellow-500 to-orange-500',
        glow: 'rgba(234,179,8,0.15)',
    },
    {
        icon: Shield,
        title: 'Thanh toán an toàn',
        desc: 'Hỗ trợ MoMo, VNPay & thẻ ngân hàng. Giao dịch mã hóa 100% an toàn và bảo mật.',
        gradient: 'from-green-500 to-teal-500',
        glow: 'rgba(34,197,94,0.15)',
    },
    {
        icon: Smartphone,
        title: 'Vé điện tử QR',
        desc: 'Nhận vé ngay trên điện thoại, xuất PDF mang đi. Không cần in vé, quét QR là vào rạp!',
        gradient: 'from-blue-500 to-indigo-500',
        glow: 'rgba(59,130,246,0.15)',
    },
    {
        icon: Ticket,
        title: 'Chọn ghế trực quan',
        desc: 'Sơ đồ ghế trực quan, dễ chọn. Đặt cặp đôi, nhóm bạn hay cả gia đình cực tiện!',
        gradient: 'from-pink-500 to-rose-500',
        glow: 'rgba(236,72,153,0.15)',
    },
    {
        icon: Gift,
        title: 'Ưu đãi thành viên',
        desc: 'Hệ thống thẻ hạng Bạc, Vàng, Kim Cương với vô số ưu đãi hấp dẫn và quà tặng độc quyền.',
        gradient: 'from-purple-500 to-violet-500',
        glow: 'rgba(168,85,247,0.15)',
    },
    {
        icon: Clock,
        title: 'Lịch chiếu thực-thời',
        desc: 'Cập nhật lịch chiếu liên tục, không lo trễ giờ. Nhận thông báo khi phim yêu thích sắp chiếu.',
        gradient: 'from-[#E50914] to-red-700',
        glow: 'rgba(229,9,20,0.15)',
    },
];

function FeatureCard({ icon: Icon, title, desc, gradient, glow }) {
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
          hidden: { opacity: 0, y: 30, rotateX: 10 },
          visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
        }}
        className="relative bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 transition-all duration-300 preserve-3d cursor-default select-none"
        style={{
          transform: isHovered 
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)` 
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          boxShadow: isHovered 
            ? `0 20px 40px ${glow}, 0 0 0 1px rgba(255,255,255,0.12) inset` 
            : '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset',
        }}
      >
        {/* Soft neon backing glow */}
        <div 
          className="absolute -inset-2 rounded-2xl opacity-0 transition-all duration-500 pointer-events-none" 
          style={{
            background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
            opacity: isHovered ? 0.35 : 0
          }}
        />

        {/* Icon wrapper */}
        <motion.div 
          animate={isHovered ? { rotateY: 360, scale: 1.1 } : { rotateY: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg`}
          style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}
        >
          <Icon size={24} className="text-white" style={{ transform: 'translateZ(10px)' }} />
        </motion.div>

        <h3 
          className="text-white font-bold text-lg mb-2"
          style={{ transform: 'translateZ(15px)' }}
        >
          {title}
        </h3>
        
        <p 
          className="text-gray-400 text-sm leading-relaxed"
          style={{ transform: 'translateZ(10px)' }}
        >
          {desc}
        </p>
      </motion.div>
    </div>
  );
}

export default function WhyChooseUs() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#E50914]/5 blur-[120px] pointer-events-none animate-pulse-glow" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p className="text-[#E50914] font-bold text-sm uppercase tracking-widest mb-3">Tại sao chọn chúng tôi?</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Trải nghiệm xem phim<br />
                        <span className="bg-gradient-to-r from-[#E50914] to-orange-500 bg-clip-text text-transparent">đỉnh cao nhất</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        SUN CINEMA mang đến hành trình đặt vé hiện đại, nhanh chóng và thú vị hơn bao giờ hết.
                    </p>
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.06
                            }
                        }
                    }}
                >
                    {features.map((feat) => (
                        <FeatureCard
                            key={feat.title}
                            {...feat}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
