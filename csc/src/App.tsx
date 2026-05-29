import { useState } from 'react'
import Login from './pages/Login'
import Main from './pages/Main'
import Onboarding from './pages/Onboarding'
import Signup from './pages/Signup'

type AppView = 'onboarding' | 'login' | 'signup' | 'main'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('onboarding')

  if (currentView === 'main') {
    return <Main />
  }

  if (currentView === 'signup') {
    return <Signup onBack={() => setCurrentView('login')} onComplete={() => setCurrentView('main')} />
  }

  if (currentView === 'login') {
    return <Login onSignup={() => setCurrentView('signup')} />
  }

  return <Onboarding onComplete={() => setCurrentView('login')} />
}

export default App
