import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, RotateCcw, Home } from 'lucide-react'

interface LuckyIncensePageProps {
  onBack?: () => void
  onNavigateHome?: () => void
}

interface HistoryItem {
  numbers: string
  timestamp: string
}

export function LuckyIncensePage({ onBack, onNavigateHome }: LuckyIncensePageProps) {
  const [candleLit, setCandleLit] = useState(false)
  const [incenseLeftLit, setIncenseLeftLit] = useState(false)
  const [incenseRightLit, setIncenseRightLit] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [leftDigit, setLeftDigit] = useState<string | null>(null)
  const [rightDigit, setRightDigit] = useState<string | null>(null)
  const [candleDigit, setCandleDigit] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isRevealing, setIsRevealing] = useState(false)
  const hasRevealedRef = useRef(false)

  const generateNumbers = (): string => {
    // สุ่มจำนวนหลัก 2-3 ตัว (สุ่มให้ได้ทั้ง 2 และ 3 หลัก)
    // Math.random() จะได้ค่า 0-1, คูณ 2 จะได้ 0-2, floor จะได้ 0 หรือ 1, +2 จะได้ 2 หรือ 3
    const digitCount = Math.random() < 0.5 ? 2 : 3 // สุ่ม 50% โอกาสได้ 2 หลัก, 50% โอกาสได้ 3 หลัก
    let numbers = ''
    for (let i = 0; i < digitCount; i++) {
      numbers += Math.floor(Math.random() * 10).toString()
    }
    return numbers
  }

  const handleLightCandle = () => {
    if (candleLit || isRevealing) return
    setCandleLit(true)
  }

  const handleLightIncense = (side: 'left' | 'right') => {
    if (isRevealing) return
    if (side === 'left' && incenseLeftLit) return
    if (side === 'right' && incenseRightLit) return

    if (side === 'left') {
      setIncenseLeftLit(true)
    } else {
      setIncenseRightLit(true)
    }
  }

  // Check if 2 items are lit and start revealing numbers
  useEffect(() => {
    const litCount = [candleLit, incenseLeftLit, incenseRightLit].filter(Boolean).length
    if (litCount === 2 && !isRevealing && !hasRevealedRef.current) {
      // ต้องจุดครบ 2 จุดก่อน และยังไม่เคยแสดงผล
      hasRevealedRef.current = true
      setIsRevealing(true)
      setResult(null)

      // ปิดเสียง background music ชั่วคราว
      if (window.backgroundMusic) {
        window.backgroundMusic.pause()
      }

      // เล่นเสียงพร
      const blessingAudio = new Audio('/sound/give-a-blessing1.mp3')
      blessingAudio.volume = 0.7
      
      // เมื่อเสียงพรเล่นเสร็จ ให้เปิดเสียง background music กลับมา
      blessingAudio.addEventListener('ended', () => {
        if (window.backgroundMusic) {
          window.backgroundMusic.play().catch(() => {})
        }
      })
      
      blessingAudio.play().catch((error) => {
        console.log('Could not play blessing sound:', error)
        // ถ้าเล่นไม่ได้ ให้เปิดเสียง background music กลับมาทันที
        if (window.backgroundMusic) {
          window.backgroundMusic.play().catch(() => {})
        }
      })

      // Generate numbers first
      const newNumbers = generateNumbers()

      // แบ่งตัวเลขไปแสดงที่แต่ละจุด (จุดละ 1 หลัก)
      const digitCount = newNumbers.length
      const digits = newNumbers.split('')
      
      // กำหนดว่าตัวเลขไหนไปจุดไหน (เรียงตามลำดับคงที่: ซ้าย, ขวา, เทียน)
      // เพื่อให้ตัวเลขที่แสดงตรงกับลำดับของ newNumbers เสมอ
      const litItems: Array<'left' | 'right' | 'candle'> = []
      if (incenseLeftLit) litItems.push('left')
      if (incenseRightLit) litItems.push('right')
      if (candleLit) litItems.push('candle')
      
      // แสดงตัวเลขทีละตัวที่แต่ละจุด (ตามลำดับตัวเลขที่สุ่มมา)
      // ถ้ามีตัวเลขมากกว่าจุดที่จุด ให้แสดงตัวเลขที่เหลือที่จุดแรก (ต่อท้าย)
      let currentIndex = 0
      
      // เก็บตัวเลขที่แสดงที่แต่ละจุด (เพื่อแสดงหลายตัวที่จุดเดียวกัน)
      const digitsByItem: { left: string[], right: string[], candle: string[] } = {
        left: [],
        right: [],
        candle: []
      }
      
      const showNextDigit = () => {
        if (currentIndex < digitCount) {
          const digit = digits[currentIndex]
          
          // กำหนดว่าตัวเลขนี้จะไปจุดไหน
          // ใช้ modulo เพื่อวนกลับมาที่จุดแรกถ้ามีตัวเลขมากกว่าจุดที่จุด
          const targetItemIndex = currentIndex % litItems.length
          const targetItem = litItems[targetItemIndex]
          
          // เพิ่มตัวเลขเข้าไปในจุดที่กำหนด
          digitsByItem[targetItem].push(digit)
          
          // แสดงตัวเลขทั้งหมดที่จุดนั้น (รวมตัวเลขที่เพิ่มเข้ามา)
          if (targetItem === 'left') {
            setLeftDigit(digitsByItem.left.join(''))
          } else if (targetItem === 'right') {
            setRightDigit(digitsByItem.right.join(''))
          } else if (targetItem === 'candle') {
            setCandleDigit(digitsByItem.candle.join(''))
          }
          
          currentIndex++
          
          if (currentIndex < digitCount) {
            setTimeout(showNextDigit, 800)
          } else {
            // แสดงผลครบทุกตัวแล้ว
            setTimeout(() => {
              // ใช้ตัวเลขที่สุ่มมา (newNumbers) - ตัวเลขนี้ตรงกับที่แสดงที่เทียนและเทียน
              setResult(newNumbers)
              setIsRevealing(false)

              // Add to history - ใช้ newNumbers ที่ตรงกับตัวเลขที่แสดง
              const newHistoryItem: HistoryItem = {
                numbers: newNumbers,
                timestamp: new Date().toLocaleTimeString('th-TH', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }),
              }
              setHistory((prev) => [newHistoryItem, ...prev].slice(0, 10)) // Keep max 10 items
            }, 800)
          }
        }
      }
      
      setTimeout(showNextDigit, 1000) // Initial delay before showing first digit
    }
  }, [candleLit, incenseLeftLit, incenseRightLit, isRevealing])

  // Cleanup: เปิดเสียง background music กลับมาเมื่อออกจากหน้า
  useEffect(() => {
    return () => {
      if (window.backgroundMusic) {
        window.backgroundMusic.play().catch(() => {})
      }
    }
  }, [])

  const handleReset = () => {
    setCandleLit(false)
    setIncenseLeftLit(false)
    setIncenseRightLit(false)
    setResult(null)
    setLeftDigit(null)
    setRightDigit(null)
    setCandleDigit(null)
    setIsRevealing(false)
    hasRevealedRef.current = false
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.17, 0.67, 0.83, 0.67] as const,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 },
    },
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

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
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
                จุดเทียนขอเลข
              </h1>
              <p className="text-sm text-white/90 mt-1">
                ตั้งจิตอธิษฐาน แล้วให้ดวงนำทางคุณ
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          {/* Main Ritual Section */}
          <div className="space-y-4">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 relative border-2 border-white/40 shadow-xl mystical-pattern" style={{ borderRadius: '1.5rem' }}
            >
              {/* Altar Area with Incense and Candle */}
              <div className="relative min-h-[440px] flex flex-col items-center justify-end pb-4" style={{ position: 'relative' }}>
                {/* Buddha Statue - Behind Candle */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0" style={{ width: '100%', maxWidth: '600px', height: '100%' }}>
                  {/* Background image for Buddha */}
                  <div 
                    className="absolute inset-0 rounded-2xl overflow-hidden"
                    style={{
                      backgroundImage: 'url(/image/bg.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      opacity: 0.5,
                      filter: 'blur(4px) brightness(0.7)',
                      zIndex: 0
                    }}
                  />
                  <motion.img
                    src="/image/Buddha-statue.png"
                    alt="Buddha"
                    className="w-72 h-auto object-contain opacity-50 relative z-10 mx-auto"
                    style={{ position: 'relative', zIndex: 1 }}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.4 }}
                    transition={{ duration: 1 }}
                  />
                </div>

                {/* Incense Burners - Left and Right */}
                <div className="absolute bottom-8 left-4 right-4 flex justify-between items-end z-10">
                  {/* Left Incense */}
                  <motion.div
                    className="relative cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLightIncense('left')}
                  >
                    <img
                      src="/image/Incense-burner.png"
                      alt="Incense Burner Left"
                      className={`w-28 h-28 object-contain drop-shadow-lg transition-all ${
                        incenseLeftLit ? 'brightness-110' : ''
                      }`}
                    />
                    {/* Smoke effect for left incense */}
                    <AnimatePresence>
                      {incenseLeftLit && (
                        <>
                          {/* Main smoke layer */}
                          <motion.div
                            initial={{ opacity: 0, y: 0, scale: 0.3 }}
                            animate={{
                              opacity: [0.6, 0.9, 0.6],
                              y: [0, -150, -150],
                              scale: [0.3, 0.8, 1, 1.1, 1],
                              x: [-5, 5, -5],
                              rotate: [-2, 2, -2],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10"
                          >
                            <img
                              src="/image/smoke.png"
                              alt="Smoke"
                              className="w-36 h-48 object-contain"
                            />
                          </motion.div>
                          {/* Secondary smoke layer - faint and floating */}
                          <motion.div
                            initial={{ opacity: 0, y: 0, scale: 0.2 }}
                            animate={{
                              opacity: [0.2, 0.4, 0.2],
                              y: [0, -180, -180],
                              scale: [0.2, 0.8, 1.2, 1.4, 1.2],
                              x: [-8, 8, -8],
                              rotate: [-3, 3, -3],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5,
                            }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-9"
                          >
                            <img
                              src="/image/smoke.png"
                              alt="Smoke"
                              className="w-40 h-56 object-contain"
                            />
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                    {/* Numbers display on left incense */}
                    {leftDigit && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none"
                        style={{ zIndex: 30 }}
                      >
                        <div className="text-3xl font-bold text-white drop-shadow-lg">
                          {leftDigit}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Right Incense */}
                  <motion.div
                    className="relative cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLightIncense('right')}
                  >
                    <img
                      src="/image/Incense-burner.png"
                      alt="Incense Burner Right"
                      className={`w-28 h-28 object-contain drop-shadow-lg transition-all ${
                        incenseRightLit ? 'brightness-110' : ''
                      }`}
                    />
                    {/* Smoke effect for right incense */}
                    <AnimatePresence>
                      {incenseRightLit && (
                        <>
                          {/* Main smoke layer */}
                          <motion.div
                            initial={{ opacity: 0, y: 0, scale: 0.3 }}
                            animate={{
                              opacity: [0.6, 0.9, 0.6],
                              y: [0, -150, -150],
                              scale: [0.3, 0.8, 1, 1.1, 1],
                              x: [5, -5, 5],
                              rotate: [2, -2, 2],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10"
                          >
                            <img
                              src="/image/smoke.png"
                              alt="Smoke"
                              className="w-36 h-48 object-contain"
                            />
                          </motion.div>
                          {/* Secondary smoke layer - faint and floating */}
                          <motion.div
                            initial={{ opacity: 0, y: 0, scale: 0.2 }}
                            animate={{
                              opacity: [0.2, 0.4, 0.2],
                              y: [0, -180, -180],
                              scale: [0.2, 0.8, 1.2, 1.4, 1.2],
                              x: [8, -8, 8],
                              rotate: [3, -3, 3],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5,
                            }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-9"
                          >
                            <img
                              src="/image/smoke.png"
                              alt="Smoke"
                              className="w-40 h-56 object-contain"
                            />
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                    {/* Numbers display on right incense */}
                    {rightDigit && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none"
                        style={{ zIndex: 30 }}
                      >
                        <div className="text-3xl font-bold text-white drop-shadow-lg">
                          {rightDigit}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Candle - Center Bottom */}
                <motion.div
                  className="relative cursor-pointer z-10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLightCandle}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{ 
                    width: '96px', // w-24 = 96px
                    height: '144px', // h-36 = 144px
                    display: 'inline-block',
                    verticalAlign: 'bottom',
                    flexShrink: 0
                  }}
                >
                  <div 
                    style={{ 
                      position: 'relative',
                      width: '96px',
                      height: '144px',
                      overflow: 'visible'
                    }}
                  >
                    <img
                      src="/image/candle.png"
                      alt="Candle"
                      className={`w-24 h-36 object-contain drop-shadow-lg transition-all ${
                        candleLit ? 'brightness-110' : ''
                      }`}
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '96px',
                        height: '144px',
                        zIndex: 1,
                        display: 'block',
                        pointerEvents: 'none'
                      }}
                    />
                    
                    {/* Fire effect when candle is lit */}
                    <AnimatePresence>
                      {candleLit && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            position: 'absolute',
                            top: '-95px', // -translate-y-24 = -96px
                            left: '10px', // ขยับไปทางซ้าย (จาก 48px เป็น 40px)
                            transform: 'translateX(-50%)',
                            width: '80px', // w-20
                            height: '96px', // h-24
                            pointerEvents: 'none',
                            zIndex: 10
                          }}
                        >
                          <img
                            src="/image/fire.gif"
                            alt="Fire"
                            style={{ 
                              width: '100%', 
                              height: '100%',
                              objectFit: 'contain'
                            }}
                          />
                          {/* Smoke from candle */}
                          <motion.div
                            initial={{ opacity: 0, y: 0, scale: 0.8 }}
                            animate={{
                              opacity: [0.6, 0.9, 0.6],
                              y: -100,
                              scale: [1, 1.15, 1],
                              x: [-3, 3, -3],
                              rotate: [-1.5, 1.5, -1.5],
                            }}
                            transition={{
                              delay: 0.2,
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              pointerEvents: 'none',
                              zIndex: 0
                            }}
                          >
                            <img
                              src="/image/smoke.png"
                              alt="Smoke"
                              className="w-40 h-56 object-contain"
                            />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Numbers display on candle */}
                    {candleDigit && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                          position: 'absolute',
                          bottom: '32px', // bottom-8 = 32px
                          left: '48px', // ตรงกลาง
                          transform: 'translateX(-50%)',
                          pointerEvents: 'none',
                          zIndex: 30,
                          willChange: 'opacity, transform'
                        }}
                      >
                        <div className="text-3xl font-bold text-white whitespace-nowrap drop-shadow-lg">
                          {candleDigit}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Instruction Text - Fixed position to prevent layout shift */}
                <div 
                  className="text-gray-600 text-sm mt-4 text-center"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    minHeight: '40px', // Reserve space to prevent layout shift
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* {!isRevealing && !candleLit && !incenseLeftLit && !incenseRightLit && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-2xl" style={{ borderRadius: '1rem' }}
                    >
                      <p className="text-white font-medium">กดที่เทียนหรือเทียนเพื่อจุดไฟ</p>
                    </motion.div>
                  )} */}
                </div>
              </div>

              {/* Result Section - Show result in history */}
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <div className="text-center bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/40 shadow-xl" style={{ borderRadius: '1.5rem' }}>
                      <p className="text-[#3024AE] text-sm mb-2 font-medium">ตัวเลขที่ได้</p>
                      <motion.p 
                        className="text-5xl font-bold mb-2 drop-shadow-lg text-[#3024AE]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        style={{ 
                          textShadow: '0 4px 12px rgba(48, 36, 174, 0.3), 0 0 20px rgba(200, 108, 215, 0.2)'
                        }}
                      >
                        {result}
                      </motion.p>
                      <p className="text-gray-600 text-xs mb-6">
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
            </motion.div>
          </div>

          {/* History Section */}
          <div className="space-y-4">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 border-2 border-white/40 shadow-xl" style={{ borderRadius: '1.5rem' }}
            >
              <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3024AE]" />
                ประวัติเลขที่เคยจุด
              </h2>
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">
                  ยังไม่มีประวัติการจุดเทียน
                </p>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {history.map((item, index) => (
                      <motion.div
                        key={`${item.numbers}-${item.timestamp}`}
                        custom={index}
                        variants={historyItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -5 }}
                        className="bg-gradient-to-r from-[#3024AE]/20 to-[#C86CD7]/20 rounded-2xl p-3 border-2 border-[#C86CD7]/40 backdrop-blur-sm" style={{ borderRadius: '1rem' }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-[#3024AE]">
                            {item.numbers}
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
              <p className="text-gray-600 text-xs leading-relaxed text-center">
                ⚠️ เลขที่ได้จากการจุดเทียนนี้สร้างขึ้นเพื่อความบันเทิงเท่านั้น ไม่รับประกันผลลอตเตอรี่ทุกกรณี กรุณาเล่นอย่างมีสติ
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

