import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Moon, Star, Cloud, Sparkles, Calendar, RefreshCw, Home } from 'lucide-react'

export const Route = createFileRoute('/dream')({
  component: DreamToNumbersPage,
})

// Types
interface DreamData {
  id: string
  dreamText: string
  category: string
  dreamDate?: string
  numbers: {
    twoDigits: string[]
    threeDigits: string[]
  }
  prediction: string
  timestamp: number
}

interface DreamDictionaryItem {
  keyword: string
  emoji: string
  numbers: string[]
  description: string
  detailedAnalysis?: string
  luckyNumbers?: string[]
  warnings?: string[]
}

// Dream Dictionary Data - เพิ่มความละเอียดและความหมายมากขึ้น
const DREAM_DICTIONARY: DreamDictionaryItem[] = [
  { 
    keyword: 'งู', 
    emoji: '🐍', 
    numbers: ['1', '5', '15', '51'], 
    description: 'งูเป็นสัตว์มงคลในความเชื่อไทย หมายถึงการเปลี่ยนแปลง การเริ่มต้นใหม่ ความรอบรู้ และปัญญา ฝันเห็นงูสีทองหมายถึงโชคลาภ งูเขียวหมายถึงสุขภาพดี งูใหญ่หมายถึงอำนาจและความสำเร็จ' 
  },
  { 
    keyword: 'น้ำ', 
    emoji: '💧', 
    numbers: ['2', '7', '27', '72'], 
    description: 'น้ำหมายถึงความอุดมสมบูรณ์ ความบริสุทธิ์ การชำระล้าง และการไหลเวียนของโชคลาภ น้ำใสหมายถึงความโชคดี น้ำไหลหมายถึงเงินทองไหลมา น้ำท่วมหมายถึงโชคลาภมากมาย' 
  },
  { 
    keyword: 'คนตาย', 
    emoji: '👻', 
    numbers: ['4', '7', '47', '74'], 
    description: 'ฝันเห็นคนตายหรือผู้ล่วงลับมักเป็นลางดี หมายถึงการได้รับพรจากบรรพบุรุษ การแก้ไขปัญหา และการเริ่มต้นใหม่ คนตายยิ้มหมายถึงโชคดี คนตายให้ของหมายถึงทรัพย์สมบัติ' 
  },
  { 
    keyword: 'เด็ก', 
    emoji: '👶', 
    numbers: ['3', '9', '39', '93'], 
    description: 'เด็กหมายถึงความบริสุทธิ์ การเริ่มต้นใหม่ ความหวัง และความเจริญเติบโต เด็กยิ้มหมายถึงความสุข เด็กร้องไห้หมายถึงการเตือนภัย เด็กวิ่งหมายถึงความก้าวหน้า' 
  },
  { 
    keyword: 'เงินทอง', 
    emoji: '💰', 
    numbers: ['8', '9', '89', '98'], 
    description: 'เงินทองหมายถึงโชคลาภ ความร่ำรวย และความอุดมสมบูรณ์ เห็นเงินมากหมายถึงโชคลาภใหญ่ หยิบเงินได้หมายถึงได้รับทรัพย์ เงินทองเรืองแสงหมายถึงโชคดีมาก' 
  },
  { 
    keyword: 'สัตว์', 
    emoji: '🐾', 
    numbers: ['1', '6', '16', '61'], 
    description: 'สัตว์ต่างๆ นำโชคตามชนิด สัตว์เลี้ยงหมายถึงมิตรภาพ สัตว์ป่าหมายถึงอิสระ สัตว์บินหมายถึงความสูงส่ง สัตว์น้ำหมายถึงความอุดมสมบูรณ์' 
  },
  { 
    keyword: 'เจอพระ', 
    emoji: '🙏', 
    numbers: ['5', '8', '58', '85'], 
    description: 'เจอพระหรือพระสงฆ์เป็นมงคลยิ่ง หมายถึงการได้รับพร การคุ้มครอง และความสำเร็จในชีวิต พระให้พรหมายถึงโชคดีมาก พระเดินผ่านหมายถึงการแก้ไขปัญหา' 
  },
  { 
    keyword: 'ดอกไม้', 
    emoji: '🌸', 
    numbers: ['2', '6', '26', '62'], 
    description: 'ดอกไม้หมายถึงความสวยงาม ความรัก ความเจริญ และความสุข ดอกไม้บานหมายถึงความสำเร็จ ดอกไม้หอมหมายถึงความรัก ดอกไม้สีแดงหมายถึงโชคลาภ' 
  },
  { 
    keyword: 'ไฟ', 
    emoji: '🔥', 
    numbers: ['3', '7', '37', '73'], 
    description: 'ไฟหมายถึงพลัง ความร้อนแรง ความมุ่งมั่น และการเปลี่ยนแปลง ไฟลุกหมายถึงความกระตือรือร้น ไฟสว่างหมายถึงปัญญา ไฟดับหมายถึงการพักผ่อน' 
  },
  { 
    keyword: 'ต้นไม้', 
    emoji: '🌳', 
    numbers: ['4', '9', '49', '94'], 
    description: 'ต้นไม้หมายถึงการเจริญเติบโต ความแข็งแกร่ง ความมั่นคง และการพัฒนาอย่างยั่งยืน ต้นไม้ใหญ่หมายถึงความสำเร็จ ต้นไม้ผลิดอกหมายถึงโชคลาภ ต้นไม้เขียวหมายถึงสุขภาพดี' 
  },
]

