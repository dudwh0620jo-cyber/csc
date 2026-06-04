import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BottomNavigation, { type BottomNavigationId } from '../components/BottomNavigation'
import StatusBar from '../components/StatusBar'
import BoardScreen from './Board'
import MyPageScreen from './MyPage'
import ScheduleScreen from './Schedule'
import useSwipeGesture from '../hooks/useSwipeGesture'
import alertIcon from '../assets/svg/alart.svg'
import alertArrowIcon from '../assets/svg/arrrrrow.svg'
import arrowFullIcon from '../assets/svg/arrow_full.svg'
import backIcon from '../assets/svg/back.svg'
import calendarIcon from '../assets/svg/pajamas_calendar.svg'
import phoneIcon from '../assets/svg/akar-icons_phone.svg'
import shareIcon from '../assets/svg/share.svg'
import togetherIcon from '../assets/svg/together.svg'
import viewerArrowIcon from '../assets/svg/memory_arrow-up-bold.svg'
import facilitiesImage from '../assets/home/facilities.png'
import homeBackgroundImage from '../assets/home/home_background.png'
import instructorImage from '../assets/home/instructor.png'
import profileImage from '../assets/home/profile.png'
import swimAdultsImage from '../assets/home/swim_ad.png'
import swimElementaryImage from '../assets/home/swim_el.png'
import swimGoodImage from '../assets/home/swim_good.png'
import swimMastersImage from '../assets/home/swim_ma.png'
import swimToddlersImage from '../assets/home/swim_to.png'
import facility01Image from '../assets/facilities/fa01.png'
import facility02Image from '../assets/facilities/fa02.png'
import facility03Image from '../assets/facilities/fa03.png'
import facility04Image from '../assets/facilities/fa04.png'
import facility05Image from '../assets/facilities/fa05.png'
import facility06Image from '../assets/facilities/fa06.png'
import facility07Image from '../assets/facilities/fa07.png'
import facility08Image from '../assets/facilities/fa08.png'
import facility09Image from '../assets/facilities/fa09.png'
import facility10Image from '../assets/facilities/fa10.png'
import facility11Image from '../assets/facilities/fa11.png'
import facility13Image from '../assets/facilities/fa13.png'
import facility14Image from '../assets/facilities/fa14.png'
import facility15Image from '../assets/facilities/fa15.png'
import instructor01Image from '../assets/facilities/in01.png'
import instructor02Image from '../assets/facilities/in02.png'
import instructor03Image from '../assets/facilities/in03.png'
import instructor04Image from '../assets/facilities/in04.png'
import instructor05Image from '../assets/facilities/in05.png'
import instructor06Image from '../assets/facilities/in06.png'
import waveImage from '../assets/home/wave.png'
import logoImage from '../assets/logo/logo_l.png'
import noticeProfile02Image from '../assets/notice/profile02.jpg'
import noticeProfile04Image from '../assets/notice/profile04.png'
import type { SignupProfile } from '../data/signupData'
import type { CompletedLessonApplication, CompletedShuttleApplication } from '../types/schedule'
import '../style/main.css'

const mainTabTitles: Record<BottomNavigationId, string> = {
  home: '홈',
  schedule: '시간표',
  board: '게시판',
  my: '마이페이지',
}

const mobileViewerPlayStoreUrl =
  'https://play.google.com/store/search?q=%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EB%B7%B0%EC%96%B4&c=apps'
const mobileViewerAppStoreUrl =
  'https://apps.apple.com/kr/app/%EA%B5%AC-%EB%AA%A8%EB%B0%94%EC%9D%BC%EB%B7%B0%EC%96%B4/id770575783'
const homeNextLessonWeekdays = [1, 3]
const homeNextLessonStartTime = '16:00'
const homeNextLessonEndTime = '16:50'
const homeDayLabels = ['일', '월', '화', '수', '목', '금', '토']

type TimetableId = 'toddlers' | 'elementary' | 'adults' | 'masters'
type InfoTabId = 'facilities' | 'instructors' | 'necessity'
type HomeDetailView = 'home' | 'facilities' | 'alerts'
type AlertTabId = 'notice' | 'ride'

const infoTabs: Array<{ id: InfoTabId; label: string }> = [
  { id: 'facilities', label: '시설 소개' },
  { id: 'instructors', label: '운영진·강사 소개' },
  { id: 'necessity', label: '수영의 필요성' },
]

const infoTabTitles: Record<InfoTabId, string> = {
  facilities: '시설 소개',
  instructors: '운영진·강사 소개',
  necessity: '수영의 필요성',
}

const alertItems = [
  {
    id: 'notice-01',
    category: '휴뮤/등록 안내',
    title: '6월 수업 재등록 기간',
    author: '변금주 매니저',
    date: '5월 18일',
    profileImage: noticeProfile02Image,
  },
  {
    id: 'notice-02',
    category: '공지',
    title: '회원분들을 위한 수영 교육 콘텐츠 안내',
    author: '오수빈 강사',
    date: '5월 3일',
    profileImage: noticeProfile04Image,
  },
]

