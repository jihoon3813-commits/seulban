import React from 'react';
import { 
  SparklesIcon, 
  CheckIcon, 
  ArrowRight, 
  ShieldCheckIcon, 
  ClockIcon, 
  PhoneIcon, 
  ShoppingBagIcon,
  HotelBuildingIcon,
  StethoscopeIcon
} from '../components/Icons';

export default function MembershipPage({ onOpenMembershipModal, onOpenMallModal }) {
  const coreValues = [
    {
      num: '01',
      title: '실질적 비용 절감',
      desc: '연간 가입 할인 혜택 및 리조트 회원가, 용품 최대 30% 할인 적용으로 가입비 이상의 경제적 혜택 제공.',
    },
    {
      num: '02',
      title: '토탈 라이프 케어',
      desc: '여가(리조트/카페)부터 필수 케어(병원/훈련), 에프터 케어(장례)까지 일관된 프리미엄 품질 보장.',
    },
    {
      num: '03',
      title: '유연한 플랜 선택',
      desc: '보호자의 소비 패턴과 반려동물의 케어 니즈에 맞춘 베이직, 골드, 프리미엄 3단계 요금제 운영.',
    },
  ];

  const planRows = [
    {
      label: '입회기간',
      basic: '1개월',
      gold: '1개월',
      premium: '1개월',
    },
    {
      label: '가입금액 (월)',
      basic: '9,900 원',
      gold: '29,900 원',
      premium: '59,900 원',
      isPrice: true,
    },
    {
      label: '년가입시 혜택',
      basic: '99,000 원',
      basicSub: '(2개월면제)',
      gold: '299,000 원',
      goldSub: '(2개월면제)',
      premium: '599,000 원',
      premiumSub: '(2개월면제)',
      isAnnual: true,
    },
    {
      label: '리조트 할인',
      basic: '회원가 적용',
      gold: '회원가 적용',
      premium: '회원가 적용',
      highlight: true,
    },
    {
      label: '용품 할인',
      basic: '10% 할인',
      gold: '20% 할인',
      premium: '30% 할인',
      highlight: true,
      isMallLink: true,
    },
    {
      label: '병원 할인',
      basic: '추후예정',
      gold: '추후예정',
      premium: '추후예정',
      isUpcoming: true,
    },
    {
      label: '훈련소 할인',
      basic: '-',
      gold: '20% 예정',
      premium: '30% 예정',
      isMixedUpcoming: true,
    },
    {
      label: '장례 서비스',
      basic: '추후예정',
      gold: '추후예정',
      premium: '추후예정',
      isUpcoming: true,
    },
    {
      label: '펫시터 / 애견카페',
      basic: '추후예정',
      gold: '추후예정',
      premium: '추후예정',
      isUpcoming: true,
    },
  ];

  const roadmapSteps = [
    {
      step: 'STEP 01 (기본)',
      title: '리조트 & 용품 혜택',
      desc: '자사몰 용품 할인 및 제휴 리조트 회원가 단독 개방',
      active: true,
    },
    {
      step: 'STEP 02 (확장중)',
      title: '훈련소 & 병원 연계',
      desc: '반려견 행동교정 훈련소 최대 30% 할인 및 제휴병원 연계',
      expanding: true,
    },
    {
      step: 'STEP 03 (예정)',
      title: '토탈 라이프케어 완성',
      desc: '펫시터, 애견카페 우대 혜택 및 장례 전문 서비스 연계',
      upcoming: true,
    },
  ];

  return (
    <div className="w-full pb-12 sm:pb-20">
      {/* Top Banner Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-8">
        <div className="w-full overflow-hidden shadow-xs border border-[#E5DFD1]">
          <img
            src="https://res.cloudinary.com/lyjyvy54/image/upload/v1789268626/ChatGPT_Image_2026%EB%85%84_9%EC%9B%94_13%EC%9D%BC_%EC%98%A4%ED%9B%84_12_03_30_6_e9hvro.png"
            alt="슬반생 멤버십 혜택 배너"
            className="w-full h-auto object-cover max-h-[220px] sm:max-h-[400px]"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 space-y-12 sm:space-y-20">
        
        {/* HERO / INTRO SECTION (Page 1) */}
        <section className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#144A42]/10 border border-[#144A42]/20 text-[#144A42] text-[10px] sm:text-xs font-bold tracking-widest uppercase">
            <span>MEMBERSHIP SERVICE GUIDE</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold text-[#144A42] tracking-tight leading-tight">
            슬기로운반려생활<br />멤버십 서비스 안내
          </h1>

          <p className="text-xs sm:text-base text-[#5F6E68] leading-relaxed font-medium">
            반려동물과의 더 나은 삶을 위한 맞춤형 프리미엄 케어 멤버십 솔루션
          </p>

          {/* 3 Key Highlights from Cover */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-2 max-w-2xl mx-auto">
            <div className="bg-white border border-[#E5DFD1] p-3.5 sm:p-4 shadow-2xs text-center">
              <span className="block text-[10px] sm:text-xs text-[#8C7A5B] font-semibold mb-0.5">숙박 & 리조트</span>
              <strong className="text-xs sm:text-sm font-extrabold text-[#144A42]">전용 회원가 혜택</strong>
            </div>
            <div className="bg-white border border-[#E5DFD1] p-3.5 sm:p-4 shadow-2xs text-center">
              <span className="block text-[10px] sm:text-xs text-[#8C7A5B] font-semibold mb-0.5">반려 용품 할인</span>
              <strong className="text-xs sm:text-sm font-extrabold text-[#144A42]">최대 30% DC</strong>
            </div>
            <div className="bg-white border border-[#E5DFD1] p-3.5 sm:p-4 shadow-2xs text-center">
              <span className="block text-[10px] sm:text-xs text-[#8C7A5B] font-semibold mb-0.5">토탈 펫케어</span>
              <strong className="text-xs sm:text-sm font-extrabold text-[#144A42]">병원·훈련·장례 연계</strong>
            </div>
          </div>

          <div className="pt-2 sm:pt-4">
            <button
              onClick={onOpenMembershipModal}
              className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 bg-[#144A42] text-white font-bold text-xs sm:text-base hover:bg-[#0D3832] transition shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A880]" />
              <span>멤버십 가입 및 사전신청하기</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </section>

        {/* SECTION 01: 서비스 개요 및 도입 배경 (Page 2) */}
        <section className="bg-white p-5 sm:p-10 border border-[#EAE3D6] shadow-xs space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#144A42] pb-3 sm:pb-4 gap-2">
            <div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-[#144A42] tracking-tight">
                서비스 개요 및 도입 배경
              </h2>
              <p className="text-[11px] sm:text-sm text-[#5F6E68] mt-0.5">
                반려동물 양육 가구를 위한 종합 혜택 제공 및 경제적 부담 완화
              </p>
            </div>
            <span className="text-[11px] sm:text-xs font-extrabold text-[#B48B55] tracking-wider uppercase">
              01 / Overview
            </span>
          </div>

          {/* 2 Overview Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-[#FAF8F4] border border-[#EAE2D3] p-5 sm:p-6 space-y-2.5">
              <div className="flex items-center gap-2 text-[#144A42] font-extrabold text-sm sm:text-base">
                <ShieldCheckIcon className="w-5 h-5 text-[#B48B55] shrink-0" />
                <h3>슬반생 멤버십이란?</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed">
                <strong className="text-[#1D2522]">㈜슬기로운반려생활</strong>의 멤버십 서비스는 반려동물과 보호자의 라이프사이클 전체를 아우르는 통합 케어 플랫폼입니다. 리조트 숙박, 용품 구매, 의료, 훈련, 장례 등 다양한 영역에서 실질적인 경제적 혜택과 편의성을 제공합니다.
              </p>
            </div>

            <div className="bg-[#FAF8F4] border border-[#EAE2D3] p-5 sm:p-6 space-y-2.5">
              <div className="flex items-center gap-2 text-[#144A42] font-extrabold text-sm sm:text-base">
                <ClockIcon className="w-5 h-5 text-[#B48B55] shrink-0" />
                <h3>주요 서비스 방향성</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#4A5550] leading-relaxed">
                합리적인 월 구독형 플랜(<strong className="text-[#1D2522]">베이직, 골드, 프리미엄</strong>)을 통해 가입 즉시 비용 절감 효과를 체감할 수 있도록 구성되었으며, 지속적인 제휴망 확장을 통해 토탈 펫 케어 생태계를 구축하고 있습니다.
              </p>
            </div>
          </div>

          {/* Core Values (3 Cards) */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base font-extrabold text-[#1D2522]">
              핵심 서비스 가치 (Core Values)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
              {coreValues.map((item) => (
                <div
                  key={item.num}
                  className="p-5 sm:p-6 bg-white border border-[#E5DFD1] shadow-2xs flex flex-col justify-between hover:border-[#144A42] transition"
                >
                  <div>
                    <span className="text-base sm:text-lg font-black text-[#B48B55] block mb-1.5">
                      {item.num}
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#144A42] mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#5A6761] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 02: 슬반생 멤버십 서비스 상품 구성 (Page 3) */}
        <section className="bg-white p-5 sm:p-10 border border-[#EAE3D6] shadow-xs space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#144A42] pb-3 sm:pb-4 gap-2">
            <div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-[#144A42] tracking-tight">
                슬반생 멤버십 서비스 상품 구성
              </h2>
              <p className="text-[11px] sm:text-sm text-[#5F6E68] mt-0.5">
                등급별 가입 조건 및 할인/제휴 혜택 비교표
              </p>
            </div>
            <span className="text-[11px] sm:text-xs font-extrabold text-[#B48B55] tracking-wider uppercase">
              02 / Product Plans
            </span>
          </div>

          {/* Product Comparison Table */}
          <div className="overflow-x-auto border border-[#DFD8CA]">
            <table className="w-full text-xs sm:text-sm text-center border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#DFD8CA]">
                  <th className="py-3.5 px-4 bg-[#F4F1EB] font-extrabold text-[#3D4843] border-r border-[#DFD8CA] w-1/4">
                    구분
                  </th>
                  <th className="py-3.5 px-4 bg-[#F4F1EB] font-extrabold text-[#1D2522] border-r border-[#DFD8CA] w-1/4">
                    슬반생-B (베이직)
                  </th>
                  <th className="py-3.5 px-4 bg-[#C58B43] font-extrabold text-white border-r border-[#DFD8CA] w-1/4">
                    슬반생-G (골드)
                  </th>
                  <th className="py-3.5 px-4 bg-[#144A42] font-extrabold text-white w-1/4">
                    슬반생-프리미엄
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4D8]">
                {planRows.map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={row.isMallLink ? onOpenMallModal : undefined}
                    className={`${
                      row.isPrice ? 'bg-[#FDFBF7]' : 'bg-white'
                    } ${row.isMallLink ? 'cursor-pointer hover:bg-[#F2F8F6] transition' : ''}`}
                    title={row.isMallLink ? '슬반생몰 바로가기' : undefined}
                  >
                    <td className="py-3.5 px-4 font-bold text-[#2C3732] bg-[#FAF8F4] border-r border-[#EAE4D8]">
                      <div className="flex items-center justify-center gap-1.5">
                        <span>{row.label}</span>
                        {row.isMallLink && (
                          <span className="text-[10px] bg-[#144A42] text-white px-1.5 py-0.5 font-bold">
                            몰 이동
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Basic */}
                    <td className="py-3.5 px-4 border-r border-[#EAE4D8]">
                      {row.isPrice ? (
                        <span className="text-sm sm:text-base font-extrabold text-[#144A42]">{row.basic}</span>
                      ) : row.isAnnual ? (
                        <div>
                          <span className="font-extrabold text-[#1D2522]">{row.basic}</span>{' '}
                          <span className="text-[11px] text-[#B48B55] font-semibold">{row.basicSub}</span>
                        </div>
                      ) : row.isUpcoming ? (
                        <span className="inline-block bg-[#F7F1E5] text-[#8C7248] text-[11px] font-bold px-2.5 py-0.5">
                          {row.basic}
                        </span>
                      ) : row.highlight ? (
                        <span className="font-bold text-[#1D2522]">{row.basic}</span>
                      ) : (
                        <span className="text-gray-600">{row.basic}</span>
                      )}
                    </td>

                    {/* Gold */}
                    <td className="py-3.5 px-4 border-r border-[#EAE4D8] bg-[#FDFBF7]/50">
                      {row.isPrice ? (
                        <span className="text-sm sm:text-base font-extrabold text-[#B47B32]">{row.gold}</span>
                      ) : row.isAnnual ? (
                        <div>
                          <span className="font-extrabold text-[#1D2522]">{row.gold}</span>{' '}
                          <span className="text-[11px] text-[#B47B32] font-semibold">{row.goldSub}</span>
                        </div>
                      ) : row.isUpcoming ? (
                        <span className="inline-block bg-[#F7F1E5] text-[#8C7248] text-[11px] font-bold px-2.5 py-0.5">
                          {row.gold}
                        </span>
                      ) : row.isMixedUpcoming ? (
                        <span className="font-bold text-[#1D2522]">
                          20% <span className="inline-block bg-[#F7F1E5] text-[#8C7248] text-[10px] font-bold px-1.5 py-0.5 ml-0.5">예정</span>
                        </span>
                      ) : row.highlight ? (
                        <span className="font-extrabold text-[#144A42]">{row.gold}</span>
                      ) : (
                        <span className="text-gray-600">{row.gold}</span>
                      )}
                    </td>

                    {/* Premium */}
                    <td className="py-3.5 px-4 bg-[#F4F9F7]/50">
                      {row.isPrice ? (
                        <span className="text-sm sm:text-base font-extrabold text-[#144A42]">{row.premium}</span>
                      ) : row.isAnnual ? (
                        <div>
                          <span className="font-extrabold text-[#1D2522]">{row.premium}</span>{' '}
                          <span className="text-[11px] text-[#144A42] font-semibold">{row.premiumSub}</span>
                        </div>
                      ) : row.isUpcoming ? (
                        <span className="inline-block bg-[#F7F1E5] text-[#8C7248] text-[11px] font-bold px-2.5 py-0.5">
                          {row.premium}
                        </span>
                      ) : row.isMixedUpcoming ? (
                        <span className="font-extrabold text-[#144A42]">
                          30% <span className="inline-block bg-[#F7F1E5] text-[#8C7248] text-[10px] font-bold px-1.5 py-0.5 ml-0.5">예정</span>
                        </span>
                      ) : row.highlight ? (
                        <span className="font-extrabold text-[#144A42]">{row.premium}</span>
                      ) : (
                        <span className="text-gray-600">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footnote */}
          <div className="bg-[#FAF6EC] border border-[#EAE0C8] px-4 py-3 text-xs text-[#6B5735] flex items-center gap-2 font-medium">
            <span className="font-extrabold text-[#B48B55]">ⓘ 참고사항:</span>
            <span>
              년가입 시 2개월 상당의 가입비 절감 효과가 적용됩니다. &apos;추후예정&apos; 항목은 제휴 협약 체결에 따라 순차적 오픈됩니다.
            </span>
          </div>
        </section>

        {/* SECTION 03: 혜택 세부내용 및 서비스 확장 로드맵 (Page 4) */}
        <section className="bg-white p-5 sm:p-10 border border-[#EAE3D6] shadow-xs space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#144A42] pb-3 sm:pb-4 gap-2">
            <div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-[#144A42] tracking-tight">
                혜택 세부내용 및 서비스 확장 로드맵
              </h2>
              <p className="text-[11px] sm:text-sm text-[#5F6E68] mt-0.5">
                보호자의 만족도를 극대화할 제휴 네트워크 확대 계획
              </p>
            </div>
            <span className="text-[11px] sm:text-xs font-extrabold text-[#B48B55] tracking-wider uppercase">
              03 / Service Details
            </span>
          </div>

          {/* 2 Service Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Available Now */}
            <div className="bg-[#FAF8F4] border-l-4 border-l-[#144A42] border border-[#EAE2D3] p-5 sm:p-6 space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#144A42] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5">
                  현재 이용 가능
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-[#144A42]">
                  리조트 & 용품 할인
                </h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#3F4A45] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#144A42] font-bold">•</span>
                  <span>
                    <strong className="text-[#1D2522]">반려동물 동반 리조트:</strong> 전 등급 회원 대상 우대 회원가 예약 혜택 제공
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#144A42] font-bold">•</span>
                  <span>
                    <strong className="text-[#1D2522]">공식 몰 용품 할인:</strong> 베이직 10%, 골드 20%, 프리미엄 30% 즉시 할인 쿠폰 제공
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#144A42] font-bold">•</span>
                  <span>
                    <strong className="text-[#1D2522]">신제품 체험단:</strong> 프리미엄 회원 대상 신규 반려용품 우선 체험 기회
                  </span>
                </li>
              </ul>
            </div>

            {/* Upcoming */}
            <div className="bg-[#FAF8F4] border-l-4 border-l-[#C58B43] border border-[#EAE2D3] p-5 sm:p-6 space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#F3E8D6] text-[#9C6B2E] text-[10px] sm:text-xs font-bold px-2.5 py-0.5">
                  오픈 예정 (순차 적용)
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-[#8C5E26]">
                  전문 케어 제휴 서비스
                </h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#3F4A45] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#C58B43] font-bold">•</span>
                  <span>
                    <strong className="text-[#1D2522]">전문 훈련소 할인:</strong> 골드 20%, 프리미엄 30% 할인 적용 예정
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C58B43] font-bold">•</span>
                  <span>
                    <strong className="text-[#1D2522]">제휴 동물병원:</strong> 건강검진 및 예방접종 할인 네트워크 구축 중
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C58B43] font-bold">•</span>
                  <span>
                    <strong className="text-[#1D2522]">장례 & 펫시터/카페:</strong> 안심 케어 서비스 제휴업체 확대 추진
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3-Step Roadmap */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base font-extrabold text-[#1D2522]">
              제휴 확장 단계별 로드맵
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
              {roadmapSteps.map((rm, i) => (
                <div
                  key={i}
                  className={`p-5 sm:p-6 border flex flex-col justify-between min-h-[140px] sm:min-h-[160px] ${
                    rm.active
                      ? 'bg-[#F2F8F6] border-[#144A42]'
                      : rm.expanding
                      ? 'bg-[#FDFBF7] border-[#D8C7B0]'
                      : 'bg-[#FAF9F6] border-[#E5DFD1]'
                  }`}
                >
                  <div>
                    <span
                      className={`text-[11px] font-extrabold uppercase tracking-wider block mb-1 ${
                        rm.active
                          ? 'text-[#144A42]'
                          : rm.expanding
                          ? 'text-[#B47B32]'
                          : 'text-[#7A8781]'
                      }`}
                    >
                      {rm.step}
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-[#1D2522]">
                      {rm.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#5A6761] leading-relaxed pt-4">
                    {rm.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 04: 가입 안내 및 문의처 (Page 5) */}
        <section className="bg-white p-5 sm:p-10 border border-[#EAE3D6] shadow-xs space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#144A42] pb-3 sm:pb-4 gap-2">
            <div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-[#144A42] tracking-tight">
                가입 안내 및 문의처
              </h2>
              <p className="text-[11px] sm:text-sm text-[#5F6E68] mt-0.5">
                반려동물과 함께하는 슬기로운 선택, 지금 시작하세요
              </p>
            </div>
            <span className="text-[11px] sm:text-xs font-extrabold text-[#B48B55] tracking-wider uppercase">
              04 / Contact Us
            </span>
          </div>

          {/* 3 Summary Stat Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            <div className="bg-[#FAF6EC] border border-[#EAE0C8] p-5 text-center space-y-1">
              <strong className="text-xl sm:text-2xl font-black text-[#144A42] block">
                월 9,900원~
              </strong>
              <span className="text-xs text-[#5F6E68] font-medium block">
                부담 없는 시작 (베이직 플랜)
              </span>
            </div>
            <div className="bg-[#FAF6EC] border border-[#EAE0C8] p-5 text-center space-y-1">
              <strong className="text-xl sm:text-2xl font-black text-[#B47B32] block">
                최대 30%
              </strong>
              <span className="text-xs text-[#5F6E68] font-medium block">
                용품 & 훈련소 우대 할인
              </span>
            </div>
            <div className="bg-[#FAF6EC] border border-[#EAE0C8] p-5 text-center space-y-1">
              <strong className="text-xl sm:text-2xl font-black text-[#144A42] block">
                2개월 FREE
              </strong>
              <span className="text-xs text-[#5F6E68] font-medium block">
                년가입 선택 시 비용 절감
              </span>
            </div>
          </div>

          {/* 2 Bottom Cards: Steps & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Steps */}
            <div className="bg-[#FAF8F4] border border-[#EAE2D3] p-5 sm:p-7 space-y-4">
              <div className="flex items-center gap-2 text-[#144A42] font-extrabold text-base">
                <CheckIcon className="w-5 h-5 text-[#B48B55]" />
                <h3>멤버십 가입 절차</h3>
              </div>
              <ol className="space-y-2.5 text-xs sm:text-sm text-[#3F4A45]">
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-[#144A42]">1. 플랜 선택:</span>
                  <span>베이직 / 골드 / 프리미엄 중 선택</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-[#144A42]">2. 주기 선택:</span>
                  <span>월간 결제 또는 년간 결제(할인) 선택</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-[#144A42]">3. 혜택 적용:</span>
                  <span>가입 즉시 회원전용 리조트가 및 쿠폰 발급</span>
                </li>
              </ol>
              <div className="pt-2">
                <button
                  onClick={onOpenMembershipModal}
                  className="w-full py-3 bg-[#144A42] text-white font-bold text-xs sm:text-sm hover:bg-[#0D3832] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>지금 멤버십 플랜 신청하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-[#144A42] text-white p-5 sm:p-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-extrabold text-base text-[#E6CAA4]">
                  <PhoneIcon className="w-5 h-5" />
                  <h3>가입 및 제휴 문의</h3>
                </div>
                <div className="space-y-1.5 text-xs sm:text-sm text-white/90">
                  <p>
                    <strong className="text-white">회사명:</strong> ㈜슬기로운반려생활
                  </p>
                  <p>
                    <strong className="text-white">대표전화:</strong> 070-4186-1500 (평일 09:00 ~ 17:00)
                  </p>
                  <p>
                    <strong className="text-white">홈페이지:</strong> www.seulbanlife.com
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href="tel:070-4186-1500"
                  className="flex-1 py-2.5 px-4 bg-[#C5A880] text-[#144A42] font-extrabold text-xs sm:text-sm text-center hover:bg-white transition"
                >
                  전화 문의 (070-4186-1500)
                </a>
              </div>
            </div>
          </div>

          {/* Closing Banner */}
          <div className="bg-[#F4F1EB] p-4 text-center text-xs sm:text-sm font-bold text-[#144A42]">
            반려동물과의 소중한 일상, ㈜슬기로운반려생활이 함께 만들어갑니다.
          </div>
        </section>

      </div>
    </div>
  );
}