// Dream Categories
const DREAM_CATEGORIES = [
  'เงินทอง',
  'คนตาย',
  'สัตว์',
  'น้ำ',
  'งู',
  'เด็ก',
  'เจอพระ',
  'ดอกไม้',
  'ไฟ',
  'ต้นไม้',
  'อื่นๆ',
]

// Prediction Logic (จำลอง)
function predictNumbersFromDream(dreamText: string, category: string): { numbers: { twoDigits: string[], threeDigits: string[] }, prediction: string } {
  const text = dreamText.toLowerCase()
  const foundKeywords: string[] = []
  
  // หาคำสำคัญจาก dictionary
  DREAM_DICTIONARY.forEach(item => {
    if (text.includes(item.keyword.toLowerCase()) || category === item.keyword) {
      foundKeywords.push(...item.numbers)
    }
  })
  
  // ถ้าไม่เจอคำสำคัญ ให้ใช้ category หรือ random
  let numbers: string[] = []
  if (foundKeywords.length > 0) {
    numbers = [...new Set(foundKeywords)] // ลบตัวซ้ำ
  } else {
    // Random แต่ให้ดูสมเหตุสมผล
    const categoryItem = DREAM_DICTIONARY.find(item => item.keyword === category)
    if (categoryItem) {
      numbers = categoryItem.numbers
    } else {
      // สุ่มจากความยาวของข้อความ
      const hash = dreamText.length % 10
      numbers = [String(hash), String((hash + 3) % 10)]
    }
  }
  
  // สร้างเลข 2 ตัว และ 3 ตัว
  const twoDigits: string[] = []
  const threeDigits: string[] = []
  
  // เลข 2 ตัว (2-3 ชุด)
  for (let i = 0; i < Math.min(3, numbers.length); i++) {
    const num1 = numbers[i] || String(Math.floor(Math.random() * 10))
    const num2 = numbers[(i + 1) % numbers.length] || String(Math.floor(Math.random() * 10))
    twoDigits.push(num1 + num2)
  }
  
  // เลข 3 ตัว (2-3 ชุด)
  for (let i = 0; i < Math.min(2, numbers.length); i++) {
    const num1 = numbers[i] || String(Math.floor(Math.random() * 10))
    const num2 = numbers[(i + 1) % numbers.length] || String(Math.floor(Math.random() * 10))
    const num3 = numbers[(i + 2) % numbers.length] || String(Math.floor(Math.random() * 10))
    threeDigits.push(num1 + num2 + num3)
  }
  
  // สร้างข้อความทำนายที่ละเอียดขึ้น
  const categoryItem = DREAM_DICTIONARY.find(item => item.keyword === category)
  let prediction = ''
  if (categoryItem) {
    // วิเคราะห์ความฝันอย่างละเอียด
    const dreamLength = dreamText.length
    const hasPositiveWords = /ดี|สำเร็จ|โชค|รวย|สุข|เจริญ/.test(text)
    const hasNegativeWords = /ไม่|เสีย|หาย|แย่|ร้าย/.test(text)
    
    let analysis = `ฝันเกี่ยวกับ${categoryItem.keyword} ${categoryItem.description}`
    
    if (hasPositiveWords) {
      analysis += ' ความฝันนี้มีสัญญาณบวกชัดเจน บ่งบอกถึงโชคลาภและความสำเร็จที่กำลังจะมาถึง'
    } else if (hasNegativeWords) {
      analysis += ' แม้ความฝันจะมีบางส่วนที่ดูไม่ดี แต่ก็เป็นสัญญาณเตือนให้ระวังและเตรียมพร้อม'
    }
    
    if (dreamLength > 50) {
      analysis += ' ความฝันที่ละเอียดเช่นนี้มักมีความหมายที่ลึกซึ้งและควรให้ความสำคัญ'
    }
    
    analysis += ` มักตีเป็นเลขเด่น ${numbers.join(', ')} และเลขที่เกี่ยวข้อง ${twoDigits.slice(0, 2).join(', ')}`
    
    prediction = analysis
  } else {
    // วิเคราะห์จากข้อความทั่วไป
    const dreamLength = dreamText.length
    const wordCount = dreamText.split(/\s+/).length
    
    let analysis = `ความฝันของคุณมีความยาว ${wordCount} คำ บ่งบอกถึง`
    if (dreamLength > 100) {
      analysis += 'ความฝันที่ละเอียดและมีความหมายลึกซึ้ง'
    } else if (dreamLength > 50) {
      analysis += 'ความฝันที่มีรายละเอียดพอสมควร'
    } else {
      analysis += 'ความฝันที่กระชับแต่มีความหมาย'
    }
    
    analysis += ` เลขเด่นที่ควรพิจารณาคือ ${numbers.join(', ')} และเลขเสริม ${twoDigits.slice(0, 2).join(', ')}`
    
    prediction = analysis
  }
  
  return { numbers: { twoDigits, threeDigits }, prediction }
}

