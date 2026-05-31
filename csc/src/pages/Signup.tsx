import { useRef, useState } from 'react'
import StatusBar from '../components/StatusBar'
import backIcon from '../assets/svg/back.svg'
import checkRoundIcon from '../assets/svg/check_round.svg'
import scheduleLineIcon from '../assets/svg/schedule-line.svg'
import {
  initialSignupProfile,
  signupTermItems,
  signupUserTypeOptions,
  type ParentRelation,
  type SignupProfile,
  type SignupStep,
  type StudentGender,
  type UserType,
} from '../data/signupData'
import '../style/signup.css'

type SignupProps = {
  onBack: () => void
  onComplete: () => void
}

type SignupTermId = (typeof signupTermItems)[number]['id']

function Signup({ onBack, onComplete }: SignupProps) {
  const [currentStep, setCurrentStep] = useState<SignupStep>('terms')
  const [checkedTermIds, setCheckedTermIds] = useState<SignupTermId[]>([])
  const [selectedUserType, setSelectedUserType] = useState<UserType>('parent')
  const [signupProfile, setSignupProfile] = useState<SignupProfile>(initialSignupProfile)
  const [studentBirthDateValue, setStudentBirthDateValue] = useState('')
  const [verifiedPhoneFields, setVerifiedPhoneFields] = useState<Array<keyof SignupProfile>>([])
  const studentBirthDateInputRef = useRef<HTMLInputElement>(null)

  const isAllTermsChecked = checkedTermIds.length === signupTermItems.length
  const isNextButtonDisabled = currentStep === 'terms' && !isAllTermsChecked

  const toggleTerm = (termId: SignupTermId) => {
    setCheckedTermIds((previousIds) =>
      previousIds.includes(termId)
        ? previousIds.filter((previousId) => previousId !== termId)
        : [...previousIds, termId],
    )
  }

  const toggleAllTerms = () => {
    setCheckedTermIds(isAllTermsChecked ? [] : signupTermItems.map((termItem) => termItem.id))
  }

  const moveToPreviousStep = () => {
    if (currentStep === 'profile') {
      setCurrentStep('user_type')
      return
    }

    if (currentStep === 'user_type') {
      setCurrentStep('terms')
      return
    }

    onBack()
  }

  const moveToNextStep = () => {
    if (currentStep === 'terms') {
      setCurrentStep('user_type')
      return
    }

    if (currentStep === 'user_type') {
      setCurrentStep('profile')
      return
    }

    onComplete()
  }

  const updateSignupProfile = (fieldName: keyof SignupProfile, value: string) => {
    setSignupProfile((previousProfile) => ({
      ...previousProfile,
      [fieldName]: value,
    }))
  }

  const updatePhoneNumber = (fieldName: 'studentPhone' | 'parentPhone', value: string) => {
    updateSignupProfile(fieldName, formatPhoneNumber(value))
    setVerifiedPhoneFields((previousFields) =>
      previousFields.filter((previousFieldName) => previousFieldName !== fieldName),
    )
  }

  const verifyPhoneNumber = (fieldName: 'studentPhone' | 'parentPhone') => {
    const numberOnlyValue = signupProfile[fieldName].replace(/\D/g, '')

    if (numberOnlyValue.length !== 11) {
      return
    }

    setVerifiedPhoneFields((previousFields) =>
      previousFields.includes(fieldName) ? previousFields : [...previousFields, fieldName],
    )
  }

  const openStudentBirthDatePicker = () => {
    const dateInput = studentBirthDateInputRef.current

    if (!dateInput) {
      return
    }

    if (typeof dateInput.showPicker === 'function') {
      dateInput.showPicker()
      return
    }

    dateInput.click()
  }

  const updateStudentBirthDate = (dateValue: string) => {
    setStudentBirthDateValue(dateValue)

    if (!dateValue) {
      updateSignupProfile('studentBirthDate', '')
      return
    }

    const [year, month, day] = dateValue.split('-')
    updateSignupProfile('studentBirthDate', `${year} / ${month} / ${day}`)
  }

  return (
    <main className="signup_page">
      <section className="signup_wrap" aria-label="회원가입">
        <div className="signup_header">
          <StatusBar />
          <button className="signup_back_button" type="button" aria-label="뒤로 가기" onClick={moveToPreviousStep}>
            <img className="signup_back_icon" src={backIcon} alt="" />
          </button>
        </div>

        {currentStep === 'terms' && (
          <div className="signup_container">
            <SignupTitle title="약관 동의" description="필수항목 및 선택항목 약관에 동의해 주세요." />
            <div className="signup_terms">
              <button className="signup_all_terms" type="button" onClick={toggleAllTerms}>
                <CheckIcon isChecked={isAllTermsChecked} />
                <span>약관 전체 동의</span>
              </button>

              <div className="signup_terms_list">
                {signupTermItems.map((termItem) => (
                  <div className="signup_term_item" key={termItem.id}>
                    <button className="signup_term_check" type="button" onClick={() => toggleTerm(termItem.id)}>
                      <CheckIcon isChecked={checkedTermIds.includes(termItem.id)} />
                      <span>{termItem.label}</span>
                    </button>
                    <button className="signup_term_more" type="button" aria-label={`${termItem.label} 상세 보기`}>
                      <span className="signup_chevron_icon" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 'user_type' && (
          <div className="signup_container">
            <SignupTitle title="이용자 유형을 선택해 주세요" description="어떤 유형으로 이용하시나요?" />
            <div className="signup_user_type_list">
              {signupUserTypeOptions.map((userTypeOption) => {
                const isSelected = selectedUserType === userTypeOption.id

                return (
                  <button
                    className={isSelected ? 'signup_user_type signup_user_type_active' : 'signup_user_type'}
                    type="button"
                    key={userTypeOption.id}
                    onClick={() => setSelectedUserType(userTypeOption.id)}
                  >
                    <CheckIcon isChecked={isSelected} />
                    <span>{userTypeOption.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {currentStep === 'profile' && (
          <div className="signup_container signup_profile_container">
            <SignupTitle
              title="학생 및 학부모 정보를 입력해 주세요"
              description="실명과 전화번호를 정확하게 입력해 주세요."
            />
            <div className="signup_profile_sections">
              <section className="signup_profile_section" aria-labelledby="student_info_title">
                <h2 className="signup_section_title" id="student_info_title">
                  학생 정보
                </h2>
                <div className="signup_field_list">
                  <label className={getSignupInfoFieldClass(Boolean(signupProfile.studentName))}>
                    <span className="signup_info_label">이름</span>
                    <input
                      className="signup_info_input"
                      value={signupProfile.studentName}
                      placeholder="홍길동"
                      onChange={(event) => updateSignupProfile('studentName', event.target.value)}
                    />
                  </label>

                  <div className={getSignupInfoFieldClass(Boolean(signupProfile.studentBirthDate))}>
                    <span className="signup_info_label">생년월일</span>
                    <div className="signup_date_row">
                      <button
                        className={
                          signupProfile.studentBirthDate
                            ? 'signup_date_value signup_date_value_filled'
                            : 'signup_date_value'
                        }
                        type="button"
                        onClick={openStudentBirthDatePicker}
                      >
                        {signupProfile.studentBirthDate || '0000 / 00 / 00'}
                      </button>
                      <button
                        className="signup_calendar_button"
                        type="button"
                        aria-label="생년월일 선택"
                        onClick={openStudentBirthDatePicker}
                      >
                        <img className="signup_calendar_icon" src={scheduleLineIcon} alt="" />
                      </button>
                      <input
                        className="signup_date_picker"
                        ref={studentBirthDateInputRef}
                        type="date"
                        value={studentBirthDateValue}
                        onChange={(event) => updateStudentBirthDate(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className={getSignupInfoFieldClass(Boolean(signupProfile.studentGender))}>
                    <span className="signup_info_label">성별</span>
                    <div className="signup_segment_group">
                      <SegmentButton
                        isSelected={signupProfile.studentGender === 'male'}
                        label="남자"
                        onClick={() => updateSignupProfile('studentGender', 'male' satisfies StudentGender)}
                      />
                      <SegmentButton
                        isSelected={signupProfile.studentGender === 'female'}
                        label="여자"
                        onClick={() => updateSignupProfile('studentGender', 'female' satisfies StudentGender)}
                      />
                    </div>
                  </div>

                  <div className="signup_verified_group">
                    <label className={getSignupInfoFieldClass(Boolean(signupProfile.studentPhone))}>
                      <span className="signup_info_label">전화번호</span>
                      <div className="signup_phone_row">
                        <input
                          className="signup_info_input"
                          value={signupProfile.studentPhone}
                          inputMode="numeric"
                          placeholder="010-0000-0000"
                          onChange={(event) => updatePhoneNumber('studentPhone', event.target.value)}
                        />
                        <button
                          className="signup_inline_button"
                          type="button"
                          onClick={() => verifyPhoneNumber('studentPhone')}
                        >
                          인증하기
                        </button>
                      </div>
                    </label>
                    {verifiedPhoneFields.includes('studentPhone') && (
                      <p className="signup_verified_message">전화번호가 인증되었습니다</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="signup_profile_section" aria-labelledby="parent_info_title">
                <h2 className="signup_section_title" id="parent_info_title">
                  학부모 정보
                </h2>
                <div className="signup_field_list">
                  <div className={getSignupInfoFieldClass(Boolean(signupProfile.parentRelation))}>
                    <span className="signup_info_label">관계</span>
                    <div className="signup_segment_group">
                      <SegmentButton
                        isSelected={signupProfile.parentRelation === 'mother'}
                        label="모"
                        onClick={() => updateSignupProfile('parentRelation', 'mother' satisfies ParentRelation)}
                      />
                      <SegmentButton
                        isSelected={signupProfile.parentRelation === 'father'}
                        label="부"
                        onClick={() => updateSignupProfile('parentRelation', 'father' satisfies ParentRelation)}
                      />
                    </div>
                  </div>

                  <div className="signup_verified_group">
                    <label className={getSignupInfoFieldClass(Boolean(signupProfile.parentPhone))}>
                      <span className="signup_info_label">전화번호</span>
                      <div className="signup_phone_row">
                        <input
                          className="signup_info_input"
                          value={signupProfile.parentPhone}
                          inputMode="numeric"
                          placeholder="010-0000-0000"
                          onChange={(event) => updatePhoneNumber('parentPhone', event.target.value)}
                        />
                        <button
                          className="signup_inline_button"
                          type="button"
                          onClick={() => verifyPhoneNumber('parentPhone')}
                        >
                          인증하기
                        </button>
                      </div>
                    </label>
                    {verifiedPhoneFields.includes('parentPhone') && (
                      <p className="signup_verified_message">전화번호가 인증되었습니다</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        <div className="signup_bottom signup_bottom_profile">
          <button
            className="signup_next_button"
            type="button"
            disabled={isNextButtonDisabled}
            onClick={moveToNextStep}
          >
            다음
          </button>
          {currentStep === 'profile' && (
            <button className="signup_add_button" type="button" disabled>
              저장하고 추가로 등록하기
            </button>
          )}
        </div>
      </section>
    </main>
  )
}

type SignupTitleProps = {
  title: string
  description: string
}

function SignupTitle({ title, description }: SignupTitleProps) {
  return (
    <div className="signup_title">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

function getSignupInfoFieldClass(hasValue: boolean) {
  return hasValue ? 'signup_info_field signup_info_field_filled' : 'signup_info_field'
}

function formatPhoneNumber(value: string) {
  const numberOnlyValue = value.replace(/\D/g, '').slice(0, 11)

  if (numberOnlyValue.length <= 3) {
    return numberOnlyValue
  }

  if (numberOnlyValue.length <= 7) {
    return `${numberOnlyValue.slice(0, 3)}-${numberOnlyValue.slice(3)}`
  }

  return `${numberOnlyValue.slice(0, 3)}-${numberOnlyValue.slice(3, 7)}-${numberOnlyValue.slice(7)}`
}

type CheckIconProps = {
  isChecked: boolean
}

function CheckIcon({ isChecked }: CheckIconProps) {
  return (
    <span className={isChecked ? 'signup_check signup_check_active' : 'signup_check'}>
      <img className="signup_check_icon" src={checkRoundIcon} alt="" />
    </span>
  )
}

type SegmentButtonProps = {
  isSelected: boolean
  label: string
  onClick: () => void
}

function SegmentButton({ isSelected, label, onClick }: SegmentButtonProps) {
  return (
    <button
      className={isSelected ? 'signup_segment_button signup_segment_button_active' : 'signup_segment_button'}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default Signup
