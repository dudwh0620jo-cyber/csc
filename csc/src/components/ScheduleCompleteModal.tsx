type ScheduleCompleteModalProps = {
  onClose: () => void
}

function ScheduleCompleteModal({ onClose }: ScheduleCompleteModalProps) {
  return (
    <div className="schedule_complete_modal_overlay" role="presentation" onClick={onClose}>
      <div
        className="schedule_complete_modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule_complete_modal_title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="schedule_complete_modal_title">신청되었습니다</h2>
        <div className="schedule_complete_modal_notice">
          <p>* 신청하신 내용은 확인 후 가능할 경우 바로 반영됩니다.</p>
          <p>* 신청이 어려운 경우 전화 또는 문자로 다시 안내드립니다.</p>
          <p>* 운영 상황에 따라 안내까지 일정 시간이 소요될 수 있습니다.</p>
        </div>
        <button type="button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  )
}

export default ScheduleCompleteModal
