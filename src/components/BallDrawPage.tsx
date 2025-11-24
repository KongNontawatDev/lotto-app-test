import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, Home, Sparkles } from 'lucide-react'

interface BallDrawPageProps {
  onBack?: () => void
  onNavigateHome?: () => void
}

interface HistoryItem {
  number: number
  timestamp: string
}

export function BallDrawPage({ onBack, onNavigateHome }: BallDrawPageProps) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [balls, setBalls] = useState<number[]>([])
  const [selectedBall, setSelectedBall] = useState<number | null>(null)

  // สร้างตัวเลข 0-9 สำหรับลูกบอล
  const numbers = Array.from({ length: 10 }, (_, i) => i)

  // สร้างลูกบอลที่หมุนอยู่ในกล่อง
  useEffect(() => {
    if (isDrawing) {
      // สร้างลูกบอลหลายลูกที่หมุนอยู่
      const ballCount = 20
      const newBalls = Array.from({ length: ballCount }, () => 
        Math.floor(Math.random() * 10)
      )
      setBalls(newBalls)
    }
  }, [isDrawing])

  const drawBall = () => {
    if (isDrawing) return

    setIsDrawing(true)
    setResult(null)
    setSelectedBall(null)

    // สุ่มตัวเลขที่จะได้
    const targetNumber = Math.floor(Math.random() * 10)

    // สร้างลูกบอลที่หมุนอยู่
    const ballCount = 20
    const spinningBalls = Array.from({ length: ballCount }, () => 
      Math.floor(Math.random() * 10)
    )
    setBalls(spinningBalls)

    // หลังจาก 2 วินาที ให้หยุดและแสดงผลลัพธ์
    setTimeout(() => {
      setSelectedBall(targetNumber)
      setResult(targetNumber)
      setIsDrawing(false)

      // เพิ่มเข้า history
      const newHistoryItem: HistoryItem = {
        number: targetNumber,
        timestamp: new Date().toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      }
      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 10))
    }, 2000)
  }

  const handleReset = () => {
    setResult(null)
    setSelectedBall(null)
    setBalls([])
  }

  const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] as const },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] as const },
    },
  }

  const resultVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  }

  const historyItemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  }

  const ballVariants = {
    spinning: (index: number) => {
      const baseX = (Math.random() - 0.5) * 150
      const baseY = (Math.random() - 0.5) * 150
      return {
        x: [
          baseX,
          baseX + (Math.random() - 0.5) * 100,
          baseX + (Math.random() - 0.5) * 100,
          baseX,
        ],
        y: [
          baseY,
          baseY + (Math.random() - 0.5) * 100,
          baseY + (Math.random() - 0.5) * 100,
          baseY,
        ],
        rotate: [0, 180, 360, 540, 720],
        scale: [0.7, 1.1, 0.9, 1.0, 0.7],
        opacity: [0.6, 1, 0.8, 1, 0.6],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          delay: index * 0.03,
        },
      }
    },
    selected: {
      scale: 1.5,
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.5,
      },
    },
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#3024AE] via-[#C86CD7] to-[#3024AE]"
    >
      {/* Modern gradient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
      </div>

      <div className="container mx-auto px-4 py-4 relative z-10">
        {/* Top Bar / Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            {onBack && (
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                onClick={onBack}
                className="p-2 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white border-2 border-white/40 hover:border-[#C86CD7]/60 text-[#3024AE] hover:text-[#C86CD7] transition-all shadow-lg" style={{ borderRadius: '1rem' }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                สุ่มลูกบอลออกรางวัล
              </h1>
              <p className="text-sm text-white/90 mt-1">
                หมุนลูกบอลเพื่อสุ่มตัวเลข 0-9
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          {/* Ball Draw Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 relative border-2 border-white/40 shadow-xl mystical-pattern" style={{ borderRadius: '1.5rem' }}
          >
            <div className="flex flex-col items-center">
              {/* Ball Container - กล่องลูกบอล */}
              <div className="relative w-80 h-80 mb-8 rounded-2xl overflow-hidden" style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(95, 29, 178, 0.15) 100%)',
                boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.2), 0 8px 32px rgba(0, 0, 0, 0.15)',
                border: '4px solid rgba(212, 175, 55, 0.4)',
              }}>
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none z-10"></div>
                {/* Inner shadow */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none z-5"></div>
                {/* Spinning balls */}
                <AnimatePresence>
                  {isDrawing && balls.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {balls.map((ballNum, index) => (
                        <motion.div
                          key={`spinning-${index}`}
                          custom={index}
                          variants={ballVariants}
                          animate="spinning"
                          className="absolute w-16 h-16 rounded-full flex items-center justify-center z-20"
                          style={{
                            left: '50%',
                            top: '50%',
                            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(212, 175, 55, 0.9), rgba(244, 208, 63, 1))',
                            border: '3px solid rgba(255, 255, 255, 0.6)',
                            boxShadow: `
                              0 8px 16px rgba(0, 0, 0, 0.3),
                              0 0 20px rgba(212, 175, 55, 0.4),
                              inset -5px -5px 10px rgba(0, 0, 0, 0.2),
                              inset 5px 5px 10px rgba(255, 255, 255, 0.3)
                            `,
                          }}
                        >
                          <span className="text-2xl font-bold text-[#1a0a2e] drop-shadow-lg" style={{
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                          }}>
                            {ballNum}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>

                {/* Selected ball - ลูกบอลที่ถูกเลือก */}
                <AnimatePresence>
                  {selectedBall !== null && (
                    <>
                      {/* Glow effect behind ball */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.6, 0.8, 0.6]
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] blur-2xl z-10"
                        style={{
                          filter: 'blur(30px)',
                        }}
                      />
                      <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 180 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          mass: 0.5,
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full flex items-center justify-center z-20"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(212, 175, 55, 0.95), rgba(244, 208, 63, 1))',
                          border: '4px solid rgba(255, 255, 255, 0.8)',
                          boxShadow: `
                            0 0 40px rgba(212, 175, 55, 0.8),
                            0 0 80px rgba(212, 175, 55, 0.5),
                            0 12px 24px rgba(0, 0, 0, 0.4),
                            inset -8px -8px 16px rgba(0, 0, 0, 0.2),
                            inset 8px 8px 16px rgba(255, 255, 255, 0.4)
                          `,
                        }}
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 3, -3, 0]
                          }}
                          transition={{ 
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="text-5xl font-bold text-[#1a0a2e]"
                          style={{
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          {selectedBall}
                        </motion.div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Empty state - เมื่อยังไม่เริ่ม */}
                {!isDrawing && selectedBall === null && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-6xl mb-4"
                      >
                        🎱
                      </motion.div>
                      <p className="text-white/90 text-sm font-medium">
                        กดปุ่มเพื่อสุ่มลูกบอล
                      </p>
                    </div>
                  </div>
                )}

                {/* Decorative particles */}
                {isDrawing && (
                  <div className="absolute inset-0 pointer-events-none z-15">
                    {[...Array(15)].map((_, i) => {
                      const angle = (i / 15) * 360
                      const radius = 120
                      return (
                        <motion.div
                          key={i}
                          className="absolute w-3 h-3 rounded-full"
                          style={{
                            background: `radial-gradient(circle, rgba(212, 175, 55, 0.9), rgba(244, 208, 63, 0.6))`,
                            boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)',
                            left: '50%',
                            top: '50%',
                          }}
                          initial={{
                            x: 0,
                            y: 0,
                            opacity: 0,
                            scale: 0,
                          }}
                          animate={{
                            x: Math.cos((angle * Math.PI) / 180) * radius,
                            y: Math.sin((angle * Math.PI) / 180) * radius,
                            opacity: [0, 1, 0.8, 0],
                            scale: [0, 1.2, 1, 0],
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.05,
                            ease: [0.4, 0, 0.6, 1],
                          }}
                        />
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Draw Button */}
              <motion.button
                variants={buttonVariants}
                whileHover={!isDrawing ? "hover" : undefined}
                whileTap={!isDrawing ? "tap" : undefined}
                onClick={drawBall}
                disabled={isDrawing}
                className={`w-full px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg transition-all ${
                  isDrawing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-white via-[#C86CD7] to-white text-[#3024AE] mystical-glow'
                }`}
                style={{
                  backgroundSize: isDrawing ? '100% 100%' : '200% 100%',
                  animation: isDrawing ? 'none' : 'gradientShift 3s ease infinite',
                }}
              >
                {isDrawing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.div>
                    <span>กำลังสุ่ม...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🎲</span>
                    <span>สุ่มลูกบอล</span>
                  </>
                )}
              </motion.button>

              {/* Result Section */}
              <AnimatePresence mode="wait">
                {result !== null && (
                  <motion.div
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mt-6 w-full"
                  >
                    <div className="text-center">
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/40 shadow-xl" style={{ borderRadius: '1.5rem' }}>
                        <p className="text-[#3024AE] text-sm mb-2 font-medium">ตัวเลขที่ได้</p>
                        <motion.div
                          className="text-7xl font-bold text-[#3024AE] mb-4 drop-shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          style={{
                            textShadow: '0 4px 12px rgba(48, 36, 174, 0.3), 0 0 20px rgba(200, 108, 215, 0.2)',
                          }}
                        >
                          {result}
                        </motion.div>
                        <p className="text-gray-600 text-xs mb-4">
                          ให้ใช้เลขนี้อย่างมีสติ และอย่าลืมใช้วิจารณญาณ
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={handleReset}
                          className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-white via-[#C86CD7] to-white text-[#3024AE] font-bold flex items-center justify-center gap-2 text-sm transition-all mystical-glow" style={{ borderRadius: '1rem', backgroundSize: '200% 100%', animation: 'gradientShift 3s ease infinite' }}
                        >
                          <RotateCcw className="w-4 h-4" />
                          สุ่มใหม่อีกครั้ง
                        </motion.button>
                        {onNavigateHome && (
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={onNavigateHome}
                            className="w-full px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium border-2 border-white/40 hover:border-[#C86CD7]/60 flex items-center justify-center gap-2 text-sm transition-all" style={{ borderRadius: '1rem' }}
                          >
                            <Home className="w-4 h-4" />
                            กลับหน้าหลัก
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* History Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 border-2 border-white/40 shadow-xl" style={{ borderRadius: '1.5rem' }}
          >
            <h2 className="text-lg font-bold mb-4 text-[#3024AE] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3024AE]" />
              ประวัติการสุ่ม
            </h2>
            {history.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-6">
                ยังไม่มีประวัติการสุ่ม
              </p>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {history.map((item, index) => (
                    <motion.div
                      key={`${item.number}-${item.timestamp}`}
                      custom={index}
                      variants={historyItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -5 }}
                      className="bg-gradient-to-r from-[#3024AE]/20 to-[#C86CD7]/20 rounded-2xl p-3 border-2 border-[#C86CD7]/40 backdrop-blur-sm" style={{ borderRadius: '1rem' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#3024AE]">
                          {item.number}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.timestamp}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 border-2 border-white/40 shadow-xl" style={{ borderRadius: '1.5rem' }}
          >
            <p className="text-[#3024AE] text-xs leading-relaxed text-center font-medium">
              ⚠️ เกมสุ่มลูกบอลนี้สร้างขึ้นเพื่อความบันเทิงเท่านั้น ไม่รับประกันผลลอตเตอรี่ทุกกรณี กรุณาเล่นอย่างมีสติ
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

