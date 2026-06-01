const scheduleDayLabels = ['일', '월', '화', '수', '목', '금', '토']

export const formatScheduleDate = (date: Date) =>
  `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()} (${scheduleDayLabels[date.getDay()]})`

export const getScheduleDeadlineDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 21, 0, 0)

export const formatScheduleDeadlineText = (date: Date) => `${formatScheduleDate(getScheduleDeadlineDate(date))} 21:00`

export const isScheduleApplicationClosed = (date: Date) => new Date() > getScheduleDeadlineDate(date)
