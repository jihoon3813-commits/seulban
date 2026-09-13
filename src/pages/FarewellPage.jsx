import React, { useState } from 'react';
import { FlowerIcon, PhoneIcon, ShieldCheckIcon, CheckIcon } from '../components/Icons';
import { BRAND_INFO } from '../data/mockData';
import { formatPhoneNumber } from '../components/Modals';

export default function FarewellPage() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    petName: '',
    petWeight: '5kg 미만',
    urgent: '긴급 상담 필요',
    memo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* Top Banner Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-8">
        <div className="w-full overflow-hidden shadow-xs border border-[#E5DFD1]">
          <img
            src="https://res.cloudinary.com/lyjyvy54/image/upload/v1789268626/ChatGPT_Image_2026%EB%85%84_9%EC%9B%94_13%EC%9D%BC_%EC%98%A4%ED%9B%84_12_03_30_5_anaspb.png"
            alt="아름다운 이별 장례케어 배너"
            className="w-full h-auto object-cover max-h-[220px] sm:max-h-[400px]"
          />
        </div>
      </div>

      <div className="py-8 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#B48B55] uppercase">
            BEAUTIFUL FAREWELL (FAR-001)
          </span>
          <h1 className="text-2xl sm:text-5xl font-extrabold text-[#144A42] tracking-tight leading-tight">
            소중한 가족의 마지막 길,<br />존중과 품격을 담아 배웅합니다
          </h1>
          <p className="text-[11px] sm:text-sm text-[#65736D] leading-relaxed">
            국가 정식 허가 반려동물 장례식장 전속 제휴로 단독 화장, 전담 장례지도사 1:1 배정, 24시간 긴급 출동 시스템을 제공합니다.
          </p>

          {/* 24h Hotlines */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
            <a
              href={`tel:${BRAND_INFO.phone2}`}
              className="px-5 py-3 sm:px-6 sm:py-3.5 bg-[#144A42] text-white font-bold text-xs sm:text-sm hover:bg-[#0D3832] transition flex items-center justify-center gap-2 shadow-md"
            >
              <PhoneIcon className="w-4 h-4 text-[#C5A880]" />
              <span>24시간 긴급 장례 직통: {BRAND_INFO.phone2}</span>
            </a>

            <button
              onClick={() => { setConsultOpen(true); setSubmitted(false); }}
              className="px-5 py-3 sm:px-6 sm:py-3.5 bg-white border border-[#D5CEC0] text-[#144A42] font-semibold text-xs sm:text-sm hover:bg-gray-50 transition"
            >
              온라인 장례 상담 접수
            </button>
          </div>
        </div>

        {/* 4-Step Funeral Procedure */}
        <div className="bg-white p-4 sm:p-8 border border-[#ECE5D8] mb-8 sm:mb-12 shadow-xs">
          <h3 className="text-base sm:text-xl font-bold text-[#144A42] text-center mb-4 sm:mb-8">
            정식 허가 프리미엄 장례 절차
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-xs">
            <div className="bg-[#FAF8F5] p-3 sm:p-5 border border-[#E8E1D2] space-y-1">
              <span className="font-bold text-[#B48B55] text-[11px]">STEP 01</span>
              <h4 className="font-bold text-xs sm:text-sm text-[#142C27]">긴급 출동/안치</h4>
              <p className="text-[10px] sm:text-xs text-[#64716B] leading-tight">
                24시간 전용 차량 안전 운구
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-3 sm:p-5 border border-[#E8E1D2] space-y-1">
              <span className="font-bold text-[#B48B55] text-[11px]">STEP 02</span>
              <h4 className="font-bold text-xs sm:text-sm text-[#142C27]">염습 및 추모</h4>
              <p className="text-[10px] sm:text-xs text-[#64716B] leading-tight">
                천연 수의와 독립 추모실
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-3 sm:p-5 border border-[#E8E1D2] space-y-1">
              <span className="font-bold text-[#B48B55] text-[11px]">STEP 03</span>
              <h4 className="font-bold text-xs sm:text-sm text-[#142C27]">100% 단독화장</h4>
              <p className="text-[10px] sm:text-xs text-[#64716B] leading-tight">
                보호자 참관 전용 단독 화로
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-3 sm:p-5 border border-[#E8E1D2] space-y-1">
              <span className="font-bold text-[#B48B55] text-[11px]">STEP 04</span>
              <h4 className="font-bold text-xs sm:text-sm text-[#142C27]">봉안/스톤제작</h4>
              <p className="text-[10px] sm:text-xs text-[#64716B] leading-tight">
                유골함 안치 및 메모리얼 스톤
              </p>
            </div>
          </div>
        </div>

        {/* Safety & Promises */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-center text-xs">
          <div className="p-3.5 sm:p-5 bg-[#FAF8F5] border border-[#E8E1D2]">
            <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#144A42] mx-auto mb-1.5 sm:mb-2" />
            <h5 className="font-bold text-xs sm:text-sm text-[#144A42] mb-0.5 sm:mb-1">농림축산식품부 정식 허가</h5>
            <p className="text-[11px] sm:text-xs text-[#64716B]">합법 시설 등록업체만 엄선</p>
          </div>
          <div className="p-3.5 sm:p-5 bg-[#FAF8F5] border border-[#E8E1D2]">
            <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#144A42] mx-auto mb-1.5 sm:mb-2" />
            <h5 className="font-bold text-xs sm:text-sm text-[#144A42] mb-0.5 sm:mb-1">동물등록 말소 대행</h5>
            <p className="text-[11px] sm:text-xs text-[#64716B]">복잡한 지자체 행정 무료 처리</p>
          </div>
          <div className="p-3.5 sm:p-5 bg-[#FAF8F5] border border-[#E8E1D2]">
            <FlowerIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#144A42] mx-auto mb-1.5 sm:mb-2" />
            <h5 className="font-bold text-xs sm:text-sm text-[#144A42] mb-0.5 sm:mb-1">슬반생 회원 15% 우대</h5>
            <p className="text-[11px] sm:text-xs text-[#64716B]">고급 수의 및 유골함 지원</p>
          </div>
        </div>

      {/* Consult Modal */}
      {consultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md p-6 shadow-2xl border border-[#E8E2D5]">
            <h3 className="text-lg font-bold text-[#144A42] mb-1">반려동물 장례 및 안치 상담 접수</h3>
            <p className="text-xs text-gray-500 mb-4">전담 장례 지도사가 바로 확인 후 전화 안내를 드립니다.</p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">보호자 성함</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="홍길동"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">연락처</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={13}
                    required
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: formatPhoneNumber(e.target.value)})}
                    placeholder="010-0000-0000"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#144A42]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">아이 이름 / 체중</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="아이 이름"
                      value={form.petName}
                      onChange={(e) => setForm({...form, petName: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300"
                    />
                    <select
                      value={form.petWeight}
                      onChange={(e) => setForm({...form, petWeight: e.target.value})}
                      className="px-3 py-2 border border-gray-300"
                    >
                      <option value="5kg 미만">5kg 미만</option>
                      <option value="5~15kg">5~15kg</option>
                      <option value="15kg 이상">15kg 이상 대형견</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setConsultOpen(false)}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold"
                  >
                    닫기
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#144A42] text-white font-bold"
                  >
                    접수하기
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckIcon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-[#144A42]">상담 접수가 완료되었습니다</h4>
                <p className="text-xs text-gray-600">
                  전담 장례 지도사가 빠르게 전화로 상담해 드리겠습니다.
                </p>
                <button
                  onClick={() => setConsultOpen(false)}
                  className="w-full py-2.5 bg-[#144A42] text-white text-xs font-bold mt-2"
                >
                  확인
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
    </div>
  );
}
