import React, { useState, useEffect } from 'react';
import { LogoEmblem, PawIcon, MenuIcon, XIcon, ExternalLinkIcon, UserIcon, ShieldCheckIcon, ShoppingBagIcon, HeartIcon } from './Icons';
import { BRAND_INFO } from '../data/mockData';

export default function Header({ 
  user, 
  onOpenLogin, 
  onOpenSignUp,
  onLogout, 
  onNavigate, 
  activeTab, 
  onOpenApplyModal,
  onOpenMembershipModal,
  onOpenAdmin,
  onOpenMallModal,
  menuVisibility
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

  const allNavItems = [
    { id: 'registration', label: '동물등록', badge: '필수' },
    { id: 'partners', label: '반려생활' },
    { id: 'travel', label: '반려여행' },
    { id: 'farewell', label: '아름다운 이별' },
    { id: 'membership', label: '슬반생멤버십', highlight: true },
    { id: 'mall', label: '슬반생몰', badge: '특가', isMall: true },
    { id: 'adoption', label: '새로운 만남', isSubService: true },
  ];

  const navItems = allNavItems.filter(item => {
    if (!menuVisibility) return true;
    return menuVisibility[item.id] !== false;
  });

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#144A42] text-[#E8DEC8] text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 text-center font-medium tracking-wide flex items-center justify-center gap-1.5 sm:gap-2">
        <span className="inline-block w-1.5 h-1.5 bg-[#E8DEC8] animate-pulse flex-shrink-0"></span>
        <span className="truncate">슬반생 동물등록 및 프리미엄 멤버십 사전신청 오픈!</span>
        <button 
          onClick={onOpenMembershipModal}
          className="ml-1 sm:ml-2 text-white underline underline-offset-2 hover:text-[#F3EFE6] text-[10px] sm:text-[11px] flex-shrink-0"
        >
          혜택 보기 →
        </button>
      </div>

      {/* Main Navigation Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#F4F0E8]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-2 sm:py-3 border-b border-[#E5DFD1]' 
          : 'bg-[#F4F0E8] border-b border-[#E5DFD1] py-2.5 sm:py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo (Standalone Image) */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left group py-0.5"
            aria-label="슬반생 홈"
          >
            <LogoEmblem className="h-[53px] sm:h-[58px] w-auto group-hover:scale-105 transition-transform" />
          </button>

          {/* Desktop Navigation Menus */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navItems.map((item) => {
              if (item.isSubService) {
                const isActive = activeTab === item.id;
                return (
                  <React.Fragment key={item.id}>
                    <div className="h-3.5 w-px bg-[#D6CFC1] mx-1 shrink-0" aria-hidden="true" />
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`relative px-2.5 py-2 text-[13.5px] transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'font-bold text-[#144A42]'
                          : 'font-medium text-[#66736D] hover:text-[#144A42]'
                      }`}
                      title="새로운 만남 (안심 입양 안내)"
                    >
                      <HeartIcon className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? 'text-[#144A42]' : 'text-[#9AA5A0]'}`} />
                      <span>{item.label}</span>
                    </button>
                  </React.Fragment>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative transition-all cursor-pointer ${
                    item.isMall
                      ? activeTab === item.id
                        ? 'ml-1 px-4 py-2 text-[15px] font-extrabold bg-[#0D3832] text-[#FDE68A] border border-[#C5A880] shadow-md flex items-center gap-1.5'
                        : 'ml-1 px-4 py-2 text-[15px] font-extrabold bg-[#144A42] text-white hover:bg-[#0D3832] border border-[#C5A880]/80 shadow-sm flex items-center gap-1.5 hover:-translate-y-0.5'
                      : activeTab === item.id 
                      ? 'px-3.5 py-2 text-[15px] font-bold text-[#144A42] bg-[#F4F1EA] border-b-2 border-[#144A42]' 
                      : item.highlight
                      ? 'px-3.5 py-2 text-[15px] font-semibold text-[#B48B55] hover:text-[#144A42] hover:bg-[#F8F6F0]'
                      : 'px-3.5 py-2 text-[15px] font-semibold text-[#2D3732] hover:text-[#144A42] hover:bg-[#F8F6F0]'
                  }`}
                >
                  {item.isMall && (
                    <ShoppingBagIcon className="w-4 h-4 text-[#C5A880] shrink-0" />
                  )}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`absolute -top-1.5 -right-1 text-[9px] font-extrabold px-1.5 py-0.2 shadow-2xs ${
                      item.isMall ? 'bg-[#E11D48] text-white animate-pulse' : 'bg-[#E11D48] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <button
                onClick={() => handleNavClick('mypage')}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#1F2C27] bg-transparent hover:bg-black/5 px-3 py-1.5 transition border border-[#D0C9BD]"
                title={`${user.name}님 마이페이지`}
              >
                <UserIcon className="w-3.5 h-3.5 text-[#1F2C27]" />
                <span className="font-bold">{user.name}님</span>
                <span className="text-[#144A42] text-[11px] font-bold bg-[#E8E0D1] px-1.5 py-0.2">MY</span>
              </button>
            ) : (
              <div className="flex items-center text-sm font-medium text-[#4A5550] divide-x divide-gray-300">
                <button 
                  onClick={onOpenLogin}
                  className="px-2.5 py-1 hover:text-[#144A42] transition text-xs font-semibold"
                >
                  로그인
                </button>
                <button 
                  onClick={onOpenSignUp || onOpenLogin}
                  className="px-2.5 py-1 text-[#144A42] hover:underline transition text-xs font-bold"
                >
                  회원가입
                </button>
              </div>
            )}
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
          <div className="md:hidden border-t border-[#E5DFD1] bg-[#F4F0E8] px-5 py-4 space-y-3 shadow-xl">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#E5DFD1]">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3 py-2.5 text-sm font-semibold transition flex items-center justify-between ${
                    item.isMall
                      ? activeTab === item.id
                        ? 'col-span-2 bg-[#0D3832] text-[#FDE68A] font-extrabold border border-[#C5A880] shadow-sm'
                        : 'col-span-2 bg-[#144A42] text-white font-extrabold border border-[#C5A880]/70 shadow-xs'
                      : activeTab === item.id
                      ? 'bg-[#144A42] text-white'
                      : item.isSubService
                      ? 'bg-[#F8F6F1] text-[#5A6862]'
                      : 'bg-[#F8F6F1] text-[#242A27]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.isMall && <ShoppingBagIcon className="w-4 h-4 text-[#C5A880]" />}
                    {item.isSubService && <HeartIcon className={`w-3.5 h-3.5 ${activeTab === item.id ? 'text-white' : 'text-[#84796D]'}`} />}
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-[#E11D48] text-white">
                      {item.badge}
                    </span>
                  )}
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
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                    className="text-xs font-semibold text-[#144A42]"
                  >
                    로그인
                  </button>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); (onOpenSignUp || onOpenLogin)(); }}
                    className="text-xs font-bold text-[#144A42] underline"
                  >
                    회원가입
                  </button>
                </div>
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
