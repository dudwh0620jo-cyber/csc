import timeIcon from '../assets/svg/time.svg'
import type { ShuttleSchedule } from '../types/schedule'

type ShuttleScheduleItemProps = ShuttleSchedule & {
  isDisabled?: boolean
  onChange: () => void
}

function ShuttleScheduleItem({ kind, name, place, time, isDisabled = false, onChange }: ShuttleScheduleItemProps) {
  return (
    <li className="shuttle_schedule_item">
      <div className="shuttle_schedule_top">
        <div className="shuttle_schedule_info">
          <h3>{kind}</h3>
          <p>
            {name} | {place}
          </p>
        </div>
        <button className="shuttle_schedule_change" type="button" disabled={isDisabled} onClick={onChange}>
          {isDisabled ? '신청 마감' : '변경 신청'}
        </button>
      </div>
      <div className="shuttle_schedule_bottom">
        <img src={timeIcon} alt="" />
        <span>{time}</span>
      </div>
    </li>
  )
}

export default ShuttleScheduleItem
