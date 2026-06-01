import type { SignupStep } from '../data/signupData'

type SignupBottomProfileProps = {
  currentStep?: SignupStep
  isNextButtonDisabled?: boolean
  label?: string
  rootClassName?: string
  buttonClassName?: string
  onNext: () => void
}

function SignupBottomProfile({
  currentStep,
  isNextButtonDisabled = false,
  label = '다음',
  rootClassName = 'signup_bottom signup_bottom_profile',
  buttonClassName = 'signup_next_button',
  onNext,
}: SignupBottomProfileProps) {
  return (
    <div className={rootClassName}>
      <button className={buttonClassName} type="button" disabled={isNextButtonDisabled} onClick={onNext}>
        {label}
      </button>
      {currentStep === 'profile' && (
        <button className="signup_add_button" type="button" disabled>
          저장하고 추가로 등록하기
        </button>
      )}
    </div>
  )
}

export default SignupBottomProfile
