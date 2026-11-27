import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

type PlanKey = '3000' | '5000' | '10000';

interface PlanDetail {
  badge: string;
  name: string;
  subtitle: string;
  desc: string;
  monthly: string;
  principal: string;
  target: string;
  formValue: string;
}

const PLAN_DATA: Record<PlanKey, PlanDetail> = {
  '3000': {
    badge: '부담 없는 첫 자산·연금 스타트 플랜',
    name: '3천 플랜',
    subtitle: '(5년 단기납입)',
    desc: '사회초년생이나 이미 다른 저축을 병행 중인 분께 적합합니다. 월 39만원씩 5년만 납입해 3천만원대 목적자금 또는 기본 연금 토대를 부담 없이 마련할 수 있습니다.',
    monthly: '월 39만원',
    principal: '2,340만원',
    target: '약 3,042만원',
    formValue: '3천 플랜 (월 39만원 / 5년)',
  },
  '5000': {
    badge: '가장 균형 잡힌 실속형 인기 플랜',
    name: '5천 플랜',
    subtitle: '(10년 130% 구조)',
    desc: '월 65만원씩 5년 납입 후 10년 시점 130% 구조로 약 5천만원 규모의 자산을 형성합니다. 자녀 교육·결혼 목적자금과 노후 보조 연금을 동시에 대비하는 실속 플랜입니다.',
    monthly: '월 65만원',
    principal: '3,900만원',
    target: '약 5,070만원',
    formValue: '5천 플랜 (월 65만원 / 5년)',
  },
  '10000': {
    badge: '프리미엄 노후·자산 완성 플랜',
    name: '1억 플랜',
    subtitle: '(10년 130% 구조)',
    desc: '은퇴 후 부부의 기본 생활비를 든든하게 책임지거나, 10년 뒤 1억 원 규모의 목돈(목적자금)을 한 번에 마련하고자 하는 분께 가장 추천하는 핵심 플랜입니다.',
    monthly: '월 129만원',
    principal: '7,740만원',
    target: '약 1억 62만원',
    formValue: '1억 플랜 (월 129만원 / 5년)',
  },
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: '정말 5년만 납입하면 그 이후에는 추가로 내지 않아도 되나요?',
    answer:
      '네, 맞습니다. 트리플연금설계는 경제활동이 활발한 시기에 딱 5년(60개월)만 집중 납입하고 납입을 완료하는 단기납 구조입니다. 5년 이후에는 추가 납입 부담 없이 거치 기간 동안 자산을 키워 나가는 방식으로 운용됩니다.',
  },
  {
    question: '10년 시점 130% 구조란 구체적으로 어떤 의미인가요?',
    answer:
      '5년간 원금을 완납한 뒤 10년 시점까지 유지할 경우, 총 납입 원금 대비 약 130% 수준으로 자산이 형성되는 구조를 말합니다. 예를 들어 월 65만원씩 5년간 총 3,900만원을 납입하면 10년 시점에 약 5,070만원 규모의 자산 형성(공시이율·연령·상품 약관 기준에 따라 변동 가능)을 기대할 수 있습니다.',
  },
  {
    question: '중간에 급한 목돈이 필요해지면 해지해야 하나요?',
    answer:
      '아닙니다. 계약을 해지하지 않고도 약관 기준 내 중도인출 기능을 활용해 필요한 자금만 꺼내 쓰실 수 있습니다. 또한 10년 시점 이후에는 목적자금(자녀 결혼·교육·주택자금 등)으로 일시금을 수령하시거나, 노후 대비를 위해 평생 연금으로 전환하는 것도 자유롭게 선택 가능합니다.',
  },
  {
    question: '월 39만 / 65만 / 129만원 외에 다른 금액으로도 설계가 가능한가요?',
    answer:
      '물론입니다. 3천·5천·1억 플랜은 가장 많이 선택하시는 대표적인 기준 예시이며, 고객님의 현재 소득 수준, 기존 연금 자산, 은퇴 목표 시점에 맞춰 월 납입 금액을 1만원 단위까지 유연하게 맞춤 설계해 드립니다.',
  },
  {
    question: '상담 신청을 하면 어떻게 진행되나요? 부담스러운 권유는 없나요?',
    answer:
      '신청 시 선택하신 희망 시간대에 맞춰 20년 경력 전문가가 연령대·목적별 1:1 시뮬레이션 리포트를 안내해 드립니다. 가입을 강요하는 영업 전화 없이, 먼저 맞춤 설계안을 충분히 비교·검토해 보신 뒤 원하실 때만 진행하실 수 있습니다.',
  },
];

