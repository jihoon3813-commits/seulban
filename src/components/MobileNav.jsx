import React from 'react';
import { HomeIcon, PawIcon, SparklesIcon, ScissorsIcon, UserIcon } from './Icons';

export default function MobileNav({ activeTab, onNavigate }) {
  const tabs = [
    { id: 'home', label: '홈', icon: HomeIcon },
    { id: 'registration', label: '동물등록', icon: PawIcon, isHighlight: true },
    { id: 'membership', label: '혜택', icon: SparklesIcon },
    { id: 'partners', label: '반려생활', icon: ScissorsIcon },
    { id: 'mypage', label: 'MY', icon: UserIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE6DD] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center justify-center py-1 group relative"
            >
              {tab.isHighlight ? (
                <div className={`-mt-5 w-11 h-11 flex items-center justify-center shadow-md transition-transform border border-black/10 ${
                  isActive ? 'bg-[#144A42] text-white scale-105' : 'bg-[#C5A880] text-[#144A42]'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              ) : (
                <Icon className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-[#144A42]' : 'text-[#8A9590]'
                }`} />
              )}
              <span className={`text-[11px] mt-1 font-medium transition-colors ${
                isActive ? 'text-[#144A42] font-bold' : 'text-[#7A8580]'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
