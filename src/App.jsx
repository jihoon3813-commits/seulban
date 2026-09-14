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
  AdminModal,
  MainPopupModal,
  MallPreparingModal
} from './components/Modals';

import { PhoneIcon, SparklesIcon, PawIcon, MessageSquare } from './components/Icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { 
  INITIAL_PET, 
  INITIAL_APPLICATION, 
  BRAND_INFO, 
  PARTNER_LIST, 
  ADOPTION_LIST, 
  TRAVEL_LIST,
  INITIAL_POPUPS
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

  // Convex Mutations
  const submitAppMutation = useMutation(api.applications.submit);
  const updateAppStatusMutation = useMutation(api.applications.updateStatus);
  const updateAppMutation = useMutation(api.applications.update);
  const removeAppMutation = useMutation(api.applications.remove);
  const savePetMutation = useMutation(api.pets.save);
  const addPartnerMutation = useMutation(api.partners.add);
  const updatePartnerMutation = useMutation(api.partners.update);
  const removePartnerMutation = useMutation(api.partners.remove);
  const addAdoptionMutation = useMutation(api.adoptions.add);
  const updateAdoptionMutation = useMutation(api.adoptions.update);
  const removeAdoptionMutation = useMutation(api.adoptions.remove);
  const addTravelMutation = useMutation(api.travels.add);
  const updateTravelMutation = useMutation(api.travels.update);
  const removeTravelMutation = useMutation(api.travels.remove);
  const addPopupMutation = useMutation(api.popups.add);
  const togglePopupMutation = useMutation(api.popups.toggleActive);
  const removePopupMutation = useMutation(api.popups.remove);
  const setSettingMutation = useMutation(api.settings.set);

  // Local state as fallback & optimistic store
  const [localPet, setLocalPet] = useState(null);

  const [localApplications, setLocalApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('seulban_applications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Seamlessly merge Convex applications with optimistic local applications
  const applications = React.useMemo(() => {
    const map = new Map();
    // 1) First add local applications
    (localApplications || []).forEach(app => {
      if (app && app.id) map.set(app.id, app);
    });
    // 2) Merge Convex applications (server truth)
    if (convexApps && convexApps.length > 0) {
      convexApps.forEach(app => {
        if (app && app.id) map.set(app.id, app);
      });
    }
    return Array.from(map.values()).sort((a, b) => {
      return (b.appliedDate || '').localeCompare(a.appliedDate || '');
    });
  }, [convexApps, localApplications]);

  // Filter applications specifically for the logged-in user
  const userApplications = React.useMemo(() => {
    if (!user) return [];
    return applications.filter(app => {
      // 1) Direct email match (case-insensitive)
      if (user.email && app.ownerEmail && app.ownerEmail.trim().toLowerCase() === user.email.trim().toLowerCase()) return true;
      // 2) Direct phone match
      const cleanUserPhone = (user.phone || '').replace(/[^0-9]/g, '');
      const cleanAppPhone = (app.phone || '').replace(/[^0-9]/g, '');
      if (cleanUserPhone && cleanAppPhone && cleanUserPhone === cleanAppPhone) return true;
      // 3) Exact name match (excluding default mock applicant unless matching user)
      if (user.name && app.ownerName && app.ownerName.trim() === user.name.trim()) return true;
      return false;
    });
  }, [user, applications]);

  // Pet profile specifically for the logged-in user (null by default for newly joined users)
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

    // 3) Match from localPet state
    if (localPet) {
      const isOwner = (user.email && localPet.ownerEmail && localPet.ownerEmail.trim().toLowerCase() === user.email.trim().toLowerCase())
        || (user.name && localPet.ownerName && localPet.ownerName.trim() === user.name.trim());
      if (isOwner) return localPet;
    }

    // 4) Match from user-specific localStorage
    try {
      if (user.email) {
        const savedUserPet = localStorage.getItem(`seulban_pet_${user.email}`);
        if (savedUserPet) return JSON.parse(savedUserPet);
      }
    } catch (e) {}

    // Fresh user has no pet registered yet
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

  // Dynamic Content States
  const [localPartners, setLocalPartners] = useState(() => {
    const saved = localStorage.getItem('seulban_partners');
    return saved ? JSON.parse(saved) : PARTNER_LIST;
  });
  const partners = (convexPartners && convexPartners.length > 0) ? convexPartners : localPartners;

  const [localAdoptionList, setLocalAdoptionList] = useState(() => {
    const saved = localStorage.getItem('seulban_adoption');
    return saved ? JSON.parse(saved) : ADOPTION_LIST;
  });
  const adoptionList = (convexAdoptions && convexAdoptions.length > 0) ? convexAdoptions : localAdoptionList;

  const [localTravelList, setLocalTravelList] = useState(() => {
    const saved = localStorage.getItem('seulban_travel');
    return saved ? JSON.parse(saved) : TRAVEL_LIST;
  });
  const travelList = (convexTravels && convexTravels.length > 0) ? convexTravels : localTravelList;

  const [localBrandInfo, setLocalBrandInfo] = useState(() => {
    const saved = localStorage.getItem('seulban_brand');
    return saved ? JSON.parse(saved) : BRAND_INFO;
  });
  const brandInfo = convexBrand || localBrandInfo;

  // Popups State
  const [localPopups, setLocalPopups] = useState(() => {
    const saved = localStorage.getItem('seulban_popups');
    return saved ? JSON.parse(saved) : INITIAL_POPUPS;
  });
  const popups = (convexPopups && convexPopups.length > 0) ? convexPopups : localPopups;

  // Modals
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [mallModalOpen, setMallModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Floating consult widget state
  const [floatingMenuOpen, setFloatingMenuOpen] = useState(false);

  // Toast message
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // 1. 동물등록 신청 접수 (Convex DB 연동 + 사용자별 스코프 영구 보존)
  const handleApplySuccess = async (newApp, newPet) => {
    const ownerEmail = user?.email || newApp.ownerEmail || '';
    const appWithOwner = {
      ...newApp,
      ownerEmail,
    };

    // 사용자 정보에 연락처가 비어있다면 신청서 연락처로 자동 업데이트
    if (user && !user.phone && newApp.phone) {
      const updatedUser = { ...user, phone: newApp.phone };
      setUser(updatedUser);
      try {
        localStorage.setItem('seulban_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }

    // 1) 즉시 로컬 반영 (낙관적 업데이트)
    const updatedApps = [appWithOwner, ...localApplications.filter(a => a.id !== newApp.id)];
    setLocalApplications(updatedApps);
    try {
      localStorage.setItem('seulban_applications', JSON.stringify(updatedApps));
    } catch (e) {
      console.warn('localStorage save applications note:', e);
    }

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
      if (ownerEmail) {
        try {
          localStorage.setItem(`seulban_pet_${ownerEmail}`, JSON.stringify(updatedPet));
        } catch (e) {
          console.warn('localStorage save pet note:', e);
        }
      }
    }

    // 2) Convex DB 서버 동기화
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

  // 2. 동물등록 신청 상태 변경 (Convex DB 연동 + 로컬 백업)
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

    // 1) 로컬 상태 업데이트
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
    localStorage.setItem('seulban_applications', JSON.stringify(updated));

    // 2) Convex DB 업데이트
    try {
      await updateAppStatusMutation({
        id: appId,
        statusCode: newStatusCode,
        statusLabel: newStatusLabel
      });
      console.log('✅ Convex DB 접수 상태 업데이트 완료:', appId, newStatusCode);
    } catch (err) {
      console.warn('Convex DB status update error:', err);
    }

    showToast(`접수건(${appId}) 상태가 [${newStatusLabel}]로 변경되었습니다.`);
  };

  // 3. 동물등록 신청 내역 수정 (Convex DB 연동 + 로컬 백업)
  const handleUpdateApplication = async (updatedApp) => {
    const appId = updatedApp.id;
    const updated = applications.map(a => (a.id === appId ? { ...a, ...updatedApp } : a));
    setLocalApplications(updated);
    localStorage.setItem('seulban_applications', JSON.stringify(updated));

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
      console.log('✅ Convex DB 접수 내역 수정 완료:', appId);
    } catch (err) {
      console.warn('Convex DB updateApp error:', err);
    }

    showToast(`신청서(${appId}) 정보가 성공적으로 수정되었습니다.`);
  };

  // 4. 동물등록 신청 내역 삭제 (Convex DB 연동 + 로컬 백업)
  const handleDeleteApplication = async (appId) => {
    const updated = applications.filter(app => app.id !== appId);
    setLocalApplications(updated);
    localStorage.setItem('seulban_applications', JSON.stringify(updated));

    try {
      await removeAppMutation({ id: appId });
      console.log('✅ Convex DB 접수 내역 삭제 완료:', appId);
    } catch (err) {
      console.warn('Convex DB removeApp error:', err);
    }

    showToast(`신청 내역(${appId})이 삭제되었습니다.`);
  };

  const handleAddPartner = async (newPartner) => {
    const updated = [newPartner, ...partners];
    setLocalPartners(updated);
    localStorage.setItem('seulban_partners', JSON.stringify(updated));

    try {
      await addPartnerMutation({
        name: newPartner.name,
        category: newPartner.category,
        categoryName: newPartner.categoryName,
        tag: newPartner.tag,
        location: newPartner.location,
        benefit: newPartner.benefit,
        desc: newPartner.desc,
        rating: Number(newPartner.rating) || 4.9,
        reviews: Number(newPartner.reviews) || 50,
        phone: newPartner.phone,
        color: newPartner.color || 'bg-[#EBF3FB] text-[#2563EB]',
        icon: newPartner.icon || 'stethoscope',
        imageUrl: newPartner.imageUrl || '',
        featured: !!newPartner.featured,
      });
    } catch (e) {
      console.warn('Convex addPartner note:', e);
    }
  };

  const handleUpdatePartner = async (updatedPartner) => {
    const pId = updatedPartner._id || updatedPartner.id;
    const updated = partners.map(p => (p._id === pId || p.id === pId) ? { ...p, ...updatedPartner } : p);
    setLocalPartners(updated);
    localStorage.setItem('seulban_partners', JSON.stringify(updated));

    try {
      if (updatedPartner._id) {
        await updatePartnerMutation({
          id: updatedPartner._id,
          name: updatedPartner.name,
          category: updatedPartner.category,
          categoryName: updatedPartner.categoryName,
          tag: updatedPartner.tag,
          location: updatedPartner.location,
          benefit: updatedPartner.benefit,
          desc: updatedPartner.desc,
          rating: Number(updatedPartner.rating) || 4.9,
          reviews: Number(updatedPartner.reviews) || 50,
          phone: updatedPartner.phone,
          color: updatedPartner.color,
          icon: updatedPartner.icon,
          imageUrl: updatedPartner.imageUrl || '',
          featured: !!updatedPartner.featured,
        });
      }
    } catch (e) {
      console.warn('Convex updatePartner note:', e);
    }
    showToast('제휴처 정보가 성공적으로 수정되었습니다.');
  };

  const handleDeletePartner = async (id) => {
    const updated = partners.filter(p => p.id !== id && p._id !== id);
    setLocalPartners(updated);
    localStorage.setItem('seulban_partners', JSON.stringify(updated));

    try {
      if (typeof id === 'string' && id.startsWith('p_') === false) {
        await removePartnerMutation({ id });
      }
    } catch (e) {
      console.warn('Convex removePartner note:', e);
    }
    showToast('제휴처가 삭제되었습니다.');
  };

  const handleAddAdoption = async (newAnimal) => {
    const updated = [newAnimal, ...adoptionList];
    setLocalAdoptionList(updated);
    localStorage.setItem('seulban_adoption', JSON.stringify(updated));

    try {
      await addAdoptionMutation({
        name: newAnimal.name,
        breed: newAnimal.breed,
        gender: newAnimal.gender,
        age: newAnimal.age,
        weight: newAnimal.weight || '5kg',
        center: newAnimal.center || '한국 동물사랑나눔 보호센터',
        story: newAnimal.story || '',
        tags: Array.isArray(newAnimal.tags) ? newAnimal.tags : [newAnimal.tags].filter(Boolean),
        status: newAnimal.status || '입양 상담 가능',
        photoUrl: newAnimal.photoUrl || '',
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
    localStorage.setItem('seulban_adoption', JSON.stringify(updated));

    try {
      if (updatedAnimal._id) {
        await updateAdoptionMutation({
          id: updatedAnimal._id,
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
      }
    } catch (e) {
      console.warn('Convex updateAdoption note:', e);
    }
    showToast('입양 동물 정보가 수정되었습니다.');
  };

  const handleDeleteAdoption = async (id) => {
    const updated = adoptionList.filter(a => a.id !== id && a._id !== id);
    setLocalAdoptionList(updated);
    localStorage.setItem('seulban_adoption', JSON.stringify(updated));

    try {
      if (typeof id === 'string' && id.startsWith('adopt_') === false) {
        await removeAdoptionMutation({ id });
      }
    } catch (e) {
      console.warn('Convex removeAdoption note:', e);
    }
    showToast('입양 동물이 삭제되었습니다.');
  };

  const handleAddTravel = async (newTravel) => {
    const updated = [newTravel, ...travelList];
    setLocalTravelList(updated);
    localStorage.setItem('seulban_travel', JSON.stringify(updated));

    try {
      await addTravelMutation({
        type: newTravel.type,
        name: newTravel.name,
        location: newTravel.location,
        weightLimit: newTravel.weightLimit,
        price: newTravel.price,
        features: Array.isArray(newTravel.features) ? newTravel.features : [newTravel.features],
        memberBenefit: newTravel.memberBenefit,
        phone: newTravel.phone,
        imageUrl: newTravel.imageUrl || '',
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
    localStorage.setItem('seulban_travel', JSON.stringify(updated));

    try {
      if (updatedTravel._id) {
        await updateTravelMutation({
          id: updatedTravel._id,
          type: updatedTravel.type,
          name: updatedTravel.name,
          location: updatedTravel.location,
          weightLimit: updatedTravel.weightLimit,
          price: updatedTravel.price,
          features: Array.isArray(updatedTravel.features) ? updatedTravel.features : [updatedTravel.features],
          memberBenefit: updatedTravel.memberBenefit,
          phone: updatedTravel.phone,
          imageUrl: updatedTravel.imageUrl || '',
        });
      }
    } catch (e) {
      console.warn('Convex updateTravel note:', e);
    }
    showToast('동반 여행지 정보가 성공적으로 수정되었습니다.');
  };

  const handleDeleteTravel = async (id) => {
    const updated = travelList.filter(t => t.id !== id && t._id !== id);
    setLocalTravelList(updated);
    localStorage.setItem('seulban_travel', JSON.stringify(updated));

    try {
      if (typeof id === 'string' && id.startsWith('t_') === false) {
        await removeTravelMutation({ id });
      }
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

    // Convex DB 비동기 계정 동기화
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
    localStorage.setItem('seulban_brand', JSON.stringify(newBrand));

    try {
      await setSettingMutation({ key: 'brand_info', value: newBrand });
    } catch (e) {
      console.warn('Convex setSetting note:', e);
    }
  };

  const handleAddPopup = async (newPopup) => {
    const updated = [newPopup, ...popups];
    setLocalPopups(updated);
    localStorage.setItem('seulban_popups', JSON.stringify(updated));

    try {
      await addPopupMutation({
        title: newPopup.title,
        imageUrl: newPopup.imageUrl,
        linkType: newPopup.linkType || 'none',
        linkUrl: newPopup.linkUrl || '',
        internalTab: newPopup.internalTab || 'registration',
        active: newPopup.active !== false,
      });
    } catch (e) {
      console.warn('Convex addPopup note:', e);
    }
    showToast('새로운 팝업이 등록되었습니다.');
  };

  const handleDeletePopup = async (id) => {
    const updated = popups.filter(p => p.id !== id && p._id !== id);
    setLocalPopups(updated);
    localStorage.setItem('seulban_popups', JSON.stringify(updated));

    try {
      if (typeof id === 'string' && id.startsWith('pop_') === false) {
        await removePopupMutation({ id });
      }
    } catch (e) {
      console.warn('Convex removePopup note:', e);
    }
    showToast('팝업이 삭제되었습니다.');
  };

  const handleTogglePopup = async (id) => {
    const updated = popups.map(p => (p.id === id || p._id === id) ? { ...p, active: !p.active } : p);
    setLocalPopups(updated);
    localStorage.setItem('seulban_popups', JSON.stringify(updated));

    try {
      if (typeof id === 'string' && id.startsWith('pop_') === false) {
        await togglePopupMutation({ id });
      }
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
            onOpenMallModal={() => setMallModalOpen(true)}
          />
        )}

        {activeTab === 'mypage' && (
          <MyPage 
            user={user}
            pet={userPet}
            applications={userApplications}
            bookmarks={bookmarks}
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
        user={user}
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

      {/* 메인 3:4 팝업 (관리자에서 설정한 활성 팝업, 7일간 숨김 및 다크 백드롭 지원) */}
      <MainPopupModal 
        popups={popups}
        onNavigate={handleNavigate}
      />

    </div>
  );
}
