import React, { useState } from 'react';
import { 
  LogoEmblem, PawIcon, HeartIcon, HomeIcon, ScissorsIcon, 
  StethoscopeIcon, FlowerIcon, SparklesIcon, ShieldCheckIcon, 
  CheckIcon, XIcon, SearchIcon, PhoneIcon, MapPinIcon, 
  ArrowRight, ClockIcon, UserIcon, ExternalLinkIcon
} from '../components/Icons';

export default function AdminPage({
  onNavigateHome,
  applications,
  onUpdateAppStatus,
  partners,
  onAddPartner,
  onDeletePartner,
  adoptionList,
  onAddAdoption,
  onDeleteAdoption,
  travelList,
  onAddTravel,
  onDeleteTravel,
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
    featured: false
  });

  const [isAddAdoptionOpen, setIsAddAdoptionOpen] = useState(false);
  const [newAdoption, setNewAdoption] = useState({
    name: '',
    breed: '믹스견',
    gender: '남아 (중성화 완료)',
    age: '1살 추정',
    weight: '6.5kg',
    center: '한국 동물사랑나눔 보호센터',
    story: '애교가 많고 온순하여 가족을 기다리는 착한 친구입니다.',
    tags: '애교만점, 사회성 우수',
    status: '입양 상담 가능'
  });

  const [isAddTravelOpen, setIsAddTravelOpen] = useState(false);
  const [newTravel, setNewTravel] = useState({
    type: '리조트',
    name: '',
    location: '',
    weightLimit: '전 견종 가능',
    price: '150,000원~',
    features: '천연잔디 운동장, 수영장, 바베큐',
    memberBenefit: '주중 20% 특별 우대',
    phone: '033-000-0000'
  });

  // Password change settings state
  const [pwdForm, setPwdForm] = useState({
    currentPwd: '',
    newUsername: adminUsername,
    newPwd: '',
    confirmPwd: ''
  });

  // Brand edit state
  const [brandForm, setBrandForm] = useState({ ...brandInfo });

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
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-[#144A42] hover:underline font-semibold"
          >
            <span>← 슬반생 서비스 홈으로 돌아가기</span>
          </button>
          <span className="text-gray-400">보안 관리자 콘솔</span>
        </div>

        {/* Login Box */}
        <div className="bg-white w-full max-w-md border border-[#DDD5C7] shadow-xl p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#144A42] text-[#D4AF7A] mx-auto rounded-full flex items-center justify-center shadow-md">
              <ShieldCheckIcon className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-bold tracking-widest text-[#B48B55] uppercase block pt-2">
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
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
              <LogoEmblem className="w-8 h-8 bg-[#1E3E37] text-[#D4AF7A]" />
              <div>
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  슬반생 <span className="text-xs px-1.5 py-0.5 bg-[#2A4D45] text-[#D4AF7A] font-medium border border-[#3E655B]">ADMIN</span>
                </span>
              </div>
            </div>

            {/* Menu Tabs in Header */}
            <nav className="hidden lg:flex items-center gap-1 ml-6 text-xs font-semibold">
              {[
                { id: 'dashboard', label: '대시보드 요약' },
                { id: 'applications', label: `동물등록 관리 (${applications.length})` },
                { id: 'partners', label: `제휴처 관리 (${partners.length})` },
                { id: 'adoption', label: `안심입양 관리 (${adoptionList.length})` },
                { id: 'travel', label: `반려여행 관리 (${travelList.length})` },
                { id: 'brand', label: '브랜드·고객센터' },
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
            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 bg-[#1F3D36] hover:bg-[#284E45] text-gray-200 border border-[#2D564D] flex items-center gap-1 transition"
            >
              <ExternalLinkIcon className="w-3.5 h-3.5" />
              <span>사용자 화면 보기</span>
            </button>
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
            { id: 'partners', label: '제휴처' },
            { id: 'adoption', label: '안심입양' },
            { id: 'travel', label: '반려여행' },
            { id: 'brand', label: '브랜드정보' },
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
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentTab('applications')}
                  className="px-4 py-2 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition flex items-center gap-1.5"
                >
                  <PawIcon className="w-4 h-4 text-[#C5A880]" />
                  <span>동물등록 신청 바로보기</span>
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 border border-[#E2DDD3] shadow-xs">
                <span className="text-xs text-gray-500 font-medium">동물등록 접수 총계</span>
                <p className="text-3xl font-black text-[#144A42] mt-2">{applications.length}건</p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 w-fit">
                  <span>검수/승인 대기: {applications.filter(a => a.statusCode === 'SUBMITTED' || a.statusCode === 'REVIEWING').length}건</span>
                </div>
              </div>

              <div className="bg-white p-6 border border-[#E2DDD3] shadow-xs">
                <span className="text-xs text-gray-500 font-medium">등록 제휴처</span>
                <p className="text-3xl font-black text-[#144A42] mt-2">{partners.length}곳</p>
                <p className="text-[11px] text-gray-500 mt-3">병원, 미용, 스파 등 엄선 제휴</p>
              </div>

              <div className="bg-white p-6 border border-[#E2DDD3] shadow-xs">
                <span className="text-xs text-gray-500 font-medium">안심 입양 등록 아이들</span>
                <p className="text-3xl font-black text-[#144A42] mt-2">{adoptionList.length}마리</p>
                <p className="text-[11px] text-gray-500 mt-3">지자체 공인 센터 연계</p>
              </div>

              <div className="bg-white p-6 border border-[#E2DDD3] shadow-xs">
                <span className="text-xs text-gray-500 font-medium">엄선 동반 여행지</span>
                <p className="text-3xl font-black text-[#144A42] mt-2">{travelList.length}곳</p>
                <p className="text-[11px] text-gray-500 mt-3">리조트, 독채펜션, 글램핑</p>
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
                            <span className="font-bold text-emerald-800 block">{app.petName}</span>
                            <span className="text-[11px] text-gray-500">
                              {app.petBreed || '말티즈'} • {app.petGender || '남아'} ({app.petBirth || '2023.05.10'})
                            </span>
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
                          <td className="p-3.5 text-right">
                            <select
                              value={app.statusCode}
                              onChange={(e) => onUpdateAppStatus(app.id, e.target.value)}
                              className="text-xs font-bold px-2.5 py-1.5 border border-[#D0C9BD] bg-white focus:outline-none focus:border-[#144A42] text-[#144A42]"
                            >
                              {statuses.map((s) => (
                                <option key={s.code} value={s.code}>{s.label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: 제휴처 관리 (PARTNERS)
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
                <div key={partner.id} className="bg-white border border-[#E2DDD3] p-5 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-[#144A42] bg-[#E8E0D1] px-2.5 py-0.5">
                        {partner.categoryName} • {partner.tag}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`[${partner.name}] 제휴처를 정말 삭제하시겠습니까?`)) {
                            onDeletePartner(partner.id);
                          }
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        삭제
                      </button>
                    </div>

                    <h4 className="font-bold text-base text-[#142C27]">{partner.name}</h4>
                    <p className="text-xs text-[#717E78] flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5 text-[#889891]" />
                      {partner.location}
                    </p>

                    <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] text-xs space-y-1">
                      <p className="font-bold text-[#144A42]">{partner.benefit}</p>
                      <p className="text-[11px] text-[#65736D] line-clamp-2">{partner.desc}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 mt-4">
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
                            setNewPartner({
                              ...newPartner, 
                              category: e.target.value,
                              categoryName: catNames[e.target.value] || '기타'
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
                <div key={animal.id} className="bg-white border border-[#E2DDD3] p-5 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                        {animal.status}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`[${animal.name}] 정보를 정말 삭제하시겠습니까?`)) {
                            onDeleteAdoption(animal.id);
                          }
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        삭제
                      </button>
                    </div>

                    <h4 className="font-bold text-lg text-[#142C27]">{animal.name}</h4>
                    <p className="text-xs text-gray-500 font-semibold">{animal.breed} • {animal.gender}</p>
                    <p className="text-xs text-gray-500">나이: {animal.age} | 몸무게: {animal.weight}</p>

                    <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] text-xs text-[#52605A] leading-relaxed">
                      {animal.story}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-400 mt-4">
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
                <div key={item.id} className="bg-white border border-[#E2DDD3] p-5 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-[#144A42] bg-[#E8E0D1] px-2 py-0.5">
                        {item.type}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`[${item.name}] 숙소를 정말 삭제하시겠습니까?`)) {
                            onDeleteTravel(item.id);
                          }
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        삭제
                      </button>
                    </div>

                    <h4 className="font-bold text-base text-[#142C27]">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.location}</p>
                    <p className="text-xs text-gray-500 font-semibold">{item.weightLimit} | {item.price}</p>

                    <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D6] text-xs space-y-1">
                      <p className="font-bold text-[#144A42]">회원 혜택: {item.memberBenefit}</p>
                      <p className="text-[11px] text-gray-500">시설: {Array.isArray(item.features) ? item.features.join(', ') : item.features}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 mt-4">
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
                        등록 완료
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 6: 브랜드 및 고객센터 설정 (BRAND)
            ======================================================== */}
        {currentTab === 'brand' && (
          <div className="space-y-6 max-w-3xl animate-fade-in">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#B48B55] uppercase">COMPANY INFO</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142C27] tracking-tight">
                브랜드 및 고객센터 정보 설정
              </h2>
              <p className="text-xs text-[#6B7973] mt-1">
                웹사이트 상단바, 푸터, 긴급 전화 플로팅 버튼에 노출되는 연락처 및 사업자 정보를 관리합니다.
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateBrandInfo(brandForm);
              showToast('브랜드 및 고객센터 정보가 업데이트되었습니다.');
            }} className="bg-white p-6 sm:p-8 border border-[#E2DDD3] shadow-xs space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">일반 고객센터 전화번호</label>
                  <input
                    type="text"
                    value={brandForm.phone1}
                    onChange={(e) => setBrandForm({...brandForm, phone1: e.target.value})}
                    className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">24시 긴급 응급/장례 직통번호</label>
                  <input
                    type="text"
                    value={brandForm.phone2}
                    onChange={(e) => setBrandForm({...brandForm, phone2: e.target.value})}
                    className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">대표 이메일 주소</label>
                <input
                  type="email"
                  value={brandForm.email}
                  onChange={(e) => setBrandForm({...brandForm, email: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">슬반생몰 쇼핑몰 외부 URL</label>
                <input
                  type="url"
                  value={brandForm.mallUrl}
                  onChange={(e) => setBrandForm({...brandForm, mallUrl: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">회사 주소</label>
                <input
                  type="text"
                  value={brandForm.address}
                  onChange={(e) => setBrandForm({...brandForm, address: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#144A42] text-white font-bold hover:bg-[#0D3832] transition shadow-xs"
                >
                  기본 정보 저장하기
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