import type { ScheduleDay } from '../types/schedule'

type ScheduleCalendarDayProps = {
  day: ScheduleDay
  dayIndex: number
  isSelected: boolean
  onSelectDate: (date: Date) => void
}

function ScheduleCalendarDay({ day, dayIndex, isSelected, onSelectDate }: ScheduleCalendarDayProps) {
  const isSunday = dayIndex % 7 === 0
  const dayClassName = ['schedule_day', isSelected ? 'schedule_day_selected' : ''].filter(Boolean).join(' ')
  const dateClassName = [
    'schedule_day_date',
    day.isToday ? 'schedule_day_date_today' : '',
    isSunday ? 'schedule_day_date_sunday' : '',
    day.isCurrentMonth === false ? 'schedule_day_date_muted' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={dayClassName} type="button" onClick={() => onSelectDate(day.fullDate)}>
      <span className={dateClassName}>{day.date}</span>
      {!!day.dots?.length && (
        <span className="schedule_day_dots" aria-hidden="true">
          {day.dots.map((dot, index) => (
            <span className={`schedule_day_dot schedule_day_dot_${dot}`} key={`${dot}-${index}`} />
          ))}
        </span>
      )}
    </button>
  )
}

export default ScheduleCalendarDay
