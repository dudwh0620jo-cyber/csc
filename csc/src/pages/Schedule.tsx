import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ScheduleCalendar from '../components/ScheduleCalendar'
import ScheduleFilterSheet from '../components/ScheduleFilterSheet'
import ScheduleLessonItem from '../components/ScheduleLessonItem'
import ScheduleReservationDetail from '../components/ScheduleReservationDetail'
import ShuttleScheduleChangeDetail from '../components/ShuttleScheduleChangeDetail'
import ShuttleScheduleItem from '../components/ShuttleScheduleItem'
import backIcon from '../assets/svg/back.svg'
import filterIcon from '../assets/svg/filter.svg'
import type {
  AvailableScheduleDotType,
  CompletedLessonApplication,
  CompletedShuttleApplication,
  ScheduleClassFilter,
  ScheduleDay,
  ScheduleDotType,
  ScheduleInstructorFilter,
  ScheduleLesson,
  ScheduleReservationSelection,
  ScheduleSection,
  ScheduleViewMode,
  ShuttleSchedule,
  ShuttleScheduleSelection,
} from '../types/schedule'
import type { SignupProfile } from '../data/signupData'
import { isScheduleApplicationClosed } from '../utils/scheduleDate'
import '../style/schedule.css'

type SchedulePageMode = 'lesson' | 'shuttle'

const scheduleWeekdays = ['일', '월', '화', '수', '목', '금', '토']
const scheduleClassFilters: ScheduleClassFilter[] = ['전체', '유아반', '초등반', '성인반', '엘리트', '마스터즈']
const scheduleInstructorFilters: ScheduleInstructorFilter[] = [
  '전체',
  '김수민 강사',
  '이현미 강사',
  '천호현 강사',
  '이남호 강사',
  '오수빈 강사',
]
const sameDayScheduleToastMessage = '원활한 운영을 위해 당일 신청은 지원되지 않습니다.\n다른 날짜를 선택해 주세요.'

const getScheduleToday = () => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

const scheduleToday = getScheduleToday()

const addScheduleDays = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)

const addScheduleMonths = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1)

const isSameScheduleDay = (date: Date, targetDate: Date) =>
  date.getFullYear() === targetDate.getFullYear() &&
  date.getMonth() === targetDate.getMonth() &&
  date.getDate() === targetDate.getDate()

const hasAllScheduleDots = (date: Date) => date.getMonth() === 5 && (date.getDate() === 1 || date.getDate() === 2)

const getScheduleDots = (date: Date, isCurrentMonth = true): ScheduleDotType[] | undefined => {
  if (!isCurrentMonth) {
    return undefined
  }

  if (isScheduleApplicationClosed(date)) {
    if (hasAllScheduleDots(date)) {
      return ['past', 'past', 'past']
    }

    if (date.getDate() % 6 === 0) {
      return ['past', 'past', 'past']
    }

    if (date.getDate() % 3 === 1) {
      return ['past']
    }

    return undefined
  }

  if (hasAllScheduleDots(date)) {
    return ['toddlers', 'elementary', 'adults']
  }

  if (date.getDay() === 0) {
    return undefined
  }

  const day = date.getDate()

  if (day % 5 === 4) {
    return ['adults']
  }

  if (day % 7 === 0) {
    return ['elementary', 'adults']
  }

  if (day % 4 === 1) {
    return ['toddlers']
  }

  if (day % 3 === 1) {
    return ['elementary']
  }

  if (day % 3 === 2) {
    return ['toddlers', 'elementary']
  }

  return ['toddlers', 'elementary', 'adults']
}

const getShuttleScheduleDots = (date: Date, isCurrentMonth = true): ScheduleDotType[] | undefined => {
  if (!isCurrentMonth) {
    return undefined
  }

  const hasShuttle = date.getDay() === 1 || date.getDay() === 3

  if (!hasShuttle) {
    return undefined
  }

  return isScheduleApplicationClosed(date) ? ['past'] : ['elementary']
}

const createScheduleDay = (date: Date, isCurrentMonth = true): ScheduleDay => ({
  date: date.getDate(),
  fullDate: date,
  isCurrentMonth,
  isToday: isSameScheduleDay(date, scheduleToday),
  dots: getScheduleDots(date, isCurrentMonth),
})

const createShuttleScheduleDay = (date: Date, isCurrentMonth = true): ScheduleDay => ({
  date: date.getDate(),
  fullDate: date,
  isCurrentMonth,
  isToday: isSameScheduleDay(date, scheduleToday),
  dots: getShuttleScheduleDots(date, isCurrentMonth),
})