const rideAlertGroups = [
  {
    month: '2026년 6월',
    items: [
      {
        id: 'ride-01',
        category: '하차 안내',
        title: '안도훈 학생이 천곡 어린이집에서\n안전하게 하차하였습니다.',
        author: '1호차',
        date: '6월 1일',
      },
      {
        id: 'ride-02',
        category: '하차 안내',
        title: '안도훈 학생이 천곡 어린이집에서\n안전하게 승차하였습니다.',
        author: '1호차',
        date: '6월 1일',
      },
    ],
  },
  {
    month: '2026년 5월',
    items: [
      {
        id: 'ride-03',
        category: '하차 안내',
        title: '안도훈 학생이 천곡 어린이집에서\n안전하게 하차하였습니다.',
        author: '1호차',
        date: '5월 27일',
      },
      {
        id: 'ride-04',
        category: '하차 안내',
        title: '안도훈 학생이 천곡 어린이집에서\n안전하게 승차하였습니다.',
        author: '1호차',
        date: '5월 27일',
      },
      {
        id: 'ride-05',
        category: '하차 안내',
        title: '안도훈 학생이 천곡 어린이집에서\n안전하게 하차하였습니다.',
        author: '1호차',
        date: '5월 25일',
      },
      {
        id: 'ride-06',
        category: '하차 안내',
        title: '안도훈 학생이 천곡 어린이집에서\n안전하게 승차하였습니다.',
        author: '1호차',
        date: '5월 25일',
      },
    ],
  },
]

const facilitySections = [
  {
    number: '01',
    title: '안내 데스크 & 상담 공간',
    images: [facility01Image, facility02Image],
    descriptions: [
      '입구 우측 인포데스크 및 상담 공간 운영',
      '프로그램 및 강사진 정보는 내부 디스플레이를 통해 안내',
      '수영장 내부는 통유리 구조로 개방감 있게 관람 가능',
    ],
  },
  {
    number: '02',
    title: '케어존',
    images: [facility03Image, facility04Image],
    descriptions: ['탈의실 입구 앞 케어존 운영', '수업 전후 드라이 및 케어 진행', '어린이 전용 안마 의자 비치'],
  },
  {
    number: '03',
    title: '수영장',
    images: [facility05Image, facility06Image, facility07Image, facility08Image],
    descriptions: ['청결 상태를 상시 유지', '개인별 맞춤 수업 관리 가능', '넓은 동선과 구조로 쾌적한 이용'],
  },
  {
    number: '04',
    title: '수질 관리 시스템',
    images: [facility09Image],
    descriptions: [
      '친환경 해수풀 시스템 운영',
      '전기분해 방식으로 피부 및 눈 자극 최소화',
      '여과기 순환 1일 8~10회 유지',
      '수온 31~33°C 유지 (사계절 일정 온도)',
    ],
  },
  {
    number: '05',
    title: '탈의실 & 샤워실',
    images: [facility10Image, facility11Image, facility13Image, facility14Image],
    descriptions: [
      '남녀 탈의실 및 샤워실 완전 분리',
      '어린이 눈높이에 맞춘 시설 설계',
      '개인별 신발장 및 탈의 바구니 제공',
      '어린이 전용 샴푸 및 바디워시 구비',
      '미끄럼 방지 바닥 적용',
    ],
  },
  {
    number: '06',
    title: '안전 소통창',
    images: [facility15Image],
    descriptions: ['수영장 내부와 외부를 연결하는 소통창 운영', '비상 상황 시 빠른 대응 가능', '전반적인 시설 안전 중심 설계'],
  },
]

const instructorImages = [
  instructor01Image,
  instructor02Image,
  instructor03Image,
  instructor04Image,
  instructor05Image,
  instructor06Image,
]

const instructorImageByName: Record<string, string> = {
  '천호현 강사': instructor01Image,
  '김흥준 강사': instructor02Image,
  '김수민 강사': instructor02Image,
  '이현민 강사': instructor03Image,
  '이현미 강사': instructor03Image,
  '이남억 강사': instructor04Image,
  '이남호 강사': instructor04Image,
  '오수빈 강사': instructor05Image,
  '강영훈 강사': instructor06Image,
}

const bottomNavigationOrder: BottomNavigationId[] = ['home', 'schedule', 'board', 'my']

const swimmingNeedSections = [
  {
    number: '01',
    title: '자신의 안전을 지키는 능력',
    placeholders: ['수상 안전 사진', '구조 교육 사진'],
    descriptions: ['위급 상황에서 스스로를 보호할 수 있는 필수 기술', '기본적인 수영 능력은 생존과 직결'],
  },
  {
    number: '02',
    title: '관절에 부담이 적은 전신 운동',
    placeholders: ['수영 동작 사진', '수영 자세 사진'],
    descriptions: ['물속에서 이루어져 신체 충격이 현저히 적음', '남녀노소 누구나 부담 없이 시작할 수 있음'],
  },
  {
    number: '03',
    title: '건강과 체력 향상',
    placeholders: ['건강한 수영 사진', '체력 향상 사진'],
    descriptions: ['심폐 기능을 강화하고 전신 근육을 고르게 발달', '규칙적인 수영으로 건강한 신체 유지'],
  },
  {
    number: '04',
    title: '평생 이어지는 기술',
    placeholders: ['수영 교습 사진', '성인 수업 사진'],
    descriptions: ['일시적인 운동이 아닌 평생 활용할 수 있는 능력', '언제 어디서든 활용 가능한 중요한 생활 기술'],
  },
  {
    number: '05',
    title: '다양한 활동의 기초',
    placeholders: ['수상 스포츠 사진', '레저 활동 사진'],
    descriptions: ['다양한 수상 스포츠로 이어지는 기본 능력', '더 넓은 여가 활동의 든든한 기반'],
  },
]

