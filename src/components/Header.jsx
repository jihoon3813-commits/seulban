import React, { useState, useEffect } from 'react';
import { LogoEmblem, PawIcon, MenuIcon, XIcon, ExternalLinkIcon, UserIcon, ShieldCheckIcon } from './Icons';
import { BRAND_INFO } from '../data/mockData';

export default function Header({ 
  user, 
  onOpenLogin, 
  onLogout, 
  onNavigate, 
  activeTab, 
  onOpenApplyModal,
  onOpenMembershipModal,
  onOpenAdmin
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'registration', label: '동물등록', badge: '필수' },
    { id: 'adoption', label: '새로운 만남' },
    { id: 'partners', label: '반려생활' },
    { id: 'travel', label: '반려여행' },
    { id: 'farewell', label: '아름다운 이별' },
    { id: 'membership', label: '슬반생멤버십', highlight: true },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#144A42] text-[#E8DEC8] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 bg-[#E8DEC8] animate-pulse"></span>
        <span>슬기로운 반려생활의 시작, 슬반생 동물등록 및 프리미엄 멤버십 사전신청 오픈!</span>
        <button 
          onClick={onOpenMembershipModal}
          className="ml-2 text-white underline underline-offset-2 hover:text-[#F3EFE6] text-[11px]"
        >
          혜택 알아보기 →
        </button>
      </div>

      {/* Main Navigation Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'glass-header shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-3' 
          : 'bg-white/95 border-b border-[#EFECE6] py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group"
          >
            <LogoEmblem className="w-9 h-9 shadow-sm group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#144A42] leading-none">슬반생</span>
              <span className="text-[10px] text-[#78827D] font-medium tracking-wider mt-0.5">슬기로운 반려생활</span>
            </div>
          </button>

          {/* Desktop Navigation Menus */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-2 text-[15px] font-semibold transition-colors ${
                  activeTab === item.id 
                    ? 'text-[#144A42] font-bold bg-[#F4F1EA] border-b-2 border-[#144A42]' 
                    : item.highlight
                    ? 'text-[#B48B55] hover:text-[#144A42] hover:bg-[#F8F6F0]'
                    : 'text-[#2D3732] hover:text-[#144A42] hover:bg-[#F8F6F0]'
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="absolute -top-1 right-0 text-[9px] font-bold px-1.5 py-0.2 bg-[#E11D48] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('mypage')}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#144A42] bg-[#EBF4F2] px-3.5 py-1.5 hover:bg-[#DCEDE9] transition border border-[#C6E2DC]"
                >
                  <UserIcon className="w-4 h-4 text-[#144A42]" />
                  <span>{user.name}님 (MY)</span>
                </button>
                <button
                  onClick={onLogout}
                  className="text-xs text-[#7B8580] hover:text-[#144A42] underline"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center text-sm font-medium text-[#4A5550] divide-x divide-gray-200">
                <button 
                  onClick={onOpenLogin}
                  className="px-2.5 py-1 hover:text-[#144A42] transition"
                >
                  로그인
                </button>
                <button 
                  onClick={onOpenLogin}
                  className="px-2.5 py-1 hover:text-[#144A42] transition"
                >
                  회원가입
                </button>
              </div>
            )}

            {/* Shopping Mall External Link */}
            <a 
              href="https://mall.seulbanlife.com" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-[#D5D0C3] text-[#4A5550] hover:border-[#144A42] hover:text-[#144A42] transition"
            >
              <span>슬반생몰</span>
              <ExternalLinkIcon className="w-3 h-3 text-[#8A948F]" />
            </a>

            {/* Admin Demo Switcher */}
            <button
              onClick={onOpenAdmin}
              className="text-[11px] font-semibold text-white bg-[#144A42] hover:bg-[#0D3832] px-3 py-1.5 transition shadow-xs"
              title="기획서 13장 관리자 시스템 데모"
            >
              관리자 모드
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => onNavigate('mypage')}
              className="p-2 text-[#144A42] hover:bg-gray-100"
              aria-label="마이페이지"
            >
              <UserIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#144A42] hover:bg-gray-100"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 space-y-3 shadow-xl">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3 py-2.5 text-sm font-semibold transition ${
                    activeTab === item.id ? 'bg-[#144A42] text-white' : 'bg-[#F8F6F1] text-[#242A27]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-1">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#144A42]">{user.name}님</span>
                  <button onClick={onLogout} className="text-xs text-gray-500 underline">로그아웃</button>
                </div>
              ) : (
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                  className="text-sm font-bold text-[#144A42]"
                >
                  로그인 / 회원가입
                </button>
              )}

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                className="text-xs font-semibold bg-[#144A42] text-white px-3 py-1.5"
              >
                관리자 시스템
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
