import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import backIcon from '../assets/svg/back.svg'
import timeIcon from '../assets/svg/time.svg'
import writeIcon from '../assets/svg/write.svg'
import profileImage from '../assets/home/profile.png'
import useSwipeGesture from '../hooks/useSwipeGesture'
import type { SignupProfile } from '../data/signupData'
import type { CompletedLessonApplication, CompletedShuttleApplication } from '../types/schedule'
import '../style/my.css'

const myPageMenuItems = [
  { label: '신청 내역', disabled: false, danger: false },
  { label: '알림 설정', disabled: true, danger: false },
  { label: '이용 약관', disabled: true, danger: false },
  { label: '개인정보 처리방침', disabled: true, danger: false },
  { label: '로그아웃', disabled: false, danger: false },
  { label: '회원 탈퇴', disabled: false, danger: true },
]

type MyPageScreenProps = {
  completedLessonApplications: CompletedLessonApplication[]
  completedShuttleApplications: CompletedShuttleApplication[]
  signupProfile: SignupProfile
  onExitToLogin: () => void
  onEditProfile: () => void
}

function MyPageScreen({
  completedLessonApplications,
  completedShuttleApplications,
  signupProfile,
  onExitToLogin,
  onEditProfile,
}: MyPageScreenProps) {
  const [isApplicationHistoryOpen, setIsApplicationHistoryOpen] = useState(false)
  const [myConfirmPopupType, setMyConfirmPopupType] = useState<'logout' | 'withdraw' | null>(null)

  if (isApplicationHistoryOpen) {
    return (
      <ApplicationHistoryScreen
        lessonApplications={completedLessonApplications}
        shuttleApplications={completedShuttleApplications}
        onBack={() => setIsApplicationHistoryOpen(false)}
      />
    )
  }

  return (
    <>
      <section className="my_page" aria-labelledby="my_page_title">
        <div className="my_page_inner">
          <header className="my_header">
            <h1 id="my_page_title">마이페이지</h1>
          </header>

          <section className="my_profile" aria-label="내 정보">
            <div className="my_profile_info">
              <img className="my_profile_image" src={profileImage} alt="" />
              <div className="my_profile_text">
                <p>
                  <strong>{signupProfile.studentName}</strong> 학부모님
                </p>
                <span>{signupProfile.parentPhone}</span>
              </div>
            </div>
            <button className="my_edit_button" type="button" aria-label="내 정보 수정" onClick={onEditProfile}>
              <img src={writeIcon} alt="" />
            </button>
          </section>

          <nav className="my_menu" aria-label="마이페이지 메뉴">
            {myPageMenuItems.map((item) => (
              <button
                className={`my_menu_item ${item.disabled ? 'my_menu_item_disabled' : ''} ${
                  item.danger ? 'my_menu_item_danger' : ''
                }`}
                type="button"
                disabled={item.disabled}
                key={item.label}
                onClick={() => {
                  if (item.label === '신청 내역') {
                    setIsApplicationHistoryOpen(true)
                    return
                  }

                  if (item.label === '로그아웃') {
                    setMyConfirmPopupType('logout')
                    return
                  }

                  if (item.label === '회원 탈퇴') {
                    setMyConfirmPopupType('withdraw')
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <AnimatePresence>
        {myConfirmPopupType && (
          <MyConfirmPopup
            type={myConfirmPopupType}
            onCancel={() => setMyConfirmPopupType(null)}
            onConfirm={onExitToLogin}
          />
        )}
      </AnimatePresence>
    </>
  )
}

type MyConfirmPopupProps = {
  type: 'logout' | 'withdraw'
  onCancel: () => void
  onConfirm: () => void
}

function MyConfirmPopup({ type, onCancel, onConfirm }: MyConfirmPopupProps) {
  const isLogout = type === 'logout'

  return (
    <motion.div
      className="my_confirm_overlay"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="my_confirm_popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="my_confirm_title"
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="my_confirm_title">{isLogout ? '로그아웃하시겠어요?' : '회원 탈퇴하시겠어요?'}</h2>
        <p>
          {isLogout ? (
            <>
              로그아웃 후 다시 로그인해야
              <br />
              서비스를 이용할 수 있습니다.
            </>
          ) : (
            <>
              탈퇴 시 계정 정보와 이용 기록이 삭제되며
              <br />
              복구할 수 없습니다.
            </>
          )}
        </p>
        <div className="my_confirm_actions">
          <button type="button" onClick={onCancel}>
            취소
          </button>
          <button className={isLogout ? undefined : 'my_confirm_danger'} type="button" onClick={onConfirm}>
            {isLogout ? '로그아웃' : '회원 탈퇴'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

type ApplicationHistoryTabId = 'lesson' | 'shuttle'

type ApplicationHistoryScreenProps = {
  lessonApplications: CompletedLessonApplication[]
  shuttleApplications: CompletedShuttleApplication[]
  onBack: () => void
}

function ApplicationHistoryScreen({
  lessonApplications,
  shuttleApplications,
  onBack,
}: ApplicationHistoryScreenProps) {
  const [activeHistoryTabId, setActiveHistoryTabId] = useState<ApplicationHistoryTabId>('lesson')
  const swipeBackGesture = useSwipeGesture({ onSwipeRight: onBack })
  const activeApplications = activeHistoryTabId === 'lesson' ? lessonApplications : shuttleApplications

  return (
    <section
      className="application_history_page"
      aria-labelledby="application_history_title"
      data-swipe-back-root
      {...swipeBackGesture}
    >
      <header className="application_history_header">
        <button className="application_history_back" type="button" aria-label="마이페이지로 돌아가기" onClick={onBack}>
          <img src={backIcon} alt="" />
        </button>
        <h1 id="application_history_title">신청 내역</h1>
        <span aria-hidden="true" />
      </header>

      <nav className="application_history_tabs" aria-label="신청 내역 구분">
        <button
          className={
            activeHistoryTabId === 'lesson'
              ? 'application_history_tab application_history_tab_active'
              : 'application_history_tab'
          }
          type="button"
          onClick={() => setActiveHistoryTabId('lesson')}
        >
          보강 시간표
        </button>
        <button
          className={
            activeHistoryTabId === 'shuttle'
              ? 'application_history_tab application_history_tab_active'
              : 'application_history_tab'
          }
          type="button"
          onClick={() => setActiveHistoryTabId('shuttle')}
        >
          셔틀 시간표
        </button>
      </nav>

      <div className="application_history_content">
        {activeApplications.length === 0 ? (
          <p className="application_history_empty">신청 완료된 내역이 없습니다.</p>
        ) : activeHistoryTabId === 'lesson' ? (
          <ApplicationHistoryLessonList applications={lessonApplications} />
        ) : (
          <ApplicationHistoryShuttleList applications={shuttleApplications} />
        )}
      </div>
    </section>
  )
}

function ApplicationHistoryLessonList({ applications }: { applications: CompletedLessonApplication[] }) {
  const applicationGroups = groupApplicationsByDate(applications)

  return (
    <>
      {applicationGroups.map((group) => (
        <section className="application_history_group" key={group.key}>
          <h2>{formatApplicationHistoryDate(group.date)}</h2>
          <ul className="application_history_list">
            {group.items.map((application) => (
              <li className="schedule_lesson_item application_history_item" key={application.id}>
                <div className="schedule_lesson_top">
                  <div className="schedule_lesson_info">
                    <h3>{application.lesson.className}</h3>
                    <p>
                      {application.lesson.instructor} | {application.lesson.lane}
                    </p>
                  </div>
                  <span className="schedule_lesson_apply schedule_lesson_apply_completed application_history_status">
                    신청 완료
                  </span>
                </div>
                <div className="schedule_lesson_bottom application_history_bottom">
                  <div className="schedule_lesson_reservation">
                    <img src={timeIcon} alt="" />
                    <span>{application.time}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}

function ApplicationHistoryShuttleList({ applications }: { applications: CompletedShuttleApplication[] }) {
  const applicationGroups = groupApplicationsByDate(applications)

  return (
    <>
      {applicationGroups.map((group) => (
        <section className="application_history_group" key={group.key}>
          <h2>{formatApplicationHistoryDate(group.date)}</h2>
          <ul className="application_history_list">
            {group.items.map((application) => (
              <li className="schedule_lesson_item application_history_item" key={application.id}>
                <div className="schedule_lesson_top">
                  <div className="schedule_lesson_info">
                    <h3>{application.shuttle.kind}</h3>
                    <p>
                      {application.shuttle.name} | {application.shuttle.place}
                    </p>
                  </div>
                  <span className="schedule_lesson_apply schedule_lesson_apply_completed application_history_status">
                    신청 완료
                  </span>
                </div>
                <div className="schedule_lesson_bottom application_history_bottom">
                  <div className="schedule_lesson_reservation">
                    <img src={timeIcon} alt="" />
                    <span>{application.changeText}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}

function groupApplicationsByDate<T extends { date: Date; id: string }>(applications: T[]) {
  return applications.reduce<Array<{ date: Date; items: T[]; key: string }>>((groups, application) => {
    const key = `${application.date.getFullYear()}-${application.date.getMonth() + 1}-${application.date.getDate()}`
    const existingGroup = groups.find((group) => group.key === key)

    if (existingGroup) {
      existingGroup.items.push(application)
      return groups
    }

    return [...groups, { date: application.date, items: [application], key }]
  }, [])
}

function formatApplicationHistoryDate(date: Date) {
  return `| ${date.getMonth() + 1}월 ${date.getDate()}일`
}

export default MyPageScreen