const timetableItems: Array<{
  id: TimetableId
  title: string
  capacity: string
  accentClassName: string
  image: string
  lines: string[]
}> = [
  {
    id: 'toddlers',
    title: '유아반',
    capacity: '1:4 책임담임제',
    accentClassName: 'home_timetable_name_toddlers',
    image: swimToddlersImage,
    lines: [
      '주 1회/2회/3회 선택 가능',
      '(유아반은 체험 후 입회 신청 가능)',
      '월~금: 15~20시 (50분 수업/10분 케어)',
      '토: 9~13시 (50분 수업/10분 케어)',
      '셔틀 지원',
    ],
  },
  {
    id: 'elementary',
    title: '초등반',
    capacity: '1:5 책임담임제',
    accentClassName: 'home_timetable_name_elementary',
    image: swimElementaryImage,
    lines: [
      '주 1회/2회/3회 선택 가능',
      '월~금: 15~20시 (50분 수업/10분 케어)',
      '토: 9~13시 (50분 수업/10분 케어)',
      '셔틀 지원',
    ],
  },
  {
    id: 'adults',
    title: '성인반',
    capacity: '정원 10명',
    accentClassName: 'home_timetable_name_adults',
    image: swimAdultsImage,
    lines: [
      '주 2회/3회/5회 선택 가능',
      '(2회: 화/목, 3회: 월/수/금, 5회: 월~금)',
      '새벽반: 6시 30분(50분 수업)',
      '저녁반: 21시 10분(50분 수업)',
    ],
  },
  {
    id: 'masters',
    title: '마스터즈\n엘리트반',
    capacity: '정원 10명',
    accentClassName: 'home_timetable_name_masters',
    image: swimMastersImage,
    lines: ['주 3회', '월/수/금: 20시', '셔틀 지원'],
  },
]

const addHomeDateDays = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)

const isHomeNextLessonDay = (date: Date) => homeNextLessonWeekdays.includes(date.getDay())

const getHomeNextLesson = () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayLessonEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 50, 0)
  let candidate = today

  if (now > todayLessonEnd) {
    candidate = addHomeDateDays(candidate, 1)
  }

  while (!isHomeNextLessonDay(candidate)) {
    candidate = addHomeDateDays(candidate, 1)
  }

  const dayDiff = Math.round((candidate.getTime() - today.getTime()) / 86400000)

  return {
    dateText: `${candidate.getFullYear()}. ${candidate.getMonth() + 1}. ${candidate.getDate()} (${homeDayLabels[candidate.getDay()]}) ${homeNextLessonStartTime}~${homeNextLessonEndTime}`,
    dDayText: dayDiff === 0 ? 'D-DAY' : `D-${dayDiff}`,
  }
}

type MainProps = {
  completedLessonApplications: CompletedLessonApplication[]
  completedShuttleApplications: CompletedShuttleApplication[]
  initialNavigationId?: BottomNavigationId
  signupProfile: SignupProfile
  onCompleteLessonApplication: (application: CompletedLessonApplication) => void
  onCompleteShuttleApplication: (application: CompletedShuttleApplication) => void
  onExitToLogin: () => void
  onEditProfile: () => void
}

function Main({
  completedLessonApplications,
  completedShuttleApplications,
  initialNavigationId = 'home',
  signupProfile,
  onCompleteLessonApplication,
  onCompleteShuttleApplication,
  onExitToLogin,
  onEditProfile,
}: MainProps) {
  const [activeNavigationId, setActiveNavigationId] = useState<BottomNavigationId>(initialNavigationId)
  const [isInstructorOverlayOpen, setIsInstructorOverlayOpen] = useState(false)
  const [initialInstructorImage, setInitialInstructorImage] = useState<string | null>(null)
  const [scheduleResetKey, setScheduleResetKey] = useState(0)
  const visitedNavigationIdsRef = useRef<Set<BottomNavigationId>>(new Set())

  useEffect(() => {
    if (visitedNavigationIdsRef.current.has(activeNavigationId)) {
      return
    }

    visitedNavigationIdsRef.current.add(activeNavigationId)
    window.scrollTo({ top: 0, left: 0 })
  }, [activeNavigationId])

  const changeNavigation = (navigationId: BottomNavigationId) => {
    if (navigationId === 'schedule') {
      setScheduleResetKey((previousKey) => previousKey + 1)
    }

    setActiveNavigationId(navigationId)
  }

  const moveNavigationBySwipe = (direction: -1 | 1) => {
    const activeIndex = bottomNavigationOrder.indexOf(activeNavigationId)
    const nextNavigationId = bottomNavigationOrder[activeIndex + direction]

    if (!nextNavigationId) {
      return
    }

    changeNavigation(nextNavigationId)
  }

  const mainSwipeGesture = useSwipeGesture({
    onSwipeLeft: () => moveNavigationBySwipe(1),
    onSwipeRight: () => moveNavigationBySwipe(-1),
    shouldIgnoreSwipe: (event) => {
      const target = event.target

      return target instanceof Element && Boolean(target.closest('[data-swipe-back-root], .bottom_nav'))
    },
  })

  return (
    <main className="main_page" {...mainSwipeGesture}>
      <StatusBar />
      <section className="main_content" aria-label={mainTabTitles[activeNavigationId]}>
        {activeNavigationId === 'home' && <HomeScreen signupProfile={signupProfile} />}
        {activeNavigationId === 'schedule' && (
          <ScheduleScreen
            resetKey={scheduleResetKey}
            signupProfile={signupProfile}
            onCompleteLessonApplication={onCompleteLessonApplication}
            onCompleteShuttleApplication={onCompleteShuttleApplication}
            onOpenInstructorInfo={(instructorName) => {
              setInitialInstructorImage(instructorImageByName[instructorName] ?? null)
              setIsInstructorOverlayOpen(true)
            }}
          />
        )}
        {activeNavigationId === 'board' && <BoardScreen />}
        {activeNavigationId === 'my' && (
          <MyPageScreen
            completedLessonApplications={completedLessonApplications}
            completedShuttleApplications={completedShuttleApplications}
            signupProfile={signupProfile}
            onExitToLogin={onExitToLogin}
            onEditProfile={onEditProfile}
          />
        )}
        {activeNavigationId !== 'home' &&
          activeNavigationId !== 'schedule' &&
          activeNavigationId !== 'board' &&
          activeNavigationId !== 'my' && (
          <PlaceholderScreen title={mainTabTitles[activeNavigationId]} />
        )}
      </section>
      <BottomNavigation activeNavigationId={activeNavigationId} onChange={changeNavigation} />
      {isInstructorOverlayOpen && (
        <div className="main_overlay_page" data-swipe-back-root>
          <StatusBar />
          <FacilitiesScreen
            initialInstructorImage={initialInstructorImage}
            initialTabId="instructors"
            onBack={() => {
              setIsInstructorOverlayOpen(false)
              setInitialInstructorImage(null)
            }}
          />
        </div>
      )}
    </main>
  )
}

