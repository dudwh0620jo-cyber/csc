import { useEffect, useRef, useState } from 'react'
import StatusBar from '../components/StatusBar'
import onboardingFirstVideo from '../assets/onbording/onboarding01.mp4'
import onboardingSecondVideo from '../assets/onbording/onboarding02.mp4'
import onboardingThirdVideo from '../assets/onbording/onboarding03.mp4'
import handUpIcon from '../assets/svg/bxs_hand-up.svg'
import '../style/onboarding.css'

const onboardingItems = [
  {
    video: onboardingFirstVideo,
    title: ['아이의 안전을 위한', '필수 생존 능력'],
  },
  {
    video: onboardingSecondVideo,
    title: ['성장기에 가장 적합한', '전신 운동'],
  },
  {
    video: onboardingThirdVideo,
    title: ['안전과 위생을 최우선으로 한', '수영 환경'],
  },
]

const slideMoveThreshold = 50

type OnboardingProps = {
  onComplete: () => void
  onDebugHome?: () => void
}

function Onboarding({ onComplete, onDebugHome }: OnboardingProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])

  const lastSlideIndex = onboardingItems.length - 1

  const playCurrentVideo = () => {
    const currentVideo = videoRefs.current[currentSlideIndex]

    if (!currentVideo) {
      return
    }

    currentVideo.muted = true
    currentVideo.defaultMuted = true
    currentVideo.playsInline = true

    void currentVideo.play().catch(() => {
      // Mobile browsers can still block autoplay in power-saving modes.
    })
  }

  useEffect(() => {
    playCurrentVideo()
  }, [currentSlideIndex])

  const moveToPreviousSlide = () => {
    setCurrentSlideIndex((previousIndex) => Math.max(previousIndex - 1, 0))
  }

  const moveToNextSlide = () => {
    if (currentSlideIndex === lastSlideIndex) {
      onComplete()
      return
    }

    setCurrentSlideIndex((previousIndex) => previousIndex + 1)
  }

  const handleDragStart = (clientX: number) => {
    setDragStartX(clientX)
  }

  const handleDragEnd = (clientX: number) => {
    if (dragStartX === null) {
      return
    }

    const dragDistance = clientX - dragStartX

    if (dragDistance > slideMoveThreshold) {
      moveToPreviousSlide()
    }

    if (dragDistance < -slideMoveThreshold) {
      moveToNextSlide()
    }

    setDragStartX(null)
  }

  const moveToHomeForDebug = () => {
    if (currentSlideIndex !== 0) {
      return
    }

    onDebugHome?.()
  }

  return (
    <main className="onboarding_page">
      <StatusBar />
      <section
        className="onboarding_wrap"
        aria-label="온보딩"
        onPointerDown={(event) => handleDragStart(event.clientX)}
        onPointerUp={(event) => handleDragEnd(event.clientX)}
        onPointerCancel={() => setDragStartX(null)}
        onDoubleClick={moveToHomeForDebug}
      >
        <div
          className="onboarding_track"
          style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
        >
          {onboardingItems.map((onboardingItem, slideIndex) => (
            <article
              className="onboarding_slide"
              aria-hidden={slideIndex !== currentSlideIndex}
              key={onboardingItem.video}
            >
              <div className="onboarding_inner">
                <button className="onboarding_skip" type="button" onClick={onComplete}>
                  skip
                </button>

                <div className="onboarding_visual" aria-hidden="true">
                  <video
                    className="onboarding_video"
                    ref={(element) => {
                      videoRefs.current[slideIndex] = element
                    }}
                    autoPlay
                    muted
                    defaultMuted
                    loop
                    playsInline
                    preload="auto"
                    onCanPlay={slideIndex === currentSlideIndex ? playCurrentVideo : undefined}
                  >
                    <source src={onboardingItem.video} type="video/mp4" />
                  </video>
                </div>

                <h1 className="onboarding_title">
                  {onboardingItem.title.map((titleLine) => (
                    <span className="onboarding_title_line" key={titleLine}>
                      {titleLine}
                    </span>
                  ))}
                </h1>
              </div>
            </article>
          ))}
        </div>
        <div
          className="onboarding_indicator"
          aria-label="온보딩 화면 선택"
          onPointerDown={(event) => event.stopPropagation()}
        >
          {onboardingItems.map((_, itemIndex) => (
            <button
              className={
                itemIndex === currentSlideIndex
                  ? 'onboarding_indicator_dot onboarding_indicator_dot_active'
                  : 'onboarding_indicator_dot'
              }
              type="button"
              aria-label={`${itemIndex + 1}번째 온보딩 보기`}
              aria-current={itemIndex === currentSlideIndex ? 'step' : undefined}
              key={itemIndex}
              onClick={() => setCurrentSlideIndex(itemIndex)}
            />
          ))}
        </div>
        <div className="onboarding_swipe_hint" aria-hidden="true">
          <span className="onboarding_swipe_motion">
            <img className="onboarding_swipe_icon" src={handUpIcon} alt="" />
          </span>
          <span className="onboarding_swipe_text">스와이프로 이동하기</span>
        </div>
      </section>
    </main>
  )
}

export default Onboarding
