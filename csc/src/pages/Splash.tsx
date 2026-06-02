import { useEffect, useState } from 'react'
import logoTextImage from '../assets/logo/logo_text.png'
import '../style/splash.css'

type SplashProps = {
  onComplete: () => void
}

function Splash({ onComplete }: SplashProps) {
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => {
      setIsLeaving(true)
    }, 700)

    const completeTimer = window.setTimeout(() => {
      onComplete()
    }, 1400)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <main className={isLeaving ? 'splash_page splash_page_leaving' : 'splash_page'} aria-label="시작 화면">
      <img className="splash_logo" src={logoTextImage} alt="CSC 스위밍 아카데미" />
    </main>
  )
}

export default Splash