// Animation Variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.17, 0.67, 0.83, 0.67],
    },
  },
}

const resultVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.17, 0.67, 0.83, 0.67],
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
}

// Dream Form Component
function DreamForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (dreamText: string, category: string, dreamDate?: string) => void
  isLoading: boolean
}) {
  const [dreamText, setDreamText] = useState('')
  const [category, setCategory] = useState('')
  const [dreamDate, setDreamDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (dreamText.trim() && category) {
      onSubmit(dreamText, category, dreamDate || undefined)
    }
  }

  return (
    <motion.form
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/40 shadow-xl mystical-pattern" style={{ borderRadius: '1.5rem' }}
    >
      <div className="space-y-5">
        {/* Textarea */}
        <div>
          <label className="block text-[#3024AE] font-medium mb-2 text-sm">
            คุณฝันว่าอะไร? 🌙
          </label>
          <textarea
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="เล่าความฝันของคุณที่นี่..."
            className="w-full h-32 px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-[#3024AE] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C86CD7]/40 focus:border-[#C86CD7]/60 transition-all resize-none" style={{ borderRadius: '1rem' }}
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-[#3024AE] font-medium mb-2 text-sm">
            หมวดหมู่ฝัน
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-[#3024AE] focus:outline-none focus:ring-2 focus:ring-[#C86CD7]/40 focus:border-[#C86CD7]/60 transition-all" style={{ borderRadius: '1rem' }}
            required
          >
            <option value="">เลือกหมวดหมู่</option>
            {DREAM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-white">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-gray-900 font-medium mb-2 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#3024AE]" />
            วันที่ฝัน (ไม่บังคับ)
          </label>
          <input
            type="date"
            value={dreamDate}
            onChange={(e) => setDreamDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-[#3024AE] focus:outline-none focus:ring-2 focus:ring-[#C86CD7]/40 focus:border-[#C86CD7]/60 transition-all" style={{ borderRadius: '1rem' }}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!dreamText.trim() || !category || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-white via-[#C86CD7] to-white text-[#3024AE] font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mystical-glow" 
          style={{ borderRadius: '1rem', backgroundSize: '200% 100%', animation: 'gradientShift 3s ease infinite' }}
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              <span>กำลังวิเคราะห์...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>ทำนายเลขจากความฝัน</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  )
}

// Dream Result Component
function DreamResult({
  result,
  onReset,
  onNavigateHome,
}: {
  result: DreamData | null
  onReset: () => void
  onNavigateHome: () => void
}) {
  if (!result) return null

  return (
    <motion.div
      variants={resultVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/40 shadow-xl mystical-pattern" style={{ borderRadius: '1.5rem' }}
    >
      <div className="space-y-6">
        {/* Prediction Text */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-4"
          >
            <Moon className="w-12 h-12 text-[#3024AE]" />
          </motion.div>
          <div className="space-y-4 mb-6">
            <p className="text-lg text-[#3024AE] leading-relaxed">{result.prediction}</p>
            
            {/* Additional Analysis */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 mt-4">
              <h4 className="font-semibold text-[#3024AE] mb-2 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3024AE]" />
                หมายเหตุเพิ่มเติม
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                ความฝันของคุณมีความหมายที่ลึกซึ้ง ควรพิจารณาเลขที่ได้อย่างรอบคอบ และใช้วิจารณญาณในการตัดสินใจ เลขเหล่านี้เป็นเพียงแนวทางจากความฝัน ไม่ใช่การรับประกันผลลอตเตอรี่
              </p>
            </div>
          </div>
        </div>

        {/* Numbers Display */}
        <div className="space-y-4">
          {/* 2 Digits */}
          <div>
            <h3 className="text-[#3024AE] font-semibold mb-3 text-sm">เลข 2 ตัว</h3>
            <div className="flex flex-wrap gap-3">
              {result.numbers.twoDigits.map((num, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="px-6 py-3 bg-gradient-to-br from-[#3024AE]/30 to-[#C86CD7]/30 border-2 border-[#C86CD7]/60 rounded-2xl text-[#3024AE] font-bold text-xl mystical-glow" style={{ borderRadius: '1rem', boxShadow: '0 0 15px rgba(200, 108, 215, 0.4)' }}
                >
                  {num}
                </motion.div>
              ))}
            </div>
          </div>

          {/* 3 Digits */}
          <div>
            <h3 className="text-[#3024AE] font-semibold mb-3 text-sm">เลข 3 ตัว</h3>
            <div className="flex flex-wrap gap-3">
              {result.numbers.threeDigits.map((num, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="px-6 py-3 bg-gradient-to-br from-[#3024AE]/30 to-[#C86CD7]/30 border-2 border-[#C86CD7]/60 rounded-2xl text-[#3024AE] font-bold text-xl mystical-glow" style={{ borderRadius: '1rem', boxShadow: '0 0 15px rgba(200, 108, 215, 0.4)' }}
                >
                  {num}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-white via-[#C86CD7] to-white text-[#3024AE] font-bold rounded-2xl transition-all flex items-center justify-center gap-2 mystical-glow" style={{ borderRadius: '1rem', backgroundSize: '200% 100%', animation: 'gradientShift 3s ease infinite' }}
          >
            <RefreshCw className="w-5 h-5" />
            <span>ทำนายใหม่</span>
          </motion.button>
          <motion.button
            onClick={onNavigateHome}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-2xl border-2 border-white/40 hover:border-[#C86CD7]/60 transition-all flex items-center justify-center gap-2" style={{ borderRadius: '1rem' }}
          >
            <Home className="w-5 h-5" />
            <span>กลับหน้าหลัก</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Dream Dictionary Component
function DreamDictionary() {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/40 shadow-xl mystical-pattern" style={{ borderRadius: '1.5rem' }}
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <Star className="w-6 h-6 text-[#3024AE]" />
        พจนานุกรมทำนายฝัน
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3"
      >
        {DREAM_DICTIONARY.map((item, idx) => (
          <motion.div
            key={item.keyword}
            variants={staggerItem}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-[#3024AE]/20 to-[#C86CD7]/20 border-2 border-[#C86CD7]/40 rounded-2xl p-4 hover:border-[#C86CD7]/60 transition-all backdrop-blur-sm" style={{ borderRadius: '1rem' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <h3 className="text-[#3024AE] font-semibold mb-1">{item.keyword}</h3>
                <p className="text-gray-700 text-sm mb-2">{item.description}</p>
                <div className="flex gap-2">
                  {item.numbers.map((num) => (
                    <span
                      key={num}
                      className="px-3 py-1 bg-gradient-to-br from-[#3024AE]/40 to-[#C86CD7]/40 border-2 border-[#C86CD7]/60 rounded-lg text-[#3024AE] font-bold text-sm"
                      style={{ boxShadow: '0 0 8px rgba(200, 108, 215, 0.3)' }}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

// Recent Dreams Component
function RecentDreams({ dreams }: { dreams: DreamData[] }) {
  if (dreams.length === 0) return null

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <Cloud className="w-6 h-6 text-[#3024AE]" />
        ความฝันล่าสุด
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {dreams.map((dream, idx) => (
          <motion.div
            key={dream.id}
            variants={staggerItem}
            className="bg-gradient-to-r from-[#3024AE]/20 to-[#C86CD7]/20 border-2 border-[#C86CD7]/40 rounded-2xl p-4 hover:border-[#C86CD7]/60 transition-all backdrop-blur-sm" style={{ borderRadius: '1rem' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-[#3024AE] font-medium mb-2 line-clamp-2">
                  {dream.dreamText.length > 50
                    ? `${dream.dreamText.substring(0, 50)}...`
                    : dream.dreamText}
                </p>
                <div className="flex flex-wrap gap-2">
                  {dream.numbers.twoDigits.slice(0, 2).map((num, numIdx) => (
                    <span
                      key={numIdx}
                      className="px-2 py-1 bg-gradient-to-br from-[#3024AE]/40 to-[#C86CD7]/40 border-2 border-[#C86CD7]/60 rounded text-[#3024AE] font-semibold text-xs"
                      style={{ boxShadow: '0 0 6px rgba(200, 108, 215, 0.3)' }}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-gray-500 text-xs whitespace-nowrap">
                {dream.category}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

// Main Component
function DreamToNumbersPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [currentResult, setCurrentResult] = useState<DreamData | null>(null)
  const [recentDreams, setRecentDreams] = useState<DreamData[]>([])

  const handleSubmit = async (dreamText: string, category: string, dreamDate?: string) => {
    setIsLoading(true)
    
    // จำลองการโหลด
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    const prediction = predictNumbersFromDream(dreamText, category)
    const newDream: DreamData = {
      id: Date.now().toString(),
      dreamText,
      category,
      dreamDate,
      numbers: prediction.numbers,
      prediction: prediction.prediction,
      timestamp: Date.now(),
    }
    
    setCurrentResult(newDream)
    
    // เพิ่มเข้า recent dreams (เก็บแค่ 5 รายการล่าสุด)
    setRecentDreams((prev) => [newDream, ...prev].slice(0, 5))
    
    setIsLoading(false)
  }

  const handleReset = () => {
    setCurrentResult(null)
  }

  const handleNavigateHome = () => {
    navigate({ to: '/' })
  }

  // Animated Moon Icon
  const moonVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  // Animated Stars
  const starVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <div 
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
        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-md"
        >
          {/* Top Bar */}
          <motion.div variants={sectionVariants} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <motion.div
                whileHover={{ scale: 1.02, x: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm">กลับหน้าหลัก</span>
                </Link>
              </motion.div>
            </div>

            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <motion.div variants={moonVariants} animate="animate">
                  <Moon className="w-8 h-8 text-[#5F1DB2]" />
                </motion.div>
                <motion.div variants={starVariants} animate="animate">
                  <Star className="w-5 h-5 text-[#027037]" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <Cloud className="w-6 h-6 text-[#5F1DB2]" />
                </motion.div>
              </div>
              <h1 className="text-2xl font-bold mb-2 text-white">
                ทำนายฝันเป็นเลข
              </h1>
              <p className="text-sm text-white/90">
                เล่าความฝันของคุณ แล้วให้เราแปลงเป็นชุดตัวเลข
              </p>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-col gap-4 mb-4">
            {/* Left Column: Form + Result */}
            <div className="space-y-6">
              {!currentResult ? (
                <DreamForm onSubmit={handleSubmit} isLoading={isLoading} />
              ) : (
                <DreamResult
                  result={currentResult}
                  onReset={handleReset}
                  onNavigateHome={handleNavigateHome}
                />
              )}
            </div>

            {/* Dictionary and Recent Dreams */}
            <div className="space-y-4">
              {!currentResult && <DreamDictionary />}
              {recentDreams.length > 0 && <RecentDreams dreams={recentDreams} />}
            </div>
          </div>

          {/* Disclaimer */}
          <motion.div
            variants={sectionVariants}
            className="text-center mt-6"
          >
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg">
              <p className="text-xs text-[#3024AE] leading-relaxed font-medium">
                ⚠️ การทำนายฝันและเลขที่แนะนำเป็นการตีความตามความเชื่อส่วนบุคคล โปรดใช้วิจารณญาณ
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
