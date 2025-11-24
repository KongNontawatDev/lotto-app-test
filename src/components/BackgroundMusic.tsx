import { useEffect, useRef } from 'react'

// เก็บ audio reference ใน window object เพื่อให้ components อื่นเข้าถึงได้
declare global {
  interface Window {
    backgroundMusic?: HTMLAudioElement
  }
}

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // สร้าง audio element
    const audio = new Audio('/sound/sound-bg.mp3')
    audio.loop = true
    audio.volume = 0.5 // ตั้งค่าระดับเสียง 50%
    audio.preload = 'auto' // โหลดไฟล์ล่วงหน้า
    
    // เก็บ reference ทั้งใน ref และ window object
    audioRef.current = audio
    window.backgroundMusic = audio
    
    // พยายามเล่นเพลงทันที
    const playAudio = async () => {
      try {
        await audio.play()
      } catch (error) {
        // ถ้าไม่สามารถเล่นได้ (browser autoplay policy)
        // รอ user interaction แล้วเล่น
        const handleUserInteraction = () => {
          audio.play().catch(() => {})
          // ลบ event listeners หลังจากเล่นแล้ว
          document.removeEventListener('click', handleUserInteraction, { once: true })
          document.removeEventListener('touchstart', handleUserInteraction, { once: true })
          document.removeEventListener('keydown', handleUserInteraction, { once: true })
        }
        document.addEventListener('click', handleUserInteraction, { once: true })
        document.addEventListener('touchstart', handleUserInteraction, { once: true })
        document.addEventListener('keydown', handleUserInteraction, { once: true })
      }
    }
    
    // เริ่มเล่นทันที
    playAudio()

    // Cleanup เมื่อ component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
      if (window.backgroundMusic) {
        window.backgroundMusic = undefined
      }
    }
  }, [])

  return null // Component นี้ไม่ render อะไร
}

