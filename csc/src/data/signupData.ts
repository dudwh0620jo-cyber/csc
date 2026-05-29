export type SignupStep = 'terms' | 'user_type' | 'profile'

export type UserType = 'parent' | 'student_adult'

export type StudentGender = 'male' | 'female' | ''

export type ParentRelation = 'mother' | 'father' | ''

export type SignupProfile = {
  studentName: string
  studentBirthDate: string
  studentGender: StudentGender
  studentPhone: string
  parentRelation: ParentRelation
  parentPhone: string
}

export const signupTermItems = [
  {
    id: 'service',
    label: '서비스 이용약관',
  },
  {
    id: 'privacy',
    label: '개인정보 수집/이용 동의',
  },
  {
    id: 'third_party',
    label: '개인정보 제3자 정보제공 동의',
  },
  {
    id: 'location',
    label: '위치 기반 서비스 이용약관 동의',
  },
] as const

export const signupUserTypeOptions = [
  {
    id: 'parent',
    label: '학부모',
  },
  {
    id: 'student_adult',
    label: '학생/성인반',
  },
] as const

export const initialSignupProfile: SignupProfile = {
  studentName: '',
  studentBirthDate: '',
  studentGender: '',
  studentPhone: '',
  parentRelation: '',
  parentPhone: '',
}
