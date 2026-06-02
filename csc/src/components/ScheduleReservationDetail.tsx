import { useState } from 'react'
import backIcon from '../assets/svg/back.svg'
import reNoIcon from '../assets/svg/re_no.svg'
import reOkIcon from '../assets/svg/re_ok.svg'
import reservationIcon from '../assets/svg/reservation.svg'
import timesandIcon from '../assets/svg/timesand.svg'
import ScheduleCompleteModal from './ScheduleCompleteModal'
import SignupBottomProfile from './SignupBottomProfile'
import StatusBar from './StatusBar'
import type { ScheduleReservationSelection } from '../types/schedule'
import { formatScheduleDate, formatScheduleDeadlineText } from '../utils/scheduleDate'

type ScheduleReservationDetailProps = {
  selection: ScheduleReservationSelection
  onBack: () => void
  onComplete?: () => void
  onOpenInstructorInfo?: (instructorName: string) => void
}

function ScheduleReservationDetail({ selection, onBack, onComplete, onOpenInstructorInfo }: ScheduleReservationDetailProps) {
  const [isCompletePopupOpen, setIsCompletePopupOpen] = useState(false)
  const { date, lesson, time } = selection
  const waitingCount = lesson.canWait ? 1 : 0
  const deadlineText = formatScheduleDeadlineText(date)
  const closeCompletePopup = () => {
    onComplete?.()
    setIsCompletePopupOpen(false)
    onBack()
  }

  return (
    <section className="schedule_reservation_page" aria-labelledby="schedule_reservation_title">
      <StatusBar />
      <header className="schedule_reservation_header">
        <button className="schedule_reservation_back" type="button" onClick={onBack}>
          <img src={backIcon} alt="" />
          <span>보강 시간표</span>
        </button>

        <div className="schedule_reservation_summary">
          <h1 id="schedule_reservation_title">CSC 스위밍 아카데미 {lesson.className}</h1>
          <p>
            {lesson.instructor} | {lesson.lane}
          </p>
        </div>

        <div className="schedule_reservation_counts">
          <div>
            <img src={reservationIcon} alt="" />
            <span>
              예약 <strong>{lesson.reserved}</strong> / {lesson.capacity}명
            </span>
          </div>
          <div>
            <img src={timesandIcon} alt="" />
            <span>
              대기 <strong>{waitingCount}</strong>명
            </span>
          </div>
        </div>
      </header>

      <div className="schedule_reservation_content">
        <section className="schedule_reservation_info" aria-labelledby="schedule_reservation_time_title">
          <h2 id="schedule_reservation_time_title">수업 시간</h2>
          <div className="schedule_reservation_info_box">
            <strong>
              {formatScheduleDate(date)} {time}
            </strong>
          </div>
        </section>

        <section className="schedule_reservation_info" aria-labelledby="schedule_reservation_period_title">
          <h2 id="schedule_reservation_period_title">예약 및 취소 가능 기간</h2>
          <div className="schedule_reservation_info_box schedule_reservation_period_box">
            <div className="schedule_reservation_period_item">
              <div className="schedule_reservation_period_label">
                <img src={reOkIcon} alt="" />
                <span>예약</span>
              </div>
              <p>
                <strong>{deadlineText}</strong> 까지
              </p>
            </div>
            <div className="schedule_reservation_period_item">
              <div className="schedule_reservation_period_label">
                <img src={reNoIcon} alt="" />
                <span>취소</span>
              </div>
              <p>
                <strong>{deadlineText}</strong> 까지
              </p>
            </div>
          </div>
        </section>

        <div className="schedule_reservation_links">
          <button type="button" onClick={() => onOpenInstructorInfo?.(lesson.instructor)}>
            강사 정보 보러 가기
          </button>
          <button type="button" disabled>
            수업 정보 보러 가기
          </button>
        </div>

        <div className="schedule_reservation_guide">
          <p>* 신청하신 내용은 확인 후 가능할 경우 바로 반영됩니다.</p>
          <p>* 신청이 어려운 경우 전화 또는 문자로 다시 안내드립니다.</p>
          <p>* 운영 상황에 따라 안내까지 일정 시간이 소요될 수 있습니다.</p>
        </div>
      </div>

      <SignupBottomProfile
        label="신청하기"
        onNext={() => setIsCompletePopupOpen(true)}
      />

      {isCompletePopupOpen && <ScheduleCompleteModal onClose={closeCompletePopup} />}
    </section>
  )
}

export default ScheduleReservationDetail
