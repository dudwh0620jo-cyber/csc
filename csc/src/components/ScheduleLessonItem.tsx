import reservationIcon from '../assets/svg/reservation.svg'
import type { ScheduleLesson } from '../types/schedule'

type ScheduleLessonItemProps = {
  isDisabled?: boolean
  lesson: ScheduleLesson
  onApply: () => void
}

function ScheduleLessonItem({ isDisabled = false, lesson, onApply }: ScheduleLessonItemProps) {
  return (
    <li className="schedule_lesson_item">
      <div className="schedule_lesson_top">
        <div className="schedule_lesson_info">
          <h3>{lesson.className}</h3>
          <p>
            {lesson.instructor} | {lesson.lane}
          </p>
        </div>
        <button className="schedule_lesson_apply" type="button" disabled={isDisabled} onClick={onApply}>
          {isDisabled ? '신청 마감' : '신청하기'}
        </button>
      </div>
      <div className="schedule_lesson_bottom">
        <div className="schedule_lesson_reservation">
          <img src={reservationIcon} alt="" />
          <span>
            예약 <strong>{lesson.reserved}</strong> / {lesson.capacity}명
          </span>
        </div>
        {lesson.canWait && <span className="schedule_lesson_wait">대기 가능</span>}
      </div>
    </li>
  )
}

export default ScheduleLessonItem
