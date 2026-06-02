import reservationIcon from '../assets/svg/reservation.svg'
import type { ScheduleLesson } from '../types/schedule'

type ScheduleLessonItemProps = {
  isDisabled?: boolean
  isCompleted?: boolean
  disabledLabel?: string
  lesson: ScheduleLesson
  onApply: () => void
}

function ScheduleLessonItem({
  isDisabled = false,
  isCompleted = false,
  disabledLabel = '신청 마감',
  lesson,
  onApply,
}: ScheduleLessonItemProps) {
  const buttonClassName = isCompleted
    ? 'schedule_lesson_apply schedule_lesson_apply_completed'
    : 'schedule_lesson_apply'

  return (
    <li className="schedule_lesson_item">
      <div className="schedule_lesson_top">
        <div className="schedule_lesson_info">
          <h3>{lesson.className}</h3>
          <p>
            {lesson.instructor} | {lesson.lane}
          </p>
        </div>
        <button className={buttonClassName} type="button" disabled={isDisabled || isCompleted} onClick={onApply}>
          {isCompleted ? '신청 완료' : isDisabled ? disabledLabel : '신청하기'}
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
