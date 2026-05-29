import { useState } from 'react'
import StatusBar from '../components/StatusBar'
import onboardingFirstVideo from '../assets/onbording/onboarding01.mp4'
import onboardingSecondVideo from '../assets/onbording/onboarding02.mp4'
import onboardingThirdVideo from '../assets/onbording/onboarding03.mp4'
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
}

function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [dragStartX, setDragStartX] = useState<number | null>(null)

  const lastSlideIndex = onboardingItems.length - 1

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

  return (
    <main className="onboarding_page">
      <StatusBar />
      <section
        className="onboarding_wrap"
        aria-label="온보딩"
        onPointerDown={(event) => handleDragStart(event.clientX)}
        onPointerUp={(event) => handleDragEnd(event.clientX)}
        onPointerCancel={() => setDragStartX(null)}
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
                    autoPlay
                    muted
                    loop
                    playsInline
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
      </section>
    </main>
  )
}

export default Onboarding
