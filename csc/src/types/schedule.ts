export type ScheduleViewMode = 'month' | 'week'
export type ScheduleDotType = 'past' | 'toddlers' | 'elementary' | 'adults'
export type AvailableScheduleDotType = Exclude<ScheduleDotType, 'past'>

export type ScheduleDay = {
  date: number
  fullDate: Date
  isCurrentMonth?: boolean
  isToday?: boolean
  dots?: ScheduleDotType[]
}

export type ScheduleLesson = {
  className: string
  instructor: string
  lane: string
  reserved: number
  capacity: number
  canWait?: boolean
}

export type ScheduleSection = {
  time: string
  lessons: ScheduleLesson[]
}

export type ScheduleReservationSelection = {
  date: Date
  lesson: ScheduleLesson
  time: string
}

export type ShuttleSchedule = {
  kind: '승차' | '하차'
  name: string
  place: string
  time: string
}

export type ShuttleScheduleSelection = {
  date: Date
  shuttle: ShuttleSchedule
}

export type ScheduleClassFilter = '전체' | '유아반' | '초등반' | '성인반' | '엘리트' | '마스터즈'
export type ScheduleInstructorFilter =
  | '전체'
  | '김수민 강사'
  | '이현미 강사'
  | '천호현 강사'
  | '이남호 강사'
  | '오수빈 강사'