type HomeScreenProps = {
  signupProfile: SignupProfile
}

function HomeScreen({ signupProfile }: HomeScreenProps) {
  const [openTimetableId, setOpenTimetableId] = useState<TimetableId | null>('toddlers')
  const [isRenewalPopupOpen, setIsRenewalPopupOpen] = useState(false)
  const [phonePopupTitle, setPhonePopupTitle] = useState('등록 연장 문의')
  const [isViewerStorePopupOpen, setIsViewerStorePopupOpen] = useState(false)
  const [homeDetailView, setHomeDetailView] = useState<HomeDetailView>('home')
  const [initialInfoTabId, setInitialInfoTabId] = useState<InfoTabId>('facilities')
  const homeNextLesson = getHomeNextLesson()

  const getMobileViewerStoreUrl = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const platform = navigator.platform.toLowerCase()
    const isAppleDevice =
      /iphone|ipad|ipod|macintosh|mac os x/.test(userAgent) || /iphone|ipad|ipod|mac/.test(platform)

    return isAppleDevice ? mobileViewerAppStoreUrl : mobileViewerPlayStoreUrl
  }

  const openMobileViewerStore = () => {
    const storeUrl = getMobileViewerStoreUrl()
    const openedWindow = window.open(storeUrl, '_blank', 'noopener,noreferrer')

    if (!openedWindow) {
      window.location.href = storeUrl
    }
  }

  return (
    <div className="home_screen">
      {homeDetailView === 'alerts' ? (
        <AlertScreen studentName={signupProfile.studentName} onBack={() => setHomeDetailView('home')} />
      ) : homeDetailView === 'facilities' ? (
        <FacilitiesScreen initialTabId={initialInfoTabId} onBack={() => setHomeDetailView('home')} />
      ) : (
        <>
          <header className="home_header">
        <img className="home_header_background" src={homeBackgroundImage} alt="" />
        <div className="home_top">
          <img className="home_logo" src={logoImage} alt="CSC" />
          <button className="home_alert_button" type="button" aria-label="알림" onClick={() => setHomeDetailView('alerts')}>
            <img src={alertIcon} alt="" />
          </button>
        </div>

        <div className="home_profile_card">
          <div className="home_profile_text">
            <div className="home_profile_copy">
              <h1>
                <strong>{signupProfile.studentName}</strong> 학부모님
              </h1>
              <p>
                재등록까지 <strong>D-59</strong> 남았습니다.
              </p>
            </div>
            <button
              className="home_extend_button"
              type="button"
              onClick={() => {
                setPhonePopupTitle('등록 연장 문의')
                setIsRenewalPopupOpen(true)
              }}
            >
              등록 연장하기
            </button>
          </div>
          <img className="home_profile_image" src={profileImage} alt="" />
        </div>
          </header>

          <section className="home_next_lesson" aria-labelledby="next_lesson_title">
        <div className="home_next_box">
          <p className="home_section_kicker" id="next_lesson_title">
            <img src={calendarIcon} alt="" />
            다음 수업
          </p>
          <div className="home_next_time">
            <strong>{homeNextLesson.dateText}</strong>
            <span>{homeNextLesson.dDayText}</span>
          </div>
        </div>
          </section>

          <section className="home_section home_intro" aria-labelledby="academy_title">
        <h2 id="academy_title">CSC 스위밍 아카데미</h2>
        <div className="home_intro_grid">
          <InfoCard
            image={facilitiesImage}
            title="시설 소개"
            description="안전하고 쾌적한 시설"
            onClick={() => {
              setInitialInfoTabId('facilities')
              setHomeDetailView('facilities')
            }}
          />
          <InfoCard
            image={instructorImage}
            title="운영진·강사 소개"
            description="운영진·강사진의 체계 지도"
            onClick={() => {
              setInitialInfoTabId('instructors')
              setHomeDetailView('facilities')
            }}
          />
        </div>
        <button
          className="home_need_card"
          type="button"
          onClick={() => {
            setInitialInfoTabId('necessity')
            setHomeDetailView('facilities')
          }}
        >
          <div>
            <h3>수영의 필요성</h3>
            <p>건강과 안전을 위한 필수 운동</p>
          </div>
          <div className="home_need_image_wrap">
            <img src={swimGoodImage} alt="" />
          </div>
        </button>
          </section>

          <section className="home_section home_timetable" aria-labelledby="timetable_title">
        <h2 id="timetable_title">반별 시간표 안내</h2>
        <div className="home_timetable_box">
          {timetableItems.map((item) => {
            const isOpen = item.id === openTimetableId

            return (
              <article className="home_timetable_item" key={item.id}>
                <div className="home_timetable_name_wrap">
                  <h3 className={`home_timetable_name ${item.accentClassName}`}>{item.title}</h3>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.img
                        className="home_timetable_image"
                        src={item.image}
                        alt=""
                        initial={{ opacity: 0, scale: 0.88, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: -4 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                      />
                    )}
                  </AnimatePresence>
                </div>
                <div className="home_timetable_info">
                  <p className="home_timetable_capacity">{item.capacity}</p>
                  <button
                    className={isOpen ? 'home_timetable_toggle home_timetable_toggle_open' : 'home_timetable_toggle'}
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenTimetableId(isOpen ? null : item.id)}
                  >
                    <motion.img
                      className="home_timetable_toggle_icon"
                      src={arrowFullIcon}
                      alt=""
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                    />
                    시간표
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.ul
                        className="home_timetable_detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                      >
                        {item.lines.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </article>
            )
          })}
        </div>
          </section>

          <section
            className="home_contact"
            aria-label="상담 문의"
            role="button"
            tabIndex={0}
            onClick={() => {
              setPhonePopupTitle('상담 문의')
              setIsRenewalPopupOpen(true)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setPhonePopupTitle('상담 문의')
                setIsRenewalPopupOpen(true)
              }
            }}
          >
        <div className="home_contact_left">
          <img src={phoneIcon} alt="" />
          <span>상담 문의</span>
        </div>
        <div className="home_contact_divider" />
        <div className="home_contact_right">
          <p>
            입회 시 <strong>수영모자</strong>, <strong>수영가방</strong> 증정
          </p>
          <div className="home_contact_numbers">
            <strong>033 - 522 - 6337</strong>
            <strong>033 - 522 - 4337</strong>
          </div>
        </div>
          </section>

          <section className="home_section home_cctv" aria-labelledby="cctv_title">
        <div className="home_cctv_top">
          <h2 id="cctv_title">실시간 수업 모습</h2>
          <button type="button" onClick={() => setIsViewerStorePopupOpen(true)}>
            모바일 뷰어 바로가기
          </button>
        </div>
        <div className="home_cctv_box">
          <LoginInfo title="1차 로그인" rows={[['ID', 'csc-6337'], ['PW', 'Admin6337']]} />
          <img className="home_viewer_arrow" src={viewerArrowIcon} alt="" />
          <LoginInfo
            title="2차 로그인"
            rows={[
              ['기기', 'CSC아카데미수영장'],
              ['ID', 'admin'],
              ['PW', 'Admin001'],
            ]}
          />
        </div>
        <p className="home_cctv_note">
          로그인 후 <strong>바로 확인</strong> 가능
        </p>
          </section>
        </>
      )}

      <AnimatePresence>
        {isRenewalPopupOpen && (
          <RenewalPhonePopup title={phonePopupTitle} onClose={() => setIsRenewalPopupOpen(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isViewerStorePopupOpen && (
          <ViewerStorePopup
            onClose={() => setIsViewerStorePopupOpen(false)}
            onConfirm={() => {
              setIsViewerStorePopupOpen(false)
              openMobileViewerStore()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

type FacilitiesScreenProps = {
  initialInstructorImage?: string | null
  initialTabId: InfoTabId
  onBack: () => void
}

function FacilitiesScreen({ initialInstructorImage = null, initialTabId, onBack }: FacilitiesScreenProps) {
  const [activeInfoTabId, setActiveInfoTabId] = useState<InfoTabId>(initialTabId)
  const swipeBackGesture = useSwipeGesture({ onSwipeRight: onBack })

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [activeInfoTabId])

  return (
    <section className="facilities_page" aria-labelledby="facilities_page_title" data-swipe-back-root {...swipeBackGesture}>
      <header className="facilities_header">
        <button className="facilities_back_button" type="button" aria-label="홈으로 돌아가기" onClick={onBack}>
          <img src={backIcon} alt="" />
        </button>
        <h1 id="facilities_page_title">{infoTabTitles[activeInfoTabId]}</h1>
        <FacilitiesShareMenu title={infoTabTitles[activeInfoTabId]} />
      </header>

      <nav className="facilities_tabs" aria-label="소개 탭">
        {infoTabs.map((tab) => (
          <button
            className={tab.id === activeInfoTabId ? 'facilities_tab facilities_tab_active' : 'facilities_tab'}
            type="button"
            aria-current={tab.id === activeInfoTabId ? 'page' : undefined}
            key={tab.id}
            onClick={() => setActiveInfoTabId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeInfoTabId === 'facilities' && <FacilitiesIntroContent />}
      {activeInfoTabId === 'instructors' && <InstructorsIntroContent initialSelectedInstructorImage={initialInstructorImage} />}
      {activeInfoTabId === 'necessity' && <SwimmingNeedIntroContent />}
    </section>
  )
}

function FacilitiesShareMenu({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const shareUrl = window.location.href

  const copyShareUrl = async () => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl)
      return
    }

    const textArea = document.createElement('textarea')
    textArea.value = shareUrl
    textArea.setAttribute('readonly', '')
    textArea.style.position = 'fixed'
    textArea.style.top = '-9999px'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }

  const runMenuAction = async (action: () => Promise<void>, message: string) => {
    await action()
    setFeedback(message)
    window.setTimeout(() => setFeedback(''), 1400)
    setIsOpen(false)
  }

  const sharePage = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        url: shareUrl,
      })
      return
    }

    await copyShareUrl()
  }

  return (
    <div className="facilities_share_wrap">
      <button
        className="facilities_share_button"
        type="button"
        aria-label="공유 메뉴"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <img src={shareIcon} alt="" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="facilities_share_menu"
            role="menu"
            aria-label="공유 메뉴 항목"
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <button type="button" role="menuitem" onClick={() => runMenuAction(copyShareUrl, '주소 복사됨')}>
              주소 복사
            </button>
            <button type="button" role="menuitem" onClick={() => runMenuAction(sharePage, '공유 완료')}>
              공유하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.span
            className="facilities_share_feedback"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
          >
            {feedback}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

type AlertScreenProps = {
  studentName: string
  onBack: () => void
}

function AlertScreen({ studentName, onBack }: AlertScreenProps) {
  const [activeAlertTabId, setActiveAlertTabId] = useState<AlertTabId>('notice')
  const swipeBackGesture = useSwipeGesture({ onSwipeRight: onBack })
  const [readAlertIds, setReadAlertIds] = useState<string[]>(() => {
    const defaultReadAlertIds = [
      ...alertItems.map((item) => item.id),
      ...rideAlertGroups.flatMap((group) =>
        group.items.filter((item) => item.date !== '6월 1일').map((item) => item.id),
      ),
    ]

    try {
      const storedReadAlertIds = window.localStorage.getItem('csc_read_alert_ids')

      if (!storedReadAlertIds) {
        return defaultReadAlertIds
      }

      const parsedReadAlertIds = JSON.parse(storedReadAlertIds)

      if (!Array.isArray(parsedReadAlertIds)) {
        return defaultReadAlertIds
      }

      return Array.from(new Set([...defaultReadAlertIds, ...parsedReadAlertIds.filter((id) => typeof id === 'string')]))
    } catch {
      return defaultReadAlertIds
    }
  })
  const noticeUnreadIds = alertItems.map((item) => item.id).filter((id) => !readAlertIds.includes(id))
  const rideUnreadIds = rideAlertGroups
    .flatMap((group) => group.items.map((item) => item.id))
    .filter((id) => !readAlertIds.includes(id))
  const activeUnreadIds = activeAlertTabId === 'notice' ? noticeUnreadIds : rideUnreadIds
  const hasNoticeUnread = noticeUnreadIds.length > 0
  const hasRideUnread = rideUnreadIds.length > 0
  const isReadAllDisabled = activeUnreadIds.length === 0

  const markActiveTabAsRead = () => {
    if (isReadAllDisabled) return
    setReadAlertIds((current) => {
      const nextReadAlertIds = Array.from(new Set([...current, ...activeUnreadIds]))
      window.localStorage.setItem('csc_read_alert_ids', JSON.stringify(nextReadAlertIds))

      return nextReadAlertIds
    })
  }

  return (
    <section className="alert_page" aria-labelledby="alert_page_title" data-swipe-back-root {...swipeBackGesture}>
      <header className="alert_header">
        <button className="alert_back_button" type="button" aria-label="홈으로 돌아가기" onClick={onBack}>
          <img src={backIcon} alt="" />
        </button>
        <h1 id="alert_page_title">알림</h1>
        <span aria-hidden="true" />
      </header>

      <button className="alert_promo_card" type="button" disabled aria-disabled="true">
        <div>
          <strong>웨이브프롬 송파구 수영장</strong>
          <span>
            신규모집 확인하러 가기
            <img className="alert_promo_arrow" src={alertArrowIcon} alt="" />
          </span>
        </div>
        <img className="alert_promo_image" src={waveImage} alt="" />
      </button>

      <div className="alert_tabs">
        <button
          className={`alert_tab ${activeAlertTabId === 'notice' ? 'alert_tab_active' : ''}`}
          type="button"
          onClick={() => setActiveAlertTabId('notice')}
        >
          공지사항
          {hasNoticeUnread && <span className="alert_tab_badge" aria-label="읽지 않은 공지사항" />}
          {activeAlertTabId === 'notice' && <motion.span className="alert_tab_indicator" layoutId="alert_tab_indicator" />}
        </button>
        <button
          className={`alert_tab ${activeAlertTabId === 'ride' ? 'alert_tab_active alert_tab_ride_active' : ''}`}
          type="button"
          onClick={() => setActiveAlertTabId('ride')}
        >
          승하차
          {hasRideUnread && <span className="alert_tab_badge" aria-label="읽지 않은 승하차 알림" />}
          {activeAlertTabId === 'ride' && <motion.span className="alert_tab_indicator" layoutId="alert_tab_indicator" />}
        </button>
        <button className="alert_read_all" type="button" disabled={isReadAllDisabled} onClick={markActiveTabAsRead}>
          모두 읽음
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeAlertTabId === 'notice' ? (
          <motion.section
            className="alert_list_section"
            aria-labelledby="alert_month_title"
            key="notice"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <h2 id="alert_month_title">2026년 5월</h2>
            <div className="alert_list">
              {alertItems.map((item) => (
                <article className="alert_item" key={item.id}>
                  <img className="alert_item_profile" src={item.profileImage} alt="" />
                  <div className="alert_item_text">
                    <h3>{item.category}</h3>
                    <p>{item.title}</p>
                    <span>{item.author}</span>
                  </div>
                  <time>{item.date}</time>
                  {!readAlertIds.includes(item.id) && <span className="alert_item_badge" aria-label="읽지 않음" />}
                </article>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.div
            className="alert_ride_sections"
            key="ride"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {rideAlertGroups.map((group) => (
              <section className="alert_list_section alert_ride_section" aria-label={group.month} key={group.month}>
                <h2>{group.month}</h2>
                <div className="alert_list">
                  {group.items.map((item) => (
                    <article className="alert_item alert_ride_item" key={item.id}>
                      <div className="alert_ride_logo">
                        <img src={logoImage} alt="" />
                      </div>
                      <div className="alert_item_text alert_ride_text">
                        <h3>{item.category}</h3>
                        <p>
                          {item.title.split('\n').map((line) => (
                            <span key={line}>{line.replaceAll('안도훈', studentName)}</span>
                          ))}
                        </p>
                        <span>{item.author}</span>
                      </div>
                      <time>{item.date}</time>
                      {!readAlertIds.includes(item.id) && <span className="alert_item_badge" aria-label="읽지 않음" />}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function FacilitiesIntroContent() {
  return (
    <div className="facilities_content">
      {facilitySections.map((section) => (
        <article className="facilities_card" key={section.number}>
          <div className="facilities_card_header">
            <span>{section.number}</span>
            <h2>{section.title}</h2>
          </div>
          <div
            className={
              section.images.length === 1 ? 'facilities_image_grid facilities_image_grid_single' : 'facilities_image_grid'
            }
          >
            {section.images.map((image) => (
              <img src={image} alt="" key={image} />
            ))}
          </div>
          <ul className="facilities_description_list">
            {section.descriptions.map((description) => (
              <li key={description}>{description}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}

type InstructorsIntroContentProps = {
  initialSelectedInstructorImage?: string | null
}

function InstructorsIntroContent({ initialSelectedInstructorImage = null }: InstructorsIntroContentProps) {
  const [selectedInstructorImage, setSelectedInstructorImage] = useState<string | null>(initialSelectedInstructorImage)
  const [imageScale, setImageScale] = useState(1)
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 })
  const [dragStartPoint, setDragStartPoint] = useState<{ x: number; y: number } | null>(null)
  const touchDistanceRef = useRef<number | null>(null)
  const imageOffsetRef = useRef({ x: 0, y: 0 })

  const closeInstructorImageViewer = () => {
    setSelectedInstructorImage(null)
    setImageScale(1)
    setImageOffset({ x: 0, y: 0 })
    setDragStartPoint(null)
    imageOffsetRef.current = { x: 0, y: 0 }
    touchDistanceRef.current = null
  }

  const updateImageScale = (nextScale: number) => {
    const clampedScale = Math.min(Math.max(nextScale, 1), 4)

    setImageScale(clampedScale)

    if (clampedScale === 1) {
      setImageOffset({ x: 0, y: 0 })
      imageOffsetRef.current = { x: 0, y: 0 }
    }
  }

  const updateImageOffset = (nextOffset: { x: number; y: number }) => {
    setImageOffset(nextOffset)
    imageOffsetRef.current = nextOffset
  }

  const getTouchDistance = (touches: React.TouchList) => {
    const firstTouch = touches[0]
    const secondTouch = touches[1]

    return Math.hypot(firstTouch.clientX - secondTouch.clientX, firstTouch.clientY - secondTouch.clientY)
  }

  useEffect(() => {
    if (!dragStartPoint) {
      return undefined
    }

    const moveImage = (event: MouseEvent) => {
      updateImageOffset({
        x: event.clientX - dragStartPoint.x,
        y: event.clientY - dragStartPoint.y,
      })
    }

    const stopDragging = () => setDragStartPoint(null)

    window.addEventListener('mousemove', moveImage)
    window.addEventListener('mouseup', stopDragging)

    return () => {
      window.removeEventListener('mousemove', moveImage)
      window.removeEventListener('mouseup', stopDragging)
    }
  }, [dragStartPoint])

  return (
    <div className="facilities_content facilities_instructor_content">
      <article className="instructor_intro_card">
        <div className="instructor_intro_header">
          <span className="instructor_intro_icon" aria-hidden="true">
            <img src={togetherIcon} alt="" />
          </span>
          <div>
            <h2>운영진 및 강사진</h2>
            <p>총 6명의 전문 강사진</p>
          </div>
        </div>
        <div className="instructor_image_list">
          {instructorImages.map((image) => (
            <button className="instructor_image_button" type="button" key={image} onClick={() => setSelectedInstructorImage(image)}>
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      </article>

      <AnimatePresence>
        {selectedInstructorImage && (
          <motion.div
            className="instructor_lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="강사 이미지 확대 보기"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeInstructorImageViewer}
          >
            <button
              className="instructor_lightbox_close"
              type="button"
              aria-label="닫기"
              onClick={(event) => {
                event.stopPropagation()
                closeInstructorImageViewer()
              }}
            >
              닫기
            </button>
            <div className="instructor_lightbox_zoom_controls" onClick={(event) => event.stopPropagation()}>
              <button type="button" aria-label="이미지 축소" onClick={() => updateImageScale(imageScale - 0.25)}>
                -
              </button>
              <button type="button" aria-label="이미지 확대" onClick={() => updateImageScale(imageScale + 0.25)}>
                +
              </button>
            </div>
            <motion.img
              className="instructor_lightbox_image"
              src={selectedInstructorImage}
              alt=""
              style={{ transform: `translate3d(${imageOffset.x}px, ${imageOffset.y}px, 0) scale(${imageScale})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => {
                if (imageScale <= 1) {
                  return
                }

                event.preventDefault()
                setDragStartPoint({
                  x: event.clientX - imageOffsetRef.current.x,
                  y: event.clientY - imageOffsetRef.current.y,
                })
              }}
              onTouchStart={(event) => {
                if (event.touches.length === 2) {
                  touchDistanceRef.current = getTouchDistance(event.touches)
                  setDragStartPoint(null)
                  return
                }

                if (event.touches.length === 1 && imageScale > 1) {
                  setDragStartPoint({
                    x: event.touches[0].clientX - imageOffsetRef.current.x,
                    y: event.touches[0].clientY - imageOffsetRef.current.y,
                  })
                }
              }}
              onTouchMove={(event) => {
                if (event.touches.length === 2 && touchDistanceRef.current !== null) {
                  event.preventDefault()
                  const nextTouchDistance = getTouchDistance(event.touches)
                  const distanceRatio = nextTouchDistance / touchDistanceRef.current

                  updateImageScale(imageScale * distanceRatio)
                  touchDistanceRef.current = nextTouchDistance
                  return
                }

                if (event.touches.length === 1 && dragStartPoint) {
                  event.preventDefault()

                  updateImageOffset({
                    x: event.touches[0].clientX - dragStartPoint.x,
                    y: event.touches[0].clientY - dragStartPoint.y,
                  })
                }
              }}
              onTouchEnd={() => {
                touchDistanceRef.current = null
                setDragStartPoint(null)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SwimmingNeedIntroContent() {
  return (
    <div className="facilities_content swimming_need_content">
      {swimmingNeedSections.map((section) => (
        <article className="swimming_need_section_card" key={section.number}>
          <div className="swimming_need_card_header">
            <span>{section.number}</span>
            <h2>{section.title}</h2>
          </div>
          <div className="swimming_need_image_grid">
            {section.placeholders.map((placeholder) => (
              <div className="swimming_need_placeholder" key={placeholder}>
                <span className="swimming_need_placeholder_icon" aria-hidden="true" />
                <p>{placeholder}</p>
              </div>
            ))}
          </div>
          <ul className="swimming_need_description_list">
            {section.descriptions.map((description) => (
              <li key={description}>{description}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}

type ViewerStorePopupProps = {
  onClose: () => void
  onConfirm: () => void
}

function ViewerStorePopup({ onClose, onConfirm }: ViewerStorePopupProps) {
  return (
    <motion.div
      className="home_popup_overlay"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="home_viewer_popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="viewer_store_title"
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="viewer_store_title">모바일 뷰어 설치 안내</h2>
        <p>모바일 뷰어 설치 페이지로 이동합니다.</p>
        <div className="home_viewer_popup_actions">
          <button type="button" onClick={onClose}>
            닫기
          </button>
          <button type="button" onClick={onConfirm}>
            설치하러 가기
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

type RenewalPhonePopupProps = {
  title: string
  onClose: () => void
}

function RenewalPhonePopup({ title, onClose }: RenewalPhonePopupProps) {
  return (
    <motion.div
      className="home_popup_overlay"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="home_phone_popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="renewal_phone_title"
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="renewal_phone_title">{title}</h2>
        <p>아래 번호로 상담 문의해 주세요.</p>
        <div className="home_phone_popup_numbers">
          <a href="tel:0335226337">033 - 522 - 6337</a>
          <a href="tel:0335224337">033 - 522 - 4337</a>
        </div>
        <div className="home_phone_popup_close">
          <button type="button" onClick={onClose}>
            닫기
          </button>
          <button type="button" disabled>
            전화
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

type InfoCardProps = {
  image: string
  title: string
  description: string
  onClick?: () => void
}

function InfoCard({ image, title, description, onClick }: InfoCardProps) {
  const content = (
    <>
      <img src={image} alt="" />
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </>
  )

  if (onClick) {
    return (
      <button className="home_info_card" type="button" onClick={onClick}>
        {content}
      </button>
    )
  }

  return (
    <article className="home_info_card">
      {content}
    </article>
  )
}

type LoginInfoProps = {
  title: string
  rows: Array<[string, string]>
}

function LoginInfo({ title, rows }: LoginInfoProps) {
  return (
    <div className="home_login_info">
      <h3>{title}</h3>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="main_placeholder">
      <h1 className="main_title">{title}</h1>
    </div>
  )
}

export default Main
