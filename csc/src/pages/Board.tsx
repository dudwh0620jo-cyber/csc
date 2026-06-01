import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import backIcon from '../assets/svg/back.svg'
import eyeIcon from '../assets/svg/Eye.svg'
import bookmarkArrowIcon from '../assets/svg/famicons_arrow-down-outline.svg'
import smileIcon from '../assets/svg/gg_smile.svg'
import menuIcon from '../assets/svg/menu.svg'
import gasi01Image from '../assets/notice/gasi01.png'
import gasi02Image from '../assets/notice/gasi02.png'
import gasi03Image from '../assets/notice/gasi03.png'
import profile01Image from '../assets/notice/profile01.jpg'
import profile02Image from '../assets/notice/profile02.jpg'
import profile03Image from '../assets/notice/profile03.jpg'
import profile04Image from '../assets/notice/profile04.png'
import rest01Image from '../assets/notice/rest01.jpg'
import rest02Image from '../assets/notice/rest02.jpg'
import rest03Image from '../assets/notice/rest03.jpg'
import rest04Image from '../assets/notice/rest04.jpg'
import rest05Image from '../assets/notice/rest05.jpg'
import rest06Image from '../assets/notice/rest06.jpg'
import rest07Image from '../assets/notice/rest07.jpg'
import rest08Image from '../assets/notice/rest08.jpg'
import rest09Image from '../assets/notice/rest09.jpg'
import rest10Image from '../assets/notice/rest10.jpg'
import rest11Image from '../assets/notice/rest11.jpg'
import rest12Image from '../assets/notice/rest12.jpg'
import instructor01Image from '../assets/facilities/in01.png'
import instructor05Image from '../assets/facilities/in05.png'
import '../style/board.css'

type BoardCategoryId = 'notice' | 'rest'

type BoardPost = {
  id: string
  author: string
  date: string
  content: string
  images: string[]
  views: number
  reactions: Partial<Record<(typeof reactionOptions)[number]['id'], number>>
}

type ReactionWithCount = (typeof reactionOptions)[number] & {
  count: number
}

const urlPattern = /https?:\/\/[^\s]+/g
const fullPhonePattern = /(^|[^\d])((?:0\d{1,2})\)?\s*[-)]?\s*\d{3,4}\s*-\s*\d{4})/g
const chainedPhonePattern = /(^|[^\d])((?:0\d{1,2})\)?\s*[-)]?\s*\d{3,4})\s*-\s*(\d{4})(?:\s*,\s*(\d{4}))+/g
const accountLinePattern = /계좌\s*:\s*([^\n]+)/g

const reactionOptions = [
  { id: 'like', emoji: '😊', label: '좋아요' },
  { id: 'best', emoji: '👏', label: '최고예요' },
  { id: 'cheer', emoji: '💙', label: '응원해요' },
  { id: 'fun', emoji: '😄', label: '웃겨요' },
  { id: 'wow', emoji: '😮', label: '놀랐어요' },
]

const authorProfileImages: Record<string, string> = {
  '천호현 교육이사': profile01Image,
  '변금주 매니저': profile02Image,
  '김흥준 팀장': profile03Image,
  '오수빈 강사': profile04Image,
}

const getPostUrl = (postId: string) => {
  const { origin, pathname, search } = window.location

  return `${origin}${pathname}${search}#board-${postId}`
}

const copyToClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.top = '-9999px'
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

const getContentLinks = (content: string) => Array.from(new Set(content.match(urlPattern) ?? []))

const getLinkHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const getCopyTargets = (content: string) => {
  const phones = new Set<string>()

  for (const match of content.matchAll(fullPhonePattern)) {
    phones.add(match[2].replace(/\)/g, '-').replace(/\s+/g, '').replace(/-+/g, '-'))
  }

  for (const match of content.matchAll(chainedPhonePattern)) {
    const prefix = match[2].replace(/\)/g, '-').replace(/\s+/g, '').replace(/-+/g, '-')
    phones.add(`${prefix}-${match[3]}`)
    const extras = match[0].match(/,\s*(\d{4})/g) ?? []

    for (const extra of extras) {
      phones.add(`${prefix}-${extra.replace(/[,\s]/g, '')}`)
    }
  }

  const accounts = new Set<string>()

  for (const match of content.matchAll(accountLinePattern)) {
    const account = match[1].match(/\d{2,4}\s*-\s*\d{2,4}\s*-\s*\d{4,8}/)?.[0]

    if (account) {
      accounts.add(account.replace(/\s+/g, ''))
    }
  }

  return { phones: Array.from(phones), accounts: Array.from(accounts) }
}

