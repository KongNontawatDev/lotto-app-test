import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Home, RotateCcw, Sparkles, Wand2 } from 'lucide-react'

interface SiameseStickPageProps {
  onBack?: () => void
  onNavigateHome?: () => void
}

interface StickResult {
  number: string
  prediction: StickPrediction
  timestamp: string
}

interface StickPrediction {
  title: string
  meaning: string
  fortune: string
  advice: string
  color: string
  detailedAnalysis?: string
  luckyDirections?: string[]
  luckyColors?: string[]
  luckyDays?: string[]
  warnings?: string[]
  additionalNumbers?: string[]
}

const STICK_PREDICTIONS: Record<string, StickPrediction> = {
  '1': {
    title: 'เลขหนึ่ง - เอกบุรุษ',
    meaning: 'ความเป็นหนึ่ง ความเป็นผู้นำ เริ่มต้นใหม่',
    fortune: 'โชคดีในการเริ่มต้นสิ่งใหม่ ความเป็นผู้นำจะนำพาความสำเร็จ',
    advice: 'เหมาะสำหรับการเริ่มต้นธุรกิจใหม่ หรือการตัดสินใจสำคัญ',
    color: '#3B82F6', // Blue
    detailedAnalysis: 'เลขหนึ่งเป็นเลขแห่งความเป็นเอก หมายถึงการเป็นผู้นำ การเริ่มต้นใหม่ และการสร้างสรรค์สิ่งใหม่ๆ ในทางโหราศาสตร์ เลขนี้เชื่อมโยงกับดวงอาทิตย์ ซึ่งเป็นดาวแห่งพลังและอำนาจ ผู้ที่ได้เลขนี้มักมีบุคลิกที่เด่นชัด มีความเป็นผู้นำ และมีความมุ่งมั่นสูง',
    luckyDirections: ['ทิศเหนือ', 'ทิศตะวันออก'],
    luckyColors: ['สีทอง', 'สีแดง', 'สีน้ำเงิน'],
    luckyDays: ['วันอาทิตย์', 'วันจันทร์'],
    warnings: ['ระวังการตัดสินใจที่หุนหันพลันแล่น ควรใช้เวลาในการคิดให้รอบคอบ'],
    additionalNumbers: ['10', '11', '19', '91', '100'],
  },
  '2': {
    title: 'เลขสอง - คู่บุพเพสันนิวาส',
    meaning: 'ความสมดุล ความเป็นคู่ ความร่วมมือ',
    fortune: 'โชคดีในความสัมพันธ์ การทำงานร่วมกันจะนำมาซึ่งความสำเร็จ',
    advice: 'ควรหาพันธมิตรหรือคู่หูในการทำงาน จะช่วยให้ประสบความสำเร็จได้ง่ายขึ้น',
    color: '#EC4899', // Pink
    detailedAnalysis: 'เลขสองเป็นเลขแห่งความสมดุลและความเป็นคู่ หมายถึงความร่วมมือ การประสานงาน และความสัมพันธ์ที่ดี ในทางโหราศาสตร์ เลขนี้เชื่อมโยงกับดวงจันทร์ ซึ่งเป็นดาวแห่งอารมณ์และความรู้สึก ผู้ที่ได้เลขนี้มักมีความสามารถในการทำงานร่วมกับผู้อื่น มีความอ่อนโยน และเข้าใจความรู้สึกของผู้อื่น',
    luckyDirections: ['ทิศตะวันตก', 'ทิศตะวันตกเฉียงเหนือ'],
    luckyColors: ['สีชมพู', 'สีขาว', 'สีเงิน'],
    luckyDays: ['วันจันทร์', 'วันศุกร์'],
    warnings: ['ระวังการตัดสินใจตามอารมณ์ ควรใช้เหตุผลประกอบ'],
    additionalNumbers: ['20', '22', '29', '92', '200'],
  },
  '3': {
    title: 'เลขสาม - สามเส้า',
    meaning: 'ความมั่นคง สามเส้า ความแข็งแกร่ง',
    fortune: 'โชคดีในความมั่นคง การวางแผนระยะยาวจะประสบความสำเร็จ',
    advice: 'ควรวางแผนอย่างรอบคอบและยึดมั่นในหลักการ จะได้ผลดีในระยะยาว',
    color: '#10B981', // Green
    detailedAnalysis: 'เลขสามเป็นเลขแห่งความมั่นคงและสามเส้า หมายถึงการมีรากฐานที่แข็งแกร่ง การวางแผนระยะยาว และความอดทน ในทางโหราศาสตร์ เลขนี้เชื่อมโยงกับดาวพฤหัสบดี ซึ่งเป็นดาวแห่งปัญญาและความเจริญ ผู้ที่ได้เลขนี้มักมีความคิดที่ลึกซึ้ง มีความอดทนสูง และสามารถสร้างรากฐานที่มั่นคงได้',
    luckyDirections: ['ทิศตะวันออก', 'ทิศตะวันออกเฉียงเหนือ'],
    luckyColors: ['สีเขียว', 'สีน้ำตาล', 'สีเหลือง'],
    luckyDays: ['วันพฤหัสบดี', 'วันอาทิตย์'],
    warnings: ['ระวังการยึดติดกับความคิดเดิมมากเกินไป ควรเปิดใจรับสิ่งใหม่'],
    additionalNumbers: ['30', '33', '39', '93', '300'],
  },
  '4': {
    title: 'เลขสี่ - เสาหลัก',
    meaning: 'ความแข็งแกร่ง ความมั่นคง ความอดทน',
    fortune: 'โชคดีในความอดทน การทำงานหนักจะได้รับผลตอบแทน',
    advice: 'ต้องใช้ความอดทนและความพยายาม แต่ผลลัพธ์จะคุ้มค่า',
    color: '#F59E0B', // Amber
    detailedAnalysis: 'เลขสี่เป็นเลขแห่งเสาหลัก หมายถึงความแข็งแกร่ง ความมั่นคง และความอดทน ในทางโหราศาสตร์ เลขนี้เชื่อมโยงกับดาวราหู ซึ่งเป็นดาวแห่งการเปลี่ยนแปลงและการต่อสู้ ผู้ที่ได้เลขนี้มักมีความแข็งแกร่งทั้งกายและใจ มีความอดทนสูง และสามารถผ่านอุปสรรคได้ด้วยความมุ่งมั่น',
    luckyDirections: ['ทิศใต้', 'ทิศตะวันออกเฉียงใต้'],
    luckyColors: ['สีส้ม', 'สีทอง', 'สีแดง'],
    luckyDays: ['วันอังคาร', 'วันเสาร์'],
    warnings: ['ระวังการทำงานหนักเกินไป ควรหาเวลาพักผ่อน'],
    additionalNumbers: ['40', '44', '49', '94', '400'],
  },
  '5': {
    title: 'เลขห้า - การเปลี่ยนแปลง',
    meaning: 'การเปลี่ยนแปลง ความหลากหลาย โอกาสใหม่',
    fortune: 'โชคดีในการเปลี่ยนแปลง การเปิดรับสิ่งใหม่จะนำมาซึ่งโอกาส',
    advice: 'ควรเปิดใจรับการเปลี่ยนแปลงและโอกาสใหม่ๆ จะพบกับสิ่งดีๆ',
    color: '#8B5CF6', // Purple
    detailedAnalysis: 'เลขห้าเป็นเลขแห่งการเปลี่ยนแปลงและความหลากหลาย หมายถึงการเคลื่อนไหว การผจญภัย และโอกาสใหม่ๆ ในทางโหราศาสตร์ เลขนี้เชื่อมโยงกับดาวพุธ ซึ่งเป็นดาวแห่งการสื่อสารและการเรียนรู้ ผู้ที่ได้เลขนี้มักมีความกระตือรือร้น ชอบการเปลี่ยนแปลง และสามารถปรับตัวได้ดี',
    luckyDirections: ['ทิศกลาง', 'ทุกทิศ'],
    luckyColors: ['สีม่วง', 'สีเทา', 'สีเงิน'],
    luckyDays: ['วันพุธ', 'วันศุกร์'],
    warnings: ['ระวังการเปลี่ยนแปลงบ่อยเกินไป ควรมีความมั่นคงบ้าง'],
    additionalNumbers: ['50', '55', '59', '95', '500'],
  },
  '6': {
    title: 'เลขหก - ความสมบูรณ์',
    meaning: 'ความสมบูรณ์ ความราบรื่น ความเจริญ',
    fortune: 'โชคดีในความราบรื่น ทุกอย่างจะดำเนินไปอย่างราบรื่น',
    advice: 'เหมาะสำหรับการลงทุนหรือการตัดสินใจสำคัญ จะได้ผลดี',
    color: '#06B6D4', // Cyan
    detailedAnalysis: 'เลขหกเป็นเลขแห่งความสมบูรณ์และความราบรื่น หมายถึงความสมดุล ความกลมกลืน และความเจริญรุ่งเรือง ในทางโหราศาสตร์ เลขนี้เชื่อมโยงกับดาวศุกร์ ซึ่งเป็นดาวแห่งความรักและความงาม ผู้ที่ได้เลขนี้มักมีชีวิตที่ราบรื่น มีความสุขในความสัมพันธ์ และมีความเจริญในหน้าที่การงาน',
    luckyDirections: ['ทิศตะวันตก', 'ทิศตะวันตกเฉียงใต้'],
    luckyColors: ['สีฟ้า', 'สีเขียวอ่อน', 'สีขาว'],
    luckyDays: ['วันศุกร์', 'วันอาทิตย์'],
    warnings: ['ระวังการประมาทเพราะทุกอย่างราบรื่น ควรระวังตัวเสมอ'],
    additionalNumbers: ['60', '66', '69', '96', '600'],
  },
  '7': {
    title: 'เลขเจ็ด - โชคลาภ',
    meaning: 'โชคลาภ ความเป็นมงคล ความสำเร็จ',
    fortune: 'โชคดีมาก! เลขนี้เป็นเลขมงคลที่นำมาซึ่งโชคลาภและความสำเร็จ',
    advice: 'เหมาะสำหรับการเสี่ยงโชคหรือการลงทุน แต่ควรใช้วิจารณญาณ',
    color: '#EF4444', // Red
    detailedAnalysis: 'เลขเจ็ดเป็นเลขแห่งโชคลาภและความเป็นมงคล หมายถึงความสำเร็จ การได้รับพร และโชคดี ในทางโหราศาสตร์ เลขนี้เชื่อมโยงกับดาวเกตุ ซึ่งเป็นดาวแห่งโชคลาภและความสำเร็จ ผู้ที่ได้เลขนี้มักมีโชคดี มีโอกาสได้รับสิ่งดีๆ และประสบความสำเร็จในสิ่งที่ทำ',
    luckyDirections: ['ทิศตะวันตกเฉียงเหนือ', 'ทิศเหนือ'],
    luckyColors: ['สีแดง', 'สีทอง', 'สีส้ม'],
    luckyDays: ['วันเสาร์', 'วันพฤหัสบดี'],
    warnings: ['แม้จะมีโชคดี แต่ควรใช้วิจารณญาณในการตัดสินใจ'],
    additionalNumbers: ['70', '77', '79', '97', '700'],
  },
  '8': {
    title: 'เลขแปด - ความร่ำรวย',
    meaning: 'ความเจริญรุ่งเรือง ความอุดมสมบูรณ์ ความร่ำรวย',
    fortune: 'โชคดีในความร่ำรวย การเงินจะดีขึ้นและมีความมั่นคง',
    advice: 'เหมาะสำหรับการลงทุนและการออมเงิน จะมีทรัพย์สินเพิ่มขึ้น',
    color: '#F97316', // Orange
    detailedAnalysis: 'เลขแปดเป็นเลขแห่งความร่ำรวยและความเจริญรุ่งเรือง หมายถึงความอุดมสมบูรณ์ การเงินที่ดี และทรัพย์สมบัติ ในทางโหราศาสตร์ เลขนี้เชื่อมโยงกับดาวเสาร์ ซึ่งเป็นดาวแห่งความมั่นคงและทรัพย์สิน ผู้ที่ได้เลขนี้มักมีความเจริญในด้านการเงิน มีทรัพย์สมบัติเพิ่มขึ้น และมีความมั่นคงทางการเงิน',
    luckyDirections: ['ทิศตะวันออกเฉียงเหนือ', 'ทิศเหนือ'],
    luckyColors: ['สีส้ม', 'สีทอง', 'สีน้ำตาล'],
    luckyDays: ['วันเสาร์', 'วันพฤหัสบดี'],
    warnings: ['ระวังการฟุ่มเฟือย ควรออมเงินและลงทุนอย่างชาญฉลาด'],
    additionalNumbers: ['80', '88', '89', '98', '800'],
  },
  '9': {
    title: 'เลขเก้า - ความสมบูรณ์แบบ',
    meaning: 'ความสมบูรณ์แบบ ความสำเร็จสูงสุด',
    fortune: 'โชคดีมาก! เลขนี้เป็นเลขแห่งความสมบูรณ์แบบและความสำเร็จสูงสุด',
    advice: 'เหมาะสำหรับการทำสิ่งสำคัญทุกอย่าง จะประสบความสำเร็จอย่างสมบูรณ์',
    color: '#14B8A6', // Teal
    detailedAnalysis: 'เลขเก้าเป็นเลขแห่งความสมบูรณ์แบบและความสำเร็จสูงสุด หมายถึงการบรรลุเป้าหมาย การครบวงจร และความสมบูรณ์ในทุกด้าน ในทางโหราศาสตร์ เลขนี้เชื่อมโยงกับดาวมังกร ซึ่งเป็นดาวแห่งอำนาจและความสำเร็จสูงสุด ผู้ที่ได้เลขนี้มักประสบความสำเร็จในสิ่งที่ทำ มีความสมบูรณ์ในชีวิต และบรรลุเป้าหมายที่ตั้งไว้',
    luckyDirections: ['ทิศใต้', 'ทิศตะวันออก'],
    luckyColors: ['สีเขียวเข้ม', 'สีทอง', 'สีแดง'],
    luckyDays: ['วันอาทิตย์', 'วันพฤหัสบดี'],
    warnings: ['แม้จะประสบความสำเร็จ แต่ควรถ่อมตัวและช่วยเหลือผู้อื่น'],
    additionalNumbers: ['90', '99', '19', '91', '900'],
  },
  '0': {
    title: 'เลขศูนย์ - วงกลมแห่งชีวิต',
    meaning: 'ความสมบูรณ์ ความว่างเปล่า เริ่มต้นใหม่',
    fortune: 'โชคดีในการเริ่มต้นใหม่ วงจรชีวิตจะหมุนเวียนมาสู่จุดที่ดี',
    advice: 'ควรเริ่มต้นใหม่ด้วยจิตใจที่บริสุทธิ์ จะพบกับโอกาสใหม่ๆ',
    color: '#6366F1', // Indigo
    detailedAnalysis: 'เลขศูนย์เป็นเลขแห่งวงกลมแห่งชีวิต หมายถึงความสมบูรณ์ ความว่างเปล่า และการเริ่มต้นใหม่ ในทางโหราศาสตร์ เลขนี้เชื่อมโยงกับดาวเนปจูน ซึ่งเป็นดาวแห่งจิตวิญญาณและการเริ่มต้นใหม่ ผู้ที่ได้เลขนี้มักมีโอกาสเริ่มต้นใหม่ มีการเปลี่ยนแปลงในชีวิต และพบกับโอกาสใหม่ๆ ที่ดีกว่าเดิม',
    luckyDirections: ['ทุกทิศ', 'ทิศกลาง'],
    luckyColors: ['สีน้ำเงินเข้ม', 'สีขาว', 'สีเงิน'],
    luckyDays: ['ทุกวัน', 'วันจันทร์'],
    warnings: ['ระวังการเริ่มต้นใหม่โดยไม่มีการวางแผน ควรเตรียมพร้อมก่อน'],
    additionalNumbers: ['00', '01', '10', '100', '1000'],
  },
}

