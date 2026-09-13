import React from 'react';
import { 
  PawIcon, UserIcon, CheckIcon, ClockIcon, HeartIcon, MapPinIcon, 
  ShieldCheckIcon, ArrowRight, SparklesIcon 
} from '../components/Icons';
import { PARTNER_LIST } from '../data/mockData';

export default function MyPage({ 
  user, 
  pet, 
  applications, 
  bookmarks, 
  onOpenApplyModal, 
  onOpenPartnerModal,
  onOpenLogin,
  onOpenSignUp,
  onLogout
}) {
  const bookmarkedItems = PARTNER_LIST.filter(p => bookmarks.includes(p.id));

  // 비로그인 상태 가드: 로그인/회원가입 안내 카드 렌더링
  if (!user) {
    return (
      <div className="py-12 sm:py-20 max-w-xl mx-auto px-4 sm:px-6 text-center animate-fade-in">
        <div className="bg-white p-8 sm:p-10 border border-[#ECE5D8] shadow-lg space-y-5">
          <div className="w-16 h-16 bg-[#F4F0E8] text-[#144A42] flex items-center justify-center mx-auto border-2 border-[#144A42]">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#B48B55] tracking-widest uppercase">MEMBER ONLY</span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#142C27] mt-1">
              로그인이 필요한 서비스입니다
            </h1>
            <p className="text-xs text-[#62706A] mt-2 leading-relaxed">
              슬반생에 로그인하시거나 1초 간편 회원가입을 완료하시면<br />
              등록된 내 반려동물 프로필, 실시간 동물등록 진행 현황, 찜한 제휴처를 한눈에 확인하실 수 있습니다.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-6 py-3 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition shadow-xs"
            >
              로그인하기
            </button>
            <button
              onClick={onOpenSignUp || onOpenLogin}
              className="w-full sm:w-auto px-6 py-3 bg-[#FAF8F5] border border-[#DDD5C7] text-[#144A42] text-xs font-bold hover:bg-[#F3EFE6] transition shadow-xs"
            >
              간편 회원가입하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* My Profile Header */}
      <div className="bg-white p-4 sm:p-8 border border-[#EAE4D7] shadow-xs mb-6 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#EBE4D8] text-[#144A42] flex items-center justify-center font-bold text-xl sm:text-2xl border-2 border-[#144A42]">
            {user ? user.name.slice(0, 1) : '김'}
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-2xl font-bold text-[#142C27]">{user ? user.name : '김슬기'} 보호자님</h1>
              <span className="text-[10px] sm:text-xs font-bold text-[#144A42] bg-[#E8E0D1] border border-[#D9D0C1] px-2 py-0.5">
                VIP 회원
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
              <p className="text-[11px] sm:text-xs text-[#73827C]">
                {user ? user.email : 'demo@seulbanlife.com'}
              </p>
              {onLogout && (
                <>
                  <span className="text-gray-300">•</span>
                  <button 
                    onClick={onLogout}
                    className="text-[11px] sm:text-xs text-[#8E9B95] hover:text-red-600 underline transition"
                  >
                    로그아웃
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
          <button
            onClick={onOpenApplyModal}
            className="flex-1 sm:flex-initial px-4 py-2 sm:px-5 sm:py-2.5 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <PawIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A880]" />
            <span>반려동물 추가 등록</span>
          </button>
        </div>
      </div>

      {/* 1. Registered Pet Profile (MY-002) */}
      <div className="mb-6 sm:mb-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-bold text-[#144A42] flex items-center gap-2">
            <PawIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#144A42]" />
            <span>등록된 내 반려동물 ({pet ? 1 : 0}마리)</span>
          </h2>
        </div>

        {pet ? (
          <div className="bg-white p-4 sm:p-6 border border-[#E8E1D2] shadow-xs flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden bg-gray-100 shrink-0 border-2 border-[#144A42]">
              <img 
                src={pet.photoUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80"} 
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-1.5 sm:space-y-2 text-xs w-full text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[#142C27]">{pet.name}</h3>
                  <span className="bg-[#EAF5F2] text-[#144A42] font-bold px-2 py-0.5 text-[10px] sm:text-[11px]">
                    {pet.status}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-gray-500 bg-gray-50 px-2 py-0.5 sm:px-2.5 sm:py-1 border border-gray-200 inline-block">
                  등록번호: {pet.regNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 pt-1 text-[#5A6862]">
                <div className="bg-[#FAF9F6] p-2 sm:p-2.5 border border-gray-100">
                  <span className="text-gray-400 block text-[9px] sm:text-[10px]">품종</span>
                  <span className="font-semibold text-xs">{pet.breed}</span>
                </div>
                <div className="bg-[#FAF9F6] p-2 sm:p-2.5 border border-gray-100">
                  <span className="text-gray-400 block text-[9px] sm:text-[10px]">성별 / 중성화</span>
                  <span className="font-semibold text-xs">{pet.gender} ({pet.neutered})</span>
                </div>
                <div className="bg-[#FAF9F6] p-2 sm:p-2.5 border border-gray-100">
                  <span className="text-gray-400 block text-[9px] sm:text-[10px]">생년월일</span>
                  <span className="font-semibold text-xs">{pet.birth}</span>
                </div>
                <div className="bg-[#FAF9F6] p-2 sm:p-2.5 border border-gray-100">
                  <span className="text-gray-400 block text-[9px] sm:text-[10px]">체중</span>
                  <span className="font-semibold text-xs">{pet.weight} kg</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-8 border border-dashed border-gray-300 text-center space-y-2.5">
            <p className="text-xs text-gray-500">아직 등록된 반려동물이 없습니다.</p>
            <button
              onClick={onOpenApplyModal}
              className="px-5 py-2 sm:px-6 sm:py-2.5 bg-[#144A42] text-white font-bold text-xs hover:bg-[#0D3832] transition"
            >
              지금 동물등록 신청하기
            </button>
          </div>
        )}
      </div>

      {/* 2. Registration Applications Status (REG-004) */}
      <div className="mb-6 sm:mb-10">
        <h2 className="text-base sm:text-lg font-bold text-[#144A42] mb-3 sm:mb-4 flex items-center gap-2">
          <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#144A42]" />
          <span>동물등록 신청 현황 및 배송 추적 ({applications.length}건)</span>
        </h2>

        {applications.length === 0 ? (
          <div className="bg-white p-6 sm:p-8 border border-dashed border-gray-300 text-center space-y-2.5">
            <p className="text-xs text-gray-500">아직 접수된 동물등록 신청 내역이 없습니다.</p>
            <button
              onClick={onOpenApplyModal}
              className="px-5 py-2 sm:px-6 sm:py-2.5 bg-[#144A42] text-white font-bold text-xs hover:bg-[#0D3832] transition"
            >
              지금 동물등록 신청하기
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-4 sm:p-6 border border-[#EAE3D6] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 gap-1.5">
                <div>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-[#144A42]">{app.id}</span>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 mt-0.5">
                    {app.petName} ({app.type})
                  </h4>
                  <span className="text-[10px] sm:text-[11px] text-gray-400">신청일시: {app.appliedDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold ${
                    app.statusCode === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    app.statusCode === 'SHIPPING' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {app.statusLabel}
                  </span>
                </div>
              </div>

              {/* Shipping info */}
              <div className="py-2.5 sm:py-3 text-[11px] sm:text-xs flex justify-between items-center text-gray-600">
                <span>배송 정보: <strong className="text-gray-900">{app.trackingNumber}</strong></span>
                <span className="text-emerald-700 font-semibold">서류 심사 완료</span>
              </div>

              {/* Timeline */}
              <div className="bg-[#FAF9F6] p-3 sm:p-4 space-y-2 sm:space-y-3 mt-1 sm:mt-2 border border-gray-100">
                <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">진행 타임라인</p>
                <div className="space-y-1.5 sm:space-y-2 text-xs">
                  {app.history.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 sm:gap-3">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#144A42] mt-1.5 shrink-0"></span>
                      <div>
                        <span className="font-semibold text-[11px] sm:text-xs text-gray-900">{h.title}</span>
                        <span className="text-gray-400 text-[10px] sm:text-[11px] ml-1.5">({h.date})</span>
                        <p className="text-[10px] sm:text-[11px] text-gray-500">{h.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* 3. Bookmarked Partners */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[#144A42] mb-3 sm:mb-4 flex items-center gap-2">
          <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" filled />
          <span>내가 찜한 제휴처 ({bookmarkedItems.length}곳)</span>
        </h2>

        {bookmarkedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {bookmarkedItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => onOpenPartnerModal(item)}
                className="bg-white p-3.5 sm:p-5 border border-gray-200 shadow-xs hover:shadow-md transition cursor-pointer flex justify-between items-center"
              >
                <div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#144A42] bg-[#EAF5F2] px-2 py-0.5">
                    {item.categoryName}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 mt-1">{item.name}</h4>
                  <p className="text-[11px] sm:text-xs text-gray-500">{item.location}</p>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#144A42] mt-0.5">{item.benefit}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 p-4 sm:p-6 bg-white border border-gray-100 text-center">
            아직 찜한 제휴처가 없습니다. [반려생활] 메뉴에서 마음에 드는 병원과 샵을 찜해보세요!
          </p>
        )}
      </div>

    </div>
  );
}
