import React from 'react';
import { LogoEmblem, PhoneIcon } from './Icons';
import { BRAND_INFO } from '../data/mockData';

export default function Footer({ onOpenAdmin, onNavigate }) {
  return (
    <footer className="bg-[#111716] text-[#A6B2AD] pt-14 pb-24 md:pb-14 border-t border-[#1F2B28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top footer row: Logo and Quick links */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-[#1E2926] gap-6">
          <div className="flex items-center gap-3">
            <LogoEmblem className="w-9 h-9 bg-[#1E332E] text-[#D4AF7A]" />
            <div>
              <span className="text-xl font-bold text-white tracking-tight">슬반생</span>
              <p className="text-xs text-[#82918B]">슬기로운 반려생활 라이프케어 플랫폼</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#CAD4CF]">
            <button onClick={() => onNavigate('registration')} className="hover:text-white transition">동물등록 안내</button>
            <button onClick={() => onNavigate('membership')} className="hover:text-white transition">멤버십 혜택</button>
            <button onClick={() => onNavigate('partners')} className="hover:text-white transition">제휴처 찾기</button>
            <button onClick={() => onNavigate('farewell')} className="hover:text-white transition">장례케어 안내</button>
            <button onClick={onOpenAdmin} className="hover:text-[#D4AF7A] font-semibold transition">관리자 시스템</button>
          </div>
        </div>

        {/* Middle footer row: Business details and Contact info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 text-xs leading-relaxed text-[#8E9B95]">
          <div className="md:col-span-2 space-y-1.5">
            <p className="text-white font-semibold text-sm mb-2">주식회사 슬기로운 반려생활</p>
            <p>대표자: 김대표 | 사업자등록번호: 123-45-67890 | 통신판매업신고: 2026-서울강남-0123호</p>
            <p>주소: 서울특별시 강남구 테헤란로 123 슬반생 타워 5층 | 개인정보보호책임자: 박슬기</p>
            <p>이메일: contact@seulbanlife.com | 호스팅 제공자: 슬반생 클라우드</p>
            <p className="text-[#64726C] pt-2">
              슬반생은 통신판매중개자이며 통신판매의 당사자가 아닙니다. 제휴사가 제공하는 상품 및 서비스의 거래와 관련한 책임은 각 제공자에게 있습니다.
            </p>
          </div>

          <div className="bg-[#182220] p-6 border border-[#23312E] space-y-2">
            <p className="text-white font-semibold text-sm flex items-center gap-1.5">
              <PhoneIcon className="w-4 h-4 text-[#D4AF7A]" />
              고객센터 및 제휴상담
            </p>
            <div className="text-lg font-bold text-[#E8DEC8] tracking-tight">
              {BRAND_INFO.phone1}
            </div>
            <div className="text-sm font-semibold text-[#A6B2AD]">
              야간/응급 안내: {BRAND_INFO.phone2}
            </div>
            <p className="text-[11px] text-[#71807A]">
              평일 09:00 - 18:00 (점심시간 12:00 - 13:00)<br />
              동물등록 및 24시 긴급상담 연중무휴 지원
            </p>
          </div>
        </div>

        {/* Bottom row: Copyright & Policy Links */}
        <div className="pt-6 border-t border-[#1C2624] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7973] gap-4">
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-white underline">개인정보처리방침</a>
            <a href="#terms" className="hover:text-white">이용약관</a>
            <a href="#marketing" className="hover:text-white">마케팅 수신동의</a>
          </div>
          <div>
            © 2026 Seulban Life Inc. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
