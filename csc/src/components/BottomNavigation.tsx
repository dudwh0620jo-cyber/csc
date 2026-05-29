import calendarIcon from '../assets/svg/calender.svg'
import homeIcon from '../assets/svg/home.svg'
import myIcon from '../assets/svg/my.svg'
import noticeBoardIcon from '../assets/svg/notice_board.svg'

const bottomNavigationItems = [
  {
    id: 'home' as const,
    label: '홈',
    icon: homeIcon,
  },
  {
    id: 'schedule' as const,
    label: '시간표',
    icon: calendarIcon,
  },
  {
    id: 'board' as const,
    label: '게시판',
    icon: noticeBoardIcon,
  },
  {
    id: 'my' as const,
    label: '마이페이지',
    icon: myIcon,
  },
]

export type BottomNavigationId = (typeof bottomNavigationItems)[number]['id']

type BottomNavigationProps = {
  activeNavigationId: BottomNavigationId
  onChange: (navigationId: BottomNavigationId) => void
}

function BottomNavigation({ activeNavigationId, onChange }: BottomNavigationProps) {
  return (
    <nav className="bottom_nav" aria-label="하단 메뉴">
      <div className="bottom_nav_list">
        {bottomNavigationItems.map((navigationItem) => {
          const isActive = navigationItem.id === activeNavigationId

          return (
            <button
              className={isActive ? 'bottom_nav_item bottom_nav_item_active' : 'bottom_nav_item'}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              key={navigationItem.id}
              onClick={() => onChange(navigationItem.id)}
            >
              <img className="bottom_nav_icon" src={navigationItem.icon} alt="" />
              <span className="bottom_nav_label">{navigationItem.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation
