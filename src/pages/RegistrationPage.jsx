import React, { useState } from 'react';
import { 
  PawIcon, ShieldCheckIcon, CheckIcon, ArrowRight, ChevronDown, 
  ChevronUp, FileTextIcon, ClockIcon, SparklesIcon 
} from '../components/Icons';
import { REG_FAQS } from '../data/mockData';

export default function RegistrationPage({ onOpenApplyModal }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [selfCheck, setSelfCheck] = useState({
    ageOver2Months: true,
    isFirstTime: true,
    residentInKorea: true,
  });

  return (
    <div className="w-full">
      {/* Top Banner Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-8">
        <div className="w-full overflow-hidden shadow-xs border border-[#E5DFD1]">
          <img
            src="https://res.cloudinary.com/lyjyvy54/image/upload/v1789268626/ChatGPT_Image_2026%EB%85%84_9%EC%9B%94_13%EC%9D%BC_%EC%98%A4%ED%9B%84_12_03_30_1_dxjcu5.png"
            alt="동물등록 배너"
            className="w-full h-auto object-cover max-h-[220px] sm:max-h-[400px]"
          />
        </div>
      </div>

      <div className="py-8 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 space-y-2 sm:space-y-3">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#B48B55] uppercase">
            MANDATORY PET REGISTRATION (REG-001)
          </span>
          <h1 className="text-2xl sm:text-5xl font-extrabold text-[#144A42] tracking-tight leading-tight">
            복잡한 동물등록,<br />
            모바일로 3분 만에 끝내세요
          </h1>
          <p className="text-[11px] sm:text-sm text-[#5C6A64] leading-relaxed">
            동물보호법에 따른 법적 필수 등록! 관공서 방문 없이 스마트폰으로 신청하고 공식 동물등록증과 안심 외장칩을 집에서 편안히 받아보세요.
          </p>

          <div className="pt-2 sm:pt-4">
            <button
              onClick={onOpenApplyModal}
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-[#144A42] text-white font-bold text-xs sm:text-base hover:bg-[#0D3832] transition shadow-md inline-flex items-center justify-center gap-2"
            >
              <PawIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A880]" />
              <span>우리 아이 등록 신청하기</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Self Check Diagnostic Card */}
        <div className="bg-[#FAF8F4] p-4 sm:p-8 border border-[#EAE3D6] mb-8 sm:mb-14 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheckIcon className="w-5 h-5 text-[#144A42]" />
            <h3 className="text-sm sm:text-lg font-bold text-[#144A42]">우리 아이 등록 대상 자가진단 (1초 체크)</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-xs">
            <label className="bg-white p-3 sm:p-4 border border-[#E5DFD2] flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-[#2C3833] text-[11px] sm:text-xs">생후 2개월령 이상인가요?</span>
              <input 
                type="checkbox" 
                checked={selfCheck.ageOver2Months} 
                onChange={(e) => setSelfCheck({...selfCheck, ageOver2Months: e.target.checked})}
                className="w-4 h-4 accent-[#144A42]"
              />
            </label>
            <label className="bg-white p-3 sm:p-4 border border-[#E5DFD2] flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-[#2C3833] text-[11px] sm:text-xs">한국 지자체 거주 보호자</span>
              <input 
                type="checkbox" 
                checked={selfCheck.residentInKorea} 
                onChange={(e) => setSelfCheck({...selfCheck, residentInKorea: e.target.checked})}
                className="w-4 h-4 accent-[#144A42]"
              />
            </label>
            <label className="bg-white p-3 sm:p-4 border border-[#E5DFD2] flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-[#2C3833] text-[11px] sm:text-xs">신규 등록 신청</span>
              <input 
                type="checkbox" 
                checked={selfCheck.isFirstTime} 
                onChange={(e) => setSelfCheck({...selfCheck, isFirstTime: e.target.checked})}
                className="w-4 h-4 accent-[#144A42]"
              />
            </label>
          </div>

          <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-[#EAF5F2] text-[11px] sm:text-xs font-semibold text-[#144A42] flex items-center gap-1.5 sm:gap-2">
            <CheckIcon className="w-4 h-4 flex-shrink-0" />
            <span>체크 완료! 지금 바로 슬반생에서 정식 법적 등록이 가능합니다.</span>
          </div>
        </div>

        {/* 5-Step Process */}
        <div className="mb-8 sm:mb-14">
          <h3 className="text-base sm:text-xl font-bold text-[#144A42] text-center mb-4 sm:mb-8">
            슬반생 초간편 5단계 등록 절차
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 text-center text-xs">
            {[
              { step: '01', title: '모바일 신청', desc: '정보 3분 간편 입력' },
              { step: '02', title: '서류 검수', desc: '전담팀 정확성 확인' },
              { step: '03', title: '구청 승인', desc: '동물보호관리 승인' },
              { step: '04', title: '등록증 제작', desc: '외장태그/카드 제작' },
              { step: '05', title: '우체국 배송', desc: '집 앞으로 안전 배송' },
            ].map((item, idx) => (
              <div 
                key={item.step} 
                className={`bg-white p-3 sm:p-5 border border-[#EAE5D9] shadow-xs flex flex-col items-center ${idx === 4 ? 'col-span-2 sm:col-span-1' : ''}`}
              >
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-[#144A42] text-white flex items-center justify-center font-bold text-[11px] sm:text-xs mb-1.5 sm:mb-2">
                  {item.step}
                </span>
                <h4 className="font-bold text-[#142C27] text-xs mb-0.5">{item.title}</h4>
                <p className="text-[10px] sm:text-[11px] text-[#71807A] leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Methods Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-14">
          <div className="bg-white p-5 sm:p-7 border-2 border-[#144A42] shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-white bg-[#144A42] px-2 py-0.5">
              인기 선택 (92%)
            </span>
            <h4 className="text-base sm:text-xl font-bold text-[#144A42] mt-2 sm:mt-3 mb-1">외장형 안심 목걸이 칩</h4>
            <p className="text-[11px] sm:text-xs text-[#63726C] mb-3 sm:mb-4">
              주사 시술 없이 가볍고 안전하게 목걸이에 거는 방식입니다.
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-[#2C3B35]">
              <li className="flex items-center gap-1.5">✓ 무통증, 가벼운 생활방수 펜던트</li>
              <li className="flex items-center gap-1.5">✓ 관공서 승인 고유 식별번호 내장</li>
              <li className="flex items-center gap-1.5">✓ 공식 동물등록증 카드 무료 동봉</li>
            </ul>
          </div>

          <div className="bg-white p-5 sm:p-7 border border-[#E3DDD1] shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#866838] bg-[#FAF2E5] px-2 py-0.5">
              영구 보관형
            </span>
            <h4 className="text-base sm:text-xl font-bold text-[#144A42] mt-2 sm:mt-3 mb-1">내장형 마이크로칩 시술권</h4>
            <p className="text-[11px] sm:text-xs text-[#63726C] mb-3 sm:mb-4">
              분실 염려 없이 안전한 슬반생 제휴 병원에서 수의사가 직접 시술합니다.
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-[#2C3B35]">
              <li className="flex items-center gap-1.5">✓ 쌀알 크기의 생체 적합 바이오 글래스 칩</li>
              <li className="flex items-center gap-1.5">✓ 슬반생 전국 제휴병원 시술 연계</li>
              <li className="flex items-center gap-1.5">✓ 영구적인 개체 식별 가능</li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white p-4 sm:p-8 border border-[#EAE4D8] shadow-xs">
          <h3 className="text-base sm:text-xl font-bold text-[#144A42] mb-4 sm:mb-6">동물등록 자주 묻는 질문 (FAQ)</h3>
          
          <div className="space-y-2 sm:space-y-3">
            {REG_FAQS.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-3 sm:p-4 text-left font-bold text-xs sm:text-sm text-[#142C27] flex justify-between items-center bg-[#FAF9F6] hover:bg-[#F3F0E8] transition"
                >
                  <span>Q. {faq.q}</span>
                  {openFaqIndex === idx ? <ChevronUp className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 ml-2" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 ml-2" />}
                </button>
                {openFaqIndex === idx && (
                  <div className="p-3 sm:p-4 text-[11px] sm:text-xs text-[#4F5E57] bg-white leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
