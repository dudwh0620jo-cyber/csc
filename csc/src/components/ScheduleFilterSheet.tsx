import { motion } from 'framer-motion'
import resetIcon from '../assets/svg/ri_reset-left-line.svg'
import type { ScheduleClassFilter, ScheduleInstructorFilter } from '../types/schedule'
import ScheduleFilterGroup from './ScheduleFilterGroup'

type ScheduleFilterSheetProps = {
  classFilterOptions: ScheduleClassFilter[]
  instructorFilterOptions: ScheduleInstructorFilter[]
  selectedClassFilters: ScheduleClassFilter[]
  selectedInstructorFilters: ScheduleInstructorFilter[]
  onApply: () => void
  onClose: () => void
  onReset: () => void
  onSelectClassFilters: (filters: ScheduleClassFilter[]) => void
  onSelectInstructorFilters: (filters: ScheduleInstructorFilter[]) => void
}

function ScheduleFilterSheet({
  classFilterOptions,
  instructorFilterOptions,
  selectedClassFilters,
  selectedInstructorFilters,
  onApply,
  onClose,
  onReset,
  onSelectClassFilters,
  onSelectInstructorFilters,
}: ScheduleFilterSheetProps) {
  return (
    <>
      <motion.button
        className="schedule_filter_scrim"
        type="button"
        aria-label="필터 닫기"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        className="schedule_filter_sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule_filter_title"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
      >
        <header className="schedule_filter_sheet_header">
          <h2 id="schedule_filter_title">필터</h2>
        </header>

        <ScheduleFilterGroup
          label="클래스 유형"
          options={classFilterOptions}
          selectedOptions={selectedClassFilters}
          onSelectOptions={onSelectClassFilters}
        />
        <ScheduleFilterGroup
          label="강사 선택"
          options={instructorFilterOptions}
          selectedOptions={selectedInstructorFilters}
          onSelectOptions={onSelectInstructorFilters}
        />

        <footer className="schedule_filter_sheet_bottom">
          <button className="schedule_filter_reset" type="button" onClick={onReset}>
            <img src={resetIcon} alt="" />
            필터 초기화
          </button>
          <button className="schedule_filter_apply" type="button" onClick={onApply}>
            적용하기
          </button>
        </footer>
      </motion.aside>
    </>
  )
}

export default ScheduleFilterSheet