const boardPosts: BoardPost[] = [
  {
    id: 'notice-01',
    author: '오수빈 강사',
    date: '2026년 5월 3일 13:07',
    images: [gasi02Image],
    views: 201,
    reactions: { like: 8, cheer: 5, best: 3 },
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
    id: 'notice-02',
    author: '김흥준 팀장',
    date: '2026년 4월 10일 14:29',
    images: [gasi01Image],
    views: 249,
    reactions: { best: 11, cheer: 9, like: 4 },
    content: `소년체전 수영 강원도 대표 선발!
    동해시의 자랑스러운 얼굴들을 소개합니다.

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
    id: 'notice-03',
    author: '천호현 교육이사',
    date: '2026년 5월 19일 09:00',
    images: [gasi03Image],
    views: 202,
    reactions: { like: 6, wow: 2, cheer: 2 },
    content: `안녕하세요, CSC 수영장입니다.
항상 저희 센터를 이용해 주시는 회원님들께 깊은 감사를 드립니다.

본 센터는 회원님들의 원활한 시설 이용과 효율적인 소통을 위해 ‘수영장 전용 앱’ 제작을 검토하고 있습니다.

실제 이용자이신 학부모님, 성인반 회원님 과거에 이용하진 적이 있거나 앞으로 이용 계획 중인 학부모님, 성인 회원님 모두 니즈를 정확히 반영하고자 하오니, 바쁘시더라도 잠시 응답해 주시면 더 나은 서비스로 보답하겠습니다.

https://forms.gle/MnKjhQqSABCGdfSQ9`,
  },
  {
    id: 'notice-04',
    author: '오수빈 강사',
    date: '2026년 4월 2일 15:30',
    images: [instructor05Image],
    views: 226,
    reactions: { like: 7, cheer: 6 },
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
    id: 'notice-05',
    author: '천호현 교육이사',
    date: '2026년 4월 2일 15:30',
    images: [instructor01Image],
    views: 218,
    reactions: { cheer: 8, like: 5, best: 2 },
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

const restPosts: BoardPost[] = [
  {
    id: 'rest-01',
    author: '변금주 매니저',
    date: '2026년 5월 18일 09:00',
    images: [rest01Image, rest02Image, rest03Image, rest04Image],
    views: 144,
    reactions: { like: 6, cheer: 4 },
    content: `🌟6월 수업 재등록기간입니다🌟

6월 일정표와 공지사항 꼭 확인 부탁드립니다.
- 센터 계좌번호 꼭 확인 부탁드립니다!
- 아이이름+나이 순으로 입금해주세요

계좌 : 100 - 037 - 196924
예금주 : (주)씨에스씨스포츠센터

✔️ 5주차 휴무일 : ‘‘6월 29일(월) ~ 7월 3일(금)(5일간)’’
     - 일요일은 정기 휴무일입니다.

✔️ 6월 3일(수) 지방선거일 휴무 : 의무보강 진행
      6월 6일(토) 현충일 휴무 : 의무보강 진행
- 의무보강은 차량지원 가능하오니,
각 담당선생님과 보강스케줄 협의하여 주시기 바랍니다.

✔️ 6월 20일(토) : 레벨테스트 PM 3:00
    (레벨테스트 가능여부는 담당선생님과 상의해주세요)

문의사항은 센터로 연락주세요
☎️ 033)522-6337, 4337`,
  },
  {
    id: 'rest-02',
    author: '변금주 매니저',
    date: '2026년 4월 28일 16:09',
    images: [rest05Image],
    views: 153,
    reactions: { like: 5, cheer: 2 },
    content: `🌼4월 5주차 휴무일, 5월 휴무 공지🌼

4월 5주차 휴무일 (4월 29일(수) ~ 5월 2일(토))

5월 5일(화) 어린이날 휴무 : 의무보강
5월 25일(월) 대체공휴일 휴무 : 의무보강

5월 휴무일 공지 드리며
아이들 스케줄에 착오없도록 참고부탁드립니다.
☎️문의사항은 센터로 연락 주세요 
033) 522-6337, 4337`,
  },
  {
    id: 'rest-03',
    author: '변금주 매니저',
    date: '2026년 4월 24일 17:22',
    images: [rest06Image],
    views: 180,
    reactions: { best: 4, like: 3, wow: 2 },
    content: `다가오는 5월 1일부터 혜택 시작! 
연말정산 되는 수영장🎉
이제 수영도 절반 가격으로 즐기세요

🏊‍♂️ 수강료 최대 50% 소득공제!
연말정산 때 돌려받는 똑똑한 운동 ✨

✔ 어린이수영 / 성인수영 / 개인레슨
✔ 연 최대 300만원 소득공제
✔ 온 가족 함께 가능한 문화비 혜택

운동도 하고, 건강도 챙기고,
연말정산 혜택까지 한 번에!

아이도, 부모님도, 직장인도
지금이 가장 좋은 시작 타이밍입니다`,
  },
  {
    id: 'rest-04',
    author: '변금주 매니저',
    date: '2026년 4월 23일 15:20',
    images: [rest07Image, rest08Image],
    views: 183,
    reactions: { cheer: 7, like: 5, best: 3 },
    content: `——————— 선착순 마감 ——————————
다가오는 5월 5일, 어린이날! 🎉
올해는 더 특별하게 즐겨보세요 😊
사용자가 올린 이미지

“친구야, 수영 가자!” 🏊‍♂️

아이와 친구, 그리고 가족이 함께 즐길 수 있는
신나는 어린이날 자유수영 이벤트를 준비했어요!
물놀이하러 CSC로 놀러 오세요 💙

✨ [이벤트 안내] ✨

💙 참가비 : 무료
★ 선착순 총 40명 (타임별 20명씩 모집) ★

🕘 이용 시간
① 09:30 ~ 10:50
② 11:00 ~ 12:20

🌈 대상

누구나 신청 가능 (기존 수강생 없이도 OK!)
친구와 함께 참여 가능 👬
부모님 + 아이 함께 참여 가능 👨‍👩‍👧

※ 안전을 위해 초등학교 1학년 이상 신청 가능
※ 단, 부모님과 함께 참여 시 6세·7세도 신청 가능합니다

🌈 접수기간
4월 22일(화) ~ 5월 3일(토)
※ 4월 29일 ~ 5월 2일은 5주차 휴무로 접수 불가

🌈 혜택
🎀 어린이날 기념 선물 증정 🎀

📌 꼭 확인해주세요

타임별 선착순 마감이므로 빠른 신청 부탁드립니다
노쇼는 다른 참여자에게 피해가 될 수 있으니 꼭 참석 부탁드립니다
개인 준비물(수영복, 수경, 수모, 개인 수건)은 반드시 지참해주세요

아이들과 함께 즐거운 어린이날 추억을 만들어보세요 💕`,
  },
  {
    id: 'rest-05',
    author: '변금주 매니저',
    date: '2026년 4월 19일 09:00',
    images: [rest09Image, rest10Image, rest11Image, rest12Image],
    views: 169,
    reactions: { like: 6, cheer: 5 },
    content: `🌸4월 수업 재등록기간입니다🌸

4월 일정표와 공지사항 꼭 확인 부탁드립니다.
- 센터 계좌번호 꼭 확인 부탁드립니다!
- 아이이름+나이 순으로 입금해주세요

계좌 : 신한 100 - 037 - 196924
예금주 : (주)씨에스씨스포츠센터

✔️ 5주차 휴무일 : ‘‘4월 29일(수) ~ 5월 2일(토)(4일간)’’
     - 일요일은 정기 휴무일입니다.

⚠️ 학기가 시작되어 승하차 장소와 반변경 문의가 많습니다.
변경 사항은 담당선생님 또는 센터로 미리 연락주시면
큰 도움이 됩니다🤍

문의사항은 센터로 연락주세요
☎️ 033)522-6337, 4337`,
  },
]

function BoardScreen() {
  const [activeCategoryId, setActiveCategoryId] = useState<BoardCategoryId>('notice')
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [selectedReactionByPostId, setSelectedReactionByPostId] = useState<Record<string, string | null>>({})
  const listScrollYRef = useRef(0)
  const shouldRestoreScrollRef = useRef(false)
  const activePosts = activeCategoryId === 'notice' ? boardPosts : restPosts
  const activeCategoryLabel = activeCategoryId === 'notice' ? '공지' : '휴무/등록 안내'
  const selectedPost = activePosts.find((post) => post.id === selectedPostId)

  useLayoutEffect(() => {
    if (selectedPostId || !shouldRestoreScrollRef.current) {
      return
    }

    shouldRestoreScrollRef.current = false
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: listScrollYRef.current, behavior: 'auto' })
    })
  }, [selectedPostId])

  const updateSelectedReaction = (postId: string, reactionId: string) => {
    setSelectedReactionByPostId((current) => ({
      ...current,
      [postId]: reactionId,
    }))
  }

  if (selectedPost) {
    return (
      <BoardPostDetail
        categoryLabel={activeCategoryLabel}
        post={selectedPost}
        selectedReactionId={selectedReactionByPostId[selectedPost.id] ?? null}
        onBack={() => {
          shouldRestoreScrollRef.current = true
          setSelectedPostId(null)
        }}
        onSelectReaction={(reactionId) => updateSelectedReaction(selectedPost.id, reactionId)}
      />
    )
  }

  return (
    <div className="board_page">
      <header className="board_header">
        <h1>게시판</h1>
      </header>

      <nav className="board_category_list" aria-label="게시판 카테고리">
        <button
          className={activeCategoryId === 'notice' ? 'board_category board_category_active' : 'board_category'}
          type="button"
          onClick={() => {
            setActiveCategoryId('notice')
            setSelectedPostId(null)
          }}
        >
          공지
        </button>
        <button
          className={activeCategoryId === 'rest' ? 'board_category board_category_active' : 'board_category'}
          type="button"
          onClick={() => {
            setActiveCategoryId('rest')
            setSelectedPostId(null)
          }}
        >
          휴무/등록 안내
        </button>
      </nav>

      <section className="board_post_list" aria-label={`${activeCategoryLabel} 게시물`}>
        {activePosts.map((post) => (
          <BoardPostCard
            post={post}
            selectedReactionId={selectedReactionByPostId[post.id] ?? null}
            key={post.id}
            onOpen={() => {
              listScrollYRef.current = window.scrollY
              setSelectedPostId(post.id)
              window.requestAnimationFrame(() => {
                window.scrollTo({ top: 0, behavior: 'auto' })
              })
            }}
            onSelectReaction={(reactionId) => updateSelectedReaction(post.id, reactionId)}
          />
        ))}
      </section>
    </div>
  )
}

