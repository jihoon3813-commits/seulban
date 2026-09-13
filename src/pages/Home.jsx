import React, { useState } from 'react';
import { 
  ArrowRight, CheckIcon, ShieldCheckIcon, PawIcon, PawOutlineIcon, HeartIcon, 
  HomeIcon, ScissorsIcon, StethoscopeIcon, FlowerIcon, SearchIcon, 
  MapPinIcon, SparklesIcon, ChevronRight, PhoneIcon, PlaneIcon, HandHeartIcon 
} from '../components/Icons';
import { 
  CORE_SERVICES, MEMBERSHIP_PERKS, PARTNER_LIST, BRAND_INFO 
} from '../data/mockData';

export default function Home({ 
  onOpenApplyModal, 
  onOpenMembershipModal, 
  onOpenPartnerModal,
  onNavigate,
  bookmarks,
  onToggleBookmark
}) {
  const [partnerCategory, setPartnerCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredPartners = PARTNER_LIST.filter(p => {
    const matchCat = partnerCategory === 'all' || p.category === partnerCategory;
    const matchKey = !searchKeyword || p.name.includes(searchKeyword) || p.location.includes(searchKeyword);
    return matchCat && matchKey;
  });

  return (
    <div className="w-full">
      
      {/* 1. HERO SECTION (우리 아이의 오늘부터 모든 내일까지) */}
      <section className="relative bg-[#151C1A] text-white overflow-hidden pt-16 pb-28 sm:pt-20 sm:pb-36 lg:pt-24 lg:pb-40">
        
        {/* Full-width Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://res.cloudinary.com/lyjyvy54/image/upload/v1789267666/ChatGPT_Image_2026%EB%85%84_9%EC%9B%94_13%EC%9D%BC_%EC%98%A4%EC%A0%84_11_47_14_vrgqwp.png"
            alt="우리 아이의 오늘부터 모든 내일까지"
            className="w-full h-full object-cover object-[center_right] lg:object-right"
          />
          {/* Subtle gradient overlay to ensure text contrast on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#151C1A] via-[#151C1A]/85 to-transparent w-full sm:w-3/4 lg:w-3/5" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Vertical Brand Watermark on Right Edge */}
        <div className="hidden lg:flex absolute right-5 top-1/2 -translate-y-1/2 z-10 items-center select-none pointer-events-none">
          <span className="text-[10px] tracking-[0.25em] text-white/30 font-medium uppercase [writing-mode:vertical-rl] rotate-180">
            SEULBAN LIFE · A LIFETIME TOGETHER
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-6">
            
            {/* Tag - Clean Gold Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#17201D]/70 backdrop-blur-md border border-[#C5A880]/40 text-xs text-[#E8DEC8] font-medium shadow-xs">
              <SparklesIcon className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>반려동물의 평생을 함께</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              우리 아이의 오늘부터<br />
              <span className="text-[#C5A880]">모든 내일까지</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#9BB1A9] max-w-xl font-normal leading-relaxed">
              등록, 건강, 여행 그리고 아름다운 이별까지,<br />
              반려생활에 필요한 모든 순간을 한곳에서 만나보세요.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onOpenApplyModal}
                className="px-6 py-3.5 bg-[#C5A880] text-[#144A42] font-bold text-xs sm:text-sm hover:bg-[#D5BA93] transition-all transform hover:-translate-y-0.5 shadow-md flex items-center gap-2"
              >
                <span>우리 아이 등록하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenMembershipModal}
                className="px-6 py-3.5 bg-[#17201D]/70 hover:bg-white/15 border border-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-sm transition-all shadow-sm"
              >
                멤버십 혜택 보기
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-[#9BB1A9]">
              <div className="flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-[#C5A880]" />
                <span>안전한 개인정보 관리</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckIcon className="w-4 h-4 text-[#C5A880]" />
                <span>검증된 제휴처</span>
              </div>
              <div className="flex items-center gap-1.5">
                <PhoneIcon className="w-4 h-4 text-[#C5A880]" />
                <span>전담 상담 지원</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FLOATING QUICK BANNER (동물등록, 아직 안 하셨나요?) - Clean Rectangle */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-14 sm:-mt-16 z-20">
        <div className="bg-[#EEE6D9] p-6 sm:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-[#DFD6C7]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left text */}
            <div className="lg:col-span-5 space-y-1.5">
              <div className="inline-block text-[11px] font-bold text-[#866838] uppercase tracking-wider">
                가장 먼저 해야 할 일
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F2C27] tracking-tight">
                동물등록, 아직 안 하셨나요?
              </h2>
              <p className="text-xs text-[#6A7872] leading-relaxed">
                2개월령 이상의 반려견은 법적 의무 등록 대상입니다.<br className="hidden sm:inline" />
                과태료 걱정 없이 모바일로 간편하게 3분 만에 신청하세요!
              </p>
            </div>

            {/* Center 4 Process Steps (Connected Circles) */}
            <div className="lg:col-span-4 py-2">
              <div className="relative">
                {/* Horizontal Connecting Line passing through center of circles */}
                <div 
                  className="absolute top-[18px] sm:top-5 -translate-y-1/2 left-2 right-2 h-[1px] bg-[#2E534A]/50 pointer-events-none" 
                />
                
                <div className="relative grid grid-cols-4 text-center">
                  {[
                    { step: '1', label: '대상 확인' },
                    { step: '2', label: '정보 입력' },
                    { step: '3', label: '신청 접수' },
                    { step: '4', label: '등록 완료' },
                  ].map((s) => (
                    <div key={s.step} className="flex flex-col items-center">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#2E534A]/75 text-[#142C27] flex items-center justify-center font-medium text-xs sm:text-sm relative z-10 bg-transparent">
                        {s.step}
                      </div>
                      <span className="mt-2.5 text-[11px] sm:text-xs font-medium text-[#1F2C27] tracking-tight whitespace-nowrap">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right CTA Button - Sharp Rectangle */}
            <div className="lg:col-span-3 flex lg:justify-end">
              <button
                onClick={onOpenApplyModal}
                className="w-full lg:w-auto px-6 py-3.5 bg-[#144A42] text-white font-bold text-xs sm:text-sm hover:bg-[#0D3832] transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>간편 등록 신청하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 3. SECTION: 함께하는 모든 순간, 슬반생 하나로 (6 Core Bento Rectangles) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">
            SEULBAN CORE SERVICES
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#142C27] tracking-tight">
            함께하는 모든 순간,<br />
            <span className="text-[#B48B55]">슬반생 하나로</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6C7A74]">
            반려동물의 생애주기 전반을 아우르는 슬반생만의 6대 핵심 서비스
          </p>
        </div>

        {/* Row 1: 2 Wide Featured Cards (동물등록 & 새로운 만남) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          
          {/* Card 1: 동물등록 */}
          <div
            onClick={onOpenApplyModal}
            className="group relative bg-[#173F35] text-white p-7 sm:p-8 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-[#1E564E] min-h-[160px]"
          >
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="w-12 h-12 rounded-full bg-[#245348] flex items-center justify-center flex-shrink-0 text-[#ECBE81] transition-transform group-hover:scale-105">
                <PawOutlineIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  동물등록
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mt-1.5 whitespace-pre-line">
                  복잡한 등록을 모바일로{'\n'}간편하게
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all self-end mb-1" />
          </div>

          {/* Card 2: 새로운 만남 */}
          <div
            onClick={() => onNavigate('adoption')}
            className="group relative bg-[#D4C3AC] text-[#2C241B] p-7 sm:p-8 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-[#C7B59D] min-h-[160px]"
          >
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[#144A42] shadow-xs transition-transform group-hover:scale-105">
                <HandHeartIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2C241B]">
                  새로운 만남
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5042] leading-relaxed mt-1.5">
                  책임 있는 입양과 가족의 시작
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#2C241B]/70 group-hover:text-[#2C241B] group-hover:translate-x-1 transition-all self-end mb-1" />
          </div>

        </div>

        {/* Row 2: 4 Service Cards (병원·건강, 미용생활, 반려여행, 아름다운 이별) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 3: 병원·건강 */}
          <div
            onClick={() => onNavigate('partners')}
            className="group relative bg-[#EBE5DA] p-6 sm:p-7 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-[#DFD8CB] min-h-[190px] sm:min-h-[210px]"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#144A42] shadow-xs mb-6 transition-transform group-hover:scale-105">
              <StethoscopeIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1 pr-3">
              <h4 className="text-base sm:text-lg font-bold tracking-tight text-[#1F2C27]">
                병원·건강
              </h4>
              <p className="text-xs text-[#6A7871] leading-relaxed">
                가까운 병원과 건강관리 정보
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#1F2C27]/50 group-hover:text-[#1F2C27] group-hover:translate-x-1 transition-all self-end mt-2" />
          </div>

          {/* Card 4: 미용생활 */}
          <div
            onClick={() => onNavigate('partners')}
            className="group relative bg-[#EBE5DA] p-6 sm:p-7 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-[#DFD8CB] min-h-[190px] sm:min-h-[210px]"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#144A42] shadow-xs mb-6 transition-transform group-hover:scale-105">
              <ScissorsIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1 pr-3">
              <h4 className="text-base sm:text-lg font-bold tracking-tight text-[#1F2C27]">
                미용생활
              </h4>
              <p className="text-xs text-[#6A7871] leading-relaxed">
                우리 아이에게 맞는 미용 제휴처
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#1F2C27]/50 group-hover:text-[#1F2C27] group-hover:translate-x-1 transition-all self-end mt-2" />
          </div>

          {/* Card 5: 반려여행 */}
          <div
            onClick={() => onNavigate('travel')}
            className="group relative bg-[#EBE5DA] p-6 sm:p-7 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-[#DFD8CB] min-h-[190px] sm:min-h-[210px]"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#144A42] shadow-xs mb-6 transition-transform group-hover:scale-105">
              <PlaneIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1 pr-3">
              <h4 className="text-base sm:text-lg font-bold tracking-tight text-[#1F2C27]">
                반려여행
              </h4>
              <p className="text-xs text-[#6A7871] leading-relaxed">
                함께 머무는 호텔·펜션·리조트
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#1F2C27]/50 group-hover:text-[#1F2C27] group-hover:translate-x-1 transition-all self-end mt-2" />
          </div>

          {/* Card 6: 아름다운 이별 */}
          <div
            onClick={() => onNavigate('farewell')}
            className="group relative bg-[#EBE5DA] p-6 sm:p-7 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-[#DFD8CB] min-h-[190px] sm:min-h-[210px]"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#144A42] shadow-xs mb-6 transition-transform group-hover:scale-105">
              <HeartIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1 pr-3">
              <h4 className="text-base sm:text-lg font-bold tracking-tight text-[#1F2C27]">
                아름다운 이별
              </h4>
              <p className="text-xs text-[#6A7871] leading-relaxed">
                마지막까지 곁을 지키는 안내
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#1F2C27]/50 group-hover:text-[#1F2C27] group-hover:translate-x-1 transition-all self-end mt-2" />
          </div>

        </div>

      </section>

      {/* 4. DARK SECTION: MEMBERSHIP (반려생활의 부담은 가볍게, 혜택은 더 든든하게) - Rectangular */}
      <section className="bg-[#121615] text-white py-24 relative overflow-hidden">
        
        {/* Subtle background watermark */}
        <div className="absolute top-10 right-10 text-[110px] font-black text-white/[0.02] select-none pointer-events-none">
          MEMBERSHIP
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold tracking-widest text-[#C5A880] uppercase">
                SEULBAN MEMBERSHIP
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.2] text-white">
                반려생활의 부담은<br />
                <span className="text-[#C5A880]">가볍게,</span><br />
                혜택은 더 든든하게
              </h2>
              <p className="text-xs sm:text-sm text-[#95A8A1] leading-relaxed max-w-md">
                동물병원비 할인부터 프리미엄 사료 용품, 반려 숙소까지<br />
                슬반생 멤버십 회원만을 위한 특별한 혜택을 만나보세요.
              </p>

              <div className="pt-3">
                <button
                  onClick={onOpenMembershipModal}
                  className="px-7 py-3.5 bg-[#EEE7DC] text-[#144A42] font-bold text-xs sm:text-sm hover:bg-white transition shadow-md flex items-center gap-2"
                >
                  <span>멤버십 알아보기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right 4 Bento Cards (2x2) - Straight Rectangles */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MEMBERSHIP_PERKS.map((perk) => (
                <div
                  key={perk.id}
                  className={`p-7 transition-all duration-300 hover:-translate-y-1 shadow-md ${perk.bg}`}
                >
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-1 mb-4 ${perk.tagBg}`}>
                    {perk.tag}
                  </span>
                  <h4 className="text-lg font-bold tracking-tight mb-2">
                    {perk.title}
                  </h4>
                  <p className="text-xs leading-relaxed opacity-85">
                    {perk.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5. SECTION: 믿고 찾을 수 있는 우리 동네 반려생활 (PARTNERS) - Rectangles */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">
              VERIFIED PARTNERS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#142C27] tracking-tight mt-1">
              믿고 찾을 수 있는<br />
              <span className="text-[#B48B55]">우리 동네 반려생활</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6C7A74] mt-2">
              슬반생이 깐깐하게 검증한 안심 제휴 파트너를 만나보세요.
            </p>
          </div>

          <button
            onClick={() => onNavigate('partners')}
            className="text-xs font-bold text-[#144A42] hover:underline flex items-center gap-1 self-start md:self-auto"
          >
            <span>제휴처 전체보기</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Search Bar - Clean Rectangles */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="병원, 미용실, 동네 이름을 검색해 보세요 (예: 강남, 분당, 스파)"
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2DDD3] text-xs focus:outline-none focus:border-[#144A42] shadow-xs"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: '전체' },
              { id: 'hospital', label: '동물병원' },
              { id: 'grooming', label: '미용/스파' },
              { id: 'hotel', label: '호텔/유치원' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPartnerCategory(tab.id)}
                className={`px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
                  partnerCategory === tab.id
                    ? 'bg-[#144A42] text-white shadow-xs font-bold'
                    : 'bg-[#EFECE6] text-[#4F5B55] hover:bg-[#E3DFD6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Partner Cards (Rectangular with pastel header blocks) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPartners.map((item) => {
            const isBookmarked = bookmarks.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onOpenPartnerModal(item)}
                className="bg-white overflow-hidden border border-[#EAE5D9] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
              >
                {/* Pastel Top Visual Block */}
                <div className={`h-36 flex flex-col items-center justify-center relative ${item.color}`}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(item.id);
                    }}
                    className="absolute top-3.5 right-3.5 w-8 h-8 bg-white/90 flex items-center justify-center text-gray-400 hover:text-red-500 shadow-xs"
                  >
                    <HeartIcon className="w-4 h-4" filled={isBookmarked} />
                  </button>

                  <div className="w-12 h-12 bg-white shadow-sm flex items-center justify-center mb-1 text-current">
                    {item.icon === 'stethoscope' && <StethoscopeIcon className="w-6 h-6" />}
                    {item.icon === 'scissors' && <ScissorsIcon className="w-6 h-6" />}
                    {item.icon === 'home' && <HomeIcon className="w-6 h-6" />}
                  </div>
                  <span className="text-[11px] font-extrabold tracking-wider uppercase opacity-80">
                    {item.categoryName}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#808E88] mb-1">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#142C27] group-hover:text-[#144A42] transition">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#63726C] line-clamp-2 mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F2EEE6] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#144A42] bg-[#EAF5F2] px-2.5 py-1">
                      {item.benefit}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 group-hover:text-[#144A42] flex items-center gap-0.5">
                      상세보기 →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 6. SECTION: ABOUT US (Sharp Geometric Right-Angled Frame matching screenshot) */}
      <section className="py-20 bg-[#F4F1EA] border-t border-[#EAE5D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Geometric Right-Angled Frame matching user image */}
            <div className="lg:col-span-5 relative">
              <div className="relative overflow-hidden shadow-xl border-4 border-white aspect-[4/3] sm:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80"
                  alt="행복한 반려생활 슬반생"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#144A42]/15 pointer-events-none"></div>
              </div>
              
              {/* Sharp Right-Angled Green Border Accent Frame (no rounded corners!) */}
              <div className="hidden sm:block absolute -bottom-4 -left-4 w-36 h-36 border-b-4 border-l-4 border-[#144A42] pointer-events-none -z-1" />
            </div>

            {/* Right Story Text */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">
                ABOUT US
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#142C27] tracking-tight leading-snug">
                반려동물과 사람이<br />
                <span className="text-[#144A42]">더 오래, 더 행복하도록</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6862] leading-relaxed max-w-xl">
                슬반생(슬기로운 반려생활)은 단순한 용품 판매나 정보 제공을 넘어, 
                처음 만나는 등록의 설렘부터 매일의 건강관리, 함께 떠나는 여행, 
                그리고 언젠가 마주하게 될 마지막 작별의 순간까지 
                반려가족의 평생 여정을 따뜻하게 동행하는 종합 라이프케어 플랫폼입니다.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('registration')}
                  className="text-xs sm:text-sm font-bold text-[#144A42] hover:text-[#0D3832] flex items-center gap-1.5 underline underline-offset-4"
                >
                  <span>슬반생 이야기 더보기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
