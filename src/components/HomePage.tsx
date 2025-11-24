import { motion } from 'framer-motion'
import { Sparkles, Moon, BookOpen, TreePine, Wand2, Circle, Target } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { FeatureCard } from './FeatureCard'

export function HomePage() {
  const navigate = useNavigate()
  
  const handleNavigate = (feature: 'incense' | 'dream' | 'masters' | 'tree-scratch' | 'siamese-stick' | 'wheel-spin' | 'ball-draw') => {
    navigate({ to: `/${feature}` })
  }
  
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.17, 0.67, 0.83, 0.67] as const,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] as const }
    }
  }

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  }

  const features = [
    {
      icon: Sparkles,
      title: 'จุดเทียนขอพร',
      description: 'สุ่มตัวเลขด้วยเอฟเฟกต์เทียนมงคล เพื่อความบันเทิงและสร้างแรงบันดาลใจ',
      delay: 0.1,
      feature: 'incense' as const
    },
    {
      icon: TreePine,
      title: 'ถูขอหวย',
      description: 'ถูต้นไม้ด้วยแป้งเพื่อเปิดเผยเลขมงคล พร้อมความหมายของแต่ละเลข',
      delay: 0.15,
      feature: 'tree-scratch' as const
    },
    {
      icon: Wand2,
      title: 'กล่องเสี่ยงเซียมซี',
      description: 'เขย่ากระบอกเซียมซีเพื่อเลือกไม้และดูเลขมงคลพร้อมคำทำนาย',
      delay: 0.175,
      feature: 'siamese-stick' as const
    },
    {
      icon: Moon,
      title: 'ทำนายฝันเป็นเลข',
      description: 'แปลงความฝันของคุณเป็นตัวเลขลอตเตอรี่ด้วยศาสตร์การทำนาย',
      delay: 0.2,
      feature: 'dream' as const
    },
    {
      icon: BookOpen,
      title: 'เลขเด็ดอาจารย์ดัง',
      description: 'รวมเลขเด็ดจากอาจารย์ผู้เชี่ยวชาญด้านตัวเลขและโหราศาสตร์',
      delay: 0.3,
      feature: 'masters' as const
    },
    {
      icon: Circle,
      title: 'หมุนวงล้อตัวเลข',
      description: 'หมุนวงล้อเพื่อสุ่มตัวเลข 0-9 ด้วยความสนุกและตื่นเต้น',
      delay: 0.25,
      feature: 'wheel-spin' as const
    },
    {
      icon: Target,
      title: 'สุ่มลูกบอลออกรางวัล',
      description: 'หมุนลูกบอลในกล่องเพื่อสุ่มตัวเลข 0-9 แบบตื่นเต้นเร้าใจ',
      delay: 0.275,
      feature: 'ball-draw' as const
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#3024AE] via-[#C86CD7] to-[#3024AE]">
      {/* Animated gradient mesh background - Aceternity style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient mesh blobs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-[#3024AE]/25 to-[#C86CD7]/25 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#C86CD7]/25 to-[#3024AE]/25 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#3024AE]/20 to-[#C86CD7]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-[#C86CD7]/40 to-[#3024AE]/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-4 md:py-8 relative z-10">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-md"
        >
          <div className="flex flex-col items-center">
            {/* Text Content */}
            <div className="text-center w-full mb-8">
              <motion.div
                variants={itemVariants}
                className="mb-6"
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#3024AE]/40 via-[#C86CD7]/40 to-[#3024AE]/40 mb-4 mystical-glow relative overflow-hidden" 
                  style={{ borderRadius: '2rem' }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 shimmer opacity-30"></div>
                  
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="absolute inset-0 rounded-3xl border-2 border-white/30"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent, rgba(200, 108, 215, 0.4), transparent)',
                      borderRadius: '2rem'
                    }}
                  />
                  <motion.div
                    animate={{
                      rotate: [0, -360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-12 h-12 text-white relative z-10" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))' }} />
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.h1
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight relative"
                style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  ตัวช่วยหาเลขลอตเตอรี่
                </motion.span>
                <br />
                <motion.span 
                  className="bg-gradient-to-r from-white via-[#C86CD7] to-white bg-clip-text text-transparent relative inline-block"
                  style={{ 
                    backgroundSize: '200% 100%',
                    animation: 'gradientShift 3s ease infinite',
                    textShadow: '0 0 20px rgba(200, 108, 215, 0.5)'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 200 }}
                >
                  ของคุณ
                </motion.span>
              </motion.h1>
              
              <motion.p
                variants={itemVariants}
                className="text-base text-white/90 mb-10 leading-relaxed max-w-sm mx-auto"
              >
                ไม่รู้จะซื้อเลขอะไร? ลองเล่นเกมจาก เงินตุง เป๋าตังดูสิ
              </motion.p>

              {/* Main CTA Button */}
              <motion.div
                variants={itemVariants}
                className="mb-6"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 40px rgba(200, 108, 215, 0.6)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate('incense')}
                  className="w-full px-6 py-4 bg-gradient-to-r from-white via-[#C86CD7] to-white text-[#3024AE] font-bold rounded-2xl transition-all text-lg mystical-glow relative overflow-hidden group"
                  style={{ 
                    backgroundSize: '200% 100%',
                    animation: 'gradientShift 3s ease infinite',
                    borderRadius: '1.5rem'
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 shimmer opacity-20"></div>
                  
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  {/* Magnetic hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#C86CD7]/20 to-[#3024AE]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{ borderRadius: '1.5rem' }}
                  />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <motion.span 
                      className="text-2xl"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      ✨
                    </motion.span>
                    <span>จุดเทียนขอเลข</span>
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid Section */}
      <section className="container mx-auto px-4 py-4 md:py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-md"
        >
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-center mb-2 text-white"
            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
          >
            ฟีเจอร์ทั้งหมด
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm text-white/80 text-center mb-8"
          >
            เลือกวิธีที่คุณชอบ
          </motion.p>

          <div className="flex flex-col gap-4">
            {features.map((feature) => (
              <FeatureCard
                key={feature.feature}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={feature.delay}
                onNavigate={() => handleNavigate(feature.feature)}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-md text-center"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/40 shadow-xl" style={{ borderRadius: '1.5rem' }}>
            <p className="text-[#3024AE] text-xs leading-relaxed font-medium">
              ⚠️ ฟีเจอร์ทั้งหมดสร้างขึ้นเพื่อความบันเทิง กรุณาใช้วิจารณญาณ และเล่นอย่างรับผิดชอบ
            </p>
          </div>
        </motion.div>
      </footer>
    </div>
  )
}

