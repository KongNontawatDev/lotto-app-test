import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { ArrowLeft, Search, X, Filter, Sparkles, BookOpen, Calendar, User } from 'lucide-react'

export const Route = createFileRoute('/masters')({
  component: MastersPage,
})

// Types
type NumberType = '2ตัวบน' | '2ตัวล่าง' | '3ตัวตรง' | '3ตัวโต๊ด' | 'เลขเด่น'

interface MasterPick {
  id: string
  masterName: string
  school: string
  period: string
  periodDate: string
  numberType: NumberType
  numbers: number[]
  note: string
  isHighlight?: boolean
}

// Mock Data
const mockPicks: MasterPick[] = [
  {
    id: '1',
    masterName: 'อ.เอก',
    school: 'สำนักวัดดัง',
    period: 'งวดที่ 1/2567',
    periodDate: '16 ม.ค. 2567',
    numberType: '2ตัวบน',
    numbers: [12, 21, 87, 45],
    note: 'เน้นตัวกลับด้วย ฟิลลิ่งแรงช่วงนี้',
    isHighlight: true,
  },
  {
    id: '2',
    masterName: 'อ.หมวย',
    school: 'สำนักโหราศาสตร์',
    period: 'งวดที่ 1/2567',
    periodDate: '16 ม.ค. 2567',
    numberType: '3ตัวตรง',
    numbers: [123, 456, 789],
    note: 'เลขนี้มาจากการคำนวณดวงดาว',
  },
  {
    id: '3',
    masterName: 'อ.สมชาย',
    school: 'สำนักเลขศาสตร์',
    period: 'งวดที่ 1/2567',
    periodDate: '16 ม.ค. 2567',
    numberType: '2ตัวล่าง',
    numbers: [34, 56, 78],
    note: 'ตัวเลขที่ซ้ำกันหลายสำนัก',
    isHighlight: true,
  },
  {
    id: '4',
    masterName: 'อ.วิไล',
    school: 'สำนักวัดดัง',
    period: 'งวดที่ 1/2567',
    periodDate: '16 ม.ค. 2567',
    numberType: 'เลขเด่น',
    numbers: [7, 9, 13],
    note: 'เลขเด่นจากดวงชะตา',
  },
  {
    id: '5',
    masterName: 'อ.เอก',
    school: 'สำนักวัดดัง',
    period: 'งวดที่ 2/2567',
    periodDate: '1 ก.พ. 2567',
    numberType: '3ตัวโต๊ด',
    numbers: [135, 246, 357],
    note: 'แนวโน้มดีมาก',
  },
  {
    id: '6',
    masterName: 'อ.หมวย',
    school: 'สำนักโหราศาสตร์',
    period: 'งวดที่ 2/2567',
    periodDate: '1 ก.พ. 2567',
    numberType: '2ตัวบน',
    numbers: [23, 45, 67],
    note: 'ตัวเลขที่ควรจับตามอง',
  },
  {
    id: '7',
    masterName: 'อ.สมชาย',
    school: 'สำนักเลขศาสตร์',
    period: 'งวดที่ 1/2567',
    periodDate: '16 ม.ค. 2567',
    numberType: '3ตัวตรง',
    numbers: [234, 567, 890],
    note: 'เลขที่มาจากการวิเคราะห์',
  },
  {
    id: '8',
    masterName: 'อ.วิไล',
    school: 'สำนักวัดดัง',
    period: 'งวดที่ 2/2567',
    periodDate: '1 ก.พ. 2567',
    numberType: '2ตัวล่าง',
    numbers: [12, 34, 56],
    note: 'ตัวเลขที่ซ้ำกันหลายสำนัก',
    isHighlight: true,
  },
  {
    id: '9',
    masterName: 'อ.เอก',
    school: 'สำนักวัดดัง',
    period: 'งวดที่ 2/2567',
    periodDate: '1 ก.พ. 2567',
    numberType: 'เลขเด่น',
    numbers: [5, 8, 11],
    note: 'เลขเด่นจากดวงชะตา',
  },
]

