import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Main from './pages/Main'
import Onboarding from './pages/Onboarding'
import Splash from './pages/Splash'
import Signup from './pages/Signup'
import { initialSignupProfile, type SignupProfile } from './data/signupData'
import type { CompletedLessonApplication, CompletedShuttleApplication } from './types/schedule'

type AppView = 'splash' | 'onboarding' | 'login' | 'signup' | 'profile_edit' | 'main'

const findScrollableParent = (target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    return null
  }

  let currentElement: Element | null = target

  while (currentElement && currentElement !== document.body) {
    const style = window.getComputedStyle(currentElement)
    const canScrollY = /(auto|scroll)/.test(style.overflowY)

    if (canScrollY && currentElement.scrollHeight > currentElement.clientHeight) {
      return currentElement
    }

    currentElement = currentElement.parentElement
  }

  return document.getElementById('root')
}

const usePreventOverscrollBounce = () => {
  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0

    const handleTouchStart = (event: TouchEvent) => {
      const firstTouch = event.touches[0]

      touchStartX = firstTouch.clientX
      touchStartY = firstTouch.clientY
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        return
      }

      const firstTouch = event.touches[0]
      const deltaX = firstTouch.clientX - touchStartX
      const deltaY = firstTouch.clientY - touchStartY

      if (Math.abs(deltaY) <= Math.abs(deltaX)) {
        return
      }

      const scrollableElement = findScrollableParent(event.target)

      if (!scrollableElement) {
        event.preventDefault()
        return
      }

      const isPullingDown = deltaY > 0
      const isPushingUp = deltaY < 0
      const isAtTop = scrollableElement.scrollTop <= 0
      const isAtBottom =
        scrollableElement.scrollTop + scrollableElement.clientHeight >= scrollableElement.scrollHeight - 1

      if ((isPullingDown && isAtTop) || (isPushingUp && isAtBottom)) {
        event.preventDefault()
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])
}

function App() {
  usePreventOverscrollBounce()

  const [currentView, setCurrentView] = useState<AppView>('splash')
  const [signupProfile, setSignupProfile] = useState<SignupProfile>(initialSignupProfile)
  const [verifiedPhoneFields, setVerifiedPhoneFields] = useState<Array<keyof SignupProfile>>([
    'studentPhone',
    'parentPhone',
  ])
  const [mainInitialNavigationId, setMainInitialNavigationId] = useState<'home' | 'my'>('home')
  const [completedLessonApplications, setCompletedLessonApplications] = useState<CompletedLessonApplication[]>([])
  const [completedShuttleApplications, setCompletedShuttleApplications] = useState<CompletedShuttleApplication[]>([])

  if (currentView === 'main') {
    return (
      <Main
        completedLessonApplications={completedLessonApplications}
        completedShuttleApplications={completedShuttleApplications}
        initialNavigationId={mainInitialNavigationId}
        signupProfile={signupProfile}
        onCompleteLessonApplication={(application) =>
          setCompletedLessonApplications((currentApplications) =>
            currentApplications.some((currentApplication) => currentApplication.id === application.id)
              ? currentApplications
              : [...currentApplications, application],
          )
        }
        onCompleteShuttleApplication={(application) =>
          setCompletedShuttleApplications((currentApplications) =>
            currentApplications.some((currentApplication) => currentApplication.id === application.id)
              ? currentApplications
              : [...currentApplications, application],
          )
        }
        onExitToLogin={() => {
          setMainInitialNavigationId('home')
          setCurrentView('login')
        }}
        onEditProfile={() => {
          setMainInitialNavigationId('my')
          setCurrentView('profile_edit')
        }}
      />
    )
  }

  if (currentView === 'signup') {
    return (
      <Signup
        initialVerifiedPhoneFields={verifiedPhoneFields}
        onBack={() => setCurrentView('login')}
        onComplete={(profile, nextVerifiedPhoneFields) => {
          setSignupProfile(profile)
          setVerifiedPhoneFields(nextVerifiedPhoneFields)
          setMainInitialNavigationId('home')
          setCurrentView('main')
        }}
      />
    )
  }

  if (currentView === 'profile_edit') {
    return (
      <Signup
        initialProfile={signupProfile}
        initialStep="profile"
        initialVerifiedPhoneFields={verifiedPhoneFields}
        onBack={() => setCurrentView('main')}
        onComplete={(profile, nextVerifiedPhoneFields) => {
          setSignupProfile(profile)
          setVerifiedPhoneFields(nextVerifiedPhoneFields)
          setMainInitialNavigationId('my')
          setCurrentView('main')
        }}
      />
    )
  }

  if (currentView === 'login') {
    return <Login onSignup={() => setCurrentView('signup')} />
  }

  if (currentView === 'splash') {
    return <Splash onComplete={() => setCurrentView('onboarding')} />
  }

  return <Onboarding onComplete={() => setCurrentView('login')} onDebugHome={() => setCurrentView('main')} />
}

export default App
