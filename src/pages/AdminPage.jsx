import React, { useState } from 'react';
import { 
  LogoEmblem, PawIcon, HeartIcon, HomeIcon, ScissorsIcon, 
  StethoscopeIcon, FlowerIcon, SparklesIcon, ShieldCheckIcon, 
  CheckIcon, XIcon, SearchIcon, PhoneIcon, MapPinIcon, 
  ArrowRight, ClockIcon, UserIcon, ExternalLinkIcon
} from '../components/Icons';
import { compressImage } from '../utils/imageCompressor';
import { BRAND_INFO } from '../data/mockData';

export default function AdminPage({
  onNavigateHome,
  applications,
  onUpdateAppStatus,
  onUpdateApplication,
  onDeleteApplication,
  partners,
  onAddPartner,
  onUpdatePartner,
  onDeletePartner,
  adoptionList,
  onAddAdoption,
  onUpdateAdoption,
  onDeleteAdoption,
  travelList,
  onAddTravel,
  onUpdateTravel,
  onDeleteTravel,
  popups = [],
  onAddPopup,
  onDeletePopup,
  onTogglePopup,
  brandInfo,
  onUpdateBrandInfo,
  showToast
}) {
  // Admin Authentication State
  const [adminAuth, setAdminAuth] = useState(() => {
    const saved = localStorage.getItem('seulban_admin_auth');
    return saved ? JSON.parse(saved) : { isLoggedIn: false };
  });

  // Admin Credentials saved in localStorage
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('seulban_admin_pwd') || 'admin1234';
  });
  const [adminUsername, setAdminUsername] = useState(() => {
    return localStorage.getItem('seulban_admin_user') || 'admin';
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({ id: '', pwd: '' });
  const [loginError, setLoginError] = useState('');

  // Current admin menu tab
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Application search & filter state
  const [appFilter, setAppFilter] = useState('ALL');
  const [appSearch, setAppSearch] = useState('');

  // Modals for adding items
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [partnerImageMode, setPartnerImageMode] = useState('upload'); // 'upload' | 'url'
  const [newPartner, setNewPartner] = useState({
    name: '',
    category: 'hospital',
    categoryName: '동물병원',
    tag: '우수 제휴처',
    location: '서울',
    benefit: '진료비 15% 할인',
    desc: '전문 진료 및 친절한 케어 제공',
    rating: 4.9,
    reviews: 50,
    phone: '02-000-0000',
    color: 'bg-[#EBF3FB] text-[#2563EB]',
    icon: 'stethoscope',
    imageUrl: '',
    featured: false
  });

  const handlePartnerImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 800, 0.8);
      setNewPartner(prev => ({ ...prev, imageUrl: compressed }));
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPartner(prev => ({ ...prev, imageUrl: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Modals for editing partner
  const [isEditPartnerOpen, setIsEditPartnerOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [editPartnerImageMode, setEditPartnerImageMode] = useState('upload'); // 'upload' | 'url'

  const handleEditPartnerImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 800, 0.8);
      setEditingPartner(prev => ({ ...prev, imageUrl: compressed }));
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingPartner(prev => ({ ...prev, imageUrl: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Application edit modal state
  const [isEditAppOpen, setIsEditAppOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  // Adoption modal state with image upload
  const [isAddAdoptionOpen, setIsAddAdoptionOpen] = useState(false);
  const [adoptionImageMode, setAdoptionImageMode] = useState('upload'); // 'upload' | 'url'
  const [newAdoption, setNewAdoption] = useState({
    name: '',
    breed: '믹스견',
    gender: '남아 (중성화 완료)',
    age: '1살 추정',
    weight: '6.5kg',
    center: '한국 동물사랑나눔 보호센터',
    story: '애교가 많고 온순하여 가족을 기다리는 착한 친구입니다.',
    tags: '애교만점, 사회성 우수',
    status: '입양 상담 가능',
    photoUrl: ''
  });

  const handleAdoptionImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 800, 0.8);
      setNewAdoption(prev => ({ ...prev, photoUrl: compressed }));
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewAdoption(prev => ({ ...prev, photoUrl: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [isEditAdoptionOpen, setIsEditAdoptionOpen] = useState(false);
  const [editingAdoption, setEditingAdoption] = useState(null);
  const [editAdoptionImageMode, setEditAdoptionImageMode] = useState('upload');

  const handleEditAdoptionImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 800, 0.8);
      setEditingAdoption(prev => ({ ...prev, photoUrl: compressed }));
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingAdoption(prev => ({ ...prev, photoUrl: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Travel edit modal state
  const [isAddTravelOpen, setIsAddTravelOpen] = useState(false);
  const [travelImageMode, setTravelImageMode] = useState('upload'); // 'upload' | 'url'
  const [newTravel, setNewTravel] = useState({
    type: '리조트',
    name: '',
    location: '',
    weightLimit: '전 견종 가능',
    price: '150,000원~',
    features: '천연잔디 운동장, 수영장, 바베큐',
    memberBenefit: '주중 20% 특별 우대',
    phone: '033-000-0000',
    imageUrl: '',
  });

  const handleTravelImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 800, 0.8);
      setNewTravel(prev => ({ ...prev, imageUrl: compressed }));
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewTravel(prev => ({ ...prev, imageUrl: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [isEditTravelOpen, setIsEditTravelOpen] = useState(false);
  const [editingTravel, setEditingTravel] = useState(null);
  const [editTravelImageMode, setEditTravelImageMode] = useState('upload');

  const handleEditTravelImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 800, 0.8);
      setEditingTravel(prev => ({ ...prev, imageUrl: compressed }));
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingTravel(prev => ({ ...prev, imageUrl: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Popup Management State (3:4 Ratio Popups)
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [popupImageMode, setPopupImageMode] = useState('upload'); // 'upload' | 'url'
  const [newPopup, setNewPopup] = useState({
    title: '',
    imageUrl: '',
    linkType: 'none', // 'none' | 'url' | 'internal'
    linkUrl: '',
    internalTab: 'registration',
    active: true,
  });

  const handlePopupImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // 3:4 ratio popups, max 600x800
      const compressed = await compressImage(file, 600, 800, 0.8);
      setNewPopup(prev => ({ ...prev, imageUrl: compressed }));
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setNewPopup(prev => ({ ...prev, imageUrl: uploadEvent.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPopupHide7Days = () => {
    localStorage.removeItem('seulban_hide_popup_until');
    if (showToast) {
      showToast('7일간 보지 않기 설정이 초기화되어 팝업이 다시 메인에 노출됩니다.');
    } else {
      alert('7일간 보지 않기 설정이 초기화되었습니다.');
    }
  };

  // Password change settings state
  const [pwdForm, setPwdForm] = useState({
    currentPwd: '',
    newUsername: adminUsername,
    newPwd: '',
    confirmPwd: ''
  });

  // Brand, SEO & Footer edit state
  const [brandForm, setBrandForm] = useState(() => ({
    ...BRAND_INFO,
    ...(brandInfo || {})
  }));

  React.useEffect(() => {
    if (brandInfo) {
      setBrandForm(prev => ({
        ...BRAND_INFO,
        ...prev,
        ...brandInfo
      }));
    }
  }, [brandInfo]);

  // SEO & Footer Settings Sub-tabs: 'seo' | 'preview' | 'footer'
  const [seoInnerTab, setSeoInnerTab] = useState('seo');
  const [ogImageMode, setOgImageMode] = useState('upload'); // 'upload' | 'url'
  const [faviconMode, setFaviconMode] = useState('upload'); // 'upload' | 'url'

  const handleOgImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // 1200x630 ratio compressed image
      const compressed = await compressImage(file, 1200, 630, 0.85);
      setBrandForm(prev => ({ ...prev, ogImage: compressed }));
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setBrandForm(prev => ({ ...prev, ogImage: uploadEvent.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // 128x128 favicon
      const compressed = await compressImage(file, 128, 128, 0.9);
      setBrandForm(prev => ({ ...prev, favicon: compressed }));
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setBrandForm(prev => ({ ...prev, favicon: uploadEvent.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.id.trim() === adminUsername && loginForm.pwd === adminPassword) {
      const authData = { isLoggedIn: true, loginTime: new Date().toISOString() };
      setAdminAuth(authData);
      localStorage.setItem('seulban_admin_auth', JSON.stringify(authData));
      setLoginError('');
      showToast('관리자 시스템에 로그인되었습니다.');
    } else {
      setLoginError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setAdminAuth({ isLoggedIn: false });
    localStorage.removeItem('seulban_admin_auth');
    showToast('관리자 로그아웃 되었습니다.');
  };

  // Handle Password & Admin Account Update
  const handleUpdateSecurity = (e) => {
    e.preventDefault();
    if (pwdForm.currentPwd !== adminPassword) {
      alert('현재 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (pwdForm.newPwd && pwdForm.newPwd.length < 4) {
      alert('새 비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }
    if (pwdForm.newPwd && pwdForm.newPwd !== pwdForm.confirmPwd) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (pwdForm.newUsername.trim()) {
      setAdminUsername(pwdForm.newUsername.trim());
      localStorage.setItem('seulban_admin_user', pwdForm.newUsername.trim());
    }
    if (pwdForm.newPwd) {
      setAdminPassword(pwdForm.newPwd);
      localStorage.setItem('seulban_admin_pwd', pwdForm.newPwd);
    }

    setPwdForm({
      currentPwd: '',
      newUsername: pwdForm.newUsername.trim() || adminUsername,
      newPwd: '',
      confirmPwd: ''
    });

    showToast('관리자 로그인 계정 및 비밀번호 설정이 안전하게 변경되었습니다.');
  };

  // Status mapping
  const statuses = [
    { code: 'SUBMITTED', label: '접수 완료', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { code: 'REVIEWING', label: '서류 검수 중', color: 'bg-orange-100 text-orange-900 border-orange-300' },
    { code: 'ACCEPTED', label: '처리 승인 (심사)', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    { code: 'REGISTERED', label: '등록번호 발급', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    { code: 'SHIPPING', label: '배송 출발 (우체국)', color: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
    { code: 'COMPLETED', label: '처리 완료', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  ];

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const matchStatus = appFilter === 'ALL' || app.statusCode === appFilter;
    const matchSearch = !appSearch || 
      app.id.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.ownerName.includes(appSearch) ||
      app.petName.includes(appSearch) ||
      app.phone.includes(appSearch);
    return matchStatus && matchSearch;
  });

  // If not logged in, show Dedicated Admin Login Screen
  if (!adminAuth.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F4F0E8] flex flex-col items-center justify-center p-4">
        {/* Top return to main button */}
        <div className="w-full max-w-md mb-4 flex justify-between items-center text-xs">
          <button
            onClick={() => {
              try {
                if (window.opener && !window.opener.closed) {
                  window.opener.focus();
                  window.close();
                } else {
                  onNavigateHome();
                }
              } catch (e) {
                onNavigateHome();
              }
            }}
            className="flex items-center gap-1.5 text-[#144A42] hover:underline font-semibold"
          >
            <span>← 슬반생 서비스 홈으로 돌아가기</span>
          </button>
          <span className="text-gray-400">보안 관리자 콘솔</span>
        </div>

        {/* Login Box */}
        <div className="bg-white w-full max-w-md border border-[#DDD5C7] shadow-xl p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-1">
              <LogoEmblem className="h-12 w-auto shadow-sm" />
            </div>
            <span className="text-[11px] font-bold tracking-widest text-[#B48B55] uppercase block">
              SEULBAN MANAGEMENT SYSTEM
            </span>
            <h1 className="text-2xl font-black text-[#142C27] tracking-tight">
              슬반생 통합 관리자 로그인
            </h1>
            <p className="text-xs text-[#6B7973]">
              승인된 관리자 계정으로 로그인하여 전체 서비스를 운영/관리하세요.
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#2C3833] mb-1.5">관리자 아이디</label>
              <input
                type="text"
                value={loginForm.id}
                onChange={(e) => setLoginForm({ ...loginForm, id: e.target.value })}
                placeholder="관리자 ID (기본: admin)"
                className="w-full px-4 py-3 border border-[#D5CFC2] focus:border-[#144A42] focus:ring-1 focus:ring-[#144A42] bg-[#FAF8F5] text-sm focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#2C3833] mb-1.5">비밀번호</label>
              <input
                type="password"
                value={loginForm.pwd}
                onChange={(e) => setLoginForm({ ...loginForm, pwd: e.target.value })}
                placeholder="비밀번호 (기본: admin1234)"
                className="w-full px-4 py-3 border border-[#D5CFC2] focus:border-[#144A42] focus:ring-1 focus:ring-[#144A42] bg-[#FAF8F5] text-sm focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#144A42] text-white font-bold text-sm hover:bg-[#0D3832] transition shadow-md mt-2 flex items-center justify-center gap-2"
            >
              <span>관리자 콘솔 접속</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-center space-y-1.5 text-[11px] text-gray-400">
            <p>초기 관리자 계정: <span className="text-[#144A42] font-semibold">{adminUsername}</span> / 비밀번호: <span className="text-[#144A42] font-semibold">{adminPassword}</span></p>
            <p className="text-gray-400">로그인 후 [설정] 메뉴에서 비밀번호를 언제든 변경하실 수 있습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Admin Dashboard View
  return (
    <div className="min-h-screen bg-[#F4F0E8] text-[#1D2522] flex flex-col">
      
      {/* Admin Top Navigation Bar */}
      <header className="bg-[#142C27] text-white border-b border-[#22443C] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-2.5 cursor-pointer group" 
              onClick={() => setCurrentTab('dashboard')}
              title="슬반생 관리자 대시보드"
            >
              <LogoEmblem bright={true} className="h-9 sm:h-10 w-auto group-hover:scale-105 transition-transform" />
              <span className="text-[11px] px-2 py-0.5 bg-[#2A4D45] text-[#D4AF7A] font-bold tracking-wider border border-[#3E655B] rounded-sm uppercase">
                ADMIN
              </span>
            </div>

            {/* Menu Tabs in Header */}
            <nav className="hidden lg:flex items-center gap-1 ml-6 text-xs font-semibold">
              {[
                { id: 'dashboard', label: '대시보드 요약' },
                { id: 'applications', label: `동물등록 관리 (${applications.length})` },
                { id: 'popups', label: `팝업 관리 (${popups.length})` },
                { id: 'partners', label: `제휴처 관리 (${partners.length})` },
                { id: 'adoption', label: `안심입양 관리 (${adoptionList.length})` },
                { id: 'travel', label: `반려여행 관리 (${travelList.length})` },
                { id: 'brand', label: '사이트·SEO 설정' },
                { id: 'settings', label: '보안·계정설정' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-3 py-2 transition border-b-2 ${
                    currentTab === tab.id
                      ? 'border-[#D4AF7A] text-[#D4AF7A] bg-white/5 font-bold'
                      : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#1F3D36] hover:bg-[#284E45] text-gray-200 border border-[#2D564D] flex items-center gap-1.5 transition cursor-pointer"
              title="사용자 화면 새 창으로 열기"
            >
              <ExternalLinkIcon className="w-3.5 h-3.5" />
              <span>사용자 화면 보기</span>
            </a>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-900/40 hover:bg-red-900/70 text-red-200 border border-red-700/50 transition font-semibold"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* Mobile Tab Scroll Menu */}
        <div className="lg:hidden flex overflow-x-auto no-scrollbar px-4 py-2 bg-[#0F221E] border-t border-[#1C3A33] text-xs gap-2">
          {[
            { id: 'dashboard', label: '대시보드' },
            { id: 'applications', label: '동물등록' },
            { id: 'popups', label: '팝업관리' },
            { id: 'partners', label: '제휴처' },
            { id: 'adoption', label: '안심입양' },
            { id: 'travel', label: '반려여행' },
            { id: 'brand', label: '사이트·SEO' },
            { id: 'settings', label: '비밀번호설정' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-3 py-1.5 whitespace-nowrap ${
                currentTab === tab.id
                  ? 'bg-[#D4AF7A] text-[#142C27] font-bold'
                  : 'bg-[#18312B] text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* ========================================================
            TAB 1: 대시보드 (DASHBOARD)
            ======================================================== */}
        {currentTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">OVERVIEW</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142C27] tracking-tight">
                  운영 현황 대시보드
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCurrentTab('popups')}
                  className="px-4 py-2 bg-white border border-[#D5CDBD] text-[#144A42] text-xs font-bold hover:bg-[#F3EFE6] transition flex items-center gap-1.5 shadow-xs"
                >
                  <SparklesIcon className="w-4 h-4 text-[#C5A880]" />
                  <span>팝업 관리</span>
                </button>
                <button
                  onClick={() => setCurrentTab('applications')}
                  className="px-4 py-2 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition flex items-center gap-1.5 shadow-xs"
                >
                  <PawIcon className="w-4 h-4 text-[#C5A880]" />
                  <span>동물등록 신청 바로보기</span>
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-6 border border-[#E2DDD3] shadow-xs">
                <span className="text-xs text-gray-500 font-medium">동물등록 접수 총계</span>
                <p className="text-3xl font-black text-[#144A42] mt-2">{applications.length}건</p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 w-fit">
                  <span>검수 대기: {applications.filter(a => a.statusCode === 'SUBMITTED' || a.statusCode === 'REVIEWING').length}건</span>
                </div>
              </div>

              <div 
                onClick={() => setCurrentTab('popups')}
                className="bg-white p-6 border border-[#E2DDD3] shadow-xs cursor-pointer hover:border-[#144A42] transition"
              >
                <span className="text-xs text-gray-500 font-medium">메인 팝업 관리</span>
                <p className="text-3xl font-black text-[#144A42] mt-2">{popups.length}개</p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 w-fit">
                  <span>노출 활성: {popups.filter(p => p.active !== false).length}개 (3:4)</span>
                </div>
              </div>

              <div className="bg-white p-6 border border-[#E2DDD3] shadow-xs">
                <span className="text-xs text-gray-500 font-medium">등록 제휴처</span>
                <p className="text-3xl font-black text-[#144A42] mt-2">{partners.length}곳</p>
                <p className="text-[11px] text-gray-500 mt-3">병원, 미용, 스파 제휴</p>
              </div>

              <div className="bg-white p-6 border border-[#E2DDD3] shadow-xs">
                <span className="text-xs text-gray-500 font-medium">안심 입양 등록</span>
                <p className="text-3xl font-black text-[#144A42] mt-2">{adoptionList.length}마리</p>
                <p className="text-[11px] text-gray-500 mt-3">공인 보호센터 연계</p>
              </div>

              <div className="bg-white p-6 border border-[#E2DDD3] shadow-xs">
                <span className="text-xs text-gray-500 font-medium">엄선 동반 여행지</span>
                <p className="text-3xl font-black text-[#144A42] mt-2">{travelList.length}곳</p>
                <p className="text-[11px] text-gray-500 mt-3">리조트, 독채펜션</p>
              </div>
            </div>

            {/* Quick Menu Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 border border-[#E2DDD3] shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#144A42]">
                  <PawIcon className="w-5 h-5 text-[#144A42]" />
                  <h3 className="font-bold text-base">동물등록 실시간 검수</h3>
                </div>
                <p className="text-xs text-[#5C6A64] leading-relaxed">
                  사용자가 웹에서 신청한 동물등록 신청서를 확인하고 상태(접수/검수/승인/배송/완료)를 변경하면 보호자 마이페이지에 실시간 반영됩니다.
                </p>
                <button
                  onClick={() => setCurrentTab('applications')}
                  className="w-full py-2.5 bg-[#FAF8F5] border border-[#DDD5C7] text-[#144A42] text-xs font-bold hover:bg-[#144A42] hover:text-white transition"
                >
                  신청 목록 검수하기 →
                </button>
              </div>

              <div className="bg-white p-6 border border-[#E2DDD3] shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#144A42]">
                  <HeartIcon className="w-5 h-5 text-red-500" filled />
                  <h3 className="font-bold text-base">콘텐츠 및 제휴처 관리</h3>
                </div>
                <p className="text-xs text-[#5C6A64] leading-relaxed">
                  [반려생활] 제휴 동물병원/미용실, [새로운 만남] 안심 입양 친구들, [반려여행] 숙소 정보를 직접 추가하거나 삭제 관리할 수 있습니다.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentTab('partners')}
                    className="flex-1 py-2.5 bg-[#FAF8F5] border border-[#DDD5C7] text-[#144A42] text-xs font-bold hover:bg-[#144A42] hover:text-white transition"
                  >
                    제휴처 관리
                  </button>
                  <button
                    onClick={() => setCurrentTab('adoption')}
                    className="flex-1 py-2.5 bg-[#FAF8F5] border border-[#DDD5C7] text-[#144A42] text-xs font-bold hover:bg-[#144A42] hover:text-white transition"
                  >
                    입양 관리
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 border border-[#E2DDD3] shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#144A42]">
                  <ShieldCheckIcon className="w-5 h-5 text-[#144A42]" />
                  <h3 className="font-bold text-base">보안 및 비밀번호 변경</h3>
                </div>
                <p className="text-xs text-[#5C6A64] leading-relaxed">
                  관리자 콘솔 접속용 아이디와 비밀번호를 손쉽게 변경하여 안전하게 시스템을 보호하고 운영할 수 있습니다.
                </p>
                <button
                  onClick={() => setCurrentTab('settings')}
                  className="w-full py-2.5 bg-[#FAF8F5] border border-[#DDD5C7] text-[#144A42] text-xs font-bold hover:bg-[#144A42] hover:text-white transition"
                >
                  비밀번호 설정 변경하기 →
                </button>
              </div>
            </div>

            {/* Recent 5 Applications */}
            <div className="bg-white border border-[#E2DDD3] p-6 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base text-[#142C27] flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-[#144A42]" />
                  <span>최근 접수된 동물등록 (최대 5건)</span>
                </h3>
                <button 
                  onClick={() => setCurrentTab('applications')} 
                  className="text-xs text-[#144A42] font-semibold hover:underline"
                >
                  전체 보기 →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-y border-[#E8E1D2] text-[#55645E]">
                    <tr>
                      <th className="p-3">접수번호</th>
                      <th className="p-3">보호자</th>
                      <th className="p-3">반려동물</th>
                      <th className="p-3">품종</th>
                      <th className="p-3">신청일</th>
                      <th className="p-3">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.slice(0, 5).map(app => (
                      <tr key={app.id} className="hover:bg-gray-50/80">
                        <td className="p-3 font-mono font-bold text-[#144A42]">{app.id}</td>
                        <td className="p-3 font-semibold">{app.ownerName}</td>
                        <td className="p-3 font-bold text-emerald-800">{app.petName}</td>
                        <td className="p-3 text-gray-500">{app.petBreed || '말티즈'}</td>
                        <td className="p-3 text-gray-400">{app.appliedDate}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 font-bold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {app.statusLabel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: 동물등록 신청 관리 (APPLICATIONS)
            ======================================================== */}
        {currentTab === 'applications' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">CRM & WORKFLOW</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142C27] tracking-tight">
                  동물등록 신청 및 검수 관리
                </h2>
                <p className="text-xs text-[#6B7973] mt-1">
                  접수된 신청서의 서류를 검수하고 승인/발급/배송 상태를 실시간 제어합니다.
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-5 border border-[#E2DDD3] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <button
                  onClick={() => setAppFilter('ALL')}
                  className={`px-3 py-1.5 text-xs font-bold transition ${
                    appFilter === 'ALL'
                      ? 'bg-[#144A42] text-white'
                      : 'bg-[#FAF8F5] text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  전체 ({applications.length})
                </button>
                {statuses.map(s => {
                  const count = applications.filter(a => a.statusCode === s.code).length;
                  return (
                    <button
                      key={s.code}
                      onClick={() => setAppFilter(s.code)}
                      className={`px-3 py-1.5 text-xs font-bold transition ${
                        appFilter === s.code
                          ? 'bg-[#144A42] text-white'
                          : 'bg-[#FAF8F5] text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {s.label} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full sm:w-72">
                <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="접수번호, 보호자명, 반려동물명..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 text-xs bg-[#FAF8F5] focus:outline-none focus:border-[#144A42]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#E2DDD3] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#E8E1D2] text-[#4A5751] font-bold">
                    <tr>
                      <th className="p-3.5">접수번호</th>
                      <th className="p-3.5">보호자 정보</th>
                      <th className="p-3.5">반려동물 정보</th>
                      <th className="p-3.5">등록 유형</th>
                      <th className="p-3.5">접수일시</th>
                      <th className="p-3.5">현재 상태</th>
                      <th className="p-3.5 text-right">상태 변경 처리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredApps.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-10 text-center text-gray-400 text-xs">
                          해당 조건에 맞는 동물등록 신청 내역이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/80 transition">
                          <td className="p-3.5 font-mono font-bold text-[#144A42]">{app.id}</td>
                          <td className="p-3.5">
                            <span className="font-bold text-[#1F2A26] block">{app.ownerName}</span>
                            <span className="text-[11px] text-gray-500 font-mono">{app.phone}</span>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              {app.petPhoto ? (
                                <img 
                                  src={app.petPhoto} 
                                  alt={app.petName} 
                                  className="w-9 h-9 object-cover rounded-sm border border-[#144A42] shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center shrink-0">
                                  <PawIcon className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-emerald-800 block">{app.petName}</span>
                                <span className="text-[11px] text-gray-500">
                                  {app.petBreed || '말티즈'} • {app.petGender || '남아'} ({app.petBirth || '2023.05.10'})
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-gray-700">
                            <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">
                              {app.type}
                            </span>
                          </td>
                          <td className="p-3.5 text-gray-500">{app.appliedDate}</td>
                          <td className="p-3.5">
                            <span className={`inline-block px-2.5 py-1 font-bold text-[11px] border ${
                              statuses.find(s => s.code === app.statusCode)?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {app.statusLabel}
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={app.statusCode}
                                onChange={(e) => onUpdateAppStatus(app.id, e.target.value)}
                                className="text-xs font-bold px-2.5 py-1.5 border border-[#D0C9BD] bg-white focus:outline-none focus:border-[#144A42] text-[#144A42]"
                              >
                                {statuses.map((s) => (
                                  <option key={s.code} value={s.code}>{s.label}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingApp({
                                    ...app,
                                    address: app.address || '',
                                    shippingAddress: app.shippingAddress || '',
                                    trackingNumber: app.trackingNumber || '',
                                  });
                                  setIsEditAppOpen(true);
                                }}
                                className="text-xs text-[#144A42] font-bold hover:text-[#0D3832] underline px-1.5 py-1"
                              >
                                수정
                              </button>
                              {onDeleteApplication && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`[${app.id} / ${app.petName}] 신청 내역을 정말 삭제하시겠습니까?`)) {
                                      onDeleteApplication(app.id);
                                    }
                                  }}
                                  className="text-xs text-red-500 hover:text-red-700 underline px-1.5 py-1"
                                >
                                  삭제
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: 동물등록 신청서 상세 수정 */}
            {isEditAppOpen && editingApp && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-lg shadow-2xl p-6 border border-[#ECE5D8] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-base text-[#144A42]">동물등록 신청서 정보 수정</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">접수번호: <span className="font-mono font-bold text-[#144A42]">{editingApp.id}</span></p>
                    </div>
                    <button onClick={() => { setIsEditAppOpen(false); setEditingApp(null); }} className="p-1 text-gray-400 hover:text-gray-700">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (onUpdateApplication) {
                      onUpdateApplication(editingApp);
                    }
                    setIsEditAppOpen(false);
                    setEditingApp(null);
                  }} className="space-y-3 text-xs">
                    
                    {/* 보호자 정보 */}
                    <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] space-y-2">
                      <span className="font-bold text-[#144A42] block">보호자 정보</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-medium text-gray-600 mb-1">보호자 이름</label>
                          <input
                            type="text"
                            value={editingApp.ownerName || ''}
                            onChange={(e) => setEditingApp({ ...editingApp, ownerName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-600 mb-1">연락처</label>
                          <input
                            type="text"
                            value={editingApp.phone || ''}
                            onChange={(e) => setEditingApp({ ...editingApp, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-600 mb-1">등록 주소</label>
                        <input
                          type="text"
                          value={editingApp.address || ''}
                          onChange={(e) => setEditingApp({ ...editingApp, address: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-gray-600 mb-1">인식표 배송 주소</label>
                        <input
                          type="text"
                          value={editingApp.shippingAddress || ''}
                          onChange={(e) => setEditingApp({ ...editingApp, shippingAddress: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 반려동물 정보 */}
                    <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] space-y-2">
                      <span className="font-bold text-[#144A42] block">반려동물 정보</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-medium text-gray-600 mb-1">반려동물 이름</label>
                          <input
                            type="text"
                            value={editingApp.petName || ''}
                            onChange={(e) => setEditingApp({ ...editingApp, petName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-600 mb-1">품종</label>
                          <input
                            type="text"
                            value={editingApp.petBreed || ''}
                            onChange={(e) => setEditingApp({ ...editingApp, petBreed: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block font-medium text-gray-600 mb-1">성별</label>
                          <input
                            type="text"
                            value={editingApp.petGender || ''}
                            onChange={(e) => setEditingApp({ ...editingApp, petGender: e.target.value })}
                            className="w-full px-2.5 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-600 mb-1">생년월일</label>
                          <input
                            type="text"
                            value={editingApp.petBirth || ''}
                            onChange={(e) => setEditingApp({ ...editingApp, petBirth: e.target.value })}
                            className="w-full px-2.5 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-600 mb-1">체중</label>
                          <input
                            type="text"
                            value={editingApp.petWeight || ''}
                            onChange={(e) => setEditingApp({ ...editingApp, petWeight: e.target.value })}
                            className="w-full px-2.5 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 등록 유형 및 배송 상태 */}
                    <div className="p-3 bg-white border border-gray-200 space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold mb-1">등록 유형</label>
                          <input
                            type="text"
                            value={editingApp.type || ''}
                            onChange={(e) => setEditingApp({ ...editingApp, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">진행 상태</label>
                          <select
                            value={editingApp.statusCode}
                            onChange={(e) => {
                              const found = statuses.find(s => s.code === e.target.value);
                              setEditingApp({
                                ...editingApp,
                                statusCode: e.target.value,
                                statusLabel: found ? found.label : editingApp.statusLabel
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none font-bold"
                          >
                            {statuses.map((s) => (
                              <option key={s.code} value={s.code}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">운송장 번호 (택배)</label>
                        <input
                          type="text"
                          value={editingApp.trackingNumber || ''}
                          onChange={(e) => setEditingApp({ ...editingApp, trackingNumber: e.target.value })}
                          placeholder="예: 우체국택배 6089-1234-5678"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setIsEditAppOpen(false); setEditingApp(null); }}
                        className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#144A42] text-white font-bold hover:bg-[#0D3832]"
                      >
                        신청 정보 저장
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB: 팝업 관리 (POPUPS) - 3:4 비율, 다크 백드롭, 복수 지원, 7일 숨김, 업로드/URL, 링크 설정
            ======================================================== */}
        {currentTab === 'popups' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">MODAL & PROMOTION</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142C27] tracking-tight">
                  메인 팝업 관리 ({popups.length}개 등록)
                </h2>
                <p className="text-xs text-[#6B7973] mt-1">
                  메인 화면에 3:4 비율로 노출되는 팝업을 등록하고 관리합니다. 파일 직접 업로드 또는 URL 입력이 가능하며, 링크가 없으면 순수 이미지 팝업으로 동작합니다.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleResetPopupHide7Days}
                  className="px-3.5 py-2.5 bg-white border border-[#D5CDBD] text-[#55635D] text-xs font-bold hover:bg-[#F3EFE6] transition shadow-xs"
                  title="브라우저에 저장된 7일 숨김 쿠키를 삭제하여 즉시 팝업을 다시 확인할 수 있습니다."
                >
                  ↺ 7일 숨김 초기화 (테스트)
                </button>
                <button
                  onClick={() => {
                    setNewPopup({
                      title: '',
                      imageUrl: '',
                      linkType: 'none',
                      linkUrl: '',
                      internalTab: 'registration',
                      active: true,
                    });
                    setPopupImageMode('upload');
                    setIsAddPopupOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>+ 신규 팝업 등록</span>
                </button>
              </div>
            </div>

            {/* Feature Spec Guide Alert */}
            <div className="bg-[#FAF8F5] p-4 sm:p-5 border border-[#E7DFD1] text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#144A42] font-bold">
                <SparklesIcon className="w-4 h-4 text-[#C5A880]" />
                <span>슬반생 팝업 운영 가이드</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#5A6862] text-[11px] leading-relaxed list-disc list-inside">
                <li><strong className="text-[#144A42]">3:4 비율 최적화:</strong> 팝업은 3:4 세로 이미지 비율에 맞춰 왜곡 없이 깔끔하게 표시됩니다. (권장: 600×800px, 900×1200px)</li>
                <li><strong className="text-[#144A42]">다크 백드롭:</strong> 팝업 오픈 시 주변 배경이 짙은 어두운 톤(bg-black/80)으로 집중도 높게 처리됩니다.</li>
                <li><strong className="text-[#144A42]">복수 팝업 지원:</strong> 2개, 3개, 4개 등 여러 개 등록 시 좌우 넘김 화살표와 하단 점형 페이지네이션이 자동 활성화됩니다.</li>
                <li><strong className="text-[#144A42]">7일 동안 보이지 않기:</strong> 사용자가 하단 버튼을 클릭하면 브라우저에 저장되어 7일간 팝업이 노출되지 않습니다.</li>
                <li><strong className="text-[#144A42]">업로드 및 URL 지원:</strong> 내 컴퓨터의 이미지 파일을 직접 업로드하거나 외부 이미지 URL을 입력할 수 있습니다.</li>
                <li><strong className="text-[#144A42]">연결 링크 유무 처리:</strong> 링크를 넣으면 클릭 시 해당 페이지로 이동하며, 링크가 없으면 순수 이미지 팝업으로 인식하여 에러 없이 이미지로만 노출됩니다.</li>
              </ul>
            </div>

            {/* Popups Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popups.map((popup, idx) => (
                <div key={popup.id} className="bg-white border border-[#E2DDD3] shadow-xs flex flex-col justify-between overflow-hidden">
                  
                  {/* Card Header: 순번 & 노출 상태 토글 */}
                  <div className="p-3 bg-[#FAF8F5] border-b border-[#EAE4D7] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#144A42] bg-white px-2 py-0.5 border border-[#DDD5C7] text-[11px]">
                      순번 #{idx + 1}
                    </span>
                    <button
                      onClick={() => onTogglePopup(popup.id)}
                      className={`px-2 py-0.5 text-[11px] font-bold border transition ${
                        popup.active !== false
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                      }`}
                      title="클릭하여 노출/숨김 상태를 전환합니다"
                    >
                      {popup.active !== false ? '● 노출 활성' : '○ 숨김 비활성'}
                    </button>
                  </div>

                  {/* 3:4 Aspect Ratio Image Preview */}
                  <div className="relative aspect-[3/4] bg-[#111716] overflow-hidden group">
                    <img
                      src={popup.imageUrl}
                      alt={popup.title || '팝업 이미지'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-mono">
                      3:4 비율
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between text-xs">
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-sm text-[#142C27] line-clamp-1">{popup.title || '(제목 없음)'}</h4>
                      
                      {/* 링크 상태 표시 */}
                      <div className="p-2.5 bg-[#FAF8F5] border border-[#ECE5D8] rounded-xs space-y-1 text-[11px]">
                        <span className="font-bold text-gray-600 block">연결 링크 정보:</span>
                        {popup.linkUrl ? (
                          <a
                            href={popup.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 break-all"
                          >
                            <ExternalLinkIcon className="w-3 h-3 shrink-0" />
                            <span>외부 링크 ({popup.linkUrl})</span>
                          </a>
                        ) : popup.internalTab ? (
                          <span className="text-[#144A42] font-semibold flex items-center gap-1">
                            <span>내부 이동:</span>
                            <strong className="underline">
                              {popup.internalTab === 'registration' && '동물등록 간편신청'}
                              {popup.internalTab === 'membership' && 'VIP 멤버십 사전신청'}
                              {popup.internalTab === 'adoption' && '안심 입양'}
                              {popup.internalTab === 'partners' && '반려생활 제휴처'}
                              {popup.internalTab === 'travel' && '반려동물 동반여행'}
                              {popup.internalTab === 'farewell' && '안심 장례 케어'}
                            </strong>
                          </span>
                        ) : (
                          <span className="text-gray-400 font-medium">
                            🖼️ 연결 링크 없음 (순수 이미지 팝업)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-gray-500 text-[11px]">
                      <span>{popup.createdAt ? `등록: ${popup.createdAt}` : '등록됨'}</span>
                      <button
                        onClick={() => {
                          if (confirm(`[${popup.title || '해당'}] 팝업을 정말 삭제하시겠습니까?`)) {
                            onDeletePopup(popup.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 font-semibold underline"
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {popups.length === 0 && (
              <div className="bg-white border border-[#E2DDD3] p-12 text-center text-xs text-gray-400 space-y-3">
                <SparklesIcon className="w-8 h-8 mx-auto text-gray-300" />
                <p className="font-bold text-gray-600 text-sm">등록된 메인 팝업이 없습니다.</p>
                <p>신규 팝업을 등록하시면 3:4 세로 비율로 메인 화면에 띄워집니다.</p>
                <button
                  onClick={() => {
                    setNewPopup({
                      title: '',
                      imageUrl: '',
                      linkType: 'none',
                      linkUrl: '',
                      internalTab: 'registration',
                      active: true,
                    });
                    setPopupImageMode('upload');
                    setIsAddPopupOpen(true);
                  }}
                  className="mt-2 px-4 py-2 bg-[#144A42] text-white font-bold hover:bg-[#0D3832]"
                >
                  + 첫 팝업 등록하기
                </button>
              </div>
            )}

            {/* Modal: 신규 팝업 등록 */}
            {isAddPopupOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-xl shadow-2xl p-6 border border-[#ECE5D8] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <SparklesIcon className="w-5 h-5 text-[#C5A880]" />
                      <h3 className="font-bold text-base text-[#144A42]">3:4 메인 팝업 신규 등록</h3>
                    </div>
                    <button onClick={() => setIsAddPopupOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newPopup.imageUrl) {
                      alert('팝업 이미지를 파일 업로드하거나 URL로 입력해주세요.');
                      return;
                    }
                    onAddPopup({
                      id: `pop_${Date.now()}`,
                      title: newPopup.title || '새 프로모션 팝업',
                      imageUrl: newPopup.imageUrl,
                      linkType: newPopup.linkType,
                      linkUrl: newPopup.linkType === 'url' ? newPopup.linkUrl : '',
                      internalTab: newPopup.linkType === 'internal' ? newPopup.internalTab : '',
                      active: newPopup.active,
                      createdAt: new Date().toISOString().split('T')[0],
                    });
                    setIsAddPopupOpen(false);
                    setNewPopup({
                      title: '',
                      imageUrl: '',
                      linkType: 'none',
                      linkUrl: '',
                      internalTab: 'registration',
                      active: true,
                    });
                  }} className="space-y-4 text-xs">
                    
                    {/* 팝업 제목 */}
                    <div>
                      <label className="block font-bold mb-1 text-[#2C3833]">관리용 팝업 제목 *</label>
                      <input 
                        type="text" 
                        required 
                        value={newPopup.title}
                        onChange={(e) => setNewPopup({...newPopup, title: e.target.value})}
                        placeholder="예: 2026 가을 동물등록 특별 프로모션"
                        className="w-full px-3.5 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                      />
                    </div>

                    {/* 이미지 등록 방식 탭 (파일 업로드 vs URL) */}
                    <div>
                      <label className="block font-bold mb-1.5 text-[#2C3833]">팝업 이미지 등록 방식 (3:4 세로 비율) *</label>
                      <div className="flex gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setPopupImageMode('upload')}
                          className={`flex-1 py-2 font-bold border transition text-xs ${
                            popupImageMode === 'upload'
                              ? 'bg-[#144A42] text-white border-[#144A42]'
                              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          📁 내 컴퓨터 파일 직접 업로드
                        </button>
                        <button
                          type="button"
                          onClick={() => setPopupImageMode('url')}
                          className={`flex-1 py-2 font-bold border transition text-xs ${
                            popupImageMode === 'url'
                              ? 'bg-[#144A42] text-white border-[#144A42]'
                              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          🔗 이미지 URL 주소 입력
                        </button>
                      </div>

                      {popupImageMode === 'upload' ? (
                        <div className="border-2 border-dashed border-[#D2C8B8] p-5 text-center bg-[#FAF8F5] space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePopupImageUpload}
                            id="popup-file-upload"
                            className="hidden"
                          />
                          <label
                            htmlFor="popup-file-upload"
                            className="inline-block px-4 py-2 bg-[#144A42] text-white font-bold cursor-pointer hover:bg-[#0D3832] transition shadow-xs"
                          >
                            이미지 파일 선택 (최대 5MB)
                          </label>
                          <p className="text-[11px] text-gray-500">
                            3:4 비율 권장 (JPG, PNG, WEBP 지원)
                          </p>
                        </div>
                      ) : (
                        <div>
                          <input 
                            type="url" 
                            value={newPopup.imageUrl}
                            onChange={(e) => setNewPopup({...newPopup, imageUrl: e.target.value})}
                            placeholder="https://example.com/popup-image.jpg"
                            className="w-full px-3.5 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none font-mono text-[11px]"
                          />
                          <p className="text-[11px] text-gray-400 mt-1">웹에 업로드된 3:4 비율 이미지의 공개 URL을 붙여넣으세요.</p>
                        </div>
                      )}
                    </div>

                    {/* 3:4 이미지 미리보기 */}
                    {newPopup.imageUrl && (
                      <div className="p-4 bg-[#FAF8F5] border border-[#EAE3D5] flex flex-col items-center">
                        <span className="text-[11px] font-bold text-[#144A42] mb-2 block">
                          3:4 실시간 미리보기 (메인 노출 시 형태)
                        </span>
                        <div className="w-36 aspect-[3/4] bg-neutral-900 border border-[#C5A880] shadow-md overflow-hidden relative">
                          <img 
                            src={newPopup.imageUrl} 
                            alt="팝업 미리보기" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewPopup({...newPopup, imageUrl: ''})}
                          className="mt-2 text-[11px] text-red-500 hover:underline"
                        >
                          이미지 다시 선택
                        </button>
                      </div>
                    )}

                    {/* 연결 링크 설정 */}
                    <div className="pt-2 border-t border-gray-100 space-y-3">
                      <label className="block font-bold text-[#2C3833]">
                        연결 링크 설정 (선택 사항)
                      </label>
                      <p className="text-[11px] text-gray-500">
                        링크 값을 넣지 않으면 사용자가 팝업을 클릭해도 이동하지 않는 '순수 이미지 팝업'으로 인식됩니다.
                      </p>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="linkType"
                            checked={newPopup.linkType === 'none'}
                            onChange={() => setNewPopup({...newPopup, linkType: 'none', linkUrl: ''})}
                            className="text-[#144A42] focus:ring-0"
                          />
                          <span className="font-semibold text-gray-800">
                            연결 링크 없음 (순수 안내용 이미지 팝업)
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="linkType"
                            checked={newPopup.linkType === 'url'}
                            onChange={() => setNewPopup({...newPopup, linkType: 'url'})}
                            className="text-[#144A42] focus:ring-0"
                          />
                          <span className="font-semibold text-gray-800">
                            외부 웹사이트 URL 링크 연결
                          </span>
                        </label>

                        {newPopup.linkType === 'url' && (
                          <div className="ml-6 pl-2 border-l-2 border-[#144A42]">
                            <input
                              type="url"
                              value={newPopup.linkUrl}
                              onChange={(e) => setNewPopup({...newPopup, linkUrl: e.target.value})}
                              placeholder="https://example.com/event"
                              className="w-full px-3 py-1.5 border border-gray-300 focus:border-[#144A42] focus:outline-none text-[11px]"
                            />
                            <span className="text-[10px] text-gray-400 mt-0.5 block">클릭 시 새 탭에서 열립니다.</span>
                          </div>
                        )}

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="linkType"
                            checked={newPopup.linkType === 'internal'}
                            onChange={() => setNewPopup({...newPopup, linkType: 'internal'})}
                            className="text-[#144A42] focus:ring-0"
                          />
                          <span className="font-semibold text-gray-800">
                            슬반생 사이트 내 페이지로 바로 이동
                          </span>
                        </label>

                        {newPopup.linkType === 'internal' && (
                          <div className="ml-6 pl-2 border-l-2 border-[#144A42]">
                            <select
                              value={newPopup.internalTab}
                              onChange={(e) => setNewPopup({...newPopup, internalTab: e.target.value})}
                              className="w-full px-3 py-1.5 border border-gray-300 focus:border-[#144A42] focus:outline-none bg-white text-xs"
                            >
                              <option value="registration">동물등록 간편 신청 (신청서 모달/페이지)</option>
                              <option value="membership">VIP 멤버십 사전신청 (혜택 안내)</option>
                              <option value="adoption">새로운 만남 (안심 입양 안내)</option>
                              <option value="partners">반려생활 제휴처 (동물병원·스파·미용)</option>
                              <option value="travel">반려동물 동반 여행 (숙소·호텔·리조트)</option>
                              <option value="farewell">안심 장례 동행 케어</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 노출 여부 */}
                    <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newPopup.active}
                          onChange={(e) => setNewPopup({...newPopup, active: e.target.checked})}
                          className="w-4 h-4 text-[#144A42] focus:ring-0"
                        />
                        <span className="font-semibold text-gray-800">
                          등록 즉시 메인 화면에 팝업 노출 (활성화)
                        </span>
                      </label>
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddPopupOpen(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#144A42] text-white font-bold hover:bg-[#0D3832] transition shadow-xs flex items-center gap-1"
                      >
                        <span>신규 팝업 등록 완료</span>
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: 제휴처 관리 (PARTNERS)
            ======================================================== */}
        {currentTab === 'partners' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">PARTNER NETWORK</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142C27] tracking-tight">
                  반려생활 제휴처 관리 ({partners.length}곳)
                </h2>
                <p className="text-xs text-[#6B7973] mt-1">
                  [반려생활] 페이지 및 마이페이지 찜에 노출되는 동물병원, 미용실, 스파 등의 제휴처를 등록/관리합니다.
                </p>
              </div>

              <button
                onClick={() => setIsAddPartnerOpen(true)}
                className="px-5 py-2.5 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition flex items-center gap-1.5 shadow-xs w-fit"
              >
                <span>+ 신규 제휴처 등록</span>
              </button>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {partners.map((partner) => (
                <div key={partner.id} className="bg-white border border-[#E2DDD3] overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    {partner.imageUrl ? (
                      <div className="relative w-full h-40 bg-gray-100 overflow-hidden border-b border-[#ECE5D8]">
                        <img
                          src={partner.imageUrl}
                          alt={partner.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 left-2.5 text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5">
                          {partner.categoryName} • {partner.tag}
                        </span>
                      </div>
                    ) : (
                      <div className={`p-4 border-b border-[#ECE5D8] flex items-center justify-between ${partner.color || 'bg-[#FAF8F5]'}`}>
                        <span className="text-[11px] font-bold text-[#144A42] bg-white/80 px-2.5 py-0.5">
                          {partner.categoryName} • {partner.tag}
                        </span>
                      </div>
                    )}

                    <div className="p-5 space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-base text-[#142C27]">{partner.name}</h4>
                          <p className="text-xs text-[#717E78] flex items-center gap-1 mt-0.5">
                            <MapPinIcon className="w-3.5 h-3.5 text-[#889891]" />
                            {partner.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <button
                            onClick={() => {
                              setEditingPartner({
                                ...partner,
                                imageUrl: partner.imageUrl || '',
                              });
                              setEditPartnerImageMode(partner.imageUrl && partner.imageUrl.startsWith('http') && !partner.imageUrl.startsWith('data:') ? 'url' : 'upload');
                              setIsEditPartnerOpen(true);
                            }}
                            className="text-xs text-[#144A42] font-semibold hover:text-[#0D3832] underline"
                          >
                            수정
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => {
                              if (confirm(`[${partner.name}] 제휴처를 정말 삭제하시겠습니까?`)) {
                                onDeletePartner(partner._id || partner.id);
                              }
                            }}
                            className="text-xs text-red-500 hover:text-red-700 underline"
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] text-xs space-y-1">
                        <p className="font-bold text-[#144A42]">{partner.benefit}</p>
                        <p className="text-[11px] text-[#65736D] line-clamp-2">{partner.desc}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-[#FAF9F7]">
                    <span>전화: {partner.phone}</span>
                    <span className="font-bold text-amber-600">★ {partner.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: 신규 제휴처 등록 */}
            {isAddPartnerOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-lg shadow-2xl p-6 border border-[#ECE5D8] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-base text-[#144A42]">신규 제휴처 추가 등록</h3>
                    <button onClick={() => setIsAddPartnerOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    onAddPartner({
                      ...newPartner,
                      id: `p_${Date.now()}`
                    });
                    setIsAddPartnerOpen(false);
                    showToast('새로운 제휴처가 성공적으로 등록되었습니다.');
                  }} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold mb-1">제휴처 이름</label>
                      <input
                        type="text"
                        value={newPartner.name}
                        onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                        placeholder="예: 강남 스마일 동물병원"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">업종 분류</label>
                        <select
                          value={newPartner.category}
                          onChange={(e) => {
                            const catNames = {
                              hospital: '동물병원',
                              grooming: '미용/스파',
                              kindergarten: '유치원/호텔',
                              funeral: '장례케어'
                            };
                            const catColors = {
                              hospital: 'bg-[#EBF3FB] text-[#2563EB]',
                              grooming: 'bg-[#FDF2F4] text-[#E11D48]',
                              kindergarten: 'bg-[#FEF9EE] text-[#D97706]',
                              funeral: 'bg-[#F3F4F6] text-[#4B5563]'
                            };
                            setNewPartner({
                              ...newPartner, 
                              category: e.target.value,
                              categoryName: catNames[e.target.value] || '기타',
                              color: catColors[e.target.value] || newPartner.color
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        >
                          <option value="hospital">동물병원</option>
                          <option value="grooming">미용/스파</option>
                          <option value="kindergarten">유치원/호텔</option>
                          <option value="funeral">장례케어</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">특징 태그</label>
                        <input
                          type="text"
                          value={newPartner.tag}
                          onChange={(e) => setNewPartner({...newPartner, tag: e.target.value})}
                          placeholder="예: 24시 응급진료"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Image Upload / URL Mode */}
                    <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block font-bold text-[#144A42]">
                          제휴처 대표 이미지 등록 <span className="text-[11px] font-normal text-gray-500">(선택)</span>
                        </label>
                        <div className="flex gap-1 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setPartnerImageMode('upload')}
                            className={`px-2 py-0.5 font-bold transition ${partnerImageMode === 'upload' ? 'bg-[#144A42] text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            직접 업로드
                          </button>
                          <button
                            type="button"
                            onClick={() => setPartnerImageMode('url')}
                            className={`px-2 py-0.5 font-bold transition ${partnerImageMode === 'url' ? 'bg-[#144A42] text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            이미지 URL 입력
                          </button>
                        </div>
                      </div>

                      {partnerImageMode === 'upload' ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePartnerImageUpload}
                            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-semibold file:bg-[#144A42] file:text-white hover:file:bg-[#0D3832] cursor-pointer"
                          />
                          <p className="text-[10px] text-gray-400 mt-1">권장 비율: 16:9 또는 4:3 (최대 5MB, JPG/PNG/WebP)</p>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="url"
                            value={newPartner.imageUrl}
                            onChange={(e) => setNewPartner({ ...newPartner, imageUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/... 또는 웹 이미지 URL"
                            className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none text-xs"
                          />
                        </div>
                      )}

                      {newPartner.imageUrl && (
                        <div className="mt-2 relative w-full h-32 bg-gray-100 overflow-hidden border border-gray-200">
                          <img
                            src={newPartner.imageUrl}
                            alt="제휴처 미리보기"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setNewPartner({ ...newPartner, imageUrl: '' })}
                            className="absolute top-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 hover:bg-black"
                          >
                            제거
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold mb-1">위치 (지역)</label>
                      <input
                        type="text"
                        value={newPartner.location}
                        onChange={(e) => setNewPartner({...newPartner, location: e.target.value})}
                        placeholder="예: 서울 강남구 역삼동"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">슬반생 회원 단독 혜택</label>
                      <input
                        type="text"
                        value={newPartner.benefit}
                        onChange={(e) => setNewPartner({...newPartner, benefit: e.target.value})}
                        placeholder="예: 진료비 15% 현장 즉시할인"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">상세 소개 문구</label>
                      <textarea
                        value={newPartner.desc}
                        onChange={(e) => setNewPartner({...newPartner, desc: e.target.value})}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">연락처</label>
                      <input
                        type="text"
                        value={newPartner.phone}
                        onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
                        placeholder="02-1234-5678"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddPartnerOpen(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#144A42] text-white font-bold hover:bg-[#0D3832]"
                      >
                        제휴처 등록 완료
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal: 제휴처 정보 수정 */}
            {isEditPartnerOpen && editingPartner && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-lg shadow-2xl p-6 border border-[#ECE5D8] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-base text-[#144A42]">제휴처 정보 수정</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">제휴처의 상세 내용 및 대표 이미지를 수정합니다.</p>
                    </div>
                    <button onClick={() => { setIsEditPartnerOpen(false); setEditingPartner(null); }} className="p-1 text-gray-400 hover:text-gray-700">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (onUpdatePartner) {
                      onUpdatePartner(editingPartner);
                    }
                    setIsEditPartnerOpen(false);
                    setEditingPartner(null);
                  }} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold mb-1">제휴처 이름</label>
                      <input
                        type="text"
                        value={editingPartner.name || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                        placeholder="예: 강남 스마일 동물병원"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">업종 분류</label>
                        <select
                          value={editingPartner.category || 'hospital'}
                          onChange={(e) => {
                            const catNames = {
                              hospital: '동물병원',
                              grooming: '미용/스파',
                              kindergarten: '유치원/호텔',
                              funeral: '장례케어'
                            };
                            const catColors = {
                              hospital: 'bg-[#EBF3FB] text-[#2563EB]',
                              grooming: 'bg-[#FDF2F4] text-[#E11D48]',
                              kindergarten: 'bg-[#FEF9EE] text-[#D97706]',
                              funeral: 'bg-[#F3F4F6] text-[#4B5563]'
                            };
                            setEditingPartner({
                              ...editingPartner,
                              category: e.target.value,
                              categoryName: catNames[e.target.value] || '기타',
                              color: catColors[e.target.value] || editingPartner.color
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        >
                          <option value="hospital">동물병원</option>
                          <option value="grooming">미용/스파</option>
                          <option value="kindergarten">유치원/호텔</option>
                          <option value="funeral">장례케어</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">특징 태그</label>
                        <input
                          type="text"
                          value={editingPartner.tag || ''}
                          onChange={(e) => setEditingPartner({ ...editingPartner, tag: e.target.value })}
                          placeholder="예: 24시 응급진료"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Image Upload / URL Mode */}
                    <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block font-bold text-[#144A42]">
                          제휴처 대표 이미지 <span className="text-[11px] font-normal text-gray-500">(선택)</span>
                        </label>
                        <div className="flex gap-1 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setEditPartnerImageMode('upload')}
                            className={`px-2 py-0.5 font-bold transition ${editPartnerImageMode === 'upload' ? 'bg-[#144A42] text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            직접 업로드
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditPartnerImageMode('url')}
                            className={`px-2 py-0.5 font-bold transition ${editPartnerImageMode === 'url' ? 'bg-[#144A42] text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            이미지 URL 입력
                          </button>
                        </div>
                      </div>

                      {editPartnerImageMode === 'upload' ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditPartnerImageUpload}
                            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-semibold file:bg-[#144A42] file:text-white hover:file:bg-[#0D3832] cursor-pointer"
                          />
                          <p className="text-[10px] text-gray-400 mt-1">권장 비율: 16:9 또는 4:3 (최대 5MB, JPG/PNG/WebP)</p>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="url"
                            value={editingPartner.imageUrl || ''}
                            onChange={(e) => setEditingPartner({ ...editingPartner, imageUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/... 또는 웹 이미지 URL"
                            className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none text-xs"
                          />
                        </div>
                      )}

                      {editingPartner.imageUrl && (
                        <div className="mt-2 relative w-full h-32 bg-gray-100 overflow-hidden border border-gray-200">
                          <img
                            src={editingPartner.imageUrl}
                            alt="제휴처 미리보기"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingPartner({ ...editingPartner, imageUrl: '' })}
                            className="absolute top-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 hover:bg-black"
                          >
                            제거
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold mb-1">위치 (지역)</label>
                      <input
                        type="text"
                        value={editingPartner.location || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, location: e.target.value })}
                        placeholder="예: 서울 강남구 역삼동"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">슬반생 회원 단독 혜택</label>
                      <input
                        type="text"
                        value={editingPartner.benefit || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, benefit: e.target.value })}
                        placeholder="예: 진료비 15% 현장 즉시할인"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">상세 소개 문구</label>
                      <textarea
                        value={editingPartner.desc || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, desc: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">연락처</label>
                        <input
                          type="text"
                          value={editingPartner.phone || ''}
                          onChange={(e) => setEditingPartner({ ...editingPartner, phone: e.target.value })}
                          placeholder="02-1234-5678"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">평점 (별점)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={editingPartner.rating || 4.9}
                          onChange={(e) => setEditingPartner({ ...editingPartner, rating: parseFloat(e.target.value) || 4.9 })}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setIsEditPartnerOpen(false); setEditingPartner(null); }}
                        className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#144A42] text-white font-bold hover:bg-[#0D3832]"
                      >
                        수정사항 저장
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: 안심입양 관리 (ADOPTION)
            ======================================================== */}
        {currentTab === 'adoption' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">ADOPTION CARE</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142C27] tracking-tight">
                  안심 입양 등록 관리 ({adoptionList.length}마리)
                </h2>
                <p className="text-xs text-[#6B7973] mt-1">
                  [새로운 만남] 페이지에 노출되는 입양 대기 아이들의 프로필을 관리합니다.
                </p>
              </div>

              <button
                onClick={() => setIsAddAdoptionOpen(true)}
                className="px-5 py-2.5 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition flex items-center gap-1.5 shadow-xs w-fit"
              >
                <span>+ 신규 입양 동물 등록</span>
              </button>
            </div>

            {/* Adoption Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {adoptionList.map((animal) => (
                <div key={animal.id} className="bg-white border border-[#E2DDD3] overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    {animal.photoUrl ? (
                      <div className="relative w-full h-44 bg-gray-100 overflow-hidden border-b border-[#ECE5D8]">
                        <img
                          src={animal.photoUrl}
                          alt={animal.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 left-2.5 text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5">
                          {animal.status}
                        </span>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-[#FAF8F5] border-b border-[#ECE5D8] flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                          {animal.status}
                        </span>
                      </div>
                    )}

                    <div className="p-5 space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg text-[#142C27]">{animal.name}</h4>
                          <p className="text-xs text-gray-500 font-semibold mt-0.5">{animal.breed} • {animal.gender}</p>
                          <p className="text-xs text-gray-500">나이: {animal.age} | 몸무게: {animal.weight}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <button
                            onClick={() => {
                              setEditingAdoption({
                                ...animal,
                                photoUrl: animal.photoUrl || '',
                                tags: Array.isArray(animal.tags) ? animal.tags.join(', ') : (animal.tags || '')
                              });
                              setEditAdoptionImageMode(animal.photoUrl && animal.photoUrl.startsWith('http') && !animal.photoUrl.startsWith('data:') ? 'url' : 'upload');
                              setIsEditAdoptionOpen(true);
                            }}
                            className="text-xs text-[#144A42] font-semibold hover:text-[#0D3832] underline"
                          >
                            수정
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => {
                              if (confirm(`[${animal.name}] 정보를 정말 삭제하시겠습니까?`)) {
                                onDeleteAdoption(animal._id || animal.id);
                              }
                            }}
                            className="text-xs text-red-500 hover:text-red-700 underline"
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] text-xs text-[#52605A] leading-relaxed">
                        {animal.story}
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {(Array.isArray(animal.tags) ? animal.tags : (animal.tags ? animal.tags.split(',') : [])).map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 border border-gray-200">
                            #{typeof t === 'string' ? t.trim() : t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-gray-100 text-[11px] text-gray-400 bg-[#FAF9F7]">
                    보호기관: {animal.center}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: 입양 동물 추가 */}
            {isAddAdoptionOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-lg shadow-2xl p-6 border border-[#ECE5D8] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-base text-[#144A42]">신규 입양 동물 등록</h3>
                    <button onClick={() => setIsAddAdoptionOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    onAddAdoption({
                      ...newAdoption,
                      id: `a_${Date.now()}`,
                      tags: newAdoption.tags.split(',').map(t => t.trim())
                    });
                    setIsAddAdoptionOpen(false);
                    showToast('새로운 입양 동물이 등록되었습니다.');
                  }} className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">이름</label>
                        <input
                          type="text"
                          value={newAdoption.name}
                          onChange={(e) => setNewAdoption({...newAdoption, name: e.target.value})}
                          placeholder="예: 초코"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">품종</label>
                        <input
                          type="text"
                          value={newAdoption.breed}
                          onChange={(e) => setNewAdoption({...newAdoption, breed: e.target.value})}
                          placeholder="예: 포메라니안 믹스"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold mb-1">성별</label>
                        <input
                          type="text"
                          value={newAdoption.gender}
                          onChange={(e) => setNewAdoption({...newAdoption, gender: e.target.value})}
                          placeholder="여아 (중성화 완료)"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">나이</label>
                        <input
                          type="text"
                          value={newAdoption.age}
                          onChange={(e) => setNewAdoption({...newAdoption, age: e.target.value})}
                          placeholder="2살 추정"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">체중</label>
                        <input
                          type="text"
                          value={newAdoption.weight}
                          onChange={(e) => setNewAdoption({...newAdoption, weight: e.target.value})}
                          placeholder="5.2kg"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">보호 센터명</label>
                      <input
                        type="text"
                        value={newAdoption.center}
                        onChange={(e) => setNewAdoption({...newAdoption, center: e.target.value})}
                        placeholder="한국 동물사랑나눔 보호센터"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">아이 소개 및 스토리</label>
                      <textarea
                        value={newAdoption.story}
                        onChange={(e) => setNewAdoption({...newAdoption, story: e.target.value})}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">태그 (쉼표로 구분)</label>
                      <input
                        type="text"
                        value={newAdoption.tags}
                        onChange={(e) => setNewAdoption({...newAdoption, tags: e.target.value})}
                        placeholder="예: 애교만점, 사람좋아함, 배변완료"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                      />
                    </div>

                    {/* Adoption Photo Upload / URL Mode */}
                    <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block font-bold text-[#144A42]">
                          입양 동물 대표 사진 <span className="text-[11px] font-normal text-gray-500">(선택)</span>
                        </label>
                        <div className="flex gap-1 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setAdoptionImageMode('upload')}
                            className={`px-2 py-0.5 font-bold transition ${adoptionImageMode === 'upload' ? 'bg-[#144A42] text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            직접 업로드
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdoptionImageMode('url')}
                            className={`px-2 py-0.5 font-bold transition ${adoptionImageMode === 'url' ? 'bg-[#144A42] text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            이미지 URL
                          </button>
                        </div>
                      </div>

                      {adoptionImageMode === 'upload' ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAdoptionImageUpload}
                            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-semibold file:bg-[#144A42] file:text-white hover:file:bg-[#0D3832] cursor-pointer"
                          />
                          <p className="text-[10px] text-gray-400 mt-1">권장 비율: 4:3 또는 16:9 (최대 5MB, JPG/PNG/WebP)</p>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="url"
                            value={newAdoption.photoUrl}
                            onChange={(e) => setNewAdoption({ ...newAdoption, photoUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/... 또는 웹 이미지 URL"
                            className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none text-xs"
                          />
                        </div>
                      )}

                      {newAdoption.photoUrl && (
                        <div className="mt-2 relative w-full h-32 bg-gray-100 overflow-hidden border border-gray-200">
                          <img
                            src={newAdoption.photoUrl}
                            alt="미리보기"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setNewAdoption({ ...newAdoption, photoUrl: '' })}
                            className="absolute top-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 hover:bg-black"
                          >
                            제거
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddAdoptionOpen(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#144A42] text-white font-bold hover:bg-[#0D3832]"
                      >
                        등록 완료
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal: 입양 동물 정보 수정 */}
            {isEditAdoptionOpen && editingAdoption && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-lg shadow-2xl p-6 border border-[#ECE5D8] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-base text-[#144A42]">입양 동물 정보 수정</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">아이의 프로필 및 대표 사진을 수정합니다.</p>
                    </div>
                    <button onClick={() => { setIsEditAdoptionOpen(false); setEditingAdoption(null); }} className="p-1 text-gray-400 hover:text-gray-700">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (onUpdateAdoption) {
                      onUpdateAdoption({
                        ...editingAdoption,
                        tags: typeof editingAdoption.tags === 'string'
                          ? editingAdoption.tags.split(',').map(t => t.trim())
                          : editingAdoption.tags
                      });
                    }
                    setIsEditAdoptionOpen(false);
                    setEditingAdoption(null);
                  }} className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">이름</label>
                        <input
                          type="text"
                          value={editingAdoption.name || ''}
                          onChange={(e) => setEditingAdoption({ ...editingAdoption, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">품종</label>
                        <input
                          type="text"
                          value={editingAdoption.breed || ''}
                          onChange={(e) => setEditingAdoption({ ...editingAdoption, breed: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold mb-1">성별</label>
                        <input
                          type="text"
                          value={editingAdoption.gender || ''}
                          onChange={(e) => setEditingAdoption({ ...editingAdoption, gender: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">나이</label>
                        <input
                          type="text"
                          value={editingAdoption.age || ''}
                          onChange={(e) => setEditingAdoption({ ...editingAdoption, age: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">체중</label>
                        <input
                          type="text"
                          value={editingAdoption.weight || ''}
                          onChange={(e) => setEditingAdoption({ ...editingAdoption, weight: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Edit Photo Upload / URL Mode */}
                    <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block font-bold text-[#144A42]">
                          대표 사진 수정 <span className="text-[11px] font-normal text-gray-500">(선택)</span>
                        </label>
                        <div className="flex gap-1 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setEditAdoptionImageMode('upload')}
                            className={`px-2 py-0.5 font-bold transition ${editAdoptionImageMode === 'upload' ? 'bg-[#144A42] text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            직접 업로드
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditAdoptionImageMode('url')}
                            className={`px-2 py-0.5 font-bold transition ${editAdoptionImageMode === 'url' ? 'bg-[#144A42] text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            이미지 URL
                          </button>
                        </div>
                      </div>

                      {editAdoptionImageMode === 'upload' ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditAdoptionImageUpload}
                            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-semibold file:bg-[#144A42] file:text-white hover:file:bg-[#0D3832] cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div>
                          <input
                            type="url"
                            value={editingAdoption.photoUrl || ''}
                            onChange={(e) => setEditingAdoption({ ...editingAdoption, photoUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/... 또는 웹 이미지 URL"
                            className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none text-xs"
                          />
                        </div>
                      )}

                      {editingAdoption.photoUrl && (
                        <div className="mt-2 relative w-full h-32 bg-gray-100 overflow-hidden border border-gray-200">
                          <img
                            src={editingAdoption.photoUrl}
                            alt="미리보기"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingAdoption({ ...editingAdoption, photoUrl: '' })}
                            className="absolute top-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 hover:bg-black"
                          >
                            제거
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">보호 센터명</label>
                        <input
                          type="text"
                          value={editingAdoption.center || ''}
                          onChange={(e) => setEditingAdoption({ ...editingAdoption, center: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">상태 (입양 단계)</label>
                        <select
                          value={editingAdoption.status || '입양 상담 가능'}
                          onChange={(e) => setEditingAdoption({ ...editingAdoption, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none font-bold"
                        >
                          <option value="입양 상담 가능">입양 상담 가능</option>
                          <option value="상담 진행 중">상담 진행 중</option>
                          <option value="입양 완료">입양 완료</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">아이 소개 및 스토리</label>
                      <textarea
                        value={editingAdoption.story || ''}
                        onChange={(e) => setEditingAdoption({ ...editingAdoption, story: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">태그 (쉼표로 구분)</label>
                      <input
                        type="text"
                        value={editingAdoption.tags || ''}
                        onChange={(e) => setEditingAdoption({ ...editingAdoption, tags: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setIsEditAdoptionOpen(false); setEditingAdoption(null); }}
                        className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#144A42] text-white font-bold hover:bg-[#0D3832]"
                      >
                        수정사항 저장
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 5: 반려여행 관리 (TRAVEL)
            ======================================================== */}
        {currentTab === 'travel' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">PET TRAVEL</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142C27] tracking-tight">
                  반려동물 동반 여행지 관리 ({travelList.length}곳)
                </h2>
                <p className="text-xs text-[#6B7973] mt-1">
                  [반려여행] 페이지에 등록된 리조트, 독채펜션, 글램핑 목록을 관리합니다.
                </p>
              </div>

              <button
                onClick={() => setIsAddTravelOpen(true)}
                className="px-5 py-2.5 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition flex items-center gap-1.5 shadow-xs w-fit"
              >
                <span>+ 신규 숙소 등록</span>
              </button>
            </div>

            {/* Travel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {travelList.map((item) => (
                <div key={item.id} className="bg-white border border-[#E2DDD3] overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    {item.imageUrl ? (
                      <div className="relative w-full h-40 bg-gray-100 overflow-hidden border-b border-[#ECE5D8]">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 left-2.5 text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5">
                          {item.type}
                        </span>
                        <span className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#144A42] text-[11px] font-extrabold px-2 py-0.5">
                          {item.price}
                        </span>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#FAF8F5] border-b border-[#ECE5D8] flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#144A42] bg-[#E8E0D1] px-2 py-0.5">
                          {item.type}
                        </span>
                        <span className="text-xs font-extrabold text-[#144A42]">
                          {item.price}
                        </span>
                      </div>
                    )}

                    <div className="p-5 space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-base text-[#142C27]">{item.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{item.location}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <button
                            onClick={() => {
                              setEditingTravel({
                                ...item,
                                imageUrl: item.imageUrl || '',
                                features: Array.isArray(item.features) ? item.features.join(', ') : (item.features || '')
                              });
                              setEditTravelImageMode(item.imageUrl && item.imageUrl.startsWith('http') && !item.imageUrl.startsWith('data:') ? 'url' : 'upload');
                              setIsEditTravelOpen(true);
                            }}
                            className="text-xs text-[#144A42] font-semibold hover:text-[#0D3832] underline"
                          >
                            수정
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => {
                              if (confirm(`[${item.name}] 숙소를 정말 삭제하시겠습니까?`)) {
                                onDeleteTravel(item._id || item.id);
                              }
                            }}
                            className="text-xs text-red-500 hover:text-red-700 underline"
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 font-semibold">{item.weightLimit}</p>

                      <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] text-xs space-y-1">
                        <p className="font-bold text-[#144A42]">회원 혜택: {item.memberBenefit}</p>
                        <p className="text-[11px] text-gray-500">시설: {Array.isArray(item.features) ? item.features.join(', ') : item.features}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500 bg-[#FAF9F7]">
                    예약 전화: {item.phone}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: 숙소 추가 */}
            {isAddTravelOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-lg shadow-2xl p-6 border border-[#ECE5D8] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-base text-[#144A42]">신규 동반 숙소 등록</h3>
                    <button onClick={() => setIsAddTravelOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    onAddTravel({
                      ...newTravel,
                      id: `t_${Date.now()}`,
                      features: newTravel.features.split(',').map(f => f.trim())
                    });
                    setIsAddTravelOpen(false);
                    showToast('새로운 동반 여행 숙소가 등록되었습니다.');
                  }} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold mb-1">숙소명</label>
                      <input
                        type="text"
                        value={newTravel.name}
                        onChange={(e) => setNewTravel({...newTravel, name: e.target.value})}
                        placeholder="예: 가평 힐링 펫 글램핑"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">유형</label>
                        <select
                          value={newTravel.type}
                          onChange={(e) => setNewTravel({...newTravel, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        >
                          <option value="리조트">리조트</option>
                          <option value="독채펜션">독채펜션</option>
                          <option value="글램핑">글램핑</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">위치 (지역)</label>
                        <input
                          type="text"
                          value={newTravel.location}
                          onChange={(e) => setNewTravel({...newTravel, location: e.target.value})}
                          placeholder="경기도 가평군"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Image Upload / URL Mode */}
                    <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block font-bold text-[#144A42]">
                          숙소 대표 이미지 등록 <span className="text-[11px] font-normal text-gray-500">(선택)</span>
                        </label>
                        <div className="flex gap-1 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setTravelImageMode('upload')}
                            className={`px-2 py-0.5 font-bold transition ${travelImageMode === 'upload' ? 'bg-[#144A42] text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            직접 업로드
                          </button>
                          <button
                            type="button"
                            onClick={() => setTravelImageMode('url')}
                            className={`px-2 py-0.5 font-bold transition ${travelImageMode === 'url' ? 'bg-[#144A42] text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            이미지 URL 입력
                          </button>
                        </div>
                      </div>

                      {travelImageMode === 'upload' ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleTravelImageUpload}
                            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-semibold file:bg-[#144A42] file:text-white hover:file:bg-[#0D3832] cursor-pointer"
                          />
                          <p className="text-[10px] text-gray-400 mt-1">권장 비율: 16:9 또는 16:10 (최대 5MB, JPG/PNG/WebP)</p>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="url"
                            value={newTravel.imageUrl}
                            onChange={(e) => setNewTravel({ ...newTravel, imageUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/... 또는 웹 이미지 URL"
                            className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none text-xs"
                          />
                        </div>
                      )}

                      {newTravel.imageUrl && (
                        <div className="mt-2 relative w-full h-32 bg-gray-100 overflow-hidden border border-gray-200">
                          <img
                            src={newTravel.imageUrl}
                            alt="숙소 미리보기"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setNewTravel({ ...newTravel, imageUrl: '' })}
                            className="absolute top-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 hover:bg-black"
                          >
                            제거
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">동반 가능 견종/체중</label>
                        <input
                          type="text"
                          value={newTravel.weightLimit}
                          onChange={(e) => setNewTravel({...newTravel, weightLimit: e.target.value})}
                          placeholder="전 견종 가능"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">기본 가격</label>
                        <input
                          type="text"
                          value={newTravel.price}
                          onChange={(e) => setNewTravel({...newTravel, price: e.target.value})}
                          placeholder="180,000원~"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">슬반생 회원 혜택</label>
                      <input
                        type="text"
                        value={newTravel.memberBenefit}
                        onChange={(e) => setNewTravel({...newTravel, memberBenefit: e.target.value})}
                        placeholder="예: 슬반생 회원 주중 20% 추가 할인"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">주요 시설 (쉼표로 구분)</label>
                      <input
                        type="text"
                        value={newTravel.features}
                        onChange={(e) => setNewTravel({...newTravel, features: e.target.value})}
                        placeholder="천연잔디, 온수풀, 바베큐장"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">예약 전화번호</label>
                      <input
                        type="text"
                        value={newTravel.phone}
                        onChange={(e) => setNewTravel({...newTravel, phone: e.target.value})}
                        placeholder="031-123-4567"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddTravelOpen(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#144A42] text-white font-bold hover:bg-[#0D3832]"
                      >
                        숙소 등록 완료
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal: 반려여행 숙소 정보 수정 */}
            {isEditTravelOpen && editingTravel && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-lg shadow-2xl p-6 border border-[#ECE5D8] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-base text-[#144A42]">동반 여행지 숙소 정보 수정</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">숙소의 상세 정보 및 대표 사진을 수정합니다.</p>
                    </div>
                    <button onClick={() => { setIsEditTravelOpen(false); setEditingTravel(null); }} className="p-1 text-gray-400 hover:text-gray-700">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (onUpdateTravel) {
                      onUpdateTravel({
                        ...editingTravel,
                        features: typeof editingTravel.features === 'string'
                          ? editingTravel.features.split(',').map(f => f.trim())
                          : editingTravel.features
                      });
                    }
                    setIsEditTravelOpen(false);
                    setEditingTravel(null);
                  }} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold mb-1">숙소명</label>
                      <input
                        type="text"
                        value={editingTravel.name || ''}
                        onChange={(e) => setEditingTravel({...editingTravel, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">숙소 유형</label>
                        <select
                          value={editingTravel.type || '리조트'}
                          onChange={(e) => setEditingTravel({...editingTravel, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        >
                          <option value="리조트">리조트</option>
                          <option value="독채펜션">독채펜션</option>
                          <option value="글램핑">글램핑</option>
                          <option value="호텔">호텔</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">위치 (지역)</label>
                        <input
                          type="text"
                          value={editingTravel.location || ''}
                          onChange={(e) => setEditingTravel({...editingTravel, location: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Travel Image Edit Mode */}
                    <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block font-bold text-[#144A42]">
                          숙소 대표 사진 <span className="text-[11px] font-normal text-gray-500">(선택)</span>
                        </label>
                        <div className="flex gap-1 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setEditTravelImageMode('upload')}
                            className={`px-2 py-0.5 font-bold transition ${editTravelImageMode === 'upload' ? 'bg-[#144A42] text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            직접 업로드
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditTravelImageMode('url')}
                            className={`px-2 py-0.5 font-bold transition ${editTravelImageMode === 'url' ? 'bg-[#144A42] text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            이미지 URL 입력
                          </button>
                        </div>
                      </div>

                      {editTravelImageMode === 'upload' ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditTravelImageUpload}
                            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-semibold file:bg-[#144A42] file:text-white hover:file:bg-[#0D3832] cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div>
                          <input
                            type="url"
                            value={editingTravel.imageUrl || ''}
                            onChange={(e) => setEditingTravel({ ...editingTravel, imageUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/... 또는 웹 이미지 URL"
                            className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none text-xs"
                          />
                        </div>
                      )}

                      {editingTravel.imageUrl && (
                        <div className="mt-2 relative w-full h-32 bg-gray-100 overflow-hidden border border-gray-200">
                          <img
                            src={editingTravel.imageUrl}
                            alt="숙소 미리보기"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingTravel({ ...editingTravel, imageUrl: '' })}
                            className="absolute top-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 hover:bg-black"
                          >
                            제거
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">동반 가능 견종/체중</label>
                        <input
                          type="text"
                          value={editingTravel.weightLimit || ''}
                          onChange={(e) => setEditingTravel({...editingTravel, weightLimit: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">기본 가격</label>
                        <input
                          type="text"
                          value={editingTravel.price || ''}
                          onChange={(e) => setEditingTravel({...editingTravel, price: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">슬반생 회원 혜택</label>
                      <input
                        type="text"
                        value={editingTravel.memberBenefit || ''}
                        onChange={(e) => setEditingTravel({...editingTravel, memberBenefit: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">주요 시설 (쉼표로 구분)</label>
                      <input
                        type="text"
                        value={editingTravel.features || ''}
                        onChange={(e) => setEditingTravel({...editingTravel, features: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">예약 전화번호</label>
                      <input
                        type="text"
                        value={editingTravel.phone || ''}
                        onChange={(e) => setEditingTravel({...editingTravel, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setIsEditTravelOpen(false); setEditingTravel(null); }}
                        className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#144A42] text-white font-bold hover:bg-[#0D3832]"
                      >
                        수정사항 저장
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 6: 사이트 설정 & SEO 최적화 (BRAND & SEO)
            ======================================================== */}
        {currentTab === 'brand' && (
          <div className="space-y-6 max-w-4xl animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">SITE & SEO SETTINGS</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142C27] tracking-tight">
                  사이트 설정 & SEO 최적화
                </h2>
                <p className="text-xs text-[#6B7973] mt-1">
                  카카오톡 공유 대표 이미지(1200×630), 파비콘, 사이트 설명 문구, 포털 검색엔진(SEO) 최적화 메타태그를 관리합니다.
                </p>
              </div>

              {/* Sub-tab Pills */}
              <div className="flex items-center bg-[#FAF8F5] p-1 border border-[#E2DDD3] text-xs">
                <button
                  type="button"
                  onClick={() => setSeoInnerTab('seo')}
                  className={`px-3.5 py-1.5 font-bold transition ${
                    seoInnerTab === 'seo' ? 'bg-[#144A42] text-white shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  SEO·대표이미지·파비콘
                </button>
                <button
                  type="button"
                  onClick={() => setSeoInnerTab('preview')}
                  className={`px-3.5 py-1.5 font-bold transition flex items-center gap-1 ${
                    seoInnerTab === 'preview' ? 'bg-[#144A42] text-white shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <span>미리보기 시뮬레이터</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
                </button>
                <button
                  type="button"
                  onClick={() => setSeoInnerTab('footer')}
                  className={`px-3.5 py-1.5 font-bold transition flex items-center gap-1.5 ${
                    seoInnerTab === 'footer' ? 'bg-[#144A42] text-white shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <span>푸터정보 관리</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF7A]"></span>
                </button>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateBrandInfo(brandForm);
              showToast('사이트 설정 및 SEO 정보가 저장되었습니다. 브라우저에 실시간 반영됩니다.');
            }} className="space-y-6">

              {/* ----------------------------------------------------
                  SUB-TAB 1: SEO, 대표이미지 (1200x630), 파비콘, 설명문구
                  ---------------------------------------------------- */}
              {seoInnerTab === 'seo' && (
                <div className="space-y-6">
                  
                  {/* 1. 대표 이미지 (카카오톡/SNS 공유 1200x630) */}
                  <div className="bg-white p-6 sm:p-7 border border-[#E2DDD3] shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#142C27]">
                            대표 이미지 (카카오톡·SNS 공유용 OG Image)
                          </h3>
                          <span className="px-2 py-0.5 bg-[#EBF5F2] text-[#144A42] text-[11px] font-bold rounded-sm border border-[#144A42]/20">
                            권장 규격 1200 × 630 px (1.91:1 비율)
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          카카오톡 채팅방, 페이스북, 인스타그램, 슬랙 등 링크를 전송했을 때 말풍선 상단에 뜨는 고해상도 대표 이미지입니다.
                        </p>
                      </div>
                      
                      {/* Mode Toggle */}
                      <div className="flex text-xs border border-gray-200">
                        <button
                          type="button"
                          onClick={() => setOgImageMode('upload')}
                          className={`px-2.5 py-1 ${ogImageMode === 'upload' ? 'bg-[#144A42] text-white font-bold' : 'bg-gray-50 text-gray-600'}`}
                        >
                          파일 업로드
                        </button>
                        <button
                          type="button"
                          onClick={() => setOgImageMode('url')}
                          className={`px-2.5 py-1 ${ogImageMode === 'url' ? 'bg-[#144A42] text-white font-bold' : 'bg-gray-50 text-gray-600'}`}
                        >
                          URL 입력
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                      {/* Left: Input controls */}
                      <div className="md:col-span-6 space-y-3">
                        {ogImageMode === 'upload' ? (
                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-700">
                              이미지 파일 선택 (JPG, PNG, WebP)
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleOgImageUpload}
                              className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-[#144A42] file:text-white hover:file:bg-[#0D3832] cursor-pointer"
                            />
                            <p className="text-[11px] text-gray-400">
                              * 선택하신 이미지는 1200×630 해상도에 최적화되어 자동 리사이징 및 압축됩니다.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">대표 이미지 웹 URL</label>
                            <input
                              type="url"
                              value={brandForm.ogImage || ''}
                              onChange={(e) => setBrandForm({ ...brandForm, ogImage: e.target.value })}
                              placeholder="https://..."
                              className="w-full px-3.5 py-2 text-xs border border-gray-300 focus:border-[#144A42] focus:outline-none"
                            />
                          </div>
                        )}

                        <div className="p-3 bg-[#FAF8F5] border border-[#ECE5D8] text-[11px] text-gray-600 space-y-1">
                          <span className="font-bold text-[#144A42]">💡 카카오톡 공유 꿀팁</span>
                          <p>
                            카카오톡은 1200×630 (1.91:1) 비율의 이미지를 가장 왜곡 없이 선명하게 보여줍니다. 텍스트가 들어간 배너를 사용할 경우 중앙에 배치하면 모바일 화면에서도 잘리지 않습니다.
                          </p>
                        </div>
                      </div>

                      {/* Right: 1200x630 Aspect Ratio Preview */}
                      <div className="md:col-span-6">
                        <span className="block text-[11px] font-bold text-gray-500 mb-1">
                          현재 설정된 대표 이미지 미리보기 (1200 × 630)
                        </span>
                        <div className="relative aspect-[1200/630] w-full bg-[#1F2C27] rounded-md overflow-hidden border border-[#E2DDD3] shadow-inner flex items-center justify-center">
                          {brandForm.ogImage ? (
                            <img
                              src={brandForm.ogImage}
                              alt="대표 이미지 미리보기"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">등록된 대표 이미지가 없습니다.</span>
                          )}
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                            1200 × 630
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. 파비콘 (Favicon) & 브라우저 탭 설정 */}
                  <div className="bg-white p-6 sm:p-7 border border-[#E2DDD3] shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#142C27]">
                            파비콘 (Favicon - 브라우저 탭 아이콘)
                          </h3>
                          <span className="px-2 py-0.5 bg-[#F2EDE2] text-[#8C6D3F] text-[11px] font-bold rounded-sm border border-[#C5A880]/30">
                            SVG, PNG, ICO 지원
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          인터넷 브라우저 탭, 즐겨찾기(북마크), 모바일 홈 화면 추가 시 표시되는 대표 아이콘입니다.
                        </p>
                      </div>

                      {/* Favicon Mode Toggle */}
                      <div className="flex text-xs border border-gray-200">
                        <button
                          type="button"
                          onClick={() => setFaviconMode('upload')}
                          className={`px-2.5 py-1 ${faviconMode === 'upload' ? 'bg-[#144A42] text-white font-bold' : 'bg-gray-50 text-gray-600'}`}
                        >
                          파일 업로드
                        </button>
                        <button
                          type="button"
                          onClick={() => setFaviconMode('url')}
                          className={`px-2.5 py-1 ${faviconMode === 'url' ? 'bg-[#144A42] text-white font-bold' : 'bg-gray-50 text-gray-600'}`}
                        >
                          URL 입력
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-6 space-y-3">
                        {faviconMode === 'upload' ? (
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">파비콘 이미지 파일 선택</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFaviconUpload}
                              className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-semibold file:bg-[#144A42] file:text-white hover:file:bg-[#0D3832] cursor-pointer"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-700">파비콘 이미지 URL 또는 DataURL</label>
                            <input
                              type="text"
                              value={brandForm.favicon || ''}
                              onChange={(e) => setBrandForm({ ...brandForm, favicon: e.target.value })}
                              placeholder="/favicon.svg 또는 https://..."
                              className="w-full px-3.5 py-2 text-xs border border-gray-300 focus:border-[#144A42] focus:outline-none font-mono"
                            />
                          </div>
                        )}
                      </div>

                      {/* Favicon Browser Tab Mockup */}
                      <div className="md:col-span-6">
                        <span className="block text-[11px] font-bold text-gray-500 mb-1.5">
                          브라우저 탭 실시간 미리보기
                        </span>
                        <div className="bg-[#DFE1E5] pt-2 px-2 pb-0 rounded-t-lg border border-gray-300">
                          <div className="bg-white px-3 py-2 rounded-t-md shadow-xs flex items-center gap-2 max-w-[240px] border-t border-x border-gray-300">
                            <img
                              src={brandForm.favicon || '/favicon.svg'}
                              alt="파비콘"
                              className="w-4 h-4 object-contain shrink-0"
                            />
                            <span className="text-xs text-gray-800 font-medium truncate">
                              {brandForm.siteTitle || '슬반생 | 슬기로운 반려생활'}
                            </span>
                            <span className="text-gray-400 hover:text-black text-xs ml-auto">×</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. 사이트 설명 문구 & SEO 메타데이터 */}
                  <div className="bg-white p-6 sm:p-7 border border-[#E2DDD3] shadow-xs space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="text-sm font-bold text-[#142C27]">
                        사이트 기본 설명 문구 & 검색엔진 최적화 (SEO)
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        네이버, 구글, 다음 등 포털 검색결과 스니펫과 카카오톡 공유 카드 본문에 표기되는 안내 문구입니다.
                      </p>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Site Title */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-bold text-gray-800">사이트 메타 타이틀 (Title Tag) *</label>
                          <span className="text-[11px] text-gray-400">
                            {(brandForm.siteTitle || '').length}자 (권장 30~50자)
                          </span>
                        </div>
                        <input
                          type="text"
                          value={brandForm.siteTitle || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, siteTitle: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none font-semibold text-gray-800"
                          placeholder="슬반생 | 슬기로운 반려생활 - 동물등록부터 평생케어까지"
                          required
                        />
                      </div>

                      {/* Site Description */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-bold text-gray-800">사이트 설명 문구 (Meta Description) *</label>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[11px] font-semibold ${
                              (brandForm.siteDescription || '').length >= 60 && (brandForm.siteDescription || '').length <= 130
                                ? 'text-emerald-600'
                                : 'text-amber-600'
                            }`}>
                              {(brandForm.siteDescription || '').length}자
                            </span>
                            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 text-gray-500">
                              포털 권장: 80~120자
                            </span>
                          </div>
                        </div>
                        <textarea
                          rows={3}
                          value={brandForm.siteDescription || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, siteDescription: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none leading-relaxed"
                          placeholder="반려동물 평생의 동반자, 슬반생! 모바일 동물등록 3분 완료부터 제휴 병원·펜션 30% 멤버십 혜택, 24시 긴급상담, 안심입양, 장례케어까지 우리 아이의 처음부터 끝까지 함께합니다."
                          required
                        />
                        <p className="text-[11px] text-gray-400 mt-1">
                          * 검색 사용자의 시선을 사로잡는 구체적인 혜택과 키워드를 조합하면 클릭률(CTR)이 대폭 상승합니다.
                        </p>
                      </div>

                      {/* Keywords */}
                      <div>
                        <label className="block font-bold mb-1 text-gray-800">
                          검색엔진 최적화 키워드 (Meta Keywords - 쉼표로 구분)
                        </label>
                        <input
                          type="text"
                          value={brandForm.keywords || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, keywords: e.target.value })}
                          placeholder="슬반생, 슬기로운반려생활, 동물등록, 강아지등록, 외장칩..."
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none text-gray-700"
                        />
                      </div>

                      {/* Canonical URL & Robots */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold mb-1 text-gray-800">사이트 대표 URL (Canonical / OG URL)</label>
                          <input
                            type="url"
                            value={brandForm.canonicalUrl || 'https://www.seulbanlife.com'}
                            onChange={(e) => setBrandForm({ ...brandForm, canonicalUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1 text-gray-800">검색 로봇 색인 제어 (Robots)</label>
                          <select
                            value={brandForm.robots || 'index, follow'}
                            onChange={(e) => setBrandForm({ ...brandForm, robots: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none bg-white"
                          >
                            <option value="index, follow">index, follow (검색엔진 색인 및 수집 허용 - 권장)</option>
                            <option value="noindex, nofollow">noindex, nofollow (검색엔진 노출 완전 차단)</option>
                          </select>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* ----------------------------------------------------
                  SUB-TAB 2: 실시간 소셜 & 포털 검색 시뮬레이터 (미리보기)
                  ---------------------------------------------------- */}
              {seoInnerTab === 'preview' && (
                <div className="space-y-6">
                  
                  {/* 1. 카카오톡 말풍선 공유 미리보기 */}
                  <div className="bg-[#B2C7D9] p-6 sm:p-8 rounded-lg shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2A3744] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-[#FEE500] rounded-full"></span>
                        카카오톡 링크 공유 말풍선 시뮬레이터 (1200×630 OG Image 연동)
                      </span>
                      <span className="text-[11px] bg-white/70 px-2 py-0.5 rounded text-gray-600 font-medium">
                        채팅방 실제 표시 뷰
                      </span>
                    </div>

                    {/* Kakao Bubble Card */}
                    <div className="max-w-sm bg-white rounded-xl overflow-hidden shadow-md border border-black/5 mx-auto">
                      {/* 1200x630 Image Container */}
                      <div className="aspect-[1200/630] w-full bg-[#144A42] relative overflow-hidden">
                        {brandForm.ogImage ? (
                          <img
                            src={brandForm.ogImage}
                            alt="카톡 미리보기"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-white text-xs">
                            대표 이미지 없음 (1200×630)
                          </div>
                        )}
                      </div>

                      {/* Content Box */}
                      <div className="p-3.5 space-y-1">
                        <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                          {brandForm.siteTitle || '슬반생 | 슬기로운 반려생활'}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                          {brandForm.siteDescription || '우리 아이의 오늘부터 모든 내일까지'}
                        </p>
                        <span className="text-[11px] text-gray-400 block pt-1">
                          {(brandForm.canonicalUrl || 'https://www.seulbanlife.com').replace(/^https?:\/\//, '')}
                        </span>
                      </div>
                    </div>

                    <p className="text-center text-[11px] text-gray-600">
                      친구에게 슬반생 링크를 전송하면 위와 같이 신뢰도 높은 카드 형태로 전송됩니다.
                    </p>
                  </div>

                  {/* 2. 네이버 & 구글 포털 검색결과 스니펫 시뮬레이터 */}
                  <div className="bg-white p-6 sm:p-8 border border-[#E2DDD3] shadow-xs space-y-4">
                    <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#142C27]">
                        네이버 / 구글 포털 검색결과 스니펫 시뮬레이터
                      </h3>
                      <span className="text-[11px] text-gray-400 font-mono">SERP Preview</span>
                    </div>

                    {/* Google / Naver Result Box */}
                    <div className="p-4 sm:p-5 bg-[#FAF8F5] border border-[#E5E0D5] rounded space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <img
                          src={brandForm.favicon || '/favicon.svg'}
                          alt="파비콘"
                          className="w-4 h-4 object-contain"
                        />
                        <span className="font-semibold">{brandForm.fullName || '슬기로운 반려생활'}</span>
                        <span className="text-gray-400">›</span>
                        <span className="text-gray-400 text-[11px]">{brandForm.canonicalUrl || 'https://www.seulbanlife.com'}</span>
                      </div>

                      <a 
                        href="#preview" 
                        onClick={(e) => e.preventDefault()}
                        className="text-base sm:text-lg font-semibold text-[#1A0DAB] hover:underline block leading-snug cursor-pointer"
                      >
                        {brandForm.siteTitle || '슬반생 | 슬기로운 반려생활 - 동물등록부터 평생케어까지'}
                      </a>

                      <p className="text-xs text-[#4D5156] leading-relaxed line-clamp-2">
                        {brandForm.siteDescription || '모바일 동물등록, 건강·의료, 미용, 반려여행, 입양, 아름다운 이별까지. 반려동물의 평생을 함께하는 슬반생입니다.'}
                      </p>
                    </div>

                    <div className="text-[11px] text-gray-500 bg-gray-50 p-3 rounded">
                      💡 포털 사이트(네이버 웹마스터도구, 구글 서치콘솔)는 위 메타데이터를 기반으로 색인하여 검색 사용자에게 사이트를 추천합니다.
                    </div>
                  </div>

                </div>
              )}

              {/* ----------------------------------------------------
                  SUB-TAB 3: 푸터정보 관리 (푸터의 모든 정보 수정 가능)
                  ---------------------------------------------------- */}
              {seoInnerTab === 'footer' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* 1. 사업자 및 법인 정보 */}
                  <div className="bg-white p-6 sm:p-8 border border-[#E2DDD3] shadow-xs space-y-5 text-xs">
                    <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#142C27] flex items-center gap-1.5">
                          <span>🏢 사업자 및 회사 기본 정보</span>
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          푸터 좌측 하단에 법적으로 표기되는 전자상거래 사업자 등록 정보입니다.
                        </p>
                      </div>
                      <span className="text-[10px] bg-[#FAF8F5] text-gray-600 px-2 py-0.5 border border-gray-200">
                        전자상거래법 필수 표기
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold mb-1 text-gray-800">상호 / 법인명 *</label>
                        <input
                          type="text"
                          value={brandForm.companyName || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, companyName: e.target.value })}
                          placeholder="주식회사 슬기로운 반려생활"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-gray-800">대표자 성명 *</label>
                        <input
                          type="text"
                          value={brandForm.ceoName || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, ceoName: e.target.value })}
                          placeholder="김대표"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold mb-1 text-gray-800">사업자등록번호 *</label>
                        <input
                          type="text"
                          value={brandForm.bizNumber || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, bizNumber: e.target.value })}
                          placeholder="123-45-67890"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-gray-800">통신판매업신고번호 *</label>
                        <input
                          type="text"
                          value={brandForm.telecomNumber || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, telecomNumber: e.target.value })}
                          placeholder="2026-서울강남-0123호"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block font-bold mb-1 text-gray-800">사업장 주소 *</label>
                        <input
                          type="text"
                          value={brandForm.address || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, address: e.target.value })}
                          placeholder="서울특별시 강남구 테헤란로 123 슬반생 타워 5층"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-gray-800">개인정보보호책임자 *</label>
                        <input
                          type="text"
                          value={brandForm.cpoName || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, cpoName: e.target.value })}
                          placeholder="박슬기"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold mb-1 text-gray-800">대표 이메일 주소 *</label>
                        <input
                          type="email"
                          value={brandForm.email || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, email: e.target.value })}
                          placeholder="contact@seulbanlife.com"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-gray-800">호스팅 제공자</label>
                        <input
                          type="text"
                          value={brandForm.hostingProvider || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, hostingProvider: e.target.value })}
                          placeholder="슬반생 클라우드"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold mb-1 text-gray-800">통신판매중개자 법적 면책 고지 문구</label>
                      <textarea
                        rows={2}
                        value={brandForm.disclaimer || ''}
                        onChange={(e) => setBrandForm({ ...brandForm, disclaimer: e.target.value })}
                        placeholder="슬반생은 통신판매중개자이며 통신판매의 당사자가 아닙니다. 제휴사가 제공하는 상품 및 서비스의 거래와 관련한 책임은 각 제공자에게 있습니다."
                        className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none leading-relaxed text-gray-600"
                      />
                    </div>
                  </div>

                  {/* 2. 고객센터 및 24시 긴급상담 안내 */}
                  <div className="bg-white p-6 sm:p-8 border border-[#E2DDD3] shadow-xs space-y-5 text-xs">
                    <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#142C27] flex items-center gap-1.5">
                          <span>📞 고객센터 및 긴급안내 설정</span>
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          푸터 우측 고객센터 안내 박스와 모바일 플로팅 상담창에 노출되는 연락처입니다.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold mb-1 text-gray-800">고객센터 블록 타이틀</label>
                        <input
                          type="text"
                          value={brandForm.csTitle || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, csTitle: e.target.value })}
                          placeholder="고객센터 및 제휴상담"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-gray-800">대표 고객센터 전화번호 *</label>
                        <input
                          type="text"
                          value={brandForm.phone1 || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, phone1: e.target.value })}
                          placeholder="010-3545-6982"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none font-semibold text-[#144A42]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-gray-800">24시 긴급 직통 라벨</label>
                        <input
                          type="text"
                          value={brandForm.phone2Label || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, phone2Label: e.target.value })}
                          placeholder="야간/응급 직통"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold mb-1 text-gray-800">24시 긴급 응급/장례 직통번호 *</label>
                        <input
                          type="text"
                          value={brandForm.phone2 || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, phone2: e.target.value })}
                          placeholder="010-8880-6982"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none font-semibold text-[#144A42]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-gray-800">슬반생몰 쇼핑몰 외부 URL</label>
                        <input
                          type="url"
                          value={brandForm.mallUrl || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, mallUrl: e.target.value })}
                          placeholder="https://mall.seulbanlife.com"
                          className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold mb-1 text-gray-800">
                        운영시간 및 긴급상담 지원 안내 문구 (줄바꿈 가능)
                      </label>
                      <textarea
                        rows={3}
                        value={brandForm.csHours || ''}
                        onChange={(e) => setBrandForm({ ...brandForm, csHours: e.target.value })}
                        placeholder="평일 09:00 - 18:00 (점심시간 12:00 - 13:00)&#10;동물등록 및 24시 긴급상담 연중무휴 지원"
                        className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none leading-relaxed font-sans"
                      />
                    </div>
                  </div>

                  {/* 3. 저작권 및 정책/약관 링크 */}
                  <div className="bg-white p-6 sm:p-8 border border-[#E2DDD3] shadow-xs space-y-5 text-xs">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="text-sm font-bold text-[#142C27] flex items-center gap-1.5">
                        <span>⚖️ 저작권 표기 및 약관 링크</span>
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        푸터 최하단 바에 표기되는 저작권 카피라이트 문구와 정책 링크입니다.
                      </p>
                    </div>

                    <div>
                      <label className="block font-bold mb-1 text-gray-800">저작권(Copyright) 표기 문구 *</label>
                      <input
                        type="text"
                        value={brandForm.copyright || ''}
                        onChange={(e) => setBrandForm({ ...brandForm, copyright: e.target.value })}
                        placeholder="© 2026 Seulban Life Inc. All rights reserved."
                        className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold mb-1 text-gray-800">개인정보처리방침 링크</label>
                        <input
                          type="text"
                          value={brandForm.privacyUrl || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, privacyUrl: e.target.value })}
                          placeholder="#privacy"
                          className="w-full px-3.5 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-gray-800">이용약관 링크</label>
                        <input
                          type="text"
                          value={brandForm.termsUrl || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, termsUrl: e.target.value })}
                          placeholder="#terms"
                          className="w-full px-3.5 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-gray-800">마케팅 수신동의 링크</label>
                        <input
                          type="text"
                          value={brandForm.marketingUrl || ''}
                          onChange={(e) => setBrandForm({ ...brandForm, marketingUrl: e.target.value })}
                          placeholder="#marketing"
                          className="w-full px-3.5 py-2 border border-gray-300 focus:border-[#144A42] focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. 실시간 푸터 다크 테마 미리보기 (Live Footer Preview) */}
                  <div className="bg-[#0B100F] p-6 sm:p-8 rounded-lg shadow-xl border border-[#1F2B28] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#1E2926] pb-3">
                      <span className="text-xs font-bold text-[#E8DEC8] flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-[#D4AF7A] rounded-full"></span>
                        실시간 푸터 렌더링 미리보기
                      </span>
                      <span className="text-[10px] bg-[#182220] text-[#A6B2AD] px-2 py-0.5 border border-[#23312E]">
                        다크 테마 실제 노출 뷰
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] leading-relaxed text-[#8E9B95] pt-1">
                      <div className="md:col-span-2 space-y-1">
                        <p className="text-white font-bold text-xs mb-1">{brandForm.companyName || '주식회사 슬기로운 반려생활'}</p>
                        <p>
                          대표자: {brandForm.ceoName || '김대표'} | 사업자등록번호: {brandForm.bizNumber || '123-45-67890'} | 통신판매업: {brandForm.telecomNumber || '2026-서울강남-0123호'}
                        </p>
                        <p>
                          주소: {brandForm.address || '서울특별시 강남구 테헤란로 123 슬반생 타워 5층'} | 개인정보책임자: {brandForm.cpoName || '박슬기'}
                        </p>
                        <p>
                          이메일: {brandForm.email || 'contact@seulbanlife.com'} | 호스팅: {brandForm.hostingProvider || '슬반생 클라우드'}
                        </p>
                        <p className="text-[#64726C] text-[10px] pt-1">
                          {brandForm.disclaimer || '슬반생은 통신판매중개자이며 통신판매의 당사자가 아닙니다.'}
                        </p>
                      </div>

                      <div className="bg-[#182220] p-3.5 border border-[#23312E] space-y-1">
                        <p className="text-white font-semibold text-xs flex items-center gap-1">
                          <PhoneIcon className="w-3.5 h-3.5 text-[#D4AF7A]" />
                          {brandForm.csTitle || '고객센터 및 제휴상담'}
                        </p>
                        <div className="text-sm font-bold text-[#E8DEC8]">
                          {brandForm.phone1 || '010-3545-6982'}
                        </div>
                        <div className="text-[11px] text-[#A6B2AD]">
                          {brandForm.phone2Label || '야간/응급'}: {brandForm.phone2 || '010-8880-6982'}
                        </div>
                        <p className="text-[10px] text-[#71807A] whitespace-pre-line pt-0.5 leading-tight">
                          {brandForm.csHours || '평일 09:00 - 18:00'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1C2624] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6B7973] gap-2">
                      <div className="flex items-center gap-3">
                        <span className="underline hover:text-white">개인정보처리방침</span>
                        <span>이용약관</span>
                        <span>마케팅 수신동의</span>
                      </div>
                      <div>
                        {brandForm.copyright || '© 2026 Seulban Life Inc. All rights reserved.'}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* 하단 저장 버튼 Bar */}
              <div className="bg-[#FAF8F5] p-4 border border-[#E2DDD3] flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  변경 사항은 저장 즉시 Convex 데이터베이스와 브라우저 DOM 메타태그에 실시간 동기화됩니다.
                </span>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#144A42] text-white font-bold text-xs sm:text-sm hover:bg-[#0D3832] transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckIcon className="w-4 h-4 text-[#C5A880]" />
                  <span>사이트 설정 & SEO 저장하기</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================
            TAB 7: 보안 및 비밀번호 설정 (SETTINGS)
            ======================================================== */}
        {currentTab === 'settings' && (
          <div className="space-y-6 max-w-2xl animate-fade-in">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">SECURITY & CREDENTIALS</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142C27] tracking-tight">
                관리자 계정 및 비밀번호 설정
              </h2>
              <p className="text-xs text-[#6B7973] mt-1">
                관리자 페이지에 로그인할 때 사용할 관리자 ID와 비밀번호를 직접 설정할 수 있습니다.
              </p>
            </div>

            <form onSubmit={handleUpdateSecurity} className="bg-white p-6 sm:p-8 border border-[#E2DDD3] shadow-xs space-y-5 text-xs">
              
              <div className="p-4 bg-[#FAF8F5] border border-[#ECE5D8] space-y-1">
                <span className="font-bold text-[#144A42] block">안내사항</span>
                <p className="text-[#65736D] leading-relaxed">
                  비밀번호를 변경하면 다음 로그인 시 변경된 비밀번호로 접속해야 합니다. 브라우저 저장소에 안전하게 유지됩니다.
                </p>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-[#2C3833]">관리자 아이디 (ID)</label>
                <input
                  type="text"
                  value={pwdForm.newUsername}
                  onChange={(e) => setPwdForm({...pwdForm, newUsername: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                  required
                />
                <span className="text-[11px] text-gray-400 mt-1 block">현재 아이디: {adminUsername}</span>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block font-bold mb-1.5 text-[#2C3833]">현재 비밀번호 확인 *</label>
                <input
                  type="password"
                  value={pwdForm.currentPwd}
                  onChange={(e) => setPwdForm({...pwdForm, currentPwd: e.target.value})}
                  placeholder="현재 비밀번호를 입력하세요"
                  className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-[#2C3833]">새 비밀번호 (4자리 이상)</label>
                <input
                  type="password"
                  value={pwdForm.newPwd}
                  onChange={(e) => setPwdForm({...pwdForm, newPwd: e.target.value})}
                  placeholder="새로 설정할 비밀번호"
                  className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-[#2C3833]">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={pwdForm.confirmPwd}
                  onChange={(e) => setPwdForm({...pwdForm, confirmPwd: e.target.value})}
                  placeholder="새 비밀번호를 한 번 더 입력하세요"
                  className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#144A42] text-white font-bold hover:bg-[#0D3832] transition shadow-xs flex items-center gap-2"
                >
                  <ShieldCheckIcon className="w-4 h-4 text-[#C5A880]" />
                  <span>관리자 계정 / 비밀번호 저장</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Admin Footer */}
      <footer className="bg-[#142C27] text-gray-400 text-xs py-4 border-t border-[#1C3B34] text-center">
        <span>© 2026 Seulban Life Management System. 모든 변경 사항은 실시간 반영됩니다.</span>
      </footer>
    </div>
  );
}