export function SiameseStickPage({ onBack, onNavigateHome }: SiameseStickPageProps) {
  const [isShaking, setIsShaking] = useState(false)
  const [result, setResult] = useState<StickResult | null>(null)
  const [isRevealing, setIsRevealing] = useState(false)
  // const [shakeIntensity, setShakeIntensity] = useState(0) // ไม่ใช้แล้ว
  const [history, setHistory] = useState<StickResult[]>([])
  const shakeCountRef = useRef(0)
  const lastShakeTimeRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasShakenRef = useRef(false)

  // Device orientation for shake detection
  useEffect(() => {
    let permissionRequested = false

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!e.alpha || !e.beta || !e.gamma) return

      // Calculate shake intensity from device orientation
      const intensity = Math.sqrt(
        Math.pow(e.beta || 0, 2) + 
        Math.pow(e.gamma || 0, 2)
      )

      // Threshold for shake detection (adjust as needed)
      if (intensity > 15 && !isShaking && !isRevealing) {
        handleShake()
      }

      // setShakeIntensity(intensity) // ไม่ใช้แล้ว
    }

    // Request permission for iOS 13+
    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function' && 
          !permissionRequested) {
        try {
          permissionRequested = true
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
          }
        } catch (error) {
          console.log('Device orientation permission denied:', error)
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation)
      }
    }

    requestPermission()

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [isShaking, isRevealing])

  const generateStickNumber = (): string => {
    // Generate 2-3 digit number
    const digitCount = Math.random() < 0.5 ? 2 : 3
    let number = ''
    for (let i = 0; i < digitCount; i++) {
      number += Math.floor(Math.random() * 10).toString()
    }
    return number
  }

  const getPrediction = (number: string): StickPrediction => {
    // Use last digit for prediction
    const lastDigit = number[number.length - 1]
    return STICK_PREDICTIONS[lastDigit] || {
      title: 'เลขมงคล',
      meaning: 'โชคดีและความสำเร็จ',
      fortune: 'เลขนี้เป็นเลขมงคลที่นำมาซึ่งโชคดี',
      advice: 'ควรใช้วิจารณญาณในการตัดสินใจ',
      color: '#5F1DB2',
    }
  }

  const handleShake = () => {
    if (isShaking || isRevealing || hasShakenRef.current) return

    hasShakenRef.current = true
    setIsShaking(true)
    shakeCountRef.current += 1
    lastShakeTimeRef.current = Date.now()

    // Play blessing sound
    if (window.backgroundMusic) {
      window.backgroundMusic.pause()
    }

    const blessingAudio = new Audio('/sound/give-a-blessing1.mp3')
    blessingAudio.volume = 0.7

    blessingAudio.addEventListener('ended', () => {
      if (window.backgroundMusic) {
        window.backgroundMusic.play().catch(() => {})
      }
    })

    blessingAudio.play().catch((error) => {
      console.log('Could not play blessing sound:', error)
      if (window.backgroundMusic) {
        window.backgroundMusic.play().catch(() => {})
      }
    })

    // Shake animation duration
    setTimeout(() => {
      setIsShaking(false)
      setIsRevealing(true)

      // Generate result after shake
      setTimeout(() => {
        const number = generateStickNumber()
        const prediction = getPrediction(number)
        const newResult: StickResult = {
          number,
          prediction,
          timestamp: new Date().toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        }

        setResult(newResult)
        setIsRevealing(false)
        setHistory((prev) => [newResult, ...prev].slice(0, 10))
      }, 800)
    }, 1500)
  }

  // Cleanup: resume background music when leaving page
  useEffect(() => {
    return () => {
      if (window.backgroundMusic) {
        window.backgroundMusic.play().catch(() => {})
      }
    }
  }, [])

  const handleReset = () => {
    setIsShaking(false)
    setResult(null)
    setIsRevealing(false)
    // setShakeIntensity(0) // ไม่ใช้แล้ว
    shakeCountRef.current = 0
    lastShakeTimeRef.current = 0
    hasShakenRef.current = false
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

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  }

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      y: [0, -5, 5, -5, 5, -3, 3, 0],
      rotate: [0, -5, 5, -5, 5, -2, 2, 0],
      transition: {
        duration: 0.5,
        repeat: 3,
        ease: 'easeInOut' as const,
      },
    },
  }

  const stickVariants = {
    shake: {
      x: [0, -15, 15, -15, 15, -8, 8, 0],
      y: [0, -8, 8, -8, 8, -4, 4, 0],
      rotate: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: {
        duration: 0.3,
        repeat: 5,
        ease: 'easeInOut' as const,
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
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#3024AE]/15 to-[#C86CD7]/15 rounded-full blur-3xl"
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
                กล่องเสี่ยงเซียมซี
              </h1>
              <p className="text-sm text-white/90 mt-1">
                เขย่ากระบอกเพื่อเลือกไม้เซียมซี
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          {/* Main Shake Section */}
          <div className="space-y-4">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 relative shadow-2xl border border-[#D4AF37]/30 mystical-pattern"
            >
              {/* Siamese Stick Container */}
              <div className="relative min-h-[450px] flex flex-col items-center justify-center">
                {/* Stick Container */}
                <motion.div
                  ref={containerRef}
                  variants={isShaking ? shakeVariants : {}}
                  animate={isShaking ? 'shake' : {}}
                  className="relative w-32 h-96 flex items-center justify-center"
                >
                  {/* Stick Cylinder */}
                  <motion.div
                    className="relative w-28 h-96 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 rounded-full shadow-2xl border-4 border-amber-950"
                    style={{
                      background: 'linear-gradient(180deg, #92400e 0%, #78350f 50%, #451a03 100%)',
                      boxShadow: '0 20px 60px rgba(146, 64, 14, 0.4), inset 0 0 40px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-400/20 to-transparent blur-xl"></div>
                    
                    {/* Decorative rings */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-2.5 bg-amber-950 rounded-full shadow-lg"></div>
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-20 h-2.5 bg-amber-950 rounded-full shadow-lg"></div>
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-20 h-2.5 bg-amber-950 rounded-full shadow-lg"></div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-2.5 bg-amber-950 rounded-full shadow-lg"></div>

                    {/* Sticks inside (visual representation) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 overflow-hidden">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={i}
                          variants={isShaking ? stickVariants : {}}
                          animate={isShaking ? 'shake' : {}}
                          className="w-1 h-16 bg-amber-100 rounded-full opacity-30"
                          style={{
                            transform: `rotate(${i * 15 - 30}deg)`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Revealed Stick */}
                    <AnimatePresence>
                      {result && (
                        <motion.div
                          initial={{ opacity: 0, y: -30, scale: 0.5, rotate: -180 }}
                          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, y: 20, scale: 0.8 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="absolute -top-16 left-1/2 -translate-x-1/2 z-20"
                        >
                          <motion.div
                            animate={{ 
                              boxShadow: [
                                `0 0 20px ${result.prediction.color}40`,
                                `0 0 40px ${result.prediction.color}60`,
                                `0 0 20px ${result.prediction.color}40`,
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-2xl border-2"
                            style={{ borderColor: result.prediction.color }}
                          >
                            <div className="text-center">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="text-5xl font-bold mb-3"
                                style={{ 
                                  color: result.prediction.color,
                                  textShadow: `0 0 20px ${result.prediction.color}40`
                                }}
                              >
                                {result.number}
                              </motion.div>
                              <div 
                                className="w-20 h-1.5 mx-auto rounded-full"
                                style={{ backgroundColor: result.prediction.color }}
                              ></div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Shake indicator */}
                  {isShaking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 text-center"
                    >
                      <Wand2 className="w-8 h-8 text-[#5F1DB2] mx-auto" />
                      <p className="text-xs text-gray-700 mt-1">กำลังเขย่า...</p>
                    </motion.div>
                  )}

                  {/* Revealing indicator */}
                  {isRevealing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 text-center"
                    >
                      <Sparkles className="w-8 h-8 text-[#5F1DB2] mx-auto" />
                      <p className="text-xs text-gray-700 mt-1">กำลังเลือกไม้...</p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Shake Button */}
                {!result && !isShaking && !isRevealing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                  >
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleShake}
                      className="px-10 py-5 bg-gradient-to-r from-white via-[#C86CD7] to-white text-[#3024AE] font-bold rounded-2xl transition-all text-lg mystical-glow flex items-center gap-3 relative overflow-hidden group" 
                      style={{ borderRadius: '1rem', backgroundSize: '200% 100%', animation: 'gradientShift 3s ease infinite' }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#7C3FD9] to-[#5F1DB2] opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <Wand2 className="w-6 h-6 relative z-10" />
                      <span className="relative z-10">เขย่ากระบอก</span>
                    </motion.button>
                    <p className="text-xs text-gray-700 text-center mt-4 font-medium">
                      💫 หรือเอียงเครื่องเพื่อเขย่า
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Result Section */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  variants={resultVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-2xl border border-[#D4AF37]/30 relative overflow-hidden mystical-pattern"
                >
                  {/* Decorative gradient background */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-2"
                    style={{ 
                      background: `linear-gradient(90deg, ${result.prediction.color}40, ${result.prediction.color}80, ${result.prediction.color}40)`
                    }}
                  />
                  
                  <div className="text-center mb-8">
                    <motion.h2 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-[#3024AE] mb-6 flex items-center justify-center gap-3"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-6 h-6 text-[#3024AE]" />
                      </motion.div>
                      <span>เลขที่ได้จากเซียมซี</span>
                    </motion.h2>
                    
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="mb-8"
                    >
                      <div 
                        className="text-7xl font-bold mb-2 inline-block"
                        style={{ 
                          color: result.prediction.color,
                          textShadow: `0 0 30px ${result.prediction.color}40, 0 4px 8px rgba(0,0,0,0.1)`
                        }}
                      >
                        {result.number}
                      </div>
                    </motion.div>

                    {/* Prediction Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-6 mb-8"
                    >
                      {/* Title */}
                      <div 
                        className="rounded-2xl p-6 text-left"
                        style={{ 
                          background: `linear-gradient(135deg, ${result.prediction.color}15, ${result.prediction.color}05)`,
                          border: `2px solid ${result.prediction.color}30`
                        }}
                      >
                        <h3 
                          className="text-xl font-bold mb-3"
                          style={{ color: result.prediction.color }}
                        >
                          {result.prediction.title}
                        </h3>
                        <p className="text-gray-700 text-base leading-relaxed mb-4">
                          {result.prediction.meaning}
                        </p>
                      </div>

                      {/* Detailed Analysis */}
                      {result.prediction.detailedAnalysis && (
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">🔮</div>
                            <div className="flex-1 text-left">
                              <h4 className="font-bold text-[#3024AE] mb-2 text-sm">การวิเคราะห์เชิงลึก</h4>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {result.prediction.detailedAnalysis}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Fortune */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">✨</div>
                          <div className="flex-1 text-left">
                            <h4 className="font-bold text-[#3024AE] mb-2 text-sm">คำทำนาย</h4>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {result.prediction.fortune}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Advice */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">💡</div>
                          <div className="flex-1 text-left">
                            <h4 className="font-bold text-[#3024AE] mb-2 text-sm">คำแนะนำ</h4>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {result.prediction.advice}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      {(result.prediction.luckyDirections || result.prediction.luckyColors || result.prediction.luckyDays || result.prediction.additionalNumbers) && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">🌟</div>
                            <div className="flex-1 text-left">
                              <h4 className="font-bold text-[#3024AE] mb-3 text-sm">ข้อมูลเสริม</h4>
                              <div className="space-y-3">
                                {result.prediction.luckyDirections && result.prediction.luckyDirections.length > 0 && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 mb-1">ทิศมงคล:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {result.prediction.luckyDirections.map((dir, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                          {dir}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {result.prediction.luckyColors && result.prediction.luckyColors.length > 0 && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 mb-1">สีมงคล:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {result.prediction.luckyColors.map((color, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                          {color}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {result.prediction.luckyDays && result.prediction.luckyDays.length > 0 && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 mb-1">วันมงคล:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {result.prediction.luckyDays.map((day, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                          {day}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {result.prediction.additionalNumbers && result.prediction.additionalNumbers.length > 0 && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 mb-1">เลขเสริม:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {result.prediction.additionalNumbers.map((num, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gradient-to-br from-[#3024AE]/30 to-[#C86CD7]/30 border-2 border-[#C86CD7]/60 text-[#3024AE] font-bold rounded-lg text-xs">
                                          {num}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Warnings */}
                      {result.prediction.warnings && result.prediction.warnings.length > 0 && (
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">⚠️</div>
                            <div className="flex-1 text-left">
                              <h4 className="font-bold text-[#3024AE] mb-2 text-sm">ข้อควรระวัง</h4>
                              <ul className="space-y-1">
                                {result.prediction.warnings.map((warning, idx) => (
                                  <li key={idx} className="text-gray-700 text-sm leading-relaxed flex items-start gap-2">
                                    <span className="text-yellow-600">•</span>
                                    <span>{warning}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
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
                      เขย่าใหม่อีกครั้ง
                    </motion.button>
                    {onNavigateHome && (
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
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
          </div>

          {/* History Section */}
          <div className="space-y-4">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-white/40" style={{ borderRadius: '1.5rem' }}
            >
              <h2 className="text-xl font-bold mb-6 text-[#3024AE] flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#3024AE]" />
                <span>ประวัติการเสี่ยงเซียมซี</span>
              </h2>
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">📜</div>
                  <p className="text-gray-500 text-sm">
                    ยังไม่มีประวัติการเสี่ยงเซียมซี
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {history.map((item, index) => (
                      <motion.div
                        key={`${item.number}-${item.timestamp}`}
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-r from-[#D4AF37]/10 to-[#5F1DB2]/10 rounded-xl p-4 border border-[#D4AF37]/30 hover:border-[#D4AF37]/50 transition-all hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span 
                                className="text-2xl font-bold"
                                style={{ color: item.prediction.color }}
                              >
                                {item.number}
                              </span>
                              <span 
                                className="text-xs font-semibold px-2 py-1 rounded-full"
                                style={{ 
                                  backgroundColor: `${item.prediction.color}20`,
                                  color: item.prediction.color
                                }}
                              >
                                {item.prediction.title}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {item.prediction.meaning}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
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
                ⚠️ เลขที่ได้จากการเสี่ยงเซียมซีนี้สร้างขึ้นเพื่อความบันเทิงเท่านั้น ไม่รับประกันผลลอตเตอรี่ทุกกรณี กรุณาเล่นอย่างมีสติ
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

