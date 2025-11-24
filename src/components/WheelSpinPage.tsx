import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, Home, Sparkles } from 'lucide-react'

interface WheelSpinPageProps {
  onBack?: () => void
  onNavigateHome?: () => void
}

interface HistoryItem {
  number: string
  timestamp: string
}

export function WheelSpinPage({ onBack, onNavigateHome }: WheelSpinPageProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [rotation, setRotation] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  // สร้างตัวเลขสำหรับวงล้อ - รวมทั้ง 1, 2 หลัก
  // สร้างตัวเลข 0-9 (1 หลัก), 10-99 (2 หลัก)
  // ลดจำนวนตัวเลขลงเพื่อให้วงล้อสวยงามและอ่านง่ายขึ้น
  const generateWheelNumbers = (): string[] => {
    const numbers: string[] = []
    
    // เพิ่มตัวเลข 1 หลัก (0-9) - 10 ตัว
    for (let i = 0; i <= 9; i++) {
      numbers.push(i.toString())
    }
    
    // เพิ่มตัวเลข 2 หลัก (10-99) - เลือกบางตัว เช่น ทุก 10 ตัว (10, 20, 30, ...)
    // และเพิ่มเลขเด็ดบางตัว
    const specialNumbers = [11, 22, 33, 44, 55, 66, 77, 88, 99] // เลขซ้ำ
    const roundNumbers = [10, 20, 30, 40, 50, 60, 70, 80, 90] // เลขกลม
    
    // รวมเลขพิเศษ
    const allSpecial = [...new Set([...specialNumbers, ...roundNumbers])]
    allSpecial.forEach(num => {
      if (num >= 10 && num <= 99) {
        numbers.push(num.toString())
      }
    })
    
    return numbers
  }

  const numbers = generateWheelNumbers()

  // คำนวณมุมสำหรับแต่ละตัวเลข
  const anglePerNumber = 360 / numbers.length

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setResult(null)

    // สุ่มตัวเลขที่จะได้ - สุ่มจากตัวเลขที่มีในวงล้อ
    // 50% โอกาสได้ 1 หลัก, 50% โอกาสได้ 2 หลัก
    const random = Math.random()
    let candidateNumbers: string[]
    
    if (random < 0.5) {
      // 1 หลัก (0-9)
      candidateNumbers = numbers.filter(num => num.length === 1)
    } else {
      // 2 หลัก (10-99)
      candidateNumbers = numbers.filter(num => num.length === 2)
    }
    
    // ถ้าไม่มีตัวเลขในหมวดนั้น ให้สุ่มทั้งหมด
    if (candidateNumbers.length === 0) {
      candidateNumbers = numbers
    }
    
    // สุ่มตัวเลขจากตัวเลขที่เลือกไว้
    const finalNumber = candidateNumbers[Math.floor(Math.random() * candidateNumbers.length)]
    const finalIndex = numbers.findIndex(num => num === finalNumber)
    
    // คำนวณมุมที่ต้องหมุน
    // เข็มชี้อยู่ที่ตำแหน่งบนสุด (top: 0) ซึ่งตรงกับ 0 องศาใน conic-gradient
    // conic-gradient เริ่มจาก 0 องศา (บนสุด) และหมุนตามเข็มนาฬิกา
    
    // มุมของตัวเลขที่ต้องการ (ตรงกลางของส่วน) ในระบบ gradient
    // ตัวเลข index 0 อยู่ที่ 0 ถึง anglePerNumber องศา, ตรงกลาง = anglePerNumber / 2
    const targetNumberCenterAngle = finalIndex * anglePerNumber + anglePerNumber / 2
    
    // หมุนหลายรอบ (5-8 รอบ) เพื่อให้ดูน่าตื่นเต้น
    const spins = 5 + Math.random() * 3 // 5-8 รอบ
    
    // คำนวณมุมที่ต้องหมุน: 
    // - หมุนหลายรอบ (spins * 360)
    // - หมุนให้ตัวเลขที่ต้องการมาอยู่ที่ตำแหน่งบนสุด (0 องศา)
    //   เนื่องจากเข็มชี้อยู่ที่ 0 องศา (บนสุด) และเราต้องการให้ตัวเลขมาอยู่ตรงนั้น
    //   เราต้องหมุนให้ตัวเลขที่อยู่ที่ targetNumberCenterAngle มาอยู่ที่ 0 องศา
    //   ดังนั้นต้องหมุนเพิ่ม 360 - targetNumberCenterAngle
    const additionalRotation = 360 - targetNumberCenterAngle
    const totalRotation = rotation + spins * 360 + additionalRotation

    setRotation(totalRotation)

    // หลังจากหมุนเสร็จ แสดงผลลัพธ์
    setTimeout(() => {
      setResult(finalNumber)
      setIsSpinning(false)

      // เพิ่มเข้า history
      const newHistoryItem: HistoryItem = {
        number: finalNumber,
        timestamp: new Date().toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      }
      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 10))
    }, 3700) // หมุน 3.7 วินาที (ตรงกับ duration ของ animation)
  }

  const handleReset = () => {
    setResult(null)
    setRotation(0)
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
                หมุนวงล้อตัวเลข
              </h1>
              <p className="text-sm text-white/90 mt-1">
                หมุนวงล้อเพื่อสุ่มตัวเลข 0-9
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          {/* Wheel Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 relative border-2 border-white/40 shadow-xl mystical-pattern" style={{ borderRadius: '1.5rem' }}
          >
            <div className="flex flex-col items-center">
              {/* Wheel Container */}
              <div className="relative w-80 h-80 mb-8">
                {/* Glow effect when spinning */}
                {isSpinning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3],
                      scale: [0.8, 1.1, 0.8],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#F4D03F]/30 blur-2xl -z-10"
                  />
                )}
                
                {/* Pointer - เข็มชี้ */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
                  {/* Base of pointer - ฐานเข็มชี้ */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-gradient-to-b from-[#D4AF37] to-[#F4D03F] rounded-t-full shadow-lg border-2 border-white"></div>
                  {/* Arrow pointer - หัวเข็มชี้ */}
                  <div className="relative mt-4">
                    <div 
                      className="w-0 h-0 border-l-[24px] border-r-[24px] border-t-[40px] border-l-transparent border-r-transparent border-t-[#D4AF37] drop-shadow-2xl"
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.8)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                      }}
                    ></div>
                    {/* Inner highlight */}
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#F4D03F]"
                      style={{ marginTop: '4px' }}
                    ></div>
                  </div>
                </div>

                {/* Wheel */}
                <div className="relative w-full h-full">
                  <motion.div
                    ref={wheelRef}
                    className="w-full h-full rounded-full relative overflow-hidden z-10"
                    animate={{
                      rotate: rotation,
                    }}
                    transition={{
                      duration: 3.5,
                      ease: [0.23, 1, 0.32, 1], // Custom easing for smooth deceleration
                    }}
                    style={{
                      // conic-gradient เริ่มจาก 0 องศา (บนสุด) และหมุนตามเข็มนาฬิกา
                      background: 'conic-gradient(from 0deg, ' +
                        numbers.map((num, index) => {
                          const startAngle = index * anglePerNumber
                          const endAngle = (index + 1) * anglePerNumber
                          const color1 = index % 2 === 0 ? '#F4D03F' : '#D4AF37'
                          const color2 = index % 2 === 0 ? '#D4AF37' : '#F4D03F'
                          return `${color1} ${startAngle}deg ${endAngle}deg`
                        }).join(', ') +
                        ')',
                      border: '6px solid rgba(212, 175, 55, 0.8)',
                      boxShadow: `
                        0 0 40px rgba(212, 175, 55, 0.4),
                        0 12px 32px rgba(0, 0, 0, 0.3),
                        inset 0 0 60px rgba(0, 0, 0, 0.1)
                      `,
                    }}
                  >
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full pointer-events-none"></div>
                    {/* Numbers on wheel */}
                    {numbers.map((num, index) => {
                      // คำนวณมุมของตัวเลข: ตัวเลขอยู่ตรงกลางของแต่ละส่วน
                      // conic-gradient เริ่มจาก 0 องศา (บนสุด) และหมุนตามเข็มนาฬิกา
                      // ตัวเลข 0 อยู่ที่ 0-36 องศา, ตรงกลาง = 18 องศา
                      // ตัวเลข 1 อยู่ที่ 36-72 องศา, ตรงกลาง = 54 องศา
                      // ...
                      // แต่ในระบบพิกัด CSS (Math.cos/sin) 0 องศา = ขวา, 90 องศา = ล่าง, -90 องศา = บน
                      // ดังนั้นต้องแปลง: angleInGradient - 90 เพื่อให้ 0 องศาใน gradient = บนสุด
                      const angleInGradient = index * anglePerNumber + anglePerNumber / 2 // 18, 54, 90, 126, ...
                      const angleInRadians = (angleInGradient - 90) * (Math.PI / 180) // แปลงเป็นระบบพิกัด CSS
                      const radius = 140 // รัศมีจากจุดศูนย์กลาง
                      const x = Math.cos(angleInRadians) * radius
                      const y = Math.sin(angleInRadians) * radius

                      // กำหนดขนาดตัวเลขตามจำนวนหลัก
                      const digitCount = num.length
                      const fontSize = digitCount === 1 ? 'text-3xl' : 'text-2xl'

                      return (
                        <div
                          key={`${num}-${index}`}
                          className="absolute top-1/2 left-1/2"
                          style={{
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                          }}
                        >
                          <div className={`${fontSize} font-bold text-[#1a0a2e] drop-shadow-lg whitespace-nowrap`}>
                            {num}
                          </div>
                        </div>
                      )
                    })}
                  </motion.div>

                  {/* Center circle */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-white z-20 flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(212, 175, 55, 0.9), rgba(244, 208, 63, 1))',
                      boxShadow: `
                        0 0 30px rgba(212, 175, 55, 0.6),
                        0 8px 16px rgba(0, 0, 0, 0.3),
                        inset -4px -4px 8px rgba(0, 0, 0, 0.2),
                        inset 4px 4px 8px rgba(255, 255, 255, 0.3)
                      `,
                    }}
                    animate={isSpinning ? {
                      rotate: 360,
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={isSpinning ? {
                      rotate: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      scale: {
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    } : {}}
                  >
                    <Sparkles className="w-8 h-8 text-[#1a0a2e] drop-shadow-lg" />
                  </motion.div>
                </div>
              </div>

              {/* Spin Button */}
              <motion.button
                variants={buttonVariants}
                whileHover={!isSpinning ? "hover" : undefined}
                whileTap={!isSpinning ? "tap" : undefined}
                onClick={spinWheel}
                disabled={isSpinning}
                className={`w-full px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg transition-all ${
                  isSpinning
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-white via-[#C86CD7] to-white text-[#3024AE] mystical-glow'
                }`}
                style={{
                  backgroundSize: isSpinning ? '100% 100%' : '200% 100%',
                  animation: isSpinning ? 'none' : 'gradientShift 3s ease infinite',
                }}
              >
                {isSpinning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.div>
                    <span>กำลังหมุน...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🎰</span>
                    <span>หมุนวงล้อ</span>
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
                    <div className="text-center bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/40 shadow-xl" style={{ borderRadius: '1.5rem' }}>
                      <p className="text-[#3024AE] text-sm mb-2 font-medium">ตัวเลขที่ได้</p>
                      <motion.div
                        className={`${result.length === 1 ? 'text-7xl' : 'text-6xl'} font-bold text-[#3024AE] mb-4 drop-shadow-lg`}
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
                      <div className="flex flex-col gap-3">
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={handleReset}
                          className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-white via-[#C86CD7] to-white text-[#3024AE] font-bold flex items-center justify-center gap-2 text-sm transition-all mystical-glow" style={{ borderRadius: '1rem', backgroundSize: '200% 100%', animation: 'gradientShift 3s ease infinite' }}
                        >
                          <RotateCcw className="w-4 h-4" />
                          หมุนใหม่อีกครั้ง
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
              ประวัติการหมุน
            </h2>
            {history.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-6">
                ยังไม่มีประวัติการหมุน
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
              ⚠️ เกมหมุนวงล้อนี้สร้างขึ้นเพื่อความบันเทิงเท่านั้น ไม่รับประกันผลลอตเตอรี่ทุกกรณี กรุณาเล่นอย่างมีสติ
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

