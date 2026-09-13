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
    <div className="py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">
          MANDATORY PET REGISTRATION (REG-001)
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#144A42] tracking-tight">
          복잡한 동물등록,<br />
          모바일로 3분 만에 끝내세요
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6A64] leading-relaxed">
          동물보호법에 따른 법적 필수 등록! 관공서 방문 없이 스마트폰으로 간편하게 신청하고 공식 동물등록증과 안심 외장칩을 집에서 편안히 받아보세요.
        </p>

        <div className="pt-4">
          <button
            onClick={onOpenApplyModal}
            className="px-8 py-4 bg-[#144A42] text-white font-bold text-sm sm:text-base hover:bg-[#0D3832] transition shadow-md inline-flex items-center gap-2"
          >
            <PawIcon className="w-5 h-5 text-[#C5A880]" />
            <span>우리 아이 등록 신청하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Self Check Diagnostic Card */}
      <div className="bg-[#FAF8F4] p-6 sm:p-8 border border-[#EAE3D6] mb-14 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <ShieldCheckIcon className="w-6 h-6 text-[#144A42]" />
          <h3 className="text-lg font-bold text-[#144A42]">우리 아이 등록 대상 자가진단 (1초 체크)</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <label className="bg-white p-4 border border-[#E5DFD2] flex items-center justify-between cursor-pointer">
            <span className="font-semibold text-[#2C3833]">생후 2개월령 이상인가요?</span>
            <input 
              type="checkbox" 
              checked={selfCheck.ageOver2Months} 
              onChange={(e) => setSelfCheck({...selfCheck, ageOver2Months: e.target.checked})}
              className="w-4 h-4 text-[#144A42]"
            />
          </label>
          <label className="bg-white p-4 border border-[#E5DFD2] flex items-center justify-between cursor-pointer">
            <span className="font-semibold text-[#2C3833]">한국 지자체 거주 보호자</span>
            <input 
              type="checkbox" 
              checked={selfCheck.residentInKorea} 
              onChange={(e) => setSelfCheck({...selfCheck, residentInKorea: e.target.checked})}
              className="w-4 h-4 text-[#144A42]"
            />
          </label>
          <label className="bg-white p-4 border border-[#E5DFD2] flex items-center justify-between cursor-pointer">
            <span className="font-semibold text-[#2C3833]">신규 등록 신청</span>
            <input 
              type="checkbox" 
              checked={selfCheck.isFirstTime} 
              onChange={(e) => setSelfCheck({...selfCheck, isFirstTime: e.target.checked})}
              className="w-4 h-4 text-[#144A42]"
            />
          </label>
        </div>

        <div className="mt-4 p-3 bg-[#EAF5F2] text-xs font-semibold text-[#144A42] flex items-center gap-2">
          <CheckIcon className="w-4 h-4" />
          <span>체크 완료! 지금 바로 슬반생에서 정식 법적 등록이 가능합니다.</span>
        </div>
      </div>

      {/* 5-Step Process */}
      <div className="mb-14">
        <h3 className="text-xl font-bold text-[#144A42] text-center mb-8">
          슬반생 초간편 5단계 등록 절차
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
          {[
            { step: '01', title: '모바일 신청', desc: '아이 정보 3분 간편 입력' },
            { step: '02', title: '서류 검수', desc: '전문 전담팀 정확성 확인' },
            { step: '03', title: '구청 전산 승인', desc: '정부 동물보호관리 승인' },
            { step: '04', title: '등록증 제작', desc: '공식 외장태그/카드 제작' },
            { step: '05', title: '우체국 배송', desc: '안전하게 집 앞으로 도착' },
          ].map((item) => (
            <div key={item.step} className="bg-white p-5 border border-[#EAE5D9] shadow-xs flex flex-col items-center">
              <span className="w-8 h-8 bg-[#144A42] text-white flex items-center justify-center font-bold text-xs mb-2">
                {item.step}
              </span>
              <h4 className="font-bold text-[#142C27] mb-1">{item.title}</h4>
              <p className="text-[11px] text-[#71807A]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Methods Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        <div className="bg-white p-7 border-2 border-[#144A42] shadow-sm">
          <span className="text-[11px] font-bold text-white bg-[#144A42] px-2.5 py-0.5">
            인기 선택 (92%)
          </span>
          <h4 className="text-xl font-bold text-[#144A42] mt-3 mb-1">외장형 안심 목걸이 칩</h4>
          <p className="text-xs text-[#63726C] mb-4">
            주사 시술 없이 가볍고 안전하게 목걸이에 거는 방식입니다.
          </p>
          <ul className="space-y-2 text-xs text-[#2C3B35]">
            <li className="flex items-center gap-2">✓ 무통증, 가벼운 생활방수 펜던트</li>
            <li className="flex items-center gap-2">✓ 관공서 승인 고유 식별번호 내장</li>
            <li className="flex items-center gap-2">✓ 공식 동물등록증 카드 무료 동봉</li>
          </ul>
        </div>

        <div className="bg-white p-7 border border-[#E3DDD1] shadow-sm">
          <span className="text-[11px] font-bold text-[#866838] bg-[#FAF2E5] px-2.5 py-0.5">
            영구 보관형
          </span>
          <h4 className="text-xl font-bold text-[#144A42] mt-3 mb-1">내장형 마이크로칩 시술권</h4>
          <p className="text-xs text-[#63726C] mb-4">
            분실 염려 없이 안전한 슬반생 제휴 병원에서 수의사가 직접 시술합니다.
          </p>
          <ul className="space-y-2 text-xs text-[#2C3B35]">
            <li className="flex items-center gap-2">✓ 쌀알 크기의 생체 적합 바이오 글래스 칩</li>
            <li className="flex items-center gap-2">✓ 슬반생 전국 제휴병원 시술 연계</li>
            <li className="flex items-center gap-2">✓ 영구적인 개체 식별 가능</li>
          </ul>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white p-6 sm:p-8 border border-[#EAE4D8] shadow-xs">
        <h3 className="text-xl font-bold text-[#144A42] mb-6">동물등록 자주 묻는 질문 (FAQ)</h3>
        
        <div className="space-y-3">
          {REG_FAQS.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#142C27] flex justify-between items-center bg-[#FAF9F6] hover:bg-[#F3F0E8] transition"
              >
                <span>Q. {faq.q}</span>
                {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
              {openFaqIndex === idx && (
                <div className="p-4 text-xs text-[#4F5E57] bg-white leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
