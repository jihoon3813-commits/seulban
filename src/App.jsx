import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import RegistrationPage from './pages/RegistrationPage';
import AdoptionPage from './pages/AdoptionPage';
import PartnersPage from './pages/PartnersPage';
import TravelPage from './pages/TravelPage';
import FarewellPage from './pages/FarewellPage';
import MembershipPage from './pages/MembershipPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';

import { 
  ApplyRegistrationModal, 
  MembershipModal, 
  PartnerModal, 
  LoginModal, 
  AdminModal 
} from './components/Modals';

import { PhoneIcon, SparklesIcon, PawIcon, MessageSquare } from './components/Icons';
import { 
  INITIAL_PET, 
  INITIAL_APPLICATION, 
  BRAND_INFO, 
  PARTNER_LIST, 
  ADOPTION_LIST, 
  TRAVEL_LIST 
} from './data/mockData';
export default function App() {
  // URL Parameter based initial tab check (?page=admin, #admin, /admin, etc.)
  const getInitialTab = () => {
    if (typeof window === 'undefined') return 'home';
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    if (page) return page;

    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (hash) return hash;
    }

    if (window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }

    return 'home';
  };

  // Navigation
  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 메뉴/페이지 전환 시 스크롤 애니메이션 없이 즉시 맨 상단 표시
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // User State
  const [user, setUser] = useState({
    name: '김슬기',
    email: 'demo@seulbanlife.com',
    phone: '010-9876-5432',
    isMember: true,
  });

  // Pet Profile State
  const [pet, setPet] = useState(INITIAL_PET);

  // Applications State (REG-004)
  const [applications, setApplications] = useState([INITIAL_APPLICATION]);

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState(['p1', 'p2']);

  // Dynamic Content States (Controlled by Admin)
  const [partners, setPartners] = useState(() => {
    const saved = localStorage.getItem('seulban_partners');
    return saved ? JSON.parse(saved) : PARTNER_LIST;
  });

  const [adoptionList, setAdoptionList] = useState(() => {
    const saved = localStorage.getItem('seulban_adoption');
    return saved ? JSON.parse(saved) : ADOPTION_LIST;
  });

  const [travelList, setTravelList] = useState(() => {
    const saved = localStorage.getItem('seulban_travel');
    return saved ? JSON.parse(saved) : TRAVEL_LIST;
  });

  const [brandInfo, setBrandInfo] = useState(() => {
    const saved = localStorage.getItem('seulban_brand');
    return saved ? JSON.parse(saved) : BRAND_INFO;
  });

  // Modals
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Floating consult widget state
  const [floatingMenuOpen, setFloatingMenuOpen] = useState(false);

  // Toast message
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApplySuccess = (newApp, newPet) => {
    setApplications([newApp, ...applications]);
    if (newPet) {
      setPet({
        ...INITIAL_PET,
        ...newPet,
        id: `pet_${Date.now()}`
      });
    }
    showToast('동물등록 신청서가 성공적으로 접수되었습니다!');
  };

  const handleLeadSubmit = (leadData) => {
    showToast(`${leadData.name}님, 멤버십 사전예약 혜택이 정상 접수되었습니다!`);
  };

  const handleToggleBookmark = (id) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter(b => b !== id));
      showToast('찜 목록에서 제거되었습니다.');
    } else {
      setBookmarks([...bookmarks, id]);
      showToast('제휴처를 찜 목록에 저장했습니다.');
    }
  };

  const handleUpdateAppStatus = (appId, newStatusCode) => {
    const statusMap = {
      SUBMITTED: '접수 완료',
      REVIEWING: '서류 검수 중',
      ACCEPTED: '처리 승인 (지자체 심사)',
      REGISTERED: '등록번호 발급 완료',
      SHIPPING: '인식표 배송 출발 (우체국)',
      COMPLETED: '처리 완료',
    };

    setApplications(applications.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          statusCode: newStatusCode,
          statusLabel: statusMap[newStatusCode] || newStatusCode,
          history: [
            { 
              date: '방금 전', 
              title: `상태 변경: ${statusMap[newStatusCode]}`, 
              desc: '관리자 콘솔에서 변경 처리되었습니다.' 
            },
            ...app.history
          ]
        };
      }
      return app;
    }));
    showToast(`접수건(${appId}) 상태가 [${statusMap[newStatusCode]}]로 변경되었습니다.`);
  };

  const handleAddPartner = (newPartner) => {
    const updated = [newPartner, ...partners];
    setPartners(updated);
    localStorage.setItem('seulban_partners', JSON.stringify(updated));
  };

  const handleDeletePartner = (id) => {
    const updated = partners.filter(p => p.id !== id);
    setPartners(updated);
    localStorage.setItem('seulban_partners', JSON.stringify(updated));
    showToast('제휴처가 삭제되었습니다.');
  };

  const handleAddAdoption = (newAnimal) => {
    const updated = [newAnimal, ...adoptionList];
    setAdoptionList(updated);
    localStorage.setItem('seulban_adoption', JSON.stringify(updated));
  };

  const handleDeleteAdoption = (id) => {
    const updated = adoptionList.filter(a => a.id !== id);
    setAdoptionList(updated);
    localStorage.setItem('seulban_adoption', JSON.stringify(updated));
    showToast('입양 동물이 삭제되었습니다.');
  };

  const handleAddTravel = (newTravel) => {
    const updated = [newTravel, ...travelList];
    setTravelList(updated);
    localStorage.setItem('seulban_travel', JSON.stringify(updated));
  };

  const handleDeleteTravel = (id) => {
    const updated = travelList.filter(t => t.id !== id);
    setTravelList(updated);
    localStorage.setItem('seulban_travel', JSON.stringify(updated));
    showToast('동반 숙소가 삭제되었습니다.');
  };

  const handleUpdateBrandInfo = (newBrand) => {
    setBrandInfo(newBrand);
    localStorage.setItem('seulban_brand', JSON.stringify(newBrand));
  };

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo(0, 0);
    try {
      const url = new URL(window.location.href);
      if (tabId === 'home') {
        url.searchParams.delete('page');
        url.hash = '';
      } else {
        url.searchParams.set('page', tabId);
      }
      window.history.pushState({}, '', url.toString());
    } catch (e) {
      // ignore
    }
  };

  // Open Admin in a new window/tab
  const handleOpenAdmin = () => {
    const adminUrl = new URL(window.location.href);
    adminUrl.searchParams.set('page', 'admin');
    window.open(adminUrl.toString(), '_blank');
  };

  // If in admin mode, show full-screen AdminPage
  if (activeTab === 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F0E8] text-[#1D2522]">
        {toast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#144A42] text-white px-6 py-3 shadow-2xl text-xs font-bold flex items-center gap-2 animate-fade-in border border-[#2D665D]">
            <span className="w-2 h-2 bg-[#C5A880]"></span>
            <span>{toast}</span>
          </div>
        )}

        <AdminPage 
          onNavigateHome={() => {
            handleNavigate('home');
            window.location.href = window.location.origin + window.location.pathname;
          }}
          applications={applications}
          onUpdateAppStatus={handleUpdateAppStatus}
          partners={partners}
          onAddPartner={handleAddPartner}
          onDeletePartner={handleDeletePartner}
          adoptionList={adoptionList}
          onAddAdoption={handleAddAdoption}
          onDeleteAdoption={handleDeleteAdoption}
          travelList={travelList}
          onAddTravel={handleAddTravel}
          onDeleteTravel={handleDeleteTravel}
          brandInfo={brandInfo}
          onUpdateBrandInfo={handleUpdateBrandInfo}
          showToast={showToast}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F0E8] text-[#1D2522]">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#144A42] text-white px-6 py-3 shadow-2xl text-xs font-bold flex items-center gap-2 animate-fade-in border border-[#2D665D]">
          <span className="w-2 h-2 bg-[#C5A880]"></span>
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <Header 
        user={user}
        onOpenLogin={() => setLoginModalOpen(true)}
        onLogout={() => { setUser(null); showToast('로그아웃 되었습니다.'); }}
        onNavigate={handleNavigate}
        activeTab={activeTab}
        onOpenApplyModal={() => setApplyModalOpen(true)}
        onOpenMembershipModal={() => setMembershipModalOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Page View */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home 
            onOpenApplyModal={() => setApplyModalOpen(true)}
            onOpenMembershipModal={() => setMembershipModalOpen(true)}
            onOpenPartnerModal={(partner) => setSelectedPartner(partner)}
            onNavigate={handleNavigate}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            partners={partners}
          />
        )}

        {activeTab === 'registration' && (
          <RegistrationPage 
            onOpenApplyModal={() => setApplyModalOpen(true)}
          />
        )}

        {activeTab === 'adoption' && (
          <AdoptionPage 
            adoptionList={adoptionList}
          />
        )}

        {activeTab === 'partners' && (
          <PartnersPage 
            onOpenPartnerModal={(partner) => setSelectedPartner(partner)}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            partners={partners}
          />
        )}

        {activeTab === 'travel' && (
          <TravelPage 
            travelList={travelList}
          />
        )}

        {activeTab === 'farewell' && (
          <FarewellPage />
        )}

        {activeTab === 'membership' && (
          <MembershipPage 
            onOpenMembershipModal={() => setMembershipModalOpen(true)}
          />
        )}

        {activeTab === 'mypage' && (
          <MyPage 
            user={user}
            pet={pet}
            applications={applications}
            bookmarks={bookmarks}
            onOpenApplyModal={() => setApplyModalOpen(true)}
            onOpenPartnerModal={(partner) => setSelectedPartner(partner)}
            onLogout={() => { setUser(null); setActiveTab('home'); showToast('로그아웃 되었습니다.'); }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onOpenAdmin={handleOpenAdmin}
        onNavigate={handleNavigate}
      />

      {/* Mobile Fixed Bottom Navigation (기획서 5.2 모바일 5대 내비게이션) */}
      <MobileNav 
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />

      {/* Floating Action Button (우측 하단 상담 플로팅 버튼 기획서 6.3) */}
      <div className="fixed right-5 bottom-20 md:bottom-8 z-30 flex flex-col items-end gap-2">
        {floatingMenuOpen && (
          <div className="bg-white p-4 shadow-2xl border border-[#ECE5D8] w-64 space-y-2.5 animate-fade-in text-xs">
            <div className="font-bold text-[#144A42] border-b border-gray-100 pb-2 flex justify-between items-center">
              <span>슬반생 고객센터 & 긴급상담</span>
              <span className="w-2 h-2 bg-emerald-500"></span>
            </div>
            
            <a 
              href={`tel:${BRAND_INFO.phone1}`}
              className="flex items-center gap-2 p-2.5 bg-[#FAF8F5] hover:bg-[#F3EFE6] transition text-[#2C3B35] font-semibold"
            >
              <PhoneIcon className="w-4 h-4 text-[#144A42]" />
              <div>
                <span>일반 상담: {BRAND_INFO.phone1}</span>
                <p className="text-[10px] text-gray-400 font-normal">평일 09:00 ~ 18:00</p>
              </div>
            </a>

            <a 
              href={`tel:${BRAND_INFO.phone2}`}
              className="flex items-center gap-2 p-2.5 bg-[#EAF5F2] hover:bg-[#DCEDE9] transition text-[#144A42] font-semibold"
            >
              <PhoneIcon className="w-4 h-4 text-[#144A42]" />
              <div>
                <span>24시 긴급 응급/장례 직통</span>
                <p className="text-[10px] text-emerald-700 font-normal">연중무휴 24시간 실시간 지원</p>
              </div>
            </a>

            <button
              onClick={() => { setFloatingMenuOpen(false); setApplyModalOpen(true); }}
              className="w-full py-2.5 bg-[#144A42] text-white font-bold text-center hover:bg-[#0D3832]"
            >
              동물등록 바로 신청하기
            </button>
          </div>
        )}

        <button
          onClick={() => setFloatingMenuOpen(!floatingMenuOpen)}
          className="w-13 h-13 p-3 bg-[#144A42] hover:bg-[#0D3832] text-white flex items-center justify-center shadow-xl transition-all transform hover:scale-105 border border-[#C5A880]"
          aria-label="상담 플로팅 버튼"
          title="상담 센터"
        >
          <PhoneIcon className="w-6 h-6 text-[#C5A880]" />
        </button>
      </div>

      {/* Modals */}
      <ApplyRegistrationModal 
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onApplySuccess={handleApplySuccess}
      />

      <MembershipModal 
        isOpen={membershipModalOpen}
        onClose={() => setMembershipModalOpen(false)}
        onLeadSubmit={handleLeadSubmit}
      />

      <PartnerModal 
        partner={selectedPartner}
        isOpen={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={selectedPartner ? bookmarks.includes(selectedPartner.id) : false}
      />

      <LoginModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={(userData) => { setUser(userData); showToast(`${userData.name}님 환영합니다!`); }}
      />

      <AdminModal 
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        applications={applications}
        onUpdateAppStatus={handleUpdateAppStatus}
      />

    </div>
  );
}