const CONSULT_TIME_SLOTS = [
  '평일 오전 (09:00 ~ 12:00)',
  '평일 오후 (12:00 ~ 18:00)',
  '평일 저녁 (18:00 ~ 21:00)',
  '주말 / 공휴일 예약 상담',
  '시간 무관 (문자·카톡 안내 선호)',
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('10000');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('40대');
  const [userPlan, setUserPlan] = useState('1억 플랜 (월 129만원 / 5년)');
  const [userGoal, setUserGoal] = useState('노후 연금 수령');
  const [userConsultTime, setUserConsultTime] = useState(CONSULT_TIME_SLOTS[1]);
  const [userContact, setUserContact] = useState('');
  const [userMemo, setUserMemo] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submittedInfo, setSubmittedInfo] = useState<{
    name: string;
    age: string;
    plan: string;
    goal: string;
    consultTime: string;
    contact: string;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentPlan = PLAN_DATA[selectedPlan];

  const syncFormPlan = () => {
    setUserPlan(currentPlan.formValue);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = userName.trim();
    const contact = userContact.trim();
    const memo = userMemo.trim();

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

    setIsSubmitting(true);
    try {
      if (accessKey && accessKey.trim() !== '') {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `[보험플러스 트리플연금] ${name}님(${userAge}) 상담 신청`,
            from_name: '보험플러스 트리플연금설계',
            성함: name,
            연령대: userAge,
            관심플랜: userPlan,
            준비목적: userGoal,
            희망상담시간: userConsultTime,
            회신연락처: contact,
            문의내용: memo || '없음',
          }),
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error('전송에 실패했습니다.');
        }
      }

      setSubmittedInfo({
        name,
        age: userAge,
        plan: userPlan,
        goal: userGoal,
        consultTime: userConsultTime,
        contact,
      });
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setUserName('');
    setUserAge('40대');
    setUserPlan('1억 플랜 (월 129만원 / 5년)');
    setUserGoal('노후 연금 수령');
    setUserConsultTime(CONSULT_TIME_SLOTS[1]);
    setUserContact('');
    setUserMemo('');
    setSubmittedInfo(null);
    setSubmitStatus('idle');
  };

  return (
    <div className="min-h-screen">
      {/* 상단 네비게이션 바 (스크롤 시 항상 상단 고정) */}
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 w-full z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-amber-900/10 transition-shadow duration-300 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          <a href="#" className="flex items-center space-x-1.5 sm:space-x-3 shrink-0 group min-w-0">
            {/* 보험플러스 투명 배경 벡터 로고 */}
            <div className="flex items-center shrink-0">
              <svg
                viewBox="0 0 340 96"
                className="h-8 xs:h-9 sm:h-11 lg:h-12 w-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="bpBlueHeart" x1="18" y1="22" x2="54" y2="78" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="55%" stopColor="#0284C7" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                  <linearGradient id="bpGreenHeart" x1="56" y1="18" x2="86" y2="74" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#A3E635" />
                    <stop offset="50%" stopColor="#65A30D" />
                    <stop offset="100%" stopColor="#15803D" />
                  </linearGradient>
                  <linearGradient id="bpGoldText" x1="165" y1="20" x2="295" y2="62" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                  <linearGradient id="bpArcLine" x1="92" y1="68" x2="310" y2="68" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#0284C7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {/* 좌측 블루 하트 날개 */}
                <path
                  d="M52 78C33 65 16 50 16 33C16 22 24.5 15 34.5 15C41.5 15 47.5 18.5 52 24.5C43.5 26 37 33 37 43C37 55 44 67 52 78Z"
                  fill="url(#bpBlueHeart)"
                />
                {/* 우측 그린 하트 */}
                <path
                  d="M52 78C71 65 88 50 88 33C88 22 79.5 15 69.5 15C62.5 15 56.5 18.5 52 24.5C60.5 26 67 33 67 43C67 55 60 67 52 78Z"
                  fill="url(#bpGreenHeart)"
                />
                {/* 하단 대각선 그린 리프 스우시 */}
                <path d="M35 81C52 71 71 58 88 41C79 60 61 74 35 81Z" fill="#65A30D" />
                <path d="M35 81C51 73 67 62 82 48C72 64 56 75 35 81Z" fill="#84CC16" />
                {/* 내부 블루 가족 실루엣 (부모 + 아이) */}
                <circle cx="43" cy="37" r="4.8" fill="#0284C7" />
                <circle cx="61" cy="37" r="4.8" fill="#0284C7" />
                <circle cx="52" cy="46.5" r="3.8" fill="#0369A1" />
                <path
                  d="M35 53C35 47.5 39 44 43.5 44C47.5 44 49.8 46.2 50.8 49.5M69 53C69 47.5 65 44 60.5 44C56.5 44 54.2 46.2 53.2 49.5"
                  stroke="#0284C7"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                />
                <path
                  d="M44.5 59C44.5 54.5 47.8 52 52 52C56.2 52 59.5 54.5 59.5 59"
                  stroke="#0369A1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* 우측 상단 4각 골드 스파클 */}
                <path d="M90 6L92.6 13.4L100 16L92.6 18.6L90 26L87.4 18.6L80 16L87.4 13.4L90 6Z" fill="#F59E0B" />
                {/* 메인 타이포그래피: 투명 배경에 맞춘 짙은 네이비 & 골드 */}
                <g transform="skewX(-9)">
                  <text
                    x="108"
                    y="54"
                    fill="#182232"
                    fontFamily="'Noto Sans KR', sans-serif"
                    fontWeight="900"
                    fontSize="37"
                    letterSpacing="-1.5"
                  >
                    보험
                  </text>
                  <text
                    x="180"
                    y="54"
                    fill="url(#bpGoldText)"
                    fontFamily="'Noto Sans KR', sans-serif"
                    fontWeight="900"
                    fontSize="37"
                    letterSpacing="-1.5"
                  >
                    플러스
                  </text>
                </g>
                {/* 우측 상단 굵은 + 기호 */}
                <path d="M306 14H315V23H324V32H315V41H306V32H297V23H306V14Z" fill="#D97706" />
                {/* 하단 곡선 아치 라인 */}
                <path d="M94 69C158 58 242 58 308 69" stroke="url(#bpArcLine)" strokeWidth="2.6" strokeLinecap="round" />
                {/* 하단 슬로건: — 당신의 행복을 지키는 보험 — */}
                <line x1="112" y1="81" x2="128" y2="81" stroke="#94A3B8" strokeWidth="1.4" />
                <text
                  x="201"
                  y="85"
                  textAnchor="middle"
                  fill="#475569"
                  fontFamily="'Noto Sans KR', sans-serif"
                  fontWeight="600"
                  fontSize="11.5"
                  letterSpacing="0.5"
                >
                  당신의 행복을 지키는 보험
                </text>
                <line x1="274" y1="81" x2="290" y2="81" stroke="#94A3B8" strokeWidth="1.4" />
              </svg>
            </div>
            <span className="font-serif font-bold text-xs sm:text-base lg:text-lg text-brand-brown tracking-tight whitespace-nowrap">
              트리플연금설계
            </span>
          </a>

          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-medium text-stone-700 whitespace-nowrap">
            <a href="#why-pension" className="hover:text-brand-gold transition">
              연금이 필수인 이유
            </a>
            <a href="#triple-plans" className="hover:text-brand-gold transition">
              3대 맞춤 플랜
            </a>
            <a href="#flexibility" className="hover:text-brand-gold transition">
              목적자금 활용법
            </a>
            <a href="#expert-note" className="hover:text-brand-gold transition">
              20년 전문가 칼럼
            </a>
            <a href="#qna-section" className="hover:text-brand-gold transition">
              자주 묻는 질문
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#consult-section"
              className="bg-brand-brown hover:bg-brand-dark text-amber-100 text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-sm transition transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              무료 설계안 받기
            </a>
            {/* 모바일·태블릿 메뉴 토글 버튼 */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="메뉴 열기"
              className="lg:hidden p-2.5 rounded-xl text-brand-brown hover:bg-amber-900/5 transition"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`} />
            </button>
          </div>
        </div>

        {/* 모바일·태블릿 드롭다운 메뉴 */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDFBF7] border-b border-amber-900/10 px-4 py-3 space-y-1 shadow-md">
            <a
              href="#why-pension"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-xl text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-brand-brown"
            >
              연금이 필수인 이유
            </a>
            <a
              href="#triple-plans"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-xl text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-brand-brown"
            >
              3대 맞춤 플랜
            </a>
            <a
              href="#flexibility"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-xl text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-brand-brown"
            >
              목적자금 활용법
            </a>
            <a
              href="#expert-note"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-xl text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-brand-brown"
            >
              20년 전문가 칼럼
            </a>
            <a
              href="#qna-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-xl text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-brand-brown"
            >
              자주 묻는 질문 (Q&amp;A)
            </a>
          </div>
        )}
      </header>

      {/* 1. 히어로 섹션 (전단지 핵심 메시지 전달) */}
      <section className="hero-bg pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* 좌측 카피라이팅 */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-brand-brown text-xs sm:text-sm font-semibold">
                <i className="fa-solid fa-award text-brand-gold shrink-0" />
                <span>단기납입 · 자산형성 · 연금연결의 완벽한 조화</span>
              </div>

              <h1 className="font-serif text-[28px] sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-brand-brown leading-[1.28] tracking-tight">
                오늘의 5년 준비가
                <br />
                <span className="gold-gradient-text">내일의 1억 자산</span>이 됩니다
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                길게 내는 연금은 이제 지치셨죠? 딱 <strong>5년만 집중 납입</strong>하고, 10년 시점{' '}
                <strong>130% 환급 구조</strong>로 노후 연금은 물론 내 집 마련·자녀 결혼 등 목적자금까지 자유롭게
                설계하세요.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
                <a
                  href="#triple-plans"
                  className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-brand-brown hover:bg-brand-dark text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-950/15 transition flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <span>내게 맞는 플랜 확인하기</span>
                  <i className="fa-solid fa-arrow-right text-amber-300 text-sm" />
                </a>
                <a
                  href="#consult-section"
                  className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-amber-50 text-brand-brown border border-amber-900/20 font-semibold text-sm sm:text-base transition flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <i className="fa-regular fa-file-lines text-brand-gold" />
                  <span>1:1 맞춤 포트폴리오 신청</span>
                </a>
              </div>

              {/* 핵심 요약 배지 */}
              <div className="pt-5 sm:pt-6 grid grid-cols-3 gap-2 sm:gap-6 border-t border-amber-900/10 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-[11px] sm:text-xs text-stone-500">납입 기간</p>
                  <p className="font-bold text-base sm:text-xl text-brand-brown">단 5년 완료</p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-stone-500">10년 시점 구조</p>
                  <p className="font-bold text-base sm:text-xl text-brand-gold">130% 환급 구조</p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-stone-500">자금 활용</p>
                  <p className="font-bold text-base sm:text-xl text-brand-sage">연금·일시금·인출</p>
                </div>
              </div>
            </div>

            {/* 우측 전단지 요약 카드 (시각적 포인트) */}
            <div className="lg:col-span-5 max-w-md sm:max-w-lg mx-auto w-full">
              <div className="bg-white rounded-3xl p-5 sm:p-8 gold-border-card relative">
                <div className="absolute -top-3.5 right-5 sm:right-6 bg-brand-brown text-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-full shadow whitespace-nowrap">
                  추천플랜
                </div>
                <div className="text-center pb-5 border-b border-stone-100">
                  <div className="inline-flex items-center justify-center space-x-1.5 px-3 py-1 rounded-full bg-[#162235] text-white text-xs font-bold mb-2">
                    <span>
                      보험<span className="text-amber-300">플러스+</span>
                    </span>
                    <span className="text-stone-400">|</span>
                    <span className="text-amber-100 font-normal">당신의 행복을 지키는 보험</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-brand-brown">보험플러스 트리플연금설계</h2>
                  <p className="text-xs text-stone-500 mt-1">단기납입 · 자산형성 · 연금연결</p>
                </div>

                <div className="space-y-3.5 my-6">
                  {/* 3천 플랜 */}
                  <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-amber-200/70 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-stone-500 block">시작부터 부담 없이</span>
                      <span className="font-bold text-lg text-brand-brown whitespace-nowrap">
                        39만원 <span className="text-xs font-normal text-stone-500">/ 5년납</span>
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif font-bold text-xl text-brand-brown whitespace-nowrap">3천 플랜</span>
                    </div>
                  </div>

                  <div className="flex justify-center text-brand-gold text-xs">
                    <i className="fa-solid fa-chevron-down" />
                  </div>

                  {/* 5천 플랜 */}
                  <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-amber-300/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-amber-700 block">10년 130% 구조</span>
                      <span className="font-bold text-lg text-brand-brown whitespace-nowrap">
                        65만원 <span className="text-xs font-normal text-stone-500">/ 5년납</span>
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif font-bold text-xl text-brand-brown whitespace-nowrap">5천 플랜</span>
                    </div>
                  </div>

                  <div className="flex justify-center text-brand-gold text-xs">
                    <i className="fa-solid fa-chevron-down" />
                  </div>

                  {/* 1억 플랜 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#3B281E] to-[#52382A] text-white shadow-md flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-amber-300 block">10년 130% 구조 · BEST</span>
                      <span className="font-bold text-lg whitespace-nowrap">
                        129만원 <span className="text-xs font-normal text-amber-100/80">/ 5년납</span>
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif font-bold text-2xl text-amber-300 whitespace-nowrap">1억 플랜</span>
                    </div>
                  </div>
                </div>

                <div className="text-center bg-stone-50 rounded-xl p-3 text-xs text-stone-600 font-medium">
                  <i className="fa-solid fa-circle-check text-brand-sage mr-1" />
                  10년 자산 형성 연금전환 / 중도인출 / 일시금 가능
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 20년 전문가의 현실 진단: 노후에 꼭 필요한 자금 */}
      <section id="why-pension" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="text-brand-gold font-bold text-xs sm:text-sm tracking-wider uppercase">WHY PENSION MATTERS</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-brown leading-snug">
              20년간 현장에서 마주한 은퇴의 현실,
              <br className="hidden sm:inline" />왜 지금 연금 자산을 분리해야 할까요?
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              단순히 오래 사는 것이 축복이 되려면, 매달 마르지 않는 현금흐름과 예상치 못한 목돈에 대비하는 두 가지 방패가 모두
              필요합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* 카드 1 */}
            <div className="p-8 rounded-3xl bg-[#FDFBF7] border border-stone-200/80 hover:border-brand-gold/50 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-brand-brown flex items-center justify-center text-xl">
                <i className="fa-solid fa-hourglass-half" />
              </div>
              <h3 className="font-bold text-xl text-brand-brown">1. 은퇴 후 &apos;소득 절벽&apos; 10년</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                평균 퇴직 연령은 50대 중반이지만 국민연금 수령은 만 65세부터 시작됩니다. 소득이 끊기는 약 10년의{' '}
                <strong>&apos;소득 공백기&apos;</strong>를 버텨줄 개인 연금 다리가 반드시 필요합니다.
              </p>
            </div>

            {/* 카드 2 */}
            <div className="p-8 rounded-3xl bg-[#FDFBF7] border border-stone-200/80 hover:border-brand-gold/50 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-brand-brown flex items-center justify-center text-xl">
                <i className="fa-solid fa-wallet" />
              </div>
              <h3 className="font-bold text-xl text-brand-brown">2. 부부 적정 노후 생활비 월 336만원</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                국민연금만으로는 기본적인 의식주 해결에도 빠듯합니다. 여행·경조사·병원비 걱정 없는 품위 있는 노후를 위해서는{' '}
                <strong>월 100~150만원의 추가 현금흐름</strong>을 별도로 구축해야 합니다.
              </p>
            </div>

            {/* 카드 3 */}
            <div className="p-8 rounded-3xl bg-[#FDFBF7] border border-stone-200/80 hover:border-brand-gold/50 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-brand-brown flex items-center justify-center text-xl">
                <i className="fa-solid fa-shield-halved" />
              </div>
              <h3 className="font-bold text-xl text-brand-brown">3. 장기 납입의 중도 해지 리스크</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                10년·20년씩 내는 상품은 중간에 자금 사정이 바뀌어 해지하면 손해를 보기 쉽습니다. 경제활동이 왕성할 때{' '}
                <strong>딱 5년만 납입을 끝내는 구조</strong>가 완주율을 높이는 핵심 비결입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 트리플 연금 설계 인터랙티브 시뮬레이터 (3천 / 5천 / 1억 플랜) */}
      <section id="triple-plans" className="py-16 sm:py-20 bg-[#F7F2E8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3">
            <span className="text-brand-gold font-bold text-xs sm:text-sm tracking-wider uppercase">TRIPLE PLAN SIMULATOR</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-brown">
              나에게 맞는 트리플 플랜 비교하기
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              원하시는 목표 자산을 선택해 보세요. 5년 납입 원금과 10년 시점 자산 형성 구조를 한눈에 비교하실 수 있습니다.
            </p>
          </div>

          {/* 플랜 선택 탭 버튼 */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() => setSelectedPlan('3000')}
              className={`plan-tab py-3 sm:py-3.5 px-2 sm:px-4 rounded-2xl font-bold text-xs sm:text-base transition ${
                selectedPlan === '3000'
                  ? 'bg-brand-brown text-amber-200 shadow-md'
                  : 'bg-white text-brand-brown border border-amber-900/20'
              }`}
            >
              3천 플랜<span className="block text-[11px] sm:text-xs font-normal opacity-80 mt-0.5">월 39만원</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('5000')}
              className={`plan-tab py-3 sm:py-3.5 px-2 sm:px-4 rounded-2xl font-bold text-xs sm:text-base transition ${
                selectedPlan === '5000'
                  ? 'bg-brand-brown text-amber-200 shadow-md'
                  : 'bg-white text-brand-brown border border-amber-900/20'
              }`}
            >
              5천 플랜<span className="block text-[11px] sm:text-xs font-normal opacity-80 mt-0.5">월 65만원</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('10000')}
              className={`plan-tab py-3 sm:py-3.5 px-2 sm:px-4 rounded-2xl font-bold text-xs sm:text-base transition ${
                selectedPlan === '10000'
                  ? 'bg-brand-brown text-amber-200 shadow-md'
                  : 'bg-white text-brand-brown border border-amber-900/20'
              }`}
            >
              1억 플랜<span className="block text-[11px] sm:text-xs font-normal opacity-80 mt-0.5">월 129만원</span>
            </button>
          </div>

          {/* 선택된 플랜 상세 카드 */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 gold-border-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-brand-brown text-xs font-bold">
                  {currentPlan.badge}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-brown">
                  {currentPlan.name}{' '}
                  <span className="text-base sm:text-lg font-sans font-normal text-stone-500">{currentPlan.subtitle}</span>
                </h3>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">{currentPlan.desc}</p>

                {/* 타임라인 바 */}
                <div className="pt-3 sm:pt-4">
                  <div className="flex justify-between text-[11px] sm:text-xs font-semibold text-stone-500 mb-2">
                    <span>가입 시점</span>
                    <span className="text-brand-brown">5년 납입 완료</span>
                    <span className="text-brand-gold font-bold">10년 시점 (130% 달성)</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden flex">
                    <div className="w-1/2 bg-brand-brown h-full" />
                    <div className="w-1/2 bg-brand-gold h-full" />
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-[11px] text-stone-400 mt-1.5">
                    <span>매월 자동이체</span>
                    <span>납입 종료 · 거치 운용</span>
                    <span>연금전환 / 일시금 / 중도인출</span>
                  </div>
                </div>
              </div>

              {/* 우측 숫자 요약 박스 */}
              <div className="lg:col-span-5 bg-[#FDFBF7] rounded-2xl p-5 sm:p-6 border border-amber-900/10 space-y-3.5 sm:space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-stone-200/80">
                  <span className="text-xs sm:text-sm text-stone-600">월 납입 금액 (5년)</span>
                  <span className="font-bold text-lg sm:text-xl text-brand-brown whitespace-nowrap">{currentPlan.monthly}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-stone-200/80">
                  <span className="text-xs sm:text-sm text-stone-600">5년 총 납입 원금</span>
                  <span className="font-semibold text-sm sm:text-base text-stone-800 whitespace-nowrap">
                    {currentPlan.principal}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 gap-2">
                  <span className="text-xs sm:text-sm font-bold text-brand-brown">
                    10년 시점 목표 자산
                    <br />
                    <span className="text-[11px] sm:text-xs font-normal text-stone-500">(130% 구조 기준)</span>
                  </span>
                  <span className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-brand-gold text-right whitespace-nowrap">
                    {currentPlan.target}
                  </span>
                </div>
                <a
                  href="#consult-section"
                  onClick={syncFormPlan}
                  className="mt-4 block w-full text-center py-3.5 rounded-xl bg-brand-brown hover:bg-brand-dark text-amber-200 font-bold text-sm transition"
                >
                  이 플랜으로 맞춤 설계안 받기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 목적자금으로도 활용 가능한 이유 (전단지 하단 문구 심화) */}
      <section id="flexibility" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="text-brand-sage font-bold text-xs sm:text-sm tracking-wider uppercase">
              FLEXIBLE ASSET MANAGEMENT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-brown leading-snug">
              &quot;노후까지 돈이 묶이면 어떡하죠?&quot;
              <br />
              목적자금으로도 완벽하게 활용 가능한 이유
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              트리플 연금 설계는 단순한 노후 전용 상품이 아닙니다. 인생의 중요한 변곡점마다 내 자산을 가장 유리한 방식으로 꺼내
              쓸 수 있는 <strong>3중 유연성</strong>을 갖추고 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* 활용 1 */}
            <div className="p-6 rounded-3xl bg-[#FDFBF7] border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-sage/15 text-brand-sage flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-bold text-base sm:text-[17px] text-brand-brown tracking-tight">자녀 결혼·교육 목적자금</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                10년 시점에 형성된 목돈을 <strong>일시금</strong>으로 수령하여 자녀의 대학 등록금, 유학 자금, 결혼 전세자금 지원
                등 큰 지출에 활용할 수 있습니다.
              </p>
            </div>

            {/* 활용 2 */}
            <div className="p-6 rounded-3xl bg-[#FDFBF7] border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-sage/15 text-brand-sage flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-bold text-base sm:text-[17px] text-brand-brown tracking-tight">
                필요할 때 꺼내 쓰는 중도인출
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                계약을 해지하지 않고도 긴급 자금이나 사업·이사 자금이 필요할 때 <strong>중도인출 기능</strong>을 통해 필요한
                만큼만 유연하게 꺼내 쓸 수 있습니다.
              </p>
            </div>

            {/* 활용 3 */}
            <div className="p-6 rounded-3xl bg-[#FDFBF7] border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-sage/15 text-brand-sage flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-bold text-base sm:text-[17px] text-brand-brown tracking-tight">은퇴 후 평생 연금 전환</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                목돈을 쓸 일이 없다면 그대로 <strong>연금으로 전환</strong>하여, 제2의 월급처럼 매월 안정적인 노후 생활비를
                수령하실 수 있습니다.
              </p>
            </div>

            {/* 활용 4 */}
            <div className="p-6 rounded-3xl bg-[#FDFBF7] border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-sage/15 text-brand-sage flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="font-bold text-base sm:text-[17px] text-brand-brown tracking-tight">목적별 통장 쪼개기 효과</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                일반 입출금 통장에 두면 소비로 사라지기 쉬운 돈을 <strong>5년 단기 집중 저축</strong>으로 분리해 확실한 종잣돈으로
                지켜줍니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 20년 경력 보험전문가의 진심 칼럼 */}
      <section id="expert-note" className="py-16 sm:py-20 bg-[#3B281E] text-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2D1E16] rounded-3xl p-6 sm:p-10 lg:p-12 border border-amber-400/20 shadow-2xl space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 text-2xl shrink-0">
                <i className="fa-solid fa-pen-nib" />
              </div>
              <div>
                <p className="text-xs text-amber-300 font-semibold tracking-wider">EXPERT&apos;S MESSAGE</p>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">20년 경력 보험전문가의 한마디</h3>
              </div>
            </div>

            <blockquote className="text-stone-200 text-base sm:text-lg leading-relaxed space-y-4 font-light">
              <p>
                &quot;지난 20년간 수많은 고객분들의 은퇴 준비를 함께하며 가장 많이 들었던 후회는{' '}
                <strong>&apos;조금 더 일찍 시작할 걸&apos;</strong>, 그리고{' '}
                <strong>&apos;너무 길게 내는 상품을 골라 중간에 깼던 것&apos;</strong>이었습니다.&quot;
              </p>
              <p>
                &quot;트리플 연금 설계는 바로 그 두 가지 고민을 해결하기 위해 제안드리는 솔루션입니다. 딱 5년만 납입을 마치고
                나면, 그다음부터는 시간이 내 편이 되어 10년 130% 구조로 자산을 키워줍니다. 노후 연금으로 쓰셔도 좋고, 10년 뒤
                인생의 중요한 목적자금으로 쓰셔도 좋습니다.&quot;
              </p>
            </blockquote>

            <div className="pt-4 border-t border-amber-200/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="font-serif italic text-amber-300 text-base">&quot;오늘의 준비가 내일의 이유입니다.&quot;</p>
              <span className="text-xs text-stone-400">행복한 노후 · 든든한 연금 파트너</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 자주 묻는 질문 (Q&A) 섹션 */}
      <section id="qna-section" className="py-16 sm:py-20 bg-[#F7F2E8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3">
            <span className="text-brand-gold font-bold text-xs sm:text-sm tracking-wider uppercase">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-brown">
              자주 묻는 질문 (Q&amp;A)
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              상담 전 가장 많이 궁금해하시는 핵심 내용을 정리했습니다. 질문을 눌러 답변을 확인해 보세요.
            </p>
          </div>

          <div className="space-y-3.5">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={item.question}
                  className={`rounded-2xl bg-white border transition-colors ${
                    isOpen ? 'border-brand-gold/70 shadow-md shadow-amber-950/5' : 'border-amber-900/10 hover:border-brand-gold/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full px-5 sm:px-7 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-brand-brown font-serif font-bold text-xs shrink-0 mt-0.5">
                        Q
                      </span>
                      <span className="font-bold text-sm sm:text-base text-brand-brown leading-snug">
                        {item.question}
                      </span>
                    </div>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'bg-brand-brown text-amber-200 rotate-180' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <i className="fa-solid fa-chevron-down text-xs" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-7 pb-5 pt-1 border-t border-stone-100 flex items-start gap-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-sage/15 text-brand-sage font-serif font-bold text-xs shrink-0 mt-0.5">
                            A
                          </span>
                          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. 맞춤 설계안 신청 섹션 (전화번호 노출 없이 온라인 신청) */}
      <section id="consult-section" className="py-16 sm:py-20 bg-[#FDFBF7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 gold-border-card">
            <div className="text-center space-y-3 mb-6 sm:mb-7">
              <span className="text-brand-gold font-bold text-xs tracking-widest uppercase">FREE CUSTOM PROPOSAL</span>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-brand-brown leading-snug">
                나만의 보험플러스 트리플연금설계 신청하기
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                원하시는 플랜과 연령대를 남겨주시면, 20년 경력 전문가가 직접 분석한 맞춤 시뮬레이션 리포트를 보내드립니다.
              </p>
            </div>

            {/* 상담 가능 시간대 안내 카드 */}
            <div className="mb-7 rounded-2xl bg-[#FAF6EE] border border-amber-900/10 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-brown text-amber-200 flex items-center justify-center shrink-0">
                    <i className="fa-regular fa-clock text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-brown">1:1 맞춤 상담 운영 시간대</p>
                    <p className="text-[11px] sm:text-xs text-stone-600">바쁜 직장인 분들을 위해 저녁·주말 예약 상담도 운영합니다</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-900/10 text-brand-brown font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-sage" />
                    평일 09:00 ~ 21:00
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-900/10 text-brand-brown font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    주말·공휴일 사전 예약제
                  </span>
                </div>
              </div>
            </div>

            {submitStatus !== 'success' && (
              <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label htmlFor="userName" className="block text-sm font-semibold text-brand-brown mb-1.5">
                      성함 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="userName"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="예: 홍길동"
                      className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-amber-200/50 text-base sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="userAge" className="block text-sm font-semibold text-brand-brown mb-1.5">
                      연령대 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="userAge"
                      value={userAge}
                      onChange={(e) => setUserAge(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-amber-200/50 text-base sm:text-sm bg-white"
                    >
                      <option value="30대">30대 (사회초년·신혼 자산형성)</option>
                      <option value="40대">40대 (은퇴 및 자녀 목적자금)</option>
                      <option value="50대">50대 (은퇴 직전 집중 노후준비)</option>
                      <option value="60대 이상">60대 이상 (목돈 운용 및 연금전환)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label htmlFor="userPlan" className="block text-sm font-semibold text-brand-brown mb-1.5">
                      관심 플랜 선택
                    </label>
                    <select
                      id="userPlan"
                      value={userPlan}
                      onChange={(e) => setUserPlan(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-amber-200/50 text-base sm:text-sm bg-white"
                    >
                      <option value="3천 플랜 (월 39만원 / 5년)">3천 플랜 (월 39만원 / 5년)</option>
                      <option value="5천 플랜 (월 65만원 / 5년)">5천 플랜 (월 65만원 / 5년)</option>
                      <option value="1억 플랜 (월 129만원 / 5년)">1억 플랜 (월 129만원 / 5년)</option>
                      <option value="맞춤 금액 상담 희망">내 예산에 맞춘 별도 금액 상담</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="userGoal" className="block text-sm font-semibold text-brand-brown mb-1.5">
                      주된 준비 목적
                    </label>
                    <select
                      id="userGoal"
                      value={userGoal}
                      onChange={(e) => setUserGoal(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-amber-200/50 text-base sm:text-sm bg-white"
                    >
                      <option value="노후 연금 수령">든든한 노후 연금 수령</option>
                      <option value="10년 뒤 목적자금(일시금)">10년 뒤 목적자금 마련 (일시금)</option>
                      <option value="연금 + 중도인출 병행">연금 준비 + 유연한 중도인출 병행</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-semibold text-brand-brown mb-2">
                    희망 상담 시간대 <span className="text-red-500">*</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CONSULT_TIME_SLOTS.map((slot, index) => {
                      const isSelected = userConsultTime === slot;
                      const isLastOdd =
                        CONSULT_TIME_SLOTS.length % 2 === 1 && index === CONSULT_TIME_SLOTS.length - 1;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setUserConsultTime(slot)}
                          className={`px-3.5 py-2.5 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-2 cursor-pointer ${
                            isLastOdd ? 'sm:col-span-2' : ''
                          } ${
                            isSelected
                              ? 'bg-brand-brown text-amber-100 border-brand-brown font-semibold shadow-sm'
                              : 'bg-[#FDFBF7] text-stone-700 border-stone-200 hover:border-brand-gold/60'
                          }`}
                        >
                          <span>{slot}</span>
                          {isSelected && <i className="fa-solid fa-circle-check text-amber-300 text-xs shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="userContact" className="block text-sm font-semibold text-brand-brown mb-1.5">
                    회신받으실 연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="userContact"
                    required
                    value={userContact}
                    onChange={(e) => setUserContact(e.target.value)}
                    placeholder="설계안을 받으실 본인의 연락처를 남겨주세요 (예: 010-1234-5678)"
                    className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-amber-200/50 text-base sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="userMemo" className="block text-sm font-semibold text-brand-brown mb-1.5">
                    궁금한 점 (선택)
                  </label>
                  <textarea
                    id="userMemo"
                    rows={3}
                    value={userMemo}
                    onChange={(e) => setUserMemo(e.target.value)}
                    placeholder="예: 10년 뒤 예상 연금 수령액이 궁금합니다 / 중도인출 조건을 알고 싶어요"
                    className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-amber-200/50 text-base sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-brand-brown hover:bg-brand-dark disabled:opacity-60 text-amber-200 font-bold text-base sm:text-lg shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  {isSubmitting ? '설계안 신청을 전송 중입니다...' : '맞춤 연금 설계안 무료 요청하기'}
                </button>
                <p className="text-center text-xs text-stone-400">
                  남겨주신 정보는 오직 맞춤 연금 설계안 작성 및 안내 목적으로만 안전하게 사용됩니다.
                </p>
              </form>
            )}

            <AnimatePresence mode="wait">
              {submitStatus === 'success' && submittedInfo && (
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, scale: 0.94, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -6 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-6 p-6 sm:p-7 rounded-2xl bg-green-50 border border-green-200 shadow-md shadow-green-900/5 text-center space-y-2.5"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.12, type: 'spring', stiffness: 320, damping: 20 }}
                    className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center mx-auto text-xl shadow-sm"
                  >
                    <i className="fa-solid fa-check" />
                  </motion.div>
                  <h4 className="font-bold text-lg text-green-900">맞춤 설계안 신청이 정상 접수되었습니다!</h4>
                  <p className="text-sm text-green-800 leading-relaxed">
                    <strong>{submittedInfo.name}</strong>님({submittedInfo.age})께서 선택하신{' '}
                    <strong>[{submittedInfo.plan}]</strong> ({submittedInfo.goal}) 맞춤 설계안을 준비하여 요청하신 시간대(
                    <strong>{submittedInfo.consultTime}</strong>)에 입력하신 연락처(
                    <strong>{submittedInfo.contact}</strong>)로 신속히 안내해 드리겠습니다.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-3 inline-block text-xs font-semibold text-green-700 underline cursor-pointer"
                  >
                    다른 조건으로 추가 신청하기
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {submitStatus === 'error' && (
              <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-center">
                <p className="text-sm text-red-600">
                  일시적인 전송 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-[#182232] text-stone-300 pt-12 pb-24 sm:pb-12 text-center text-xs sm:text-sm border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <svg viewBox="0 0 340 96" className="h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M52 78C33 65 16 50 16 33C16 22 24.5 15 34.5 15C41.5 15 47.5 18.5 52 24.5C43.5 26 37 33 37 43C37 55 44 67 52 78Z"
                fill="#0EA5E9"
              />
              <path
                d="M52 78C71 65 88 50 88 33C88 22 79.5 15 69.5 15C62.5 15 56.5 18.5 52 24.5C60.5 26 67 33 67 43C67 55 60 67 52 78Z"
                fill="#65A30D"
              />
              <path d="M35 81C52 71 71 58 88 41C79 60 61 74 35 81Z" fill="#84CC16" />
              <circle cx="43" cy="37" r="4.8" fill="#0284C7" />
              <circle cx="61" cy="37" r="4.8" fill="#0284C7" />
              <circle cx="52" cy="46.5" r="3.8" fill="#0369A1" />
              <path
                d="M35 53C35 47.5 39 44 43.5 44C47.5 44 49.8 46.2 50.8 49.5M69 53C69 47.5 65 44 60.5 44C56.5 44 54.2 46.2 53.2 49.5"
                stroke="#0284C7"
                strokeWidth="3.6"
                strokeLinecap="round"
              />
              <path
                d="M44.5 59C44.5 54.5 47.8 52 52 52C56.2 52 59.5 54.5 59.5 59"
                stroke="#0369A1"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path d="M90 6L92.6 13.4L100 16L92.6 18.6L90 26L87.4 18.6L80 16L87.4 13.4L90 6Z" fill="#FACC15" />
              <g transform="skewX(-9)">
                <text
                  x="108"
                  y="54"
                  fill="#FFFFFF"
                  fontFamily="'Noto Sans KR', sans-serif"
                  fontWeight="900"
                  fontSize="37"
                  letterSpacing="-1.5"
                >
                  보험
                </text>
                <text
                  x="180"
                  y="54"
                  fill="#FBBF24"
                  fontFamily="'Noto Sans KR', sans-serif"
                  fontWeight="900"
                  fontSize="37"
                  letterSpacing="-1.5"
                >
                  플러스
                </text>
              </g>
              <path d="M306 14H315V23H324V32H315V41H306V32H297V23H306V14Z" fill="#FBBF24" />
              <path
                d="M94 69C158 58 242 58 308 69"
                stroke="#7DD3FC"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeOpacity="0.85"
              />
              <line x1="112" y1="81" x2="128" y2="81" stroke="#64748B" strokeWidth="1.4" />
              <text
                x="201"
                y="85"
                textAnchor="middle"
                fill="#CBD5E1"
                fontFamily="'Noto Sans KR', sans-serif"
                fontWeight="500"
                fontSize="11.5"
                letterSpacing="0.5"
              >
                당신의 행복을 지키는 보험
              </text>
              <line x1="274" y1="81" x2="290" y2="81" stroke="#64748B" strokeWidth="1.4" />
            </svg>
            <span className="font-serif text-amber-200 text-lg font-bold tracking-tight">트리플연금설계</span>
          </div>
          <p className="text-stone-400">단기납입 · 자산형성 · 연금연결</p>
          <p className="text-stone-500 text-xs pt-2 max-w-2xl mx-auto">
            ※ 본 페이지의 10년 130% 구조 및 플랜 예시는 이해를 돕기 위한 안내이며, 실제 가입 시점의 공시이율, 연령, 성별 및 상품
            약관에 따라 세부 수치는 달라질 수 있습니다.
          </p>
        </div>
      </footer>

      {/* 모바일 전용 하단 고정 CTA 바 (모바일 엄지손가락 터치 최적화) */}
      <div
        id="mobile-sticky-cta"
        className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-amber-900/15 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-stone-500 leading-tight">5년 단기납 · 10년 130% 구조</p>
            <p className="text-xs font-bold text-brand-brown truncate">3천 · 5천 · 1억 맞춤 설계</p>
          </div>
          <a
            href="#consult-section"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-brand-brown active:bg-brand-dark text-amber-200 text-xs font-bold shadow-sm whitespace-nowrap"
          >
            무료 설계안 신청
          </a>
        </div>
      </div>

      {/* 우측 하단 공중 고정 1:1 카톡상담 플로팅 버튼 */}
      <motion.a
        href="https://open.kakao.com/o/sPDkSWVi"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="1:1 카카오톡 오픈채팅 상담 바로가기"
        initial={{ opacity: 0, y: 18, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="fixed right-4 bottom-20 sm:right-6 sm:bottom-6 z-50 group flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-[#FEE500] hover:bg-[#F7DC00] text-[#3C1E1E] border border-[#E5CC00] shadow-[0_10px_28px_rgba(59,40,30,0.22)] transition-colors"
      >
        <span className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 shrink-0">
          <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 fill-[#3C1E1E]" aria-hidden="true">
            <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.84 5.31 4.62 6.72-.16.59-.59 2.13-.68 2.46-.11.41.15.4.31.29.13-.08 2.04-1.39 2.87-1.95.92.13 1.88.2 2.88.2 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#FEE500]" />
        </span>
        <span className="flex flex-col leading-tight text-left">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#3C1E1E]/80">빠른 실시간 문의</span>
          <span className="text-xs sm:text-sm font-extrabold tracking-tight whitespace-nowrap">1:1 카톡상담</span>
        </span>
      </motion.a>
    </div>
  );
}
