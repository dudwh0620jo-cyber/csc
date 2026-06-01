import eyeIcon from '../assets/svg/Eye.svg'
import smileIcon from '../assets/svg/gg_smile.svg'
import menuIcon from '../assets/svg/menu.svg'
import gasi01Image from '../assets/notice/gasi01.png'
import gasi02Image from '../assets/notice/gasi02.png'
import gasi03Image from '../assets/notice/gasi03.png'
import instructor01Image from '../assets/facilities/in01.png'
import instructor05Image from '../assets/facilities/in05.png'
import '../style/board.css'

type BoardPost = {
  author: string
  date: string
  content: string
  image: string
  views: number
}

const boardPosts: BoardPost[] = [
  {
    author: '오수빈 강사',
    date: '2026년 5월 3일 13:07',
    image: gasi02Image,
    views: 201,
    content: `안녕하세요 Csc스위밍아카데미 강사 오수빈입니다!😊
제가 수영 관련 유튜브 채널과 인스타 수영계정을 운영하고 있어서
회원분들께도 공유드리면 도움이 될 것 같아 이렇게 올립니다☺️
수영하면서
잘 안되는 부분, 궁금한 점, 이런 영상 있었으면 좋겠다 하는 내용들
편하게 댓글이나 메시지로 남겨주시면
반영해서 영상으로 만들어보겠습니다!
아이들 수영에 대한 부족한 부분이나 궁금한 점 남겨주시면
그 내용들도 모아서 쉽게 이해할 수 있게 영상으로 제작해보겠습니다😊
많은 관심 부탁드립니다!🩵✨🫧🏊🏻‍♀️💕
유튜브 계정
https://www.youtube.com/channel/UC9rsCmgWrHwSfjK0GWHXD_g
인스타 계정
https://www.instagram.com/o_oh_swim?igsh=MTJlcHh4Z3U5YWhqaw%3D%3D`,
  },
  {
    author: '김흥준 팀장',
    date: '2026년 5월 3일 13:07',
    image: gasi01Image,
    views: 249,
    content: `제목: 소년체전 수영 강원도 대표 선발! 동해시의 자랑스러운 얼굴들을 소개합니다.
동해시 학부모님들 안녕하세요.
지난 4월 초 진행된 '전국 소년체전 강원도 선발전'에서 기쁜 소식이 있어 전해드립니다.
우리 시를 대표하여 5월 말 전국 대회에 출전할 수영 유망주 4인이 확정되었습니다.
[선발 명단]
여자부: 강보민, 권민서, 함채민
남자부: 홍시우
특히 이번 선발 인원 4명 모두가 CSC 수영장에서 꿈을 키워온 아이들이라 그 의미가 더욱 남다른 것 같습니다.
체계적인 시스템과 열정적인 지도, 그리고 무엇보다 아이들의 노력이 만들어낸 값진 결과라고 생각합니다. 동해시와 CSC 수영장의 이름을 걸고 전국 무대에 나설 우리 아이들에게 따뜻한 격려와 응원 부탁드립니다.
꿈나무들의 성장을 늘 응원하겠습니다. 감사합니다!`,
  },
  {
    author: '천호현 교육이사',
    date: '2026년 5월 19일 09:00',
    image: gasi03Image,
    views: 202,
    content: `안녕하세요, CSC 수영장입니다.
항상 저희 센터를 이용해 주시는 회원님들께 깊은 감사를 드립니다.
본 센터는 회원님들의 원활한 시설 이용과 효율적인 소통을 위해 ‘수영장 전용 앱’ 제작을 검토하고 있습니다.
실제 이용자이신 학부모님, 성인반 회원님 과거에 이용하진 적이 있거나 앞으로 이용 계획 중인 학부모님, 성인 회원님 모두 니즈를 정확히 반영하고자 하오니, 바쁘시더라도 잠시 응답해 주시면 더 나은 서비스로 보답하겠습니다.
https://forms.gle/MnKjhQqSABCGdfSQ9`,
  },
  {
    author: '오수빈 강사',
    date: '2026년 4월 2일 15:30',
    image: instructor05Image,
    views: 226,
    content: `안녕하세요😃
CSC 스위밍 아카데미 학부모님 여러분
오수빈 강사입니다.

이번 4월부터 아이들 정규반 수업을 맡게 되어 인사드립니다🙇🏻‍♀️

아이들이 수영을 처음 접하는 단계부터 실력을 키워가는 과정까지
항상 즐겁고 안전한 환경 속에서 배울 수 있도록 정성을 다해 지도하겠습니다.

아이들을 믿고 맡겨주시는 만큼
항상 책임감을 가지고 세심하게 지도하겠습니다.

아이들 수영과 관련해 궁금하신 점이나 상담이 필요하신 부분은
언제든지 편하게 연락 주시면 친절히 안내드리겠습니다.

감사합니다😊`,
  },
  {
    author: '천호현 교육이사',
    date: '2026년 4월 2일 15:30',
    image: instructor01Image,
    views: 218,
    content: `안녕하세요
CSC 스위밍 아카데미 학부모님 여러분
교육이사 천호현입니다

이번 4월부터 아이들 정규반 수업을 맡게 되어 인사드립니다🙇🏻

아이들의 수영 실력 향상은 물론, 그 이상의 성장과 경험을 느낄 수 있도록 지도하겠습니다
또한 항상 가까이에서 세심하게 케어하며 학부모님들께서 믿고 맡기실 수 있는 환경을 만들겠습니다

수업 운영, 시설 관리, 학부모님들과의 소통까지 하나하나 신경 쓰며
더 나은 CSC 스위밍 아카데미가 될 수 있도록 최선을 다하겠습니다

아이들을 보내주시면서 느끼시는 작은 불편함이나 의견도 언제든 편하게 말씀해 주시면
빠르게 개선해 나갈 수 있도록 노력하겠습니다

항상 저희 수영장과 함께해주셔서 감사합니다☺️`,
  },
]

function BoardScreen() {
  return (
    <div className="board_page">
      <header className="board_header">
        <h1>게시판</h1>
      </header>

      <nav className="board_category_list" aria-label="게시판 카테고리">
        <button className="board_category board_category_active" type="button">
          공지
        </button>
        <button className="board_category" type="button">
          휴무/등록 안내
        </button>
      </nav>

      <section className="board_post_list" aria-label="공지 게시물">
        {boardPosts.map((post) => (
          <BoardPostCard post={post} key={`${post.author}-${post.date}-${post.views}`} />
        ))}
      </section>
    </div>
  )
}

function BoardPostCard({ post }: { post: BoardPost }) {
  const previewText = post.content
    .split('\n')
    .map((line) => line.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join('\n')

  return (
    <article className="board_post_card">
      <div className="board_post_body">
        <header className="board_post_top">
          <div className="board_post_author">
            <span className="board_post_avatar" aria-hidden="true" />
            <div>
              <strong>{post.author}</strong>
              <time>{post.date}</time>
            </div>
          </div>
          <button className="board_post_menu" type="button" aria-label="게시물 메뉴">
            <img src={menuIcon} alt="" />
          </button>
        </header>

        <p className="board_post_content">{previewText}</p>
      </div>

      <div className="board_post_image_frame">
        <img src={post.image} alt="" />
      </div>

      <footer className="board_post_meta">
        <button className="board_post_reaction" type="button">
          <img src={smileIcon} alt="" />
          <span>표정짓기</span>
        </button>
        <span className="board_post_views">
          <img src={eyeIcon} alt="" />
          <span>{post.views}</span>
        </span>
      </footer>
    </article>
  )
}

export default BoardScreen
