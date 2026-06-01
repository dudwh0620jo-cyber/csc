type ScheduleFilterGroupProps<TOption extends string> = {
  label: string
  options: TOption[]
  selectedOptions: TOption[]
  onSelectOptions: (options: TOption[]) => void
}

function ScheduleFilterGroup<TOption extends string>({
  label,
  options,
  selectedOptions,
  onSelectOptions,
}: ScheduleFilterGroupProps<TOption>) {
  const toggleOption = (option: TOption) => {
    if (option === '전체') {
      onSelectOptions([option])
      return
    }

    const nextOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((selectedOption) => selectedOption !== option)
      : [...selectedOptions.filter((selectedOption) => selectedOption !== '전체'), option]

    onSelectOptions(nextOptions.length > 0 ? nextOptions : (['전체'] as TOption[]))
  }

  return (
    <section className="schedule_filter_group">
      <h3>{label}</h3>
      <div className="schedule_filter_chip_list">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option)

          return (
            <button
              className={isSelected ? 'schedule_filter_chip schedule_filter_chip_active' : 'schedule_filter_chip'}
              type="button"
              key={option}
              onClick={() => toggleOption(option)}
            >
              {option}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default ScheduleFilterGroup
