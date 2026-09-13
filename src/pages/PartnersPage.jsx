import React, { useState } from 'react';
import { 
  SearchIcon, MapPinIcon, HeartIcon, PhoneIcon, StethoscopeIcon, 
  ScissorsIcon, HomeIcon, CheckIcon 
} from '../components/Icons';
import { PARTNER_LIST } from '../data/mockData';

export default function PartnersPage({ onOpenPartnerModal, bookmarks, onToggleBookmark }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [region, setRegion] = useState('all');
  const [keyword, setKeyword] = useState('');

  const filtered = PARTNER_LIST.filter(item => {
    const matchCat = selectedCat === 'all' || item.category === selectedCat;
    const matchRegion = region === 'all' || item.location.includes(region);
    const matchKey = !keyword || item.name.includes(keyword) || item.location.includes(keyword) || item.desc.includes(keyword);
    return matchCat && matchRegion && matchKey;
  });

  return (
    <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">
          PARTNER NETWORK (PAR-001)
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#144A42] tracking-tight">
          검증된 우리 동네<br />반려생활 제휴처
        </h1>
        <p className="text-xs sm:text-sm text-[#61716A]">
          슬반생이 직접 시설과 진료 환경을 확인하고 엄선한 동물병원, 미용실, 유치원입니다. 회원 특별 할인과 무료 서비스를 누려보세요.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 border border-[#EAE3D6] shadow-xs mb-10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-6 relative">
            <SearchIcon className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="업체명 또는 진료과목 검색 (예: 24시, 스케일링, 스파)"
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 text-xs focus:border-[#144A42] focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 text-xs text-gray-700 focus:outline-none"
            >
              <option value="all">전체 지역 (전국)</option>
              <option value="서울">서울시</option>
              <option value="강남">서울 강남구</option>
              <option value="송파">서울 송파구</option>
              <option value="경기">경기도</option>
              <option value="성남">경기 성남시</option>
              <option value="용인">경기 용인시</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 text-xs text-gray-700 focus:outline-none"
            >
              <option value="all">전체 업종</option>
              <option value="hospital">동물병원</option>
              <option value="grooming">미용/스파</option>
              <option value="hotel">호텔/유치원</option>
            </select>
          </div>

        </div>

        {/* Quick pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100 text-xs">
          <span className="text-gray-400 font-medium">추천 태그:</span>
          {['24시간 응급', '무마취 스케일링', '탄산스파', '천연잔디 운동장', '슬반생 우대할인'].map((tag, i) => (
            <button
              key={i}
              onClick={() => setKeyword(tag)}
              className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#5A6862] text-[11px] border border-gray-200"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#6B7973] mb-6">
        <span>총 <strong className="text-[#144A42] font-bold">{filtered.length}</strong>개의 제휴처가 등록되어 있습니다.</span>
        <span>정렬: 추천순</span>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const isBookmarked = bookmarks.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => onOpenPartnerModal(item)}
              className="bg-white overflow-hidden border border-[#ECE5D8] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
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

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#808E88]">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#142C27] group-hover:text-[#144A42] transition">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#63726C] line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="p-3 bg-[#EAF5F2] text-xs font-bold text-[#144A42] mb-3">
                  {item.benefit}
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 group-hover:text-[#144A42]">
                  <span>상세정보 확인</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