const getVisibleMonthDays = (date: Date, createDay: (dayDate: Date, isCurrentMonth?: boolean) => ScheduleDay) => {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
  const calendarStart = addScheduleDays(monthStart, -monthStart.getDay())
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const visibleWeeks = Math.ceil((monthStart.getDay() + daysInMonth) / 7)
  const visibleDays = visibleWeeks * 7

  return Array.from({ length: visibleDays }, (_, index) => {
    const dayDate = addScheduleDays(calendarStart, index)
    return createDay(dayDate, dayDate.getMonth() === date.getMonth())
  })
}

const getVisibleWeekDays = (date: Date, createDay: (dayDate: Date) => ScheduleDay) => {
  const weekStart = addScheduleDays(date, -date.getDay())

  return Array.from({ length: 7 }, (_, index) => createDay(addScheduleDays(weekStart, index)))
}

const formatScheduleMonthTitle = (date: Date) => `${date.getFullYear()}. ${date.getMonth() + 1}`

const scheduleLessonTypeByClassName: Record<string, AvailableScheduleDotType> = {
  유아반: 'toddlers',
  초등반: 'elementary',
  성인반: 'adults',
  마스터즈: 'masters',
  '엘리트 마스터즈반': 'masters',
}

const getScheduleLessonType = (lesson: ScheduleLesson) => scheduleLessonTypeByClassName[lesson.className] ?? null

const parseStudentBirthYear = (studentBirthDate: string) => {
  const birthYear = Number(studentBirthDate.split('/')[0]?.trim())

  return Number.isFinite(birthYear) ? birthYear : null
}

const getAllowedScheduleTypesByProfile = (signupProfile: SignupProfile) => {
  const birthYear = parseStudentBirthYear(signupProfile.studentBirthDate)

  if (birthYear !== null && birthYear >= 2020 && birthYear <= 2022) {
    return new Set<AvailableScheduleDotType>(['toddlers', 'masters'])
  }

  if (birthYear !== null && birthYear >= 2013 && birthYear <= 2019) {
    return new Set<AvailableScheduleDotType>(['elementary', 'masters'])
  }

  if (birthYear !== null && birthYear <= 2007) {
    return new Set<AvailableScheduleDotType>(['adults'])
  }

  return new Set<AvailableScheduleDotType>(['toddlers', 'elementary', 'adults', 'masters'])
}

const getAvailableScheduleTypes = (date: Date) => {
  const dateScheduleTypes = new Set(
    (getScheduleDots(date) ?? []).filter((dot): dot is AvailableScheduleDotType => dot !== 'past'),
  )

  if (dateScheduleTypes.has('toddlers') || dateScheduleTypes.has('elementary')) {
    dateScheduleTypes.add('masters')
  }

  return dateScheduleTypes
}

const getScheduleApplicationKey = (date: Date, time: string, lesson: ScheduleLesson) =>
  [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    time,
    lesson.className,
    lesson.instructor,
    lesson.lane,
  ].join('|')

const matchesSelectedClassFilters = (lesson: ScheduleLesson, selectedClassFilters: ScheduleClassFilter[]) => {
  if (selectedClassFilters.includes('전체')) {
    return true
  }

  if (getScheduleLessonType(lesson) === 'masters') {
    return selectedClassFilters.includes('마스터즈') || selectedClassFilters.includes('엘리트')
  }

  return selectedClassFilters.includes(lesson.className as ScheduleClassFilter)
}