const masters = ['ทั้งหมด', 'อ.เอก', 'อ.หมวย', 'อ.สมชาย', 'อ.วิไล']
const schools = ['ทั้งหมด', 'สำนักวัดดัง', 'สำนักโหราศาสตร์', 'สำนักเลขศาสตร์']
const periods = ['ทั้งหมด', 'งวดที่ 1/2567', 'งวดที่ 2/2567']
const numberTypes: NumberType[] = ['2ตัวบน', '2ตัวล่าง', '3ตัวตรง', '3ตัวโต๊ด', 'เลขเด่น']

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.17, 0.67, 0.83, 0.67] as const,
    },
  },
}

const highlightVariants = {
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Components
function FilterBar({
  selectedMaster,
  selectedSchool,
  selectedPeriod,
  selectedNumberType,
  searchQuery,
  onMasterChange,
  onSchoolChange,
  onPeriodChange,
  onNumberTypeChange,
  onSearchChange,
  onReset,
}: {
  selectedMaster: string
  selectedSchool: string
  selectedPeriod: string
  selectedNumberType: string
  searchQuery: string
  onMasterChange: (value: string) => void
  onSchoolChange: (value: string) => void
  onPeriodChange: (value: string) => void
  onNumberTypeChange: (value: string) => void
  onSearchChange: (value: string) => void
  onReset: () => void
}) {
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 mb-4 border-2 border-white/40 shadow-xl mystical-pattern" style={{ borderRadius: '1.5rem' }}
    >
      <div className="flex flex-col gap-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาชื่ออาจารย์หรือคำอธิบาย..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white/90 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-[#3024AE] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C86CD7]/40 focus:border-[#C86CD7]/60 transition-all" style={{ borderRadius: '1rem' }}
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col gap-2">
          {/* Master Filter */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <select
              value={selectedMaster}
              onChange={(e) => onMasterChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white/90 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-[#3024AE] focus:outline-none focus:ring-2 focus:ring-[#C86CD7]/40 focus:border-[#C86CD7] transition-all appearance-none cursor-pointer" style={{ borderRadius: '1rem' }}
            >
              {masters.map((master) => (
                <option key={master} value={master} className="bg-white">
                  {master}
                </option>
              ))}
            </select>
          </div>

          {/* School Filter */}
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <select
              value={selectedSchool}
              onChange={(e) => onSchoolChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white/90 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-[#3024AE] focus:outline-none focus:ring-2 focus:ring-[#C86CD7]/40 focus:border-[#C86CD7] transition-all appearance-none cursor-pointer" style={{ borderRadius: '1rem' }}
            >
              {schools.map((school) => (
                <option key={school} value={school} className="bg-white">
                  {school}
                </option>
              ))}
            </select>
          </div>

          {/* Period Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white/90 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-[#3024AE] focus:outline-none focus:ring-2 focus:ring-[#C86CD7]/40 focus:border-[#C86CD7] transition-all appearance-none cursor-pointer" style={{ borderRadius: '1rem' }}
            >
              {periods.map((period) => (
                <option key={period} value={period} className="bg-white">
                  {period}
                </option>
              ))}
            </select>
          </div>

          {/* Number Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <select
              value={selectedNumberType}
              onChange={(e) => onNumberTypeChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white/90 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-[#3024AE] focus:outline-none focus:ring-2 focus:ring-[#C86CD7]/40 focus:border-[#C86CD7] transition-all appearance-none cursor-pointer" style={{ borderRadius: '1rem' }}
            >
              <option value="ทั้งหมด" className="bg-white">
                ทั้งหมด
              </option>
              {numberTypes.map((type) => (
                <option key={type} value={type} className="bg-white">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm hover:bg-white border-2 border-white/40 text-[#3024AE] rounded-2xl transition-all text-xs font-medium" style={{ borderRadius: '1rem' }}
        >
          <X className="w-3 h-3" />
          รีเซ็ตฟิลเตอร์
        </motion.button>
      </div>
    </motion.div>
  )
}

function MasterPickCard({ pick }: { pick: MasterPick }) {
  const getNumberTypeColor = (type: NumberType) => {
    switch (type) {
      case 'เลขเด่น':
        return 'bg-[#027037]/10 text-[#027037] border-[#027037]/30'
      case '2ตัวบน':
        return 'bg-[#5F1DB2]/10 text-[#5F1DB2] border-[#5F1DB2]/30'
      case '2ตัวล่าง':
        return 'bg-[#5F1DB2]/10 text-[#5F1DB2] border-[#5F1DB2]/30'
      case '3ตัวตรง':
        return 'bg-[#027037]/10 text-[#027037] border-[#027037]/30'
      case '3ตัวโต๊ด':
        return 'bg-[#5F1DB2]/10 text-[#5F1DB2] border-[#5F1DB2]/30'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-5 border-2 border-white/40 hover:border-[#C86CD7]/60 transition-all duration-200 shadow-xl mystical-pattern" style={{ borderRadius: '1.5rem' }}
    >
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">✍️</span>
              <h3 className="text-lg font-bold text-[#3024AE]">{pick.masterName}</h3>
            </div>
            <p className="text-sm text-gray-700">{pick.school}</p>
          </div>
          {pick.isHighlight && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1 px-2 py-1 bg-[#027037]/10 border border-[#027037]/30 rounded-lg"
            >
              <Sparkles className="w-3 h-3 text-[#027037]" />
              <span className="text-xs text-[#027037] font-medium">เด่น</span>
            </motion.div>
          )}
        </div>

        {/* Period Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs">📜</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-medium">
            {pick.periodDate}
          </span>
        </div>

        {/* Number Type Tag */}
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${getNumberTypeColor(pick.numberType)}`}
          >
            {pick.numberType}
          </span>
        </div>

        {/* Numbers */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {pick.numbers.map((num, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 bg-gradient-to-br from-[#3024AE]/30 to-[#C86CD7]/30 border-2 border-[#C86CD7]/60 rounded-lg text-[#3024AE] font-semibold text-sm"
                style={{ boxShadow: '0 0 8px rgba(200, 108, 215, 0.3)' }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-700 italic">💡 {pick.note}</p>
        </div>
      </div>
    </motion.div>
  )
}

function HighlightCard({ picks }: { picks: MasterPick[] }) {
  // Find common numbers across picks
  const allNumbers = picks.flatMap((p) => p.numbers)
  const numberCounts = allNumbers.reduce((acc, num) => {
    acc[num] = (acc[num] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const commonNumbers = Object.entries(numberCounts)
    .filter(([_, count]) => count >= 2)
    .map(([num]) => parseInt(num))
    .slice(0, 3)

  if (commonNumbers.length === 0) return null

  return (
    <motion.div
      variants={highlightVariants}
      animate="animate"
      className="col-span-full mb-6 bg-gradient-to-br from-[#3024AE]/20 to-[#C86CD7]/20 border-2 border-[#C86CD7]/50 rounded-3xl p-6 shadow-xl mystical-glow backdrop-blur-sm" style={{ borderRadius: '1.5rem' }}
    >
      <div className="flex items-start gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-[#3024AE] flex-shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-[#3024AE] mb-2">
            เลขเด่นรวมทุกอาจารย์
          </h3>
          <p className="text-sm text-gray-700">
            เลขนี้ซ้ำกันหลายสำนัก โปรดใช้วิจารณญาณ
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {commonNumbers.map((num, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.1 }}
            className="px-4 py-2 bg-gradient-to-br from-[#3024AE] to-[#C86CD7] border-2 border-white/50 rounded-2xl text-white font-bold text-lg mystical-glow" style={{ borderRadius: '1rem', boxShadow: '0 0 20px rgba(200, 108, 215, 0.6)' }}
          >
            {num}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function Legend() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mt-8 bg-white/95 backdrop-blur-sm rounded-3xl p-4 border-2 border-white/40 shadow-xl" style={{ borderRadius: '1.5rem' }}
    >
      <h4 className="text-sm font-semibold text-[#3024AE] mb-3">🔖 คำอธิบายแท็กสี</h4>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#027037] border border-[#027037]"></span>
          <span className="text-xs text-gray-700">เลขเด่น</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#D4AF37] border border-[#F4D03F]"></span>
          <span className="text-xs text-gray-700">2 ตัวบน</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#D4AF37] border border-[#F4D03F]"></span>
          <span className="text-xs text-gray-700">2 ตัวล่าง</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#5F1DB2] border border-[#7C3FD9]"></span>
          <span className="text-xs text-gray-700">3 ตัวตรง</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#D4AF37] border border-[#F4D03F]"></span>
          <span className="text-xs text-gray-700">3 ตัวโต๊ด</span>
        </div>
      </div>
      <p className="text-xs text-gray-600 italic border-t border-gray-200 pt-3">
        ⚠️ เลขที่แสดงเป็นเพียงแนวทางจากผู้ให้เลข ไม่รับประกันผล
      </p>
    </motion.div>
  )
}

// Main Component
function MastersPage() {
  const navigate = useNavigate()

  const [selectedMaster, setSelectedMaster] = useState('ทั้งหมด')
  const [selectedSchool, setSelectedSchool] = useState('ทั้งหมด')
  const [selectedPeriod, setSelectedPeriod] = useState('ทั้งหมด')
  const [selectedNumberType, setSelectedNumberType] = useState('ทั้งหมด')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPicks = useMemo(() => {
    return mockPicks.filter((pick) => {
      const matchMaster = selectedMaster === 'ทั้งหมด' || pick.masterName === selectedMaster
      const matchSchool = selectedSchool === 'ทั้งหมด' || pick.school === selectedSchool
      const matchPeriod = selectedPeriod === 'ทั้งหมด' || pick.period === selectedPeriod
      const matchNumberType =
        selectedNumberType === 'ทั้งหมด' || pick.numberType === selectedNumberType
      const matchSearch =
        searchQuery === '' ||
        pick.masterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pick.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pick.note.toLowerCase().includes(searchQuery.toLowerCase())

      return matchMaster && matchSchool && matchPeriod && matchNumberType && matchSearch
    })
  }, [selectedMaster, selectedSchool, selectedPeriod, selectedNumberType, searchQuery])

  const handleReset = () => {
    setSelectedMaster('ทั้งหมด')
    setSelectedSchool('ทั้งหมด')
    setSelectedPeriod('ทั้งหมด')
    setSelectedNumberType('ทั้งหมด')
    setSearchQuery('')
  }

  const handleNavigateHome = () => {
    navigate({ to: '/' })
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
        <div className="mx-auto max-w-md">
          {/* Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNavigateHome}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">กลับหน้าหลัก</span>
            </motion.button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-white" />
                <h1 className="text-2xl font-bold text-white">
                  เลขเด็ดอาจารย์ดัง
                </h1>
              </div>
              <p className="text-sm text-white/90">
                รวมแนวทางจากอาจารย์และสำนักดังไว้ในที่เดียว
              </p>
            </div>
          </motion.div>

          {/* Filter Bar */}
          <FilterBar
            selectedMaster={selectedMaster}
            selectedSchool={selectedSchool}
            selectedPeriod={selectedPeriod}
            selectedNumberType={selectedNumberType}
            searchQuery={searchQuery}
            onMasterChange={setSelectedMaster}
            onSchoolChange={setSelectedSchool}
            onPeriodChange={setSelectedPeriod}
            onNumberTypeChange={setSelectedNumberType}
            onSearchChange={setSearchQuery}
            onReset={handleReset}
          />

          {/* Highlight Card */}
          {filteredPicks.length > 0 && <HighlightCard picks={filteredPicks} />}

          {/* Master Picks Grid */}
          {filteredPicks.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
            >
              {filteredPicks.map((pick) => (
                <MasterPickCard key={pick.id} pick={pick} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/40 shadow-xl" style={{ borderRadius: '1.5rem' }}
            >
              <p className="text-gray-600 text-lg">ไม่พบข้อมูลที่ค้นหา</p>
            </motion.div>
          )}

          {/* Legend */}
          <Legend />
        </div>
      </div>
    </div>
  )
}
