import React from 'react';
import { SparklesIcon, CheckIcon, ArrowRight, ShieldCheckIcon } from '../components/Icons';
import { MEMBERSHIP_PERKS } from '../data/mockData';

export default function MembershipPage({ onOpenMembershipModal }) {
  return (
    <div className="py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">
          EXCLUSIVE MEMBERSHIP (MEM-001)
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#144A42] tracking-tight">
          반려생활의 든든한 혜택,<br />슬반생 멤버십
        </h1>
        <p className="text-xs sm:text-sm text-[#5F6E68] leading-relaxed">
          예측하기 어려운 병원비 걱정부터 사료·용품 쇼핑, 여행까지. 슬반생 멤버십 하나로 우리 아이 평생 케어 비용을 스마트하게 아끼세요.
        </p>

        <div className="pt-4">
          <button
            onClick={onOpenMembershipModal}
            className="px-8 py-4 bg-[#144A42] text-white font-bold text-sm sm:text-base hover:bg-[#0D3832] transition shadow-md inline-flex items-center gap-2"
          >
            <SparklesIcon className="w-5 h-5 text-[#C5A880]" />
            <span>멤버십 사전신청 및 혜택 찜하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Core Perks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {MEMBERSHIP_PERKS.map((p) => (
          <div key={p.id} className={`p-8 ${p.bg} shadow-md flex flex-col justify-between`}>
            <div>
              <span className={`inline-block text-[10px] font-bold px-3 py-1 mb-4 ${p.tagBg}`}>
                {p.tag}
              </span>
              <h3 className="text-2xl font-bold tracking-tight mb-3">{p.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed opacity-90">{p.desc}</p>
            </div>
            <div className="pt-6 mt-6 border-t border-current/10 flex items-center gap-1.5 text-xs font-bold">
              <span>혜택 적용 조건 확인</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white p-6 sm:p-8 border border-[#EAE3D6] shadow-xs mb-14">
        <h3 className="text-xl font-bold text-[#144A42] text-center mb-6">
          일반회원 vs 슬반생 멤버십 비교
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-4 font-bold text-gray-500">제공 혜택</th>
                <th className="py-3 px-4 text-center font-bold text-gray-500">일반 회원</th>
                <th className="py-3 px-4 text-center font-extrabold text-[#144A42] bg-[#F2F8F6]">
                  슬반생 멤버십 (월 9,900원 상당)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3.5 px-4 font-medium">모바일 동물등록 대행</td>
                <td className="py-3.5 px-4 text-center text-gray-400">수수료 무료</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#144A42] bg-[#F2F8F6]">외장칩+등록증 키트 전액 무료 (2만원 상당)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium">제휴 동물병원 진료비</td>
                <td className="py-3.5 px-4 text-center text-gray-400">정가 적용</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#144A42] bg-[#F2F8F6]">진료 및 기본검진 10~20% 상시 할인</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium">반려 숙소(펜션/리조트)</td>
                <td className="py-3.5 px-4 text-center text-gray-400">정가 적용</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#144A42] bg-[#F2F8F6]">주중 최대 30% 할인 및 반려견 1마리 추가 무료</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium">슬반생몰 쇼핑 쿠폰</td>
                <td className="py-3.5 px-4 text-center text-gray-400">첫구매 3,000원</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#144A42] bg-[#F2F8F6]">매월 50,000원 전용 할인 쿠폰팩 지급</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium">24시 긴급상담 & 장례 우대</td>
                <td className="py-3.5 px-4 text-center text-gray-400">일반 안내</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#144A42] bg-[#F2F8F6]">전담 플래너 1:1 배정 & 장례비용 15% 지원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