const scheduleSections: ScheduleSection[] = [
  {
    time: '16:00~16:50',
    lessons: [
      { className: '유아반', instructor: '천호현 강사', lane: '4 Lane', reserved: 4, capacity: 4, canWait: true },
      { className: '초등반', instructor: '김수민 강사', lane: '1 Lane', reserved: 4, capacity: 5 },
      { className: '초등반', instructor: '이남호 강사', lane: '2 Lane', reserved: 4, capacity: 5 },
      { className: '초등반', instructor: '천호현 강사', lane: '3 Lane', reserved: 2, capacity: 5 },
      { className: '초등반', instructor: '오수빈 강사', lane: '5 Lane', reserved: 4, capacity: 5 },
    ],
  },
  {
    time: '17:00~17:50',
    lessons: [
      { className: '유아반', instructor: '김수민 강사', lane: '1 Lane', reserved: 3, capacity: 4 },
      { className: '초등반', instructor: '이남호 강사', lane: '2 Lane', reserved: 4, capacity: 5 },
      { className: '초등반', instructor: '이남호 강사', lane: '3 Lane', reserved: 4, capacity: 5 },
      { className: '초등반', instructor: '천호현 강사', lane: '4 Lane', reserved: 4, capacity: 5 },
      { className: '초등반', instructor: '오수빈 강사', lane: '5 Lane', reserved: 5, capacity: 5, canWait: true },
    ],
  },
  {
    time: '18:00~18:50',
    lessons: [
      { className: '초등반', instructor: '김수민 강사', lane: '2 Lane', reserved: 4, capacity: 5 },
      { className: '초등반', instructor: '이남호 강사', lane: '3 Lane', reserved: 5, capacity: 5, canWait: true },
      { className: '초등반', instructor: '오수빈 강사', lane: '5 Lane', reserved: 4, capacity: 5 },
      { className: '마스터즈', instructor: '김수민 강사', lane: '1 Lane', reserved: 4, capacity: 10 },
    ],
  },
  {
    time: '19:00~19:50',
    lessons: [
      { className: '초등반', instructor: '김수민 강사', lane: '1 Lane', reserved: 6, capacity: 5, canWait: true },
      { className: '초등반', instructor: '이남호 강사', lane: '2 Lane', reserved: 5, capacity: 5, canWait: true },
      { className: '초등반', instructor: '이남호 강사', lane: '3 Lane', reserved: 2, capacity: 5 },
      { className: '초등반', instructor: '오수빈 강사', lane: '4 Lane', reserved: 2, capacity: 5 },
    ],
  },
  {
    time: '20:00~20:50',
    lessons: [
      { className: '성인반', instructor: '오수빈 강사', lane: '1, 2 Lane', reserved: 0, capacity: 5 },
      { className: '성인반', instructor: '천호현 강사', lane: '3, 4 Lane', reserved: 0, capacity: 5 },
    ],
  },
]

const shuttleScheduleItems: ShuttleSchedule[] = [
  {
    kind: '승차' as const,
    name: '홍길동',
    place: '천곡 어린이집',
    time: '15시 35분',
  },
  {
    kind: '하차' as const,
    name: '홍길동',
    place: '이마트 옆 삼척세무서',
    time: '16시~17시',
  },
]

type ScheduleScreenProps = {
  onCompleteLessonApplication: (application: CompletedLessonApplication) => void
  onCompleteShuttleApplication: (application: CompletedShuttleApplication) => void
  onOpenInstructorInfo?: (instructorName: string) => void
  resetKey?: number
  signupProfile: SignupProfile
}

