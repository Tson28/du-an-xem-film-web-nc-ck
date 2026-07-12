import { motion } from 'framer-motion';

const steps = [
    {
        num: '01',
        title: 'Chọn phim & suất chiếu',
        desc: 'Duyệt qua danh sách phim đang chiếu, đọc mô tả, xem điểm đánh giá và chọn suất chiếu phù hợp với lịch của bạn.',
    },
    {
        num: '02',
        title: 'Chọn ghế ngồi',
        desc: 'Sơ đồ ghế trực quan, màu sắc rõ ràng phân biệt ghế trống, đã đặt và VIP. Chọn vị trí ưng ý chỉ trong vài giây.',
    },
    {
        num: '03',
        title: 'Thêm combo bắp nước',
        desc: 'Đừng bỏ lỡ combo bắp rang bơ và nước ngọt siêu ngon! Đặt trước để tiết kiệm thời gian chờ tại quầy.',
    },
    {
        num: '04',
        title: 'Thanh toán & nhận vé',
        desc: 'Thanh toán qua MoMo hoặc VNPay cực nhanh. Vé QR Code được gửi ngay, tải PDF về điện thoại để soát vé offline.',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-24 bg-[#080808] relative overflow-hidden">
            {/* Background glowing mesh */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#E50914]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <p className="text-[#E50914] font-bold text-sm uppercase tracking-widest mb-3">Quy trình</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Đặt vé chỉ với<br />
                        <span className="bg-gradient-to-r from-[#E50914] to-orange-500 bg-clip-text text-transparent">4 bước đơn giản</span>
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* Connecting line (desktop) */}
                    <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-transparent via-[#E50914]/25 to-transparent pointer-events-none z-0" />

                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.12
                                }
                            }
                        }}
                    >
                        {steps.map(({ num, title, desc }, index) => (
                            <motion.div 
                                key={num}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.8, y: 30 },
                                    visible: { 
                                        opacity: 1, 
                                        scale: 1, 
                                        y: 0,
                                        transition: { type: "spring", stiffness: 80, damping: 12 }
                                    }
                                }}
                                className="relative text-center group z-10"
                            >
                                {/* Extruded 3D Number bubble with floating movement */}
                                <div className="relative mb-8">
                                    <motion.div 
                                        whileHover={{ y: 4, scale: 0.98 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                        className="relative mx-auto w-24 h-24 rounded-3xl bg-[#0d0d0d] border border-white/5 flex items-center justify-center cursor-pointer select-none shadow-[0_8px_0_#b3000b,0_16px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_2px_0_#b3000b,0_8px_16px_rgba(229,9,20,0.25)] hover:border-[#E50914]/30 transition-shadow duration-200"
                                        style={{
                                          animation: `float-y 4s ease-in-out infinite`,
                                          animationDelay: `${index * 0.4}s`
                                        }}
                                    >
                                        <span className="text-4xl font-black bg-gradient-to-br from-[#E50914] to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                            {num}
                                        </span>
                                    </motion.div>
                                </div>
                                
                                <h3 className="text-white font-bold text-lg mb-3 group-hover:text-[#E50914] transition-colors duration-200">{title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed px-2">{desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
