import { AnimatePresence, motion } from 'framer-motion'
import type { ScheduleDay, ScheduleViewMode } from '../types/schedule'
import ScheduleCalendarDay from './ScheduleCalendarDay'

type ScheduleCalendarProps = {
  days: ScheduleDay[]
  selectedDate: Date
  viewMode: ScheduleViewMode
  weekdays: string[]
  onSelectDate: (date: Date) => void
}

const isSameScheduleDay = (date: Date, targetDate: Date) =>
  date.getFullYear() === targetDate.getFullYear() &&
  date.getMonth() === targetDate.getMonth() &&
  date.getDate() === targetDate.getDate()

function ScheduleCalendar({ days, selectedDate, viewMode, weekdays, onSelectDate }: ScheduleCalendarProps) {
  return (
    <div className={viewMode === 'month' ? 'schedule_calendar schedule_calendar_month' : 'schedule_calendar'}>
      <div className="schedule_weekdays">
        {weekdays.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="schedule_days"
          key={viewMode}
          initial={{ opacity: 0, x: viewMode === 'month' ? 28 : -28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: viewMode === 'month' ? -28 : 28 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {days.map((day, index) => (
            <ScheduleCalendarDay
              day={day}
              dayIndex={index}
              isSelected={isSameScheduleDay(day.fullDate, selectedDate)}
              key={`${day.fullDate.toISOString()}-${index}`}
              onSelectDate={onSelectDate}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ScheduleCalendar
