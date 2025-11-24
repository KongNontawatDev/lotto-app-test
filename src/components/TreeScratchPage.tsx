import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Home, RotateCcw, Sparkles } from 'lucide-react'

interface TreeScratchPageProps {
  onBack?: () => void
  onNavigateHome?: () => void
}

interface ScratchNumber {
  digit: string
  position: { x: number; y: number }
  revealProgress: number // 0-1 for animation
  isRevealing: boolean
}

const NUMBER_MEANINGS: Record<string, string> = {
  '0': 'เลขศูนย์ หมายถึงความสมบูรณ์และความว่างเปล่า',
  '1': 'เลขหนึ่ง หมายถึงความเป็นหนึ่ง ความเป็นผู้นำ',
  '2': 'เลขสอง หมายถึงความสมดุล ความเป็นคู่',
  '3': 'เลขสาม หมายถึงความมั่นคง สามเส้า',
  '4': 'เลขสี่ หมายถึงความแข็งแกร่ง ความมั่นคง',
  '5': 'เลขห้า หมายถึงการเปลี่ยนแปลง ความหลากหลาย',
  '6': 'เลขหก หมายถึงความสมบูรณ์ ความราบรื่น',
  '7': 'เลขเจ็ด หมายถึงโชคลาภ ความเป็นมงคล',
  '8': 'เลขแปด หมายถึงความเจริญรุ่งเรือง ความอุดมสมบูรณ์',
  '9': 'เลขเก้า หมายถึงความสมบูรณ์แบบ ความสำเร็จ',
}

