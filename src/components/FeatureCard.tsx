import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay: number
  onNavigate: () => void
}

export function FeatureCard({ icon: Icon, title, description, delay, onNavigate }: FeatureCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { delay, duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] }
        }
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onNavigate}
    >
      <motion.div 
        className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 h-full transition-all duration-300 border-2 border-white/30 hover:border-[#C86CD7]/60 hover:shadow-2xl hover:shadow-[#C86CD7]/30 relative overflow-hidden group" 
        style={{ borderRadius: '1.5rem' }}
        whileHover={{ 
          y: -5,
          transition: { duration: 0.3 }
        }}
      >
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 shimmer"></div>
        </div>
        
        {/* Modern gradient glow effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#3024AE]/0 via-[#C86CD7]/0 to-transparent rounded-3xl" 
          style={{ borderRadius: '1.5rem' }}
          whileHover={{
            background: 'linear-gradient(to bottom right, rgba(48, 36, 174, 0.15), rgba(200, 108, 215, 0.15), transparent)',
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100"
          style={{ 
            borderRadius: '1.5rem',
            background: 'conic-gradient(from 0deg, transparent, rgba(200, 108, 215, 0.3), transparent)',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <div className="relative z-10">
          <div className="mb-4 flex justify-center">
            <motion.div 
              className="p-4 rounded-2xl bg-gradient-to-br from-[#3024AE]/20 via-[#C86CD7]/20 to-[#3024AE]/20 border-2 border-[#C86CD7]/40 relative" 
              style={{ borderRadius: '1rem' }}
              whileHover={{ 
                scale: 1.15, 
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.3 }
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute inset-0 rounded-2xl border border-[#C86CD7]/30" 
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(200, 108, 215, 0.2), transparent)',
                }}
              />
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Icon className="w-7 h-7 text-[#3024AE] relative z-10" style={{ filter: 'drop-shadow(0 0 8px rgba(48, 36, 174, 0.5))' }} />
              </motion.div>
            </motion.div>
          </div>
          
          <motion.h3 
            className="text-lg font-bold text-[#3024AE] mb-2 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.h3>
          
          <p className="text-gray-700 text-sm text-center leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

