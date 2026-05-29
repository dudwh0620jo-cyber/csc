import { useState } from 'react'
import BottomNavigation, { type BottomNavigationId } from '../components/BottomNavigation'
import StatusBar from '../components/StatusBar'
import '../style/main.css'

const mainTabTitles: Record<BottomNavigationId, string> = {
  home: '홈',
  schedule: '시간표',
  board: '게시판',
  my: '마이페이지',
}

function Main() {
  const [activeNavigationId, setActiveNavigationId] = useState<BottomNavigationId>('schedule')

  return (
    <main className="main_page">
      <StatusBar />
      <section className="main_content" aria-label={mainTabTitles[activeNavigationId]}>
        <h1 className="main_title">{mainTabTitles[activeNavigationId]}</h1>
      </section>
      <BottomNavigation activeNavigationId={activeNavigationId} onChange={setActiveNavigationId} />
    </main>
  )
}

export default Main
