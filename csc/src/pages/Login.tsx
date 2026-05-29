import { useState } from 'react'
import StatusBar from '../components/StatusBar'
import logoTextImage from '../assets/logo/logo_text.png'
import appleIcon from '../assets/svg/apple.svg'
import eyeIcon from '../assets/svg/Eye.svg'
import googleIcon from '../assets/svg/google.svg'
import kakaoIcon from '../assets/svg/kakao.svg'
import naverIcon from '../assets/svg/naver.svg'
import '../style/login.css'

const helperLinks = [
  {
    label: '아이디 찾기',
    isEnabled: false,
  },
  {
    label: '비밀번호 찾기',
    isEnabled: false,
  },
  {
    label: '회원가입',
    isEnabled: true,
  },
]

const socialLoginItems = [
  {
    className: 'login_social_button_kakao',
    icon: kakaoIcon,
    label: '카카오 로그인',
  },
  {
    className: 'login_social_button_naver',
    icon: naverIcon,
    label: '네이버 로그인',
  },
  {
    className: 'login_social_button_google',
    icon: googleIcon,
    label: '구글 로그인',
  },
  {
    className: 'login_social_button_apple',
    icon: appleIcon,
    label: '애플 로그인',
  },
]

type LoginProps = {
  onSignup: () => void
}

function Login({ onSignup }: LoginProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <main className="login_page">
      <StatusBar />
      <section className="login_wrap" aria-label="로그인">
        <div className="login_inner">
          <div className="login_content">
            <img className="login_logo" src={logoTextImage} alt="씨에스씨 스위밍 아카데미" />

            <div className="login_auth_entry">
              <form className="login_form" autoComplete="off">
                <div className="login_form_fields">
                  <label className="login_field">
                    <span className="login_field_label">아이디</span>
                    <input
                      className="login_input"
                      type="text"
                      placeholder="아이디 입력"
                      defaultValue="swimming@gmail.com"
                      autoComplete="off"
                      name="login_email_field"
                    />
                  </label>
                  <label className="login_field">
                    <span className="login_field_label">비밀번호</span>
                    <div className="login_password_field">
                      <input
                        className="login_input login_password_input"
                        type={isPasswordVisible ? 'text' : 'password'}
                        placeholder="비밀번호 입력"
                        defaultValue="Swim1234$$"
                        autoComplete="new-password"
                        name="login_password_field"
                      />
                      <button
                        className="login_password_toggle"
                        type="button"
                        aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                        aria-pressed={isPasswordVisible}
                        onClick={() => setIsPasswordVisible((previousValue) => !previousValue)}
                      >
                        <img className="login_password_toggle_icon" src={eyeIcon} alt="" />
                      </button>
                    </div>
                  </label>
                </div>
                <button className="login_primary_button" type="submit" disabled>
                  로그인
                </button>
              </form>

              <nav className="login_helper" aria-label="계정 도움말">
                {helperLinks.map((helperLink) => (
                  <button
                    className="login_helper_link"
                    type="button"
                    disabled={!helperLink.isEnabled}
                    onClick={helperLink.label === '회원가입' ? onSignup : undefined}
                    key={helperLink.label}
                  >
                    {helperLink.label}
                  </button>
                ))}
              </nav>

              <div className="login_social_section">
                <div className="login_divider">
                  <span className="login_divider_line" />
                  <span className="login_divider_text">또는</span>
                  <span className="login_divider_line" />
                </div>

                <div className="login_social_buttons">
                  {socialLoginItems.map((socialItem) => (
                    <button
                      className={`login_social_button ${socialItem.className}`}
                      type="button"
                      aria-label={socialItem.label}
                      disabled
                      key={socialItem.label}
                    >
                      <img className="login_social_icon" src={socialItem.icon} alt="" />
                    </button>
                  ))}
                </div>
              </div>

              <button className="login_guest_button" type="button">
                로그인 없이 둘러보기
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login