export function TreeScratchPage({ onBack, onNavigateHome }: TreeScratchPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [scratchProgress, setScratchProgress] = useState(0)
  const [revealedNumbers, setRevealedNumbers] = useState<ScratchNumber[]>([])
  const [finalNumbers, setFinalNumbers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [treeImage, setTreeImage] = useState<HTMLImageElement | null>(null)
  const particlesRef = useRef<Array<{ x: number; y: number; opacity: number; size: number; vy: number; vx: number }>>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const scratchCountRef = useRef(0) // Track number of scratch actions
  const lastScratchTimeRef = useRef(0) // Track timing for realistic reveal
  const revealingNumberRef = useRef(false) // Prevent multiple reveals at once
  const revealedNumbersRef = useRef<ScratchNumber[]>([]) // Ref for smooth animation
  const targetNumberCountRef = useRef(Math.random() < 0.5 ? 2 : 3) // Random number of digits to reveal (2 or 3)

  // Load tree image
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = 'https://cdn.cizucu.com/images/photos/lj8GnjtlT9TSd8h74Er6.jpg?auto=format%2Ccompress&fit=max&w=1536&q=90'
    img.onload = () => {
      setTreeImage(img)
    }
    img.onerror = () => {
      console.error('Failed to load tree image')
    }
  }, [])

  // Sync revealedNumbers state to ref for smooth animation
  useEffect(() => {
    revealedNumbersRef.current = revealedNumbers
  }, [revealedNumbers])

  // Continuous animation loop for number reveals - only animate the latest number
  useEffect(() => {
    let animationFrameId: number | undefined
    
    const animateNumbers = () => {
      // Find the latest number that is still revealing
      const numbers = revealedNumbersRef.current
      if (numbers.length === 0) {
        animationFrameId = requestAnimationFrame(animateNumbers)
        return
      }
      
      // Find the last index that is still revealing
      let latestRevealingIndex = -1
      for (let i = numbers.length - 1; i >= 0; i--) {
        if (numbers[i].isRevealing && numbers[i].revealProgress < 1) {
          latestRevealingIndex = i
          break
        }
      }
      
      // Only animate the latest revealing number
      if (latestRevealingIndex >= 0) {
        revealedNumbersRef.current = revealedNumbersRef.current.map((num, index) => {
          if (index === latestRevealingIndex) {
            // Animate only the latest number
            const newProgress = Math.min(1, num.revealProgress + 0.03) // Smooth increment
            return {
              ...num,
              revealProgress: newProgress,
              isRevealing: newProgress < 1,
            }
          } else {
            // Ensure all other numbers are fully revealed and not animating
            return {
              ...num,
              revealProgress: 1,
              isRevealing: false,
            }
          }
        })
      } else {
        // Ensure all numbers are fully revealed
        revealedNumbersRef.current = revealedNumbersRef.current.map((num) => ({
          ...num,
          revealProgress: 1,
          isRevealing: false,
        }))
      }
      
      // Always continue animation loop to check for new numbers
      animationFrameId = requestAnimationFrame(animateNumbers)
    }
    
    // Start continuous animation loop
    animationFrameId = requestAnimationFrame(animateNumbers)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, []) // Empty dependency - run once and continue forever

  // Initialize canvas - only depends on treeImage, not revealedNumbers
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !treeImage) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Draw tree background
    drawTree(ctx, canvas.width, canvas.height)

    // Animation loop for particles - smooth and continuous
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawTree(ctx, canvas.width, canvas.height)
      updateAndDrawParticles(ctx)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    // Start animation after a short delay to ensure image is loaded
    const timeoutId = setTimeout(() => {
      animate()
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [treeImage]) // Removed revealedNumbers dependency to prevent restart

  const drawTree = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!treeImage) return

    // Draw tree image to fill canvas while maintaining aspect ratio
    const imgAspect = treeImage.width / treeImage.height
    const canvasAspect = width / height

    let drawWidth = width
    let drawHeight = height
    let drawX = 0
    let drawY = 0

    if (imgAspect > canvasAspect) {
      // Image is wider, fit to height
      drawHeight = height
      drawWidth = height * imgAspect
      drawX = (width - drawWidth) / 2
    } else {
      // Image is taller, fit to width
      drawWidth = width
      drawHeight = width / imgAspect
      drawY = (height - drawHeight) / 2
    }

    ctx.drawImage(treeImage, drawX, drawY, drawWidth, drawHeight)
  }

  const updateAndDrawParticles = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Draw all particles - keep them fixed at their original position (like a drawing)
    particlesRef.current.forEach((particle) => {
      // Don't update position - keep particles fixed where they were drawn
      // This creates a permanent drawing effect

      // Draw particle with very light glow effect (much more transparent)
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      )
      // Very light opacity - much more subtle
      gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity * 0.15})`)
      gradient.addColorStop(0.3, `rgba(255, 255, 255, ${particle.opacity * 0.08})`)
      gradient.addColorStop(0.6, `rgba(255, 255, 255, ${particle.opacity * 0.04})`)
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw revealed numbers on canvas with animation - use ref for smooth rendering
    revealedNumbersRef.current.forEach((num) => {
      const x = num.position.x
      const y = num.position.y
      const progress = Math.max(0.1, num.revealProgress) // Minimum visibility
      const scale = 0.5 + (progress * 0.5) // Scale from 0.5 to 1.0
      const alpha = progress * 0.5 // Fade in from 0 to 0.5 (จางลง)

      ctx.save()
      
      // Animated scale effect
      ctx.translate(x, y)
      ctx.scale(scale, scale)
      ctx.translate(-x, -y)
      
      // Draw number without glow effects
      ctx.globalAlpha = alpha
      
      // Simple shadow for better visibility (no glow)
      ctx.shadowColor = `rgba(0, 0, 0, ${alpha * 0.3})`
      ctx.shadowBlur = 3
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      
      // Draw number with light brown color to blend with tree
      ctx.fillStyle = 'rgba(139, 111, 71, 0.8)' // Light brown
      ctx.font = 'bold 32px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(num.digit, x, y)
      
      ctx.restore()
    })
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true)
    handleScratch(e)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      handleScratch(e)
    }
  }

  const handleMouseUp = () => {
    setIsScratching(false)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsScratching(true)
    handleScratchTouch(e)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      handleScratchTouch(e)
    }
  }

  const handleTouchEnd = () => {
    setIsScratching(false)
  }

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    addParticle(x, y)
    updateScratchProgress()
  }

  const handleScratchTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    addParticle(x, y)
    updateScratchProgress()
  }

  const addParticle = (x: number, y: number) => {
    // Add more particles for realistic flour effect
    // Particles are created at fixed positions and stay there (like drawing)
    for (let i = 0; i < 20; i++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 50, // Wider spread for more realistic effect
        y: y + (Math.random() - 0.5) * 50,
        opacity: Math.random() * 0.2 + 0.15, // Slightly more visible
        size: Math.random() * 10 + 5, // Varied sizes
        vy: 0, // No movement - particles stay fixed
        vx: 0, // No movement - particles stay fixed
      })
    }

    // Keep all particles - they stay forever like a drawing
    // Only limit for performance (can increase if needed)
    if (particlesRef.current.length > 3000) {
      // Remove oldest particles if too many
      particlesRef.current = particlesRef.current.slice(-3000)
    }

    // Gradually increase opacity of existing particles in area (but keep it very light)
    particlesRef.current.forEach((p) => {
      const distance = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2))
      if (distance < 120) {
        p.opacity = Math.min(0.4, p.opacity + 0.03) // Slightly more visible when overlapping
      }
    })

    // Increment scratch count for timing-based reveals
    scratchCountRef.current += 1
    const currentTime = Date.now()
    const timeSinceLastScratch = currentTime - lastScratchTimeRef.current
    lastScratchTimeRef.current = currentTime

    // Reveal numbers based on scratch count and timing (more realistic)
    // First number appears after ~30 scratches
    // Second number appears after ~90 more scratches (total 90)
    // Third number appears after ~150 more scratches (total 150) - only if target is 3
    const targetCount = targetNumberCountRef.current
    if (!revealingNumberRef.current) {
      if (revealedNumbers.length === 0 && scratchCountRef.current >= 30) {
        revealingNumberRef.current = true
        revealNumber(x, y)
      } else if (revealedNumbers.length === 1 && scratchCountRef.current >= 90) {
        // Only reveal second number if target is 2 or 3
        if (targetCount >= 2) {
          revealingNumberRef.current = true
          revealNumber(x, y)
        }
      } else if (revealedNumbers.length === 2 && scratchCountRef.current >= 150) {
        // Only reveal third number if target is 3
        if (targetCount >= 3) {
          revealingNumberRef.current = true
          revealNumber(x, y)
        }
      }
    }
  }

  const revealNumber = (x: number, y: number) => {
    const digit = Math.floor(Math.random() * 10).toString()
    const newNumber: ScratchNumber = {
      digit,
      position: { x, y },
      revealProgress: 0,
      isRevealing: true,
    }
    
    // Add number with slight delay for suspense
    setTimeout(() => {
      setRevealedNumbers((prev) => {
        revealingNumberRef.current = false // Reset flag after adding
        const updated = [...prev, newNumber]
        revealedNumbersRef.current = updated // Sync ref immediately
        return updated
      })
    }, 300)
  }

  const updateScratchProgress = () => {
    setScratchProgress((prev) => {
      const targetCount = targetNumberCountRef.current
      // Progress based on scratch count and target number count
      // For 2 numbers: complete at ~90 scratches
      // For 3 numbers: complete at ~150 scratches
      const maxScratches = targetCount === 2 ? 90 : 150
      const baseProgress = Math.min(100, (scratchCountRef.current / maxScratches) * 100)
      const newProgress = Math.max(prev, baseProgress)

      // When complete, show final result
      if (newProgress >= 100 && !isComplete && revealedNumbers.length === targetCount) {
        setIsComplete(true)
        const final = revealedNumbers.map(n => n.digit)
        setFinalNumbers(final)
        // Wait a bit for last number animation to complete
        setTimeout(() => setShowResult(true), 1000)
      }

      return newProgress
    })
  }

  const handleReset = () => {
    setScratchProgress(0)
    setRevealedNumbers([])
    setFinalNumbers([])
    setShowResult(false)
    setIsComplete(false)
    // Reset scratch counters
    scratchCountRef.current = 0
    lastScratchTimeRef.current = 0
    revealingNumberRef.current = false
    revealedNumbersRef.current = [] // Reset ref
    // Randomize target number count (2 or 3)
    targetNumberCountRef.current = Math.random() < 0.5 ? 2 : 3
    // Clear all particles - reset the drawing
    particlesRef.current = []
    
    // Redraw tree
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawTree(ctx, canvas.width, canvas.height)
      }
    }
  }

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.17, 0.67, 0.83, 0.67] as const },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.17, 0.67, 0.83, 0.67] as const },
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="p-2 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white border-2 border-white/40 hover:border-[#C86CD7]/60 text-[#3024AE] hover:text-[#C86CD7] transition-all shadow-lg" style={{ borderRadius: '1rem' }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                ถูขอหวย
              </h1>
              <p className="text-sm text-white/90 mt-1">
                ถูต้นไม้ด้วยแป้งเพื่อเปิดเผยเลขมงคล
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scratch Canvas */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 mb-4 border-2 border-white/40 shadow-xl" style={{ borderRadius: '1.5rem' }}
        >
          <div className="relative">
            <div className="relative w-full h-64 rounded-xl overflow-hidden bg-slate-900/50">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full h-full cursor-crosshair touch-none"
                style={{ backgroundColor: '#0f172a' }}
              />
              
              {/* Loading indicator */}
              {!treeImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 border-2 border-[#5F1DB2] border-t-transparent rounded-full mx-auto mb-2"
                    />
                    <p className="text-xs text-gray-700">กำลังโหลดภาพต้นไม้...</p>
                  </div>
                </div>
              )}

              {/* Instructions overlay */}
              {treeImage && scratchProgress === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-2 left-0 right-0 text-center pointer-events-none"
                >
                  <p className="text-xs text-[#3024AE] bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full inline-block border-2 border-[#C86CD7]/40 font-medium shadow-sm">
                    👆 ถูต้นไม้เพื่อเปิดเผยเลขมงคล
                  </p>
                </motion.div>
              )}
            </div>

            {/* Progress Indicator */}
            {scratchProgress > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3"
              >
                <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#3024AE]" />
                    ความคืบหน้า
                  </span>
                  <span className="font-semibold text-[#3024AE]">{Math.round(scratchProgress)}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scratchProgress}%` }}
                    className="h-full bg-gradient-to-r from-[#3024AE] via-[#C86CD7] to-[#3024AE] rounded-full"
                    style={{ 
                      backgroundSize: '200% 100%',
                      animation: 'gradientShift 2s ease infinite'
                    }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Result Section */}
        <AnimatePresence>
          {showResult && finalNumbers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 mb-4 border-2 border-white/40 shadow-xl" style={{ borderRadius: '1.5rem' }}
            >
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-[#3024AE] mb-3 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#3024AE]" />
                  เลขที่ได้จากการถู
                </h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {finalNumbers.map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#3024AE] to-[#C86CD7] rounded-2xl text-white font-bold text-2xl mystical-glow border-2 border-white/50" 
                      style={{ borderRadius: '1rem', boxShadow: '0 0 20px rgba(200, 108, 215, 0.6)' }}
                    >
                      {digit}
                    </motion.div>
                  ))}
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/40 shadow-xl mb-4" style={{ borderRadius: '1.5rem' }}>
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
                    {finalNumbers.join('')}
                  </motion.p>
                </div>
              </div>

              {/* Meanings */}
              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-semibold text-[#3024AE] mb-2">ความหมายของเลข:</h3>
                {finalNumbers.map((digit, index) => (
                  <div key={index} className="bg-gradient-to-r from-[#3024AE]/20 to-[#C86CD7]/20 rounded-2xl p-3 border-2 border-[#C86CD7]/40 backdrop-blur-sm" style={{ borderRadius: '1rem' }}>
                    <p className="text-xs text-gray-700">
                      <span className="font-bold text-[#3024AE]">{digit}</span>: {NUMBER_MEANINGS[digit]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-white via-[#C86CD7] to-white text-[#3024AE] font-bold flex items-center justify-center gap-2 text-sm transition-all mystical-glow" style={{ borderRadius: '1rem', backgroundSize: '200% 100%', animation: 'gradientShift 3s ease infinite' }}
                >
                  <RotateCcw className="w-4 h-4" />
                  ถูใหม่
                </motion.button>
                {onNavigateHome && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                        onClick={onNavigateHome}
                        className="w-full px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white text-[#3024AE] font-medium border-2 border-white/40 hover:border-[#C86CD7]/60 flex items-center justify-center gap-2 text-sm transition-all shadow-lg" style={{ borderRadius: '1rem' }}
                      >
                    <Home className="w-4 h-4" />
                    กลับหน้าหลัก
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions & Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg"
        >
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-lg">💡</span>
              <div className="flex-1">
                <p className="text-gray-900 text-xs font-medium mb-1">วิธีใช้งาน</p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  ใช้เมาส์หรือนิ้วถูไปบนต้นไม้เพื่อเปิดเผยเลขมงคล แป้งจะลอยขึ้นและคงอยู่บนต้นไม้
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-gray-600 text-xs leading-relaxed text-center">
                ⚠️ เลขที่ได้จากการถูนี้สร้างขึ้นเพื่อความบันเทิงเท่านั้น กรุณาใช้วิจารณญาณ
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

