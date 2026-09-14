import React from 'react';
import { SparklesIcon, CheckIcon, ArrowRight, ShieldCheckIcon } from '../components/Icons';
import { MEMBERSHIP_PERKS } from '../data/mockData';

export default function MembershipPage({ onOpenMembershipModal, onOpenMallModal }) {
  return (
    <div className="w-full">
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

      <div className="py-8 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 space-y-2 sm:space-y-3">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#B48B55] uppercase">
            EXCLUSIVE MEMBERSHIP (MEM-001)
          </span>
          <h1 className="text-2xl sm:text-5xl font-extrabold text-[#144A42] tracking-tight leading-tight">
            반려생활의 든든한 혜택,<br />슬반생 멤버십
          </h1>
          <p className="text-[11px] sm:text-sm text-[#5F6E68] leading-relaxed">
            예측하기 어려운 병원비 걱정부터 사료·용품 쇼핑, 여행까지. 슬반생 멤버십 하나로 우리 아이 평생 케어 비용을 스마트하게 아끼세요.
          </p>

          <div className="pt-2 sm:pt-4">
            <button
              onClick={onOpenMembershipModal}
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-[#144A42] text-white font-bold text-xs sm:text-base hover:bg-[#0D3832] transition shadow-md inline-flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A880]" />
              <span>멤버십 사전신청 및 혜택 찜하기</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* 4 Core Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-16">
          {MEMBERSHIP_PERKS.map((p) => (
            <div key={p.id} className={`p-5 sm:p-8 ${p.bg} shadow-xs flex flex-col justify-between`}>
              <div>
                <span className={`inline-block text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 mb-2 sm:mb-4 ${p.tagBg}`}>
                  {p.tag}
                </span>
                <h3 className="text-base sm:text-2xl font-bold tracking-tight mb-1.5 sm:mb-3">{p.title}</h3>
                <p className="text-[11px] sm:text-sm leading-relaxed opacity-90">{p.desc}</p>
              </div>
              <div className="pt-3 sm:pt-6 mt-3 sm:mt-6 border-t border-current/10 flex items-center gap-1.5 text-[11px] sm:text-xs font-bold">
                <span>혜택 적용 조건 확인</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white p-4 sm:p-8 border border-[#EAE3D6] shadow-xs mb-8 sm:mb-14">
          <h3 className="text-base sm:text-xl font-bold text-[#144A42] text-center mb-4 sm:mb-6">
            일반회원 vs 슬반생 멤버십 비교
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] sm:text-xs text-left whitespace-nowrap sm:whitespace-normal">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-2.5 px-3 sm:py-3 sm:px-4 font-bold text-gray-500">제공 혜택</th>
                  <th className="py-2.5 px-3 sm:py-3 sm:px-4 text-center font-bold text-gray-500">일반 회원</th>
                  <th className="py-2.5 px-3 sm:py-3 sm:px-4 text-center font-extrabold text-[#144A42] bg-[#F2F8F6]">
                    슬반생 멤버십 (월 9,900원 상당)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 font-medium">모바일 동물등록</td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-center text-gray-400">수수료 무료</td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-center font-bold text-[#144A42] bg-[#F2F8F6]">외장칩+등록증 키트 전액 무료</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 font-medium">제휴 병원 진료비</td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-center text-gray-400">정가 적용</td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-center font-bold text-[#144A42] bg-[#F2F8F6]">진료비 10~20% 즉시 할인</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 font-medium">반려 숙소/펜션</td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-center text-gray-400">정가 적용</td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-center font-bold text-[#144A42] bg-[#F2F8F6]">주중 최대 30% 할인 & 1견 무료</td>
                </tr>
                <tr 
                  onClick={onOpenMallModal}
                  className="cursor-pointer hover:bg-[#F9F7F2] transition group"
                  title="슬반생몰 오픈 준비 현황 보기"
                >
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 font-medium flex items-center justify-between">
                    <span>슬반생몰 쇼핑</span>
                    <span className="text-[10px] bg-[#EBF5F2] text-[#144A42] px-1.5 py-0.5 rounded font-bold group-hover:bg-[#144A42] group-hover:text-white transition">
                      오픈준비중
                    </span>
                  </td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-center text-gray-400">첫구매 3,000원</td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-center font-bold text-[#144A42] bg-[#F2F8F6] group-hover:bg-[#E2EFEA] transition">
                    매월 50,000원 전용 쿠폰팩
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 font-medium">24시 응급 & 장례</td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-center text-gray-400">일반 안내</td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-center font-bold text-[#144A42] bg-[#F2F8F6]">전담 플래너 1:1 배정 & 장례비용 15% 지원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