type BoardPostCardProps = {
  post: BoardPost
  selectedReactionId: string | null
  onOpen: () => void
  onSelectReaction: (reactionId: string) => void
}

function BoardPostCard({ post, selectedReactionId, onOpen, onSelectReaction }: BoardPostCardProps) {
  const [isReactionOpen, setIsReactionOpen] = useState(false)
  const selectedReaction = reactionOptions.find((reaction) => reaction.id === selectedReactionId)
  const reactionSummary = reactionOptions
    .map((reaction) => ({
      ...reaction,
      count: (post.reactions[reaction.id] ?? 0) + (selectedReactionId === reaction.id ? 1 : 0),
    }))
    .filter((reaction) => reaction.count > 0)

  const previewText = post.content
    .split('\n')
    .map((line) => line.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join('\n')

  return (
    <article className="board_post_card" onClick={onOpen}>
      <div className="board_post_body">
        <header className="board_post_top">
          <div className="board_post_author">
            <AuthorAvatar author={post.author} />
            <div>
              <strong>{post.author}</strong>
              <time>{post.date}</time>
            </div>
          </div>
          <BoardPostMenu post={post} />
        </header>

        <p className="board_post_content">{previewText}</p>
      </div>

      <div className="board_post_image_list">
        {post.images.map((image) => (
          <div className="board_post_image_frame" key={image}>
            <img src={image} alt="" />
          </div>
        ))}
      </div>

      <ReactionSummary reactions={reactionSummary} selectedReactionId={selectedReactionId} />

      <ReactionBubble
        isOpen={isReactionOpen}
        selectedReactionId={selectedReactionId}
        onSelect={(reactionId) => {
          onSelectReaction(reactionId)
          setIsReactionOpen(false)
        }}
      />

      <footer className="board_post_meta">
        <button
          className={selectedReaction ? 'board_post_reaction board_post_reaction_selected' : 'board_post_reaction'}
          type="button"
          aria-expanded={isReactionOpen}
          onClick={(event) => {
            event.stopPropagation()
            setIsReactionOpen((current) => !current)
          }}
        >
          <img src={smileIcon} alt="" />
          <span>{selectedReaction ? selectedReaction.label : '표정짓기'}</span>
        </button>
        <span className="board_post_views">
          <img src={eyeIcon} alt="" />
          <span>{post.views}</span>
        </span>
      </footer>
    </article>
  )
}

type ReactionSummaryProps = {
  reactions: ReactionWithCount[]
  selectedReactionId: string | null
}

function ReactionSummary({ reactions, selectedReactionId }: ReactionSummaryProps) {
  return (
    <div className="board_reaction_summary" aria-label="게시물 표정 반응">
      {reactions.map((reaction) => (
        <span
          className={
            reaction.id === selectedReactionId
              ? 'board_reaction_count board_reaction_count_selected'
              : 'board_reaction_count'
          }
          key={reaction.id}
        >
          <span aria-hidden="true">{reaction.emoji}</span>
          {reaction.count}
        </span>
      ))}
    </div>
  )
}

type ReactionBubbleProps = {
  isOpen: boolean
  selectedReactionId: string | null
  onSelect: (reactionId: string) => void
}

function ReactionBubble({ isOpen, selectedReactionId, onSelect }: ReactionBubbleProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          className="board_reaction_bubble"
          role="menu"
          aria-label="표정 선택"
          initial={{ height: 0, opacity: 0, scale: 0.96, y: 6 }}
          animate={{ height: 'auto', opacity: 1, scale: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, scale: 0.96, y: 6 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={(event) => event.stopPropagation()}
        >
          {reactionOptions.map((reaction) => (
            <button
              className={
                reaction.id === selectedReactionId
                  ? 'board_reaction_option board_reaction_option_active'
                  : 'board_reaction_option'
              }
              type="button"
              role="menuitemradio"
              aria-checked={reaction.id === selectedReactionId}
              key={reaction.id}
              onClick={() => onSelect(reaction.id)}
            >
              <span aria-hidden="true">{reaction.emoji}</span>
              {reaction.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function BoardPostMenu({ post }: { post: BoardPost }) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const postUrl = getPostUrl(post.id)

  const runMenuAction = async (action: () => Promise<void>, message: string) => {
    await action()
    setFeedback(message)
    window.setTimeout(() => setFeedback(''), 1400)
    setIsOpen(false)
  }

  const sharePost = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${post.author} 게시글`,
        text: post.content,
        url: postUrl,
      })
      return
    }

    await copyToClipboard(postUrl)
  }

  return (
    <div className="board_post_menu_wrap" onClick={(event) => event.stopPropagation()}>
      <button
        className="board_post_menu"
        type="button"
        aria-label="게시물 메뉴"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <img src={menuIcon} alt="" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="board_post_action_menu"
            role="menu"
            aria-label="게시물 메뉴 항목"
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <button type="button" role="menuitem" onClick={() => runMenuAction(() => copyToClipboard(post.content), '본문 복사됨')}>
              본문 복사
            </button>
            <button type="button" role="menuitem" onClick={() => runMenuAction(() => copyToClipboard(postUrl), '주소 복사됨')}>
              주소 복사
            </button>
            <button type="button" role="menuitem" onClick={() => runMenuAction(sharePost, '공유 완료')}>
              공유하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.span
            className="board_post_menu_feedback"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
          >
            {feedback}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

type BoardPostDetailProps = {
  categoryLabel: string
  post: BoardPost
  selectedReactionId: string | null
  onBack: () => void
  onSelectReaction: (reactionId: string) => void
}

function BoardPostDetail({ categoryLabel, post, selectedReactionId, onBack, onSelectReaction }: BoardPostDetailProps) {
  const [isReactionOpen, setIsReactionOpen] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState('')
  const selectedReaction = reactionOptions.find((reaction) => reaction.id === selectedReactionId)
  const contentLinks = getContentLinks(post.content)
  const copyTargets = getCopyTargets(post.content)
  const reactionSummary = reactionOptions
    .map((reaction) => ({
      ...reaction,
      count: (post.reactions[reaction.id] ?? 0) + (selectedReactionId === reaction.id ? 1 : 0),
    }))
    .filter((reaction) => reaction.count > 0)

  return (
    <div className="board_detail_page">
      <header className="board_detail_header">
        <button className="board_detail_back" type="button" aria-label="게시판으로 돌아가기" onClick={onBack}>
          <img src={backIcon} alt="" />
        </button>
        <h1>{categoryLabel}</h1>
        <span aria-hidden="true" />
      </header>

      <article className="board_detail_card">
        <div className="board_detail_body">
          <header className="board_post_top">
            <div className="board_post_author">
              <AuthorAvatar author={post.author} />
              <div>
                <strong>{post.author}</strong>
                <time>{post.date}</time>
              </div>
            </div>
            <BoardPostMenu post={post} />
          </header>

          <LinkifiedContent content={post.content} />
          <CopyTargetList
            accounts={copyTargets.accounts}
            phones={copyTargets.phones}
            onCopy={async (value, label) => {
              await copyToClipboard(value)
              setCopyFeedback(`${label} 복사됨`)
              window.setTimeout(() => setCopyFeedback(''), 1400)
            }}
          />
          <AnimatePresence>
            {copyFeedback && (
              <motion.span
                className="board_detail_copy_feedback"
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.14, ease: 'easeOut' }}
              >
                {copyFeedback}
              </motion.span>
            )}
          </AnimatePresence>
          {contentLinks.length > 0 && <LinkBookmarkList links={contentLinks} />}
        </div>

        <div className="board_detail_image_list">
          {post.images.map((image) => (
            <div className="board_detail_image_frame" key={image}>
              <img src={image} alt="" />
            </div>
          ))}
        </div>

        <ReactionSummary reactions={reactionSummary} selectedReactionId={selectedReactionId} />

        <ReactionBubble
          isOpen={isReactionOpen}
          selectedReactionId={selectedReactionId}
          onSelect={(reactionId) => {
            onSelectReaction(reactionId)
            setIsReactionOpen(false)
          }}
        />

        <footer className="board_post_meta">
          <button
            className={selectedReaction ? 'board_post_reaction board_post_reaction_selected' : 'board_post_reaction'}
            type="button"
            aria-expanded={isReactionOpen}
            onClick={() => setIsReactionOpen((current) => !current)}
          >
            <img src={smileIcon} alt="" />
            <span>{selectedReaction ? selectedReaction.label : '표정짓기'}</span>
          </button>
          <span className="board_post_views">
            <img src={eyeIcon} alt="" />
            <span>{post.views}</span>
          </span>
        </footer>
      </article>
    </div>
  )
}

type CopyTargetListProps = {
  accounts: string[]
  phones: string[]
  onCopy: (value: string, label: string) => Promise<void>
}

function CopyTargetList({ accounts, phones, onCopy }: CopyTargetListProps) {
  if (accounts.length === 0 && phones.length === 0) {
    return null
  }

  return (
    <div className="board_copy_target_list" aria-label="복사 가능한 정보">
      {phones.map((phone) => (
        <button className="board_copy_target_chip" type="button" key={`phone-${phone}`} onClick={() => onCopy(phone, '전화번호')}>
          <span>전화번호</span>
          {phone}
        </button>
      ))}
      {accounts.map((account) => (
        <button className="board_copy_target_chip" type="button" key={`account-${account}`} onClick={() => onCopy(account, '계좌번호')}>
          <span>계좌번호</span>
          {account}
        </button>
      ))}
    </div>
  )
}

function AuthorAvatar({ author }: { author: string }) {
  const profileImage = authorProfileImages[author]

  if (!profileImage) {
    return <span className="board_post_avatar" aria-hidden="true" />
  }

  return <img className="board_post_avatar" src={profileImage} alt="" />
}

function LinkifiedContent({ content }: { content: string }) {
  const parts = content.split(urlPattern)
  const urls = content.match(urlPattern) ?? []

  return (
    <p className="board_detail_content">
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {urls[index] && (
            <a className="board_detail_link" href={urls[index]} target="_blank" rel="noreferrer">
              {urls[index]}
            </a>
          )}
        </span>
      ))}
    </p>
  )
}

function LinkBookmarkList({ links }: { links: string[] }) {
  return (
    <div className="board_bookmark_list" aria-label="본문 링크 북마크">
      {links.map((link) => (
        <a className="board_bookmark_card" href={link} target="_blank" rel="noreferrer" key={link}>
          <div className="board_bookmark_icon" aria-hidden="true">
            <img src={bookmarkArrowIcon} alt="" />
          </div>
          <div>
            <strong>{getLinkHost(link)}</strong>
            <span>{link}</span>
          </div>
        </a>
      ))}
    </div>
  )
}

export default BoardScreen
