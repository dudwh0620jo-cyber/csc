import batteryIcon from '../assets/svg/Battery.svg'
import cellularConnectionIcon from '../assets/svg/Cellular Connection.svg'
import wifiIcon from '../assets/svg/Wifi.svg'

const isAndroidOrIosDevice = () => {
  if (typeof navigator === 'undefined') {
    return false
  }

  const userAgent = navigator.userAgent.toLowerCase()
  const platform = navigator.platform.toLowerCase()
  const isAndroid = userAgent.includes('android')
  const isIos = /iphone|ipad|ipod/.test(userAgent) || (/mac/.test(platform) && navigator.maxTouchPoints > 1)

  return isAndroid || isIos
}

function StatusBar() {
  if (isAndroidOrIosDevice()) {
    return null
  }

  return (
    <header className="status_bar" aria-label="기기 상태">
      <div className="status_bar_nav">
        <time className="status_bar_time" dateTime="09:41">
          09:41
        </time>
        <div className="status_bar_levels" aria-label="통신 상태">
          <img
            className="status_bar_icon status_bar_icon_cellular"
            src={cellularConnectionIcon}
            alt="셀룰러 연결"
          />
          <img
            className="status_bar_icon status_bar_icon_wifi"
            src={wifiIcon}
            alt="와이파이"
          />
          <img
            className="status_bar_icon status_bar_icon_battery"
            src={batteryIcon}
            alt="배터리"
          />
        </div>
      </div>
    </header>
  )
}

export default StatusBar
