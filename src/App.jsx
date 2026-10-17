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
import MallPage from './pages/MallPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';

import { 
  ApplyRegistrationModal, 
  MembershipModal, 
  PartnerModal, 
  ShopPartnerModal,
  LoginModal, 
  AdminModal,
  MainPopupModal,
  MallPreparingModal,
  QuickConsultModal,
  PolicyViewerModal
} from './components/Modals';
import { updateSeoMeta } from './utils/seoHelper';

import { PhoneIcon, SparklesIcon, PawIcon, MessageSquare, KakaoIcon, HeadphoneIcon } from './components/Icons';
import { useQuery, useMutation } from 'convex/react';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import { 
  INITIAL_PET, 
  INITIAL_APPLICATION, 
  BRAND_INFO, 
  PARTNER_LIST, 
  ADOPTION_LIST, 
  TRAVEL_LIST,
  INITIAL_POPUPS,
  INITIAL_SHOP_ORDERS,
  REDPUPPY_PRODUCTS,
  DEFAULT_MENU_VISIBILITY
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

  // User State (null by default for real sign-up/login, persisted in localStorage)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('seulban_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  // Convex Hooks & Queries (Reactive backend synchronization)
  const convexApps = useQuery(api.applications.list);
  const convexPets = useQuery(api.pets.list);
  const convexPartners = useQuery(api.partners.list);
  const convexAdoptions = useQuery(api.adoptions.list);
  const convexTravels = useQuery(api.travels.list);
  const convexPopups = useQuery(api.popups.list);
  const convexBrand = useQuery(api.settings.get, { key: 'brand_info' });
  const convexMenuVisibility = useQuery(api.settings.get, { key: 'menu_visibility' });
  const convexShopOrders = useQuery(api.settings.get, { key: 'shop_orders' });
  const convexConsultations = useQuery(api.settings.get, { key: 'consultations' });

  // Convex Mutations
  const submitAppMutation = useMutation(api.applications.submit);
  const updateAppStatusMutation = useMutation(api.applications.updateStatus);
  const updateAppMutation = useMutation(api.applications.update);
  const removeAppMutation = useMutation(api.applications.remove);
  const savePetMutation = useMutation(api.pets.save);
  const addPartnerMutation = useMutation(api.partners.add);
  const updatePartnerMutation = useMutation(api.partners.update);
  const removePartnerMutation = useMutation(api.partners.remove);
  const syncPartnersMutation = useMutation(api.partners.syncAll);
  const addAdoptionMutation = useMutation(api.adoptions.add);
  const updateAdoptionMutation = useMutation(api.adoptions.update);
  const removeAdoptionMutation = useMutation(api.adoptions.remove);
  const syncAdoptionsMutation = useMutation(api.adoptions.syncAll);
  const addTravelMutation = useMutation(api.travels.add);
  const updateTravelMutation = useMutation(api.travels.update);
  const removeTravelMutation = useMutation(api.travels.remove);
  const syncTravelsMutation = useMutation(api.travels.syncAll);
  const addPopupMutation = useMutation(api.popups.add);
  const togglePopupMutation = useMutation(api.popups.toggleActive);
  const removePopupMutation = useMutation(api.popups.remove);
  const syncPopupsMutation = useMutation(api.popups.syncAll);
  const setSettingMutation = useMutation(api.settings.set);
  const syncSettingsMutation = useMutation(api.settings.syncAllSettings);

  // 기존 브라우저 로컬 스토리지에 남아있던 구버전 데이터 캐시 일괄 정리 (모든 PC에서 운영 서버 단일 데이터만 참조)
  useEffect(() => {
    const legacyKeys = [
      'seulban_partners',
      'seulban_adoption',
      'seulban_travel',
      'seulban_brand',
      'seulban_popups',
      'seulban_consultations',
      'seulban_shop_orders',
      'seulban_menu_visibility',
      'seulban_applications',
    ];
    legacyKeys.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
  }, []);

  // In-memory optimistic state (used only while Convex queries load or mutations are in flight)
  const [localPet, setLocalPet] = useState(null);
  const [localApplications, setLocalApplications] = useState([]);

  // Server truth from Convex (with in-flight optimistic fallback only before server responds)
  const applications = React.useMemo(() => {
    const source = convexApps !== undefined ? convexApps : localApplications;
    return [...(source || [])].sort((a, b) => {
      return (b.appliedDate || '').localeCompare(a.appliedDate || '');
    });
  }, [convexApps, localApplications]);

  // Filter applications specifically for the logged-in user
  const userApplications = React.useMemo(() => {
    if (!user) return [];
    return applications.filter(app => {
      if (user.email && app.ownerEmail && app.ownerEmail.trim().toLowerCase() === user.email.trim().toLowerCase()) return true;
      const cleanUserPhone = (user.phone || '').replace(/[^0-9]/g, '');
      const cleanAppPhone = (app.phone || '').replace(/[^0-9]/g, '');
      if (cleanUserPhone && cleanAppPhone && cleanUserPhone === cleanAppPhone) return true;
      if (user.name && app.ownerName && app.ownerName.trim() === user.name.trim()) return true;
      return false;
    });
  }, [user, applications]);

  // Pet profile specifically for the logged-in user
  const userPet = React.useMemo(() => {
    if (!user) return null;

    // 1) Match from Convex pets list
    if (convexPets && convexPets.length > 0) {
      const cleanUserPhone = (user.phone || '').replace(/[^0-9]/g, '');
      const match = convexPets.find(p => {
        if (user.email && p.ownerEmail && p.ownerEmail.trim().toLowerCase() === user.email.trim().toLowerCase()) return true;
        const cleanPetPhone = (p.ownerPhone || '').replace(/[^0-9]/g, '');
        if (cleanUserPhone && cleanPetPhone && cleanUserPhone === cleanPetPhone) return true;
        if (user.name && p.ownerName && p.ownerName.trim() === user.name.trim()) return true;
        return false;
      });
      if (match) return match;
    }

    // 2) Match from user's submitted applications (newest first)
    if (userApplications && userApplications.length > 0) {
      const latestApp = userApplications[0];
      return {
        id: `pet_${latestApp.id}`,
        name: latestApp.petName,
        breed: latestApp.petBreed || '믹스/기타',
        gender: latestApp.petGender || '남아',
        birth: latestApp.petBirth || '2024-01-01',
        weight: latestApp.petWeight || '3.5',
        neutered: '완료',
        regNumber: (latestApp.statusCode === 'REGISTERED' || latestApp.statusCode === 'COMPLETED')
          ? (latestApp.trackingNumber || '4101000' + latestApp.id.replace(/[^0-9]/g, '').slice(-8))
          : '심사 진행 중',
        status: latestApp.statusLabel || '등록 신청 중',
        photoUrl: latestApp.petPhoto || '',
      };
    }

    // 3) Match from in-memory localPet state
    if (localPet) {
      const isOwner = (user.email && localPet.ownerEmail && localPet.ownerEmail.trim().toLowerCase() === user.email.trim().toLowerCase())
        || (user.name && localPet.ownerName && localPet.ownerName.trim() === user.name.trim());
      if (isOwner) return localPet;
    }

    return null;
  }, [user, convexPets, userApplications, localPet]);

  // Bookmarks State (isolated per user or guest)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const savedUser = localStorage.getItem('seulban_user');
      const u = savedUser ? JSON.parse(savedUser) : null;
      const key = u ? `seulban_bookmarks_${u.email}` : 'seulban_bookmarks';
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const key = user ? `seulban_bookmarks_${user.email}` : 'seulban_bookmarks';
      const saved = localStorage.getItem(key);
      setBookmarks(saved ? JSON.parse(saved) : []);
    } catch {
      setBookmarks([]);
    }
  }, [user]);

  // Server-driven Content States (Convex Server is Single Source of Truth)
  const [localPartners, setLocalPartners] = useState([]);
  const rawPartners = convexPartners !== undefined ? convexPartners : localPartners;

  const partners = React.useMemo(() => {
    return (rawPartners || []).map(p => {
      let b = p.benefit || '전 상품 20% 회원 단독 할인';
      if (b.includes('25%')) {
        b = b.replace('25%', '20%');
      }
      let prods = p.products;
      if (!prods || prods.length === 0) {
        if (p.id === 'p_redpuppy' || p.partnerType === 'shop' || p.name?.includes('레드퍼피')) {
          prods = REDPUPPY_PRODUCTS;
        }
      }
      return {
        ...p,
        benefit: b,
        discountRate: p.discountRate === 25 ? 20 : (p.discountRate || 20),
        products: prods
      };
    });
  }, [convexPartners, localPartners]);

  const [localAdoptionList, setLocalAdoptionList] = useState([]);
  const adoptionList = convexAdoptions !== undefined ? convexAdoptions : localAdoptionList;

  const [localTravelList, setLocalTravelList] = useState([]);
  const travelList = convexTravels !== undefined ? convexTravels : localTravelList;

  const [localBrandInfo, setLocalBrandInfo] = useState(BRAND_INFO);
  const brandInfo = (convexBrand && typeof convexBrand === 'object')
    ? { ...BRAND_INFO, ...convexBrand }
    : localBrandInfo;

  // Real-time SEO Meta and Favicon synchronization
  useEffect(() => {
    if (brandInfo) {
      updateSeoMeta(brandInfo);
    }
  }, [brandInfo]);

  // Popups State
  const [localPopups, setLocalPopups] = useState([]);
  const popups = convexPopups !== undefined ? convexPopups : localPopups;

  // Consultations State (빠른상담 신청 내역)
  const [localConsultations, setLocalConsultations] = useState([]);
  const consultations = (convexConsultations && Array.isArray(convexConsultations))
    ? convexConsultations
    : localConsultations;

  // Shop Orders State (제휴 쇼핑몰 주문 내역)
  const [localShopOrders, setLocalShopOrders] = useState(INITIAL_SHOP_ORDERS);
  const shopOrders = (convexShopOrders && Array.isArray(convexShopOrders))
    ? convexShopOrders
    : localShopOrders;

  const handleCreateShopOrder = async (newOrder) => {
    const updated = [newOrder, ...shopOrders];
    setLocalShopOrders(updated);
    try {
      await setSettingMutation({ key: 'shop_orders', value: updated });
    } catch (e) {
      console.warn('Convex save shop_orders note:', e);
    }
    showToast(`[${newOrder.partnerName}] 회원 특가 주문이 성공적으로 접수되었습니다!`);
  };

  const handleUpdateShopOrderStatus = async (orderId, newStatus, shippingInfo) => {
    const statusMap = {
      ORDERED: '주문 접수',
      PAID: '결제/입금 확인',
      PREPARING: '배송 준비중',
      SHIPPING: '배송중',
      DELIVERED: '배송 완료',
      CANCELLED: '주문 취소'
    };
    const updated = shopOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          statusLabel: statusMap[newStatus] || newStatus,
          ...(shippingInfo || {})
        };
      }
      return o;
    });
    setLocalShopOrders(updated);
    try {
      await setSettingMutation({ key: 'shop_orders', value: updated });
    } catch (e) {
      console.warn('Convex save shop_orders note:', e);
    }
    showToast('주문 및 배송 정보가 성공적으로 변경되었습니다.');
  };

  const handleDeleteShopOrder = async (orderId) => {
    const updated = shopOrders.filter(o => o.id !== orderId);
    setLocalShopOrders(updated);
    try {
      await setSettingMutation({ key: 'shop_orders', value: updated });
    } catch (e) {
      console.warn('Convex save shop_orders note:', e);
    }
    showToast('주문 내역이 삭제되었습니다.');
  };

  // Modals
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [mallModalOpen, setMallModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedShopPartner, setSelectedShopPartner] = useState(null);
  const [quickConsultOpen, setQuickConsultOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState({ isOpen: false, type: 'privacy' });

  // Navigation Menu Visibility State (어드민에서 메뉴 숨김/노출 제어)
  const [localMenuVisibility, setLocalMenuVisibility] = useState(DEFAULT_MENU_VISIBILITY);
  const menuVisibility = (convexMenuVisibility && typeof convexMenuVisibility === 'object')
    ? { ...DEFAULT_MENU_VISIBILITY, ...convexMenuVisibility }
    : localMenuVisibility;

  const handleUpdateMenuVisibility = async (newVisibility) => {
    setLocalMenuVisibility(newVisibility);
    try {
      await setSettingMutation({ key: 'menu_visibility', value: newVisibility });
    } catch (e) {
      console.warn('Convex save menu_visibility note:', e);
    }
    showToast('메뉴 노출 설정이 저장되었습니다.');
  };

  // Floating consult widget state
  const [floatingMenuOpen, setFloatingMenuOpen] = useState(false);

  // Toast message
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddConsultation = async (newConsult) => {
    const item = {
      id: `CS-${Date.now()}`,
      status: 'PENDING',
      ...newConsult
    };
    const updated = [item, ...consultations];
    setLocalConsultations(updated);
    try {
      await setSettingMutation({ key: 'consultations', value: updated });
    } catch (e) {
      console.warn('Convex save consultations note:', e);
    }
    showToast('빠른 상담 신청이 성공적으로 접수되었습니다.');
  };

  const handleDeleteConsultation = async (id) => {
    const updated = consultations.filter(c => (c.id !== id && c._id !== id));
    setLocalConsultations(updated);
    try {
      await setSettingMutation({ key: 'consultations', value: updated });
    } catch (e) {
      console.warn('Convex save consultations note:', e);
    }
    showToast('상담 신청 건이 삭제되었습니다.');
  };

  const handleUpdateConsultStatus = async (id, newStatus) => {
    const updated = consultations.map(c => (c.id === id || c._id === id) ? { ...c, status: newStatus } : c);
    setLocalConsultations(updated);
    try {
      await setSettingMutation({ key: 'consultations', value: updated });
    } catch (e) {
      console.warn('Convex save consultations note:', e);
    }
    showToast(`상담 처리 상태가 [${newStatus === 'COMPLETED' ? '상담 완료' : '상담 대기'}]로 변경되었습니다.`);
  };

  // Convex는 실시간 WebSocket 구독으로 자동 갱신됨
  const handleRefreshAdminData = () => {};

  // 1. 동물등록 신청 접수 (Convex DB 실시간 저장)
  const handleApplySuccess = async (newApp, newPet) => {
    const ownerEmail = user?.email || newApp.ownerEmail || '';
    const appWithOwner = {
      ...newApp,
      ownerEmail,
    };

    if (user && !user.phone && newApp.phone) {
      const updatedUser = { ...user, phone: newApp.phone };
      setUser(updatedUser);
      try {
        localStorage.setItem('seulban_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }

    const updatedApps = [appWithOwner, ...applications.filter(a => a.id !== newApp.id)];
    setLocalApplications(updatedApps);

    let updatedPet = null;
    if (newPet) {
      updatedPet = {
        ...newPet,
        id: `pet_${appWithOwner.id}`,
        ownerEmail,
        ownerName: newApp.ownerName,
        ownerPhone: newApp.phone,
      };
      setLocalPet(updatedPet);
    }

    try {
      await submitAppMutation({
        id: appWithOwner.id,
        type: appWithOwner.type,
        petName: appWithOwner.petName,
        petPhoto: appWithOwner.petPhoto || '',
        petBreed: newPet?.breed || '믹스/기타',
        petGender: newPet?.gender || '남아',
        petBirth: newPet?.birth || '2024-01-01',
        petWeight: String(newPet?.weight || '3.5'),
        ownerName: appWithOwner.ownerName,
        phone: appWithOwner.phone,
        ownerEmail,
        address: appWithOwner.address || '',
        shippingAddress: appWithOwner.shippingAddress || '',
        statusCode: appWithOwner.statusCode || 'SUBMITTED',
        statusLabel: appWithOwner.statusLabel || '접수 완료 (검수 대기)',
        appliedDate: appWithOwner.appliedDate || new Date().toLocaleString('ko-KR'),
        trackingNumber: appWithOwner.trackingNumber || '검수 후 발송 준비 예정',
        history: appWithOwner.history || [
          { date: '방금 전', title: '온라인 신청서 접수', desc: '담당자 검수 대기 중입니다.' }
        ]
      });

      if (updatedPet) {
        await savePetMutation({
          id: updatedPet.id,
          name: updatedPet.name,
          breed: updatedPet.breed,
          gender: updatedPet.gender,
          birth: updatedPet.birth,
          weight: String(updatedPet.weight || '3.5'),
          neutered: updatedPet.neutered || '완료',
          regNumber: updatedPet.regNumber || '발급 심사 진행 중',
          status: updatedPet.status || '등록 신청 중',
          photoUrl: updatedPet.photoUrl || '',
          ownerPhone: newApp.phone,
          ownerEmail,
          ownerName: newApp.ownerName,
        });
      }
      console.log('✅ Convex DB 동물등록 신청서 및 반려동물 데이터 저장 완료:', newApp.id);
    } catch (err) {
      console.error('Convex DB sync error:', err);
    }

    showToast('동물등록 신청서가 성공적으로 접수되었습니다!');
  };

  const handleLeadSubmit = (leadData) => {
    showToast(`${leadData.name}님, 멤버십 사전예약 혜택이 정상 접수되었습니다!`);
  };

  const handleToggleBookmark = (id) => {
    const updated = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id) 
      : [...bookmarks, id];
    setBookmarks(updated);
    const key = user ? `seulban_bookmarks_${user.email}` : 'seulban_bookmarks';
    localStorage.setItem(key, JSON.stringify(updated));
    showToast(bookmarks.includes(id) ? '찜 목록에서 제거되었습니다.' : '제휴처를 찜 목록에 저장했습니다.');
  };

  // 2. 동물등록 신청 상태 변경 (Convex DB 연동)
  const handleUpdateAppStatus = async (appId, newStatusCode) => {
    const statusMap = {
      SUBMITTED: '접수 완료',
      REVIEWING: '서류 검수 중',
      ACCEPTED: '처리 승인 (지자체 심사)',
      REGISTERED: '등록번호 발급 완료',
      SHIPPING: '인식표 배송 출발 (우체국)',
      COMPLETED: '처리 완료',
    };
    const newStatusLabel = statusMap[newStatusCode] || newStatusCode;

    const updated = applications.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          statusCode: newStatusCode,
          statusLabel: newStatusLabel,
          history: [
            { 
              date: '방금 전', 
              title: `상태 변경: ${newStatusLabel}`, 
              desc: '관리자 콘솔에서 변경 처리되었습니다.' 
            },
            ...(app.history || [])
          ]
        };
      }
      return app;
    });
    setLocalApplications(updated);

    try {
      await updateAppStatusMutation({
        id: appId,
        statusCode: newStatusCode,
        statusLabel: newStatusLabel
      });
    } catch (err) {
      console.warn('Convex DB status update error:', err);
    }

    showToast(`접수건(${appId}) 상태가 [${newStatusLabel}]로 변경되었습니다.`);
  };

  // 3. 동물등록 신청 내역 수정 (Convex DB 연동)
  const handleUpdateApplication = async (updatedApp) => {
    const appId = updatedApp.id;
    const updated = applications.map(a => (a.id === appId ? { ...a, ...updatedApp } : a));
    setLocalApplications(updated);

    try {
      await updateAppMutation({
        id: appId,
        ownerName: updatedApp.ownerName,
        phone: updatedApp.phone,
        address: updatedApp.address,
        shippingAddress: updatedApp.shippingAddress,
        petName: updatedApp.petName,
        petPhoto: updatedApp.petPhoto,
        petBreed: updatedApp.petBreed,
        petGender: updatedApp.petGender,
        petBirth: updatedApp.petBirth,
        petWeight: updatedApp.petWeight,
        type: updatedApp.type,
        trackingNumber: updatedApp.trackingNumber,
        statusCode: updatedApp.statusCode,
        statusLabel: updatedApp.statusLabel,
      });
    } catch (err) {
      console.warn('Convex DB updateApp error:', err);
    }

    showToast(`신청서(${appId}) 정보가 성공적으로 수정되었습니다.`);
  };

  // 4. 동물등록 신청 내역 삭제 (Convex DB 연동)
  const handleDeleteApplication = async (appId) => {
    const updated = applications.filter(app => app.id !== appId);
    setLocalApplications(updated);

    try {
      await removeAppMutation({ id: appId });
    } catch (err) {
      console.warn('Convex DB removeApp error:', err);
    }

    showToast(`신청 내역(${appId})이 삭제되었습니다.`);
  };

  // Helper to remove any undefined or invalid Convex serialization values
  const sanitizeForConvex = (obj) => {
    if (obj === undefined || obj === null) return null;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeForConvex(item));
    }
    const clean = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) {
        clean[k] = sanitizeForConvex(v);
      }
    }
    return clean;
  };

  // Convex 서버 저장 전 유효성 정리 (undefined 제거)
  const preparePartnersForConvex = (partnersList) => {
    return (partnersList || []).map(p => {
      const { _id, _creationTime, ...rest } = p;
      return sanitizeForConvex(rest);
    });
  };

  const handleAddPartner = async (newPartner) => {
    const partnerToSave = {
      ...newPartner,
      id: newPartner.id || `p_${Date.now()}`,
      rating: Number(newPartner.rating) || 4.9,
      reviews: Number(newPartner.reviews) || 50,
      color: newPartner.color || 'bg-[#EBF3FB] text-[#2563EB]',
      icon: newPartner.icon || 'stethoscope',
      imageUrl: newPartner.imageUrl || '',
      featured: !!newPartner.featured,
    };
    setLocalPartners(prev => [partnerToSave, ...prev]);

    try {
      const safePartner = preparePartnersForConvex([partnerToSave])[0];
      await addPartnerMutation(safePartner);
      showToast(`[${partnerToSave.name}] 제휴처가 서버에 성공적으로 등록되었습니다.`);
    } catch (e) {
      console.error('Convex addPartner error:', e);
      showToast('제휴처 서버 등록 오류: ' + (e?.message || e));
    }
  };

  const handleUpdatePartner = async (updatedPartner) => {
    const pId = updatedPartner._id || updatedPartner.id;
    setLocalPartners(prev => prev.map(p => (p._id === pId || p.id === pId) ? { ...p, ...updatedPartner } : p));

    try {
      const safePartner = preparePartnersForConvex([updatedPartner])[0];
      await updatePartnerMutation({
        id: updatedPartner.id || (typeof updatedPartner._id === 'string' ? updatedPartner._id : undefined),
        ...safePartner,
      });
      showToast('제휴처 정보가 운영서버에 수정 반영되었습니다.');
    } catch (e) {
      console.error('Convex updatePartner error:', e);
      showToast('제휴처 수정 오류: ' + (e?.message || e));
    }
  };

  const handleDeletePartner = async (partnerOrId) => {
    let idToDelete = partnerOrId;
    let customId = null;
    let convexId = null;

    if (typeof partnerOrId === 'object' && partnerOrId !== null) {
      customId = partnerOrId.id;
      convexId = partnerOrId._id;
      idToDelete = convexId || customId;
    } else if (typeof partnerOrId === 'string') {
      idToDelete = partnerOrId;
      const found = partners.find(p => p._id === partnerOrId || p.id === partnerOrId);
      if (found) {
        customId = found.id;
        convexId = found._id;
      }
    }

    setLocalPartners(prev => prev.filter(p => p.id !== idToDelete && p._id !== idToDelete && p.id !== customId && p._id !== convexId));

    try {
      if (convexId) {
        await removePartnerMutation({ id: String(convexId) });
      }
      if (customId && customId !== convexId) {
        await removePartnerMutation({ id: String(customId) });
      }
      if (!convexId && !customId && idToDelete) {
        await removePartnerMutation({ id: String(idToDelete) });
      }
      showToast('제휴처가 운영서버에서 즉시 삭제되었습니다.');
    } catch (e) {
      console.error('Convex removePartner error:', e);
      showToast('제휴처 삭제 오류: ' + (e?.message || e));
    }
  };

  const PROD_CONVEX_URL = 'https://uncommon-opossum-624.convex.cloud';

  const handleAddAdoption = async (newAnimal) => {
    const itemToSave = {
      ...newAnimal,
      id: newAnimal.id || `a_${Date.now()}`,
      weight: newAnimal.weight || '5kg',
      center: newAnimal.center || '한국 동물사랑나눔 보호센터',
      story: newAnimal.story || '',
      tags: Array.isArray(newAnimal.tags) ? newAnimal.tags : [newAnimal.tags].filter(Boolean),
      status: newAnimal.status || '입양 상담 가능',
      photoUrl: newAnimal.photoUrl || '',
    };
    const updated = [itemToSave, ...adoptionList];
    setLocalAdoptionList(updated);

    try {
      await addAdoptionMutation({
        id: itemToSave.id,
        name: itemToSave.name,
        breed: itemToSave.breed,
        gender: itemToSave.gender,
        age: itemToSave.age,
        weight: itemToSave.weight,
        center: itemToSave.center,
        story: itemToSave.story,
        tags: itemToSave.tags,
        status: itemToSave.status,
        photoUrl: itemToSave.photoUrl,
      });
    } catch (e) {
      console.warn('Convex addAdoption note:', e);
    }
    showToast('새로운 입양 동물이 등록되었습니다.');
  };

  const handleUpdateAdoption = async (updatedAnimal) => {
    const aId = updatedAnimal._id || updatedAnimal.id;
    const updated = adoptionList.map(a => (a._id === aId || a.id === aId ? { ...a, ...updatedAnimal } : a));
    setLocalAdoptionList(updated);

    try {
      await updateAdoptionMutation({
        id: String(updatedAnimal.id || updatedAnimal._id),
        name: updatedAnimal.name,
        breed: updatedAnimal.breed,
        gender: updatedAnimal.gender,
        age: updatedAnimal.age,
        weight: updatedAnimal.weight,
        center: updatedAnimal.center,
        story: updatedAnimal.story,
        tags: Array.isArray(updatedAnimal.tags) ? updatedAnimal.tags : [updatedAnimal.tags].filter(Boolean),
        status: updatedAnimal.status,
        photoUrl: updatedAnimal.photoUrl || '',
      });
    } catch (e) {
      console.warn('Convex updateAdoption note:', e);
    }
    showToast('입양 동물 정보가 수정되었습니다.');
  };

  const handleDeleteAdoption = async (id) => {
    const updated = adoptionList.filter(a => a.id !== id && a._id !== id);
    setLocalAdoptionList(updated);

    try {
      await removeAdoptionMutation({ id: String(id) });
    } catch (e) {
      console.warn('Convex removeAdoption note:', e);
    }
    showToast('입양 동물이 삭제되었습니다.');
  };

  const handleAddTravel = async (newTravel) => {
    const itemToSave = {
      ...newTravel,
      id: newTravel.id || `t_${Date.now()}`,
      features: Array.isArray(newTravel.features) ? newTravel.features : [newTravel.features].filter(Boolean),
      imageUrl: newTravel.imageUrl || '',
    };
    const updated = [itemToSave, ...travelList];
    setLocalTravelList(updated);

    try {
      await addTravelMutation({
        id: itemToSave.id,
        type: itemToSave.type,
        name: itemToSave.name,
        location: itemToSave.location,
        weightLimit: itemToSave.weightLimit,
        price: itemToSave.price,
        features: itemToSave.features,
        memberBenefit: itemToSave.memberBenefit,
        phone: itemToSave.phone,
        imageUrl: itemToSave.imageUrl,
      });
    } catch (e) {
      console.warn('Convex addTravel note:', e);
    }
    showToast('새 동반 여행지가 등록되었습니다.');
  };

  const handleUpdateTravel = async (updatedTravel) => {
    const tId = updatedTravel._id || updatedTravel.id;
    const updated = travelList.map(t => (t._id === tId || t.id === tId ? { ...t, ...updatedTravel } : t));
    setLocalTravelList(updated);

    try {
      await updateTravelMutation({
        id: String(updatedTravel.id || updatedTravel._id),
        type: updatedTravel.type,
        name: updatedTravel.name,
        location: updatedTravel.location,
        weightLimit: updatedTravel.weightLimit,
        price: updatedTravel.price,
        features: Array.isArray(updatedTravel.features) ? updatedTravel.features : [updatedTravel.features].filter(Boolean),
        memberBenefit: updatedTravel.memberBenefit,
        phone: updatedTravel.phone,
        imageUrl: updatedTravel.imageUrl || '',
      });
    } catch (e) {
      console.warn('Convex updateTravel note:', e);
    }
    showToast('동반 여행지 정보가 성공적으로 수정되었습니다.');
  };

  const handleDeleteTravel = async (id) => {
    const updated = travelList.filter(t => t.id !== id && t._id !== id);
    setLocalTravelList(updated);

    try {
      await removeTravelMutation({ id: String(id) });
    } catch (e) {
      console.warn('Convex removeTravel note:', e);
    }
    showToast('동반 숙소가 삭제되었습니다.');
  };

  // User Auth Handlers (Sign up / Login / Logout)
  const registerUserMutation = useMutation(api.users.register);
  const loginUserMutation = useMutation(api.users.login);

  const handleLogin = async (userData) => {
    setUser(userData);
    localStorage.setItem('seulban_user', JSON.stringify(userData));
    showToast(`${userData.name}님 환영합니다!`);

    try {
      if (userData.isNewUser || userData.provider === 'google') {
        await registerUserMutation({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          provider: userData.provider || 'email',
          password: userData.password,
          membershipLevel: userData.membershipLevel || 'VIP 회원',
          isMember: userData.isMember !== false,
        });
      } else {
        await loginUserMutation({
          email: userData.email,
          password: userData.password,
        });
      }
    } catch (e) {
      console.warn('Convex user auth note:', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('seulban_user');
    showToast('로그아웃 되었습니다.');
  };

  const handleUpdateBrandInfo = async (newBrand) => {
    setLocalBrandInfo(newBrand);

    try {
      await setSettingMutation({ key: 'brand_info', value: newBrand });
    } catch (e) {
      console.warn('Convex setSetting note:', e);
    }
  };

  const handleAddPopup = async (newPopup) => {
    const itemToSave = {
      ...newPopup,
      id: newPopup.id || `pop_${Date.now()}`,
      linkType: newPopup.linkType || 'none',
      linkUrl: newPopup.linkUrl || '',
      internalTab: newPopup.internalTab || 'registration',
      active: newPopup.active !== false,
    };
    const updated = [itemToSave, ...popups];
    setLocalPopups(updated);

    try {
      await addPopupMutation({
        id: itemToSave.id,
        title: itemToSave.title,
        imageUrl: itemToSave.imageUrl,
        linkType: itemToSave.linkType,
        linkUrl: itemToSave.linkUrl,
        internalTab: itemToSave.internalTab,
        active: itemToSave.active,
      });
    } catch (e) {
      console.warn('Convex addPopup note:', e);
    }
    showToast('새로운 팝업이 등록되었습니다.');
  };

  const handleDeletePopup = async (id) => {
    const updated = popups.filter(p => p.id !== id && p._id !== id);
    setLocalPopups(updated);

    try {
      await removePopupMutation({ id: String(id) });
    } catch (e) {
      console.warn('Convex removePopup note:', e);
    }
    showToast('팝업이 삭제되었습니다.');
  };

  const handleTogglePopup = async (id) => {
    const updated = popups.map(p => (p.id === id || p._id === id) ? { ...p, active: !p.active } : p);
    setLocalPopups(updated);

    try {
      await togglePopupMutation({ id: String(id) });
    } catch (e) {
      console.warn('Convex togglePopup note:', e);
    }
    showToast('팝업 노출 상태가 변경되었습니다.');
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
          onUpdateApplication={handleUpdateApplication}
          onDeleteApplication={handleDeleteApplication}
          partners={partners}
          onAddPartner={handleAddPartner}
          onUpdatePartner={handleUpdatePartner}
          onDeletePartner={handleDeletePartner}
          shopOrders={shopOrders}
          onUpdateShopOrderStatus={handleUpdateShopOrderStatus}
          onDeleteShopOrder={handleDeleteShopOrder}
          adoptionList={adoptionList}
          onAddAdoption={handleAddAdoption}
          onUpdateAdoption={handleUpdateAdoption}
          onDeleteAdoption={handleDeleteAdoption}
          travelList={travelList}
          onAddTravel={handleAddTravel}
          onUpdateTravel={handleUpdateTravel}
          onDeleteTravel={handleDeleteTravel}
          popups={popups}
          onAddPopup={handleAddPopup}
          onDeletePopup={handleDeletePopup}
          onTogglePopup={handleTogglePopup}
          brandInfo={brandInfo}
          onUpdateBrandInfo={handleUpdateBrandInfo}
          consultations={consultations}
          onDeleteConsultation={handleDeleteConsultation}
          onUpdateConsultStatus={handleUpdateConsultStatus}
          onRefreshData={handleRefreshAdminData}
          menuVisibility={menuVisibility}
          onUpdateMenuVisibility={handleUpdateMenuVisibility}
          serverStatus={{
            isConnected: !!convexApps,
            convexPartnersCount: convexPartners ? convexPartners.length : 0,
            env: 'production',
            convexUrl: PROD_CONVEX_URL,
          }}
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
        onOpenLogin={() => { setAuthMode('login'); setLoginModalOpen(true); }}
        onOpenSignUp={() => { setAuthMode('signup'); setLoginModalOpen(true); }}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        activeTab={activeTab}
        onOpenApplyModal={() => setApplyModalOpen(true)}
        onOpenMembershipModal={() => setMembershipModalOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenMallModal={() => setMallModalOpen(true)}
        menuVisibility={menuVisibility}
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
            onOpenShopModal={(partner) => setSelectedShopPartner(partner)}
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
            onOpenMallModal={() => handleNavigate('mall')}
          />
        )}

        {activeTab === 'mall' && (
          <MallPage
            partner={partners.find(p => p.id === 'p_redpuppy' || p.partnerType === 'shop' || p.name?.includes('레드퍼피')) || PARTNER_LIST.find(p => p.id === 'p_redpuppy')}
            onOrderSubmit={handleCreateShopOrder}
            user={user}
            brandInfo={brandInfo}
          />
        )}

        {activeTab === 'mypage' && (
          <MyPage 
            user={user}
            pet={userPet}
            applications={userApplications}
            bookmarks={bookmarks}
            partners={partners}
            onOpenApplyModal={() => setApplyModalOpen(true)}
            onOpenPartnerModal={(partner) => setSelectedPartner(partner)}
            onOpenLogin={() => { setAuthMode('login'); setLoginModalOpen(true); }}
            onOpenSignUp={() => { setAuthMode('signup'); setLoginModalOpen(true); }}
            onLogout={() => { handleLogout(); setActiveTab('home'); }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onOpenAdmin={handleOpenAdmin}
        onNavigate={handleNavigate}
        brandInfo={brandInfo}
        onOpenPolicy={(type) => setPolicyModal({ isOpen: true, type })}
        menuVisibility={menuVisibility}
      />

      {/* Mobile Fixed Bottom Navigation (기획서 5.2 모바일 5대 내비게이션) */}
      <MobileNav 
        activeTab={activeTab}
        onNavigate={handleNavigate}
        menuVisibility={menuVisibility}
      />

      {/* Floating Action Buttons (빠른상담, 카톡상담, 전화상담 지원) */}
      <div className="fixed right-4 sm:right-6 bottom-20 md:bottom-8 z-30 flex flex-col items-end gap-2.5">
        {floatingMenuOpen && (
          <div className="bg-white p-4 shadow-2xl border border-[#ECE5D8] w-72 space-y-2.5 animate-fade-in text-xs">
            <div className="font-bold text-[#144A42] border-b border-gray-100 pb-2 flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-extrabold text-xs">
                <HeadphoneIcon className="w-4 h-4 text-[#C5A880]" />
                <span>슬반생 원스톱 상담센터</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            {/* 1. 빠른 맞춤상담 신청 버튼 */}
            <button
              type="button"
              onClick={() => {
                setFloatingMenuOpen(false);
                setQuickConsultOpen(true);
              }}
              className="w-full p-2.5 bg-[#144A42] hover:bg-[#0D3832] text-white flex items-center justify-between transition shadow-xs group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-left">
                <HeadphoneIcon className="w-4 h-4 text-[#E6CAA4]" />
                <div>
                  <span className="font-bold text-xs block text-white">1:1 빠른 맞춤상담 신청</span>
                  <p className="text-[10px] text-[#A3CCC3] font-normal">전문 상담사가 확인 후 즉시 연락</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#E6CAA4] group-hover:translate-x-0.5 transition-transform">신청 →</span>
            </button>

            {/* 2. 카카오톡 실시간 채팅 상담 */}
            <a
              href={brandInfo.kakaoChannelUrl || BRAND_INFO.kakaoChannelUrl || "https://pf.kakao.com"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setFloatingMenuOpen(false)}
              className="flex items-center justify-between p-2.5 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold transition shadow-xs"
            >
              <div className="flex items-center gap-2">
                <KakaoIcon className="w-4 h-4 text-[#191919]" />
                <div className="text-left">
                  <span className="text-xs block">카톡 1:1 실시간 상담</span>
                  <p className="text-[10px] text-neutral-600 font-normal">카카오톡 채널로 간편하게 문의</p>
                </div>
              </div>
              <span className="text-[11px] font-bold">대화하기 →</span>
            </a>
            
            {/* 3. 대표 유선 전화상담 */}
            <a 
              href={`tel:${brandInfo.phone1 || BRAND_INFO.phone1 || '070-4186-1500'}`}
              className="flex items-center gap-2 p-2.5 bg-[#FAF8F5] hover:bg-[#F3EFE6] transition text-[#2C3B35] font-semibold"
            >
              <PhoneIcon className="w-4 h-4 text-[#144A42]" />
              <div>
                <span>대표 전화: {brandInfo.phone1 || BRAND_INFO.phone1 || '070-4186-1500'}</span>
                <p className="text-[10px] text-gray-400 font-normal">평일 09:00 ~ 18:00</p>
              </div>
            </a>

            {/* 4. 보조/직통 번호 (설정된 경우에만 노출) */}
            {brandInfo.phone2 && brandInfo.phone2.trim() && (
              <a 
                href={`tel:${brandInfo.phone2}`}
                className="flex items-center gap-2 p-2.5 bg-[#EAF5F2] hover:bg-[#DCEDE9] transition text-[#144A42] font-semibold"
              >
                <PhoneIcon className="w-4 h-4 text-[#144A42]" />
                <div>
                  <span>{brandInfo.phone2Label || '직통 번호'}</span>
                  <p className="text-[10px] text-emerald-700 font-normal">{brandInfo.phone2}</p>
                </div>
              </a>
            )}

            <button
              onClick={() => { setFloatingMenuOpen(false); setApplyModalOpen(true); }}
              className="w-full py-2.5 bg-[#FAF8F5] border border-[#DDD5C7] text-[#144A42] font-bold text-center hover:bg-[#F3EFE6] transition"
            >
              동물등록 바로 신청하기 →
            </button>
          </div>
        )}

        {/* Floating Toggle Button (상담센터 전체 옵션 팝업) */}
        <button
          onClick={() => setFloatingMenuOpen(!floatingMenuOpen)}
          className="w-13 h-13 sm:w-14 sm:h-14 p-3 bg-[#144A42] hover:bg-[#0D3832] text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 border border-[#C5A880] cursor-pointer relative"
          aria-label="상담 플로팅 버튼"
          title="슬반생 상담센터"
        >
          <HeadphoneIcon className="w-6 h-6 text-[#C5A880]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* Modals */}
      <ApplyRegistrationModal 
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onApplySuccess={handleApplySuccess}
        user={user}
        brandInfo={brandInfo}
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
        onOpenShopModal={(partner) => setSelectedShopPartner(partner)}
      />

      <ShopPartnerModal
        partner={selectedShopPartner}
        isOpen={!!selectedShopPartner}
        onClose={() => setSelectedShopPartner(null)}
        onOrderSubmit={handleCreateShopOrder}
        user={user}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
        brandInfo={brandInfo}
      />

      <LoginModal 
        isOpen={loginModalOpen}
        initialMode={authMode}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <AdminModal 
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        applications={applications}
        onUpdateAppStatus={handleUpdateAppStatus}
      />

      {/* 슬반생몰 준비중 안내 모달 */}
      <MallPreparingModal 
        isOpen={mallModalOpen}
        onClose={() => setMallModalOpen(false)}
        user={user}
        onNavigate={handleNavigate}
      />

      {/* 빠른 맞춤상담 모달 */}
      <QuickConsultModal 
        isOpen={quickConsultOpen}
        onClose={() => setQuickConsultOpen(false)}
        onSubmitConsult={handleAddConsultation}
        brandInfo={brandInfo}
        user={user}
      />

      {/* 개인정보처리방침 / 이용약관 전용 모달 */}
      <PolicyViewerModal 
        isOpen={policyModal.isOpen}
        type={policyModal.type}
        onClose={() => setPolicyModal({ isOpen: false, type: 'privacy' })}
        brandInfo={brandInfo}
      />

      {/* 메인 3:4 팝업 (관리자에서 설정한 활성 팝업, 7일간 숨김 및 다크 백드롭 지원) */}
      <MainPopupModal 
        popups={popups}
        isLoading={convexPopups === undefined}
        onNavigate={handleNavigate}
      />

    </div>
  );
}