function ScheduleScreen({
  onCompleteLessonApplication,
  onCompleteShuttleApplication,
  onOpenInstructorInfo,
  resetKey = 0,
  signupProfile,
}: ScheduleScreenProps) {
  const [schedulePageMode, setSchedulePageMode] = useState<SchedulePageMode>('shuttle')
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('month')
  const [visibleDate, setVisibleDate] = useState(() => getScheduleToday())
  const [selectedDate, setSelectedDate] = useState(() => getScheduleToday())
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [reservationSelection, setReservationSelection] = useState<ScheduleReservationSelection | null>(null)
  const [shuttleSelection, setShuttleSelection] = useState<ShuttleScheduleSelection | null>(null)
  const [completedApplicationKeys, setCompletedApplicationKeys] = useState<string[]>([])
  const [selectedClassFilters, setSelectedClassFilters] = useState<ScheduleClassFilter[]>(['전체'])
  const [selectedInstructorFilters, setSelectedInstructorFilters] = useState<ScheduleInstructorFilter[]>(['전체'])
  const [scheduleToastMessage, setScheduleToastMessage] = useState('')

  useEffect(() => {
    const today = getScheduleToday()

    setSchedulePageMode('lesson')
    setVisibleDate(today)
    setSelectedDate(today)
  }, [resetKey])

  useEffect(() => {
    setScheduleToastMessage(sameDayScheduleToastMessage)

    const toastTimer = window.setTimeout(() => {
      setScheduleToastMessage('')
    }, 2000)

    return () => window.clearTimeout(toastTimer)
  }, [resetKey])

  const calendarDays =
    schedulePageMode === 'shuttle'
      ? viewMode === 'month'
        ? getVisibleMonthDays(visibleDate, createShuttleScheduleDay)
        : getVisibleWeekDays(visibleDate, createShuttleScheduleDay)
      : viewMode === 'month'
        ? getVisibleMonthDays(visibleDate, createScheduleDay)
        : getVisibleWeekDays(visibleDate, createScheduleDay)
  const isPastSelectedDate = selectedDate < scheduleToday
  const isSelectedDateApplicationClosed = isScheduleApplicationClosed(selectedDate)
  const hasSelectedDateShuttleSchedule = Boolean(getShuttleScheduleDots(selectedDate)?.length)
  const allowedScheduleTypes = getAllowedScheduleTypesByProfile(signupProfile)
  const availableScheduleTypes = isPastSelectedDate || isSelectedDateApplicationClosed
    ? new Set<AvailableScheduleDotType>(['toddlers', 'elementary', 'adults'])
    : getAvailableScheduleTypes(selectedDate)
  const visibleScheduleSections = scheduleSections
    .map((section) => ({
      ...section,
      lessons: section.lessons.filter((lesson) => {
        const lessonType = getScheduleLessonType(lesson)
        const isAvailableClass = lessonType !== null && availableScheduleTypes.has(lessonType)
        const matchesClass = matchesSelectedClassFilters(lesson, selectedClassFilters)
        const matchesInstructor =
          selectedInstructorFilters.includes('전체') ||
          selectedInstructorFilters.includes(lesson.instructor as ScheduleInstructorFilter)

        return isAvailableClass && matchesClass && matchesInstructor
      }),
    }))
    .filter((section) => section.lessons.length > 0)
  const moveCalendar = (direction: -1 | 1) => {
    const nextDate = viewMode === 'month' ? addScheduleMonths(visibleDate, direction) : addScheduleDays(visibleDate, direction * 7)

    setVisibleDate(nextDate)
    setSelectedDate(nextDate)
  }

  return (
    <div className="schedule_page">
      <header className="schedule_header">
        <h1>
          <button
            className={schedulePageMode === 'lesson' ? 'schedule_header_tab schedule_header_tab_active' : 'schedule_header_tab'}
            type="button"
            onClick={() => setSchedulePageMode('lesson')}
          >
            보강 시간표
          </button>
          <span>|</span>
          <button
            className={
              schedulePageMode === 'shuttle' ? 'schedule_header_tab schedule_header_tab_active' : 'schedule_header_tab'
            }
            type="button"
            onClick={() => setSchedulePageMode('shuttle')}
          >
            셔틀 시간표
          </button>
        </h1>
      </header>

      <section className="schedule_calendar_card" aria-label={`${schedulePageMode === 'lesson' ? '보강' : '셔틀'} 시간표 달력`}>
        <div className="schedule_calendar_top">
          <div className="schedule_month_button">
            <button
              className="schedule_month_arrow_button"
              type="button"
              aria-label={viewMode === 'month' ? '이전 달' : '이전 주'}
              onClick={() => moveCalendar(-1)}
            >
              <img className="schedule_month_arrow schedule_month_arrow_prev" src={backIcon} alt="" />
            </button>
            <span>{formatScheduleMonthTitle(visibleDate)}</span>
            <button
              className="schedule_month_arrow_button"
              type="button"
              aria-label={viewMode === 'month' ? '다음 달' : '다음 주'}
              onClick={() => moveCalendar(1)}
            >
              <img className="schedule_month_arrow schedule_month_arrow_next" src={backIcon} alt="" />
            </button>
          </div>

          <div className="schedule_calendar_actions">
            <div className="schedule_view_toggle" aria-label="보기 방식">
              <button
                className={viewMode === 'week' ? 'schedule_view_toggle_active' : undefined}
                type="button"
                onClick={() => setViewMode('week')}
              >
                주
              </button>
              <button
                className={viewMode === 'month' ? 'schedule_view_toggle_active' : undefined}
                type="button"
                onClick={() => setViewMode('month')}
              >
                월
              </button>
            </div>
            {schedulePageMode === 'lesson' && (
              <button className="schedule_filter_button" type="button" onClick={() => setIsFilterOpen(true)}>
                <img src={filterIcon} alt="" />
                필터
              </button>
            )}
          </div>
        </div>

        <ScheduleCalendar
          days={calendarDays}
          selectedDate={selectedDate}
          viewMode={viewMode}
          weekdays={scheduleWeekdays}
          onSelectDate={(date) => {
            setSelectedDate(date)
            setVisibleDate(date)
          }}
        />
      </section>

      {schedulePageMode === 'lesson' ? (
        <div className="schedule_time_list">
          {visibleScheduleSections.map((section) => (
            <section className="schedule_time_section" aria-labelledby={`schedule_time_${section.time}`} key={section.time}>
              <h2 id={`schedule_time_${section.time}`}>| {section.time}</h2>
              <ul>
                {section.lessons.map((lesson, index) => (
                  <ScheduleLessonItem
                    isCompleted={completedApplicationKeys.includes(
                      getScheduleApplicationKey(selectedDate, section.time, lesson),
                    )}
                    isDisabled={
                      isSelectedDateApplicationClosed ||
                      !allowedScheduleTypes.has(getScheduleLessonType(lesson) as AvailableScheduleDotType)
                    }
                    disabledLabel={
                      isSelectedDateApplicationClosed ||
                      allowedScheduleTypes.has(getScheduleLessonType(lesson) as AvailableScheduleDotType)
                        ? '신청 마감'
                        : '신청 불가'
                    }
                    lesson={lesson}
                    key={`${section.time}-${lesson.className}-${lesson.lane}-${index}`}
                    onApply={() => setReservationSelection({ date: selectedDate, lesson, time: section.time })}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : hasSelectedDateShuttleSchedule ? (
        <ul className="shuttle_schedule_list">
          {shuttleScheduleItems.map((item) => (
            <ShuttleScheduleItem
              isDisabled={isSelectedDateApplicationClosed}
              kind={item.kind}
              name={signupProfile.studentName}
              place={item.place}
              time={item.time}
              key={`${item.kind}-${item.place}`}
              onChange={() => setShuttleSelection({ date: selectedDate, shuttle: { ...item, name: signupProfile.studentName } })}
            />
          ))}
        </ul>
      ) : (
        <div className="shuttle_schedule_empty">셔틀 일정이 없습니다.</div>
      )}

      <AnimatePresence>
        {schedulePageMode === 'lesson' && isFilterOpen && (
          <ScheduleFilterSheet
            classFilterOptions={scheduleClassFilters}
            instructorFilterOptions={scheduleInstructorFilters}
            selectedClassFilters={selectedClassFilters}
            selectedInstructorFilters={selectedInstructorFilters}
            onApply={() => setIsFilterOpen(false)}
            onClose={() => setIsFilterOpen(false)}
            onReset={() => {
              setSelectedClassFilters(['전체'])
              setSelectedInstructorFilters(['전체'])
            }}
            onSelectClassFilters={setSelectedClassFilters}
            onSelectInstructorFilters={setSelectedInstructorFilters}
          />
        )}
      </AnimatePresence>
      {reservationSelection && (
        <ScheduleReservationDetail
          selection={reservationSelection}
          onComplete={() => {
            const completedApplicationKey = getScheduleApplicationKey(
              reservationSelection.date,
              reservationSelection.time,
              reservationSelection.lesson,
            )

            setCompletedApplicationKeys((currentKeys) =>
              currentKeys.includes(completedApplicationKey)
                ? currentKeys
                : [...currentKeys, completedApplicationKey],
            )
            onCompleteLessonApplication({
              ...reservationSelection,
              id: completedApplicationKey,
            })
          }}
          onBack={() => setReservationSelection(null)}
          onOpenInstructorInfo={onOpenInstructorInfo}
        />
      )}
      {shuttleSelection && (
        <ShuttleScheduleChangeDetail
          selection={shuttleSelection}
          onBack={() => setShuttleSelection(null)}
          onComplete={(changeText) =>
            onCompleteShuttleApplication({
              ...shuttleSelection,
              changeText,
              id: getScheduleApplicationKey(shuttleSelection.date, changeText, {
                className: shuttleSelection.shuttle.kind,
                instructor: shuttleSelection.shuttle.name,
                lane: shuttleSelection.shuttle.place,
                reserved: 0,
                capacity: 0,
              }),
            })
          }
        />
      )}
      <AnimatePresence>
        {scheduleToastMessage && (
          <motion.div
            className="schedule_toast"
            role="status"
            initial={{ opacity: 0, x: '-50%', y: 'calc(50% + 12px)' }}
            animate={{ opacity: 1, x: '-50%', y: '50%' }}
            exit={{ opacity: 0, x: '-50%', y: 'calc(50% + 12px)' }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {scheduleToastMessage.split('\n').map((messageLine) => (
              <span key={messageLine}>{messageLine}</span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ScheduleScreen
