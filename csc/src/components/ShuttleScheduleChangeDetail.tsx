import { useState } from 'react'
import backIcon from '../assets/svg/back.svg'
import reNoIcon from '../assets/svg/re_no.svg'
import reOkIcon from '../assets/svg/re_ok.svg'
import timeIcon from '../assets/svg/time.svg'
import ScheduleCompleteModal from './ScheduleCompleteModal'
import SignupBottomProfile from './SignupBottomProfile'
import StatusBar from './StatusBar'
import type { ShuttleScheduleSelection } from '../types/schedule'
import { formatScheduleDeadlineText } from '../utils/scheduleDate'

type ShuttleScheduleChangeDetailProps = {
  selection: ShuttleScheduleSelection
  onBack: () => void
}

function ShuttleScheduleChangeDetail({ selection, onBack }: ShuttleScheduleChangeDetailProps) {
  const [selectedChangeType, setSelectedChangeType] = useState<'self' | 'etc' | null>('self')
  const [etcChangeText, setEtcChangeText] = useState('')
  const [isCompletePopupOpen, setIsCompletePopupOpen] = useState(false)
  const { date, shuttle } = selection
  const deadlineText = formatScheduleDeadlineText(date)
  const isSubmitDisabled = selectedChangeType === 'etc' && etcChangeText.trim().length === 0
  const closeCompletePopup = () => {
    setIsCompletePopupOpen(false)
    onBack()
  }

  return (
    <section className="schedule_reservation_page shuttle_change_page" aria-labelledby="shuttle_change_title">
      <StatusBar />
      <header className="schedule_reservation_header">
        <button className="schedule_reservation_back" type="button" onClick={onBack}>
          <img src={backIcon} alt="" />
          <span>셔틀 시간표</span>
        </button>

        <div className="schedule_reservation_summary">
          <h1 id="shuttle_change_title">{shuttle.kind}</h1>
          <p>
            {shuttle.name} | {shuttle.place}
          </p>
        </div>

        <div className="shuttle_change_time">
          <img src={timeIcon} alt="" />
          <span>{shuttle.time}</span>
        </div>
      </header>

      <div className="schedule_reservation_content shuttle_change_content">
        <section className="schedule_reservation_info" aria-labelledby="shuttle_change_content_title">
          <h2 id="shuttle_change_content_title">변경 내용</h2>
          <div className="shuttle_change_box">
            <label className="shuttle_change_option">
              <input
                type="checkbox"
                checked={selectedChangeType === 'self'}
                onChange={() => setSelectedChangeType('self')}
              />
              <span>자가로 변경</span>
            </label>
            <label className="shuttle_change_option shuttle_change_option_etc">
              <input
                type="checkbox"
                checked={selectedChangeType === 'etc'}
                onChange={() => setSelectedChangeType('etc')}
              />
              <span>기타</span>
              <textarea
                disabled={selectedChangeType !== 'etc'}
                placeholder="변경 내용을 작성해 주세요"
                value={etcChangeText}
                onChange={(event) => setEtcChangeText(event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="schedule_reservation_info" aria-labelledby="shuttle_change_period_title">
          <h2 id="shuttle_change_period_title">예약 및 취소 가능 기간</h2>
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

        <div className="schedule_reservation_guide shuttle_change_guide">
          <p>* 신청하신 내용은 확인 후 가능할 경우 바로 반영됩니다.</p>
          <p>* 변경이 어려운 경우 전화 또는 문자로 다시 안내드립니다.</p>
          <p>* 운영 상황에 따라 안내까지 일정 시간이 소요될 수 있습니다.</p>
        </div>
      </div>

      <SignupBottomProfile
        isNextButtonDisabled={isSubmitDisabled}
        label="신청하기"
        onNext={() => setIsCompletePopupOpen(true)}
      />

      {isCompletePopupOpen && <ScheduleCompleteModal onClose={closeCompletePopup} />}
    </section>
  )
}

export default ShuttleScheduleChangeDetail
