import { useState } from 'react'
import Login from './pages/Login'
import Main from './pages/Main'
import Onboarding from './pages/Onboarding'
import Splash from './pages/Splash'
import Signup from './pages/Signup'
import { initialSignupProfile, type SignupProfile } from './data/signupData'
import type { CompletedLessonApplication, CompletedShuttleApplication } from './types/schedule'

type AppView = 'splash' | 'onboarding' | 'login' | 'signup' | 'profile_edit' | 'main'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('splash')
  const [signupProfile, setSignupProfile] = useState<SignupProfile>(initialSignupProfile)
  const [verifiedPhoneFields, setVerifiedPhoneFields] = useState<Array<keyof SignupProfile>>([])
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
