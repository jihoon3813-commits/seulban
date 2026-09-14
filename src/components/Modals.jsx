import React, { useState, useEffect, useRef } from 'react';
import { 
  XIcon, CheckIcon, ShieldCheckIcon, PawIcon, ArrowRight, 
  PhoneIcon, MapPinIcon, HeartIcon, SparklesIcon, FileTextIcon, 
  ClockIcon, StethoscopeIcon, UserIcon, CameraIcon, SearchIcon,
  LogoEmblem, ShoppingBagIcon, GiftIcon, BellIcon
} from './Icons';
import { BRAND_INFO, MEMBERSHIP_PERKS, REG_FAQS } from '../data/mockData';
import { compressImage } from '../utils/imageCompressor';

// 휴대폰 번호 자동 하이픈 포맷 함수
export const formatPhoneNumber = (value) => {
  if (!value) return '';
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else if (digits.length <= 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
};

// 1. 동물등록 7단계 신청 마법사 모달 (REG-002 & REG-003)
export function ApplyRegistrationModal({ isOpen, onClose, onApplySuccess, user }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ownerName: user?.name || '',
    birthDate: '',
    phone: user?.phone || '',
    address: '',
    addressDetail: '',
    postalCode: '',
    petName: '',
    petPhoto: '',
    petType: 'dog',
    breed: '',
    gender: '남아',
    petBirth: '',
    neutered: '완료',
    regType: 'external',
    tagColor: '베이지 골드',
    recipient: user?.name || '',
    shippingPostalCode: '',
    shippingAddress: '',
    shippingAddressDetail: '',
    shippingMemo: '',
    agreeTerms: true,
    agreeAgency: true,
  });

  const [submittedNumber, setSubmittedNumber] = useState('');
  const [isPostcodeModalOpen, setIsPostcodeModalOpen] = useState(false);
  const [postcodeTarget, setPostcodeTarget] = useState('owner'); // 'owner' | 'shipping'
  const [isSameAsOwnerAddress, setIsSameAsOwnerAddress] = useState(true);

  const postcodeContainerRef = useRef(null);
  const addressDetailRef = useRef(null);
  const shippingAddressDetailRef = useRef(null);

  // 모달이 열릴 때마다 폼을 깨끗하게 초기화
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({
        ownerName: user?.name || '',
        birthDate: '',
        phone: user?.phone || '',
        address: '',
        addressDetail: '',
        postalCode: '',
        petName: '',
        petPhoto: '',
        petType: 'dog',
        breed: '',
        gender: '남아',
        petBirth: '',
        neutered: '완료',
        regType: 'external',
        tagColor: '베이지 골드',
        recipient: '',
        shippingPostalCode: '',
        shippingAddress: '',
        shippingAddressDetail: '',
        shippingMemo: '',
        agreeTerms: true,
        agreeAgency: true,
      });
      setSubmittedNumber('');
      setIsPostcodeModalOpen(false);
      setIsSameAsOwnerAddress(true);
    }
  }, [isOpen]);

  // 카카오 우편번호 검색 열기
  const handleOpenPostcode = (target = 'owner') => {
    setPostcodeTarget(target);
    if (window.daum && window.daum.Postcode) {
      setIsPostcodeModalOpen(true);
    } else {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        setIsPostcodeModalOpen(true);
      };
      script.onerror = () => {
        alert('우편번호 검색 서비스를 불러오는 데 실패했습니다. 주소를 직접 입력해 주세요.');
      };
      document.head.appendChild(script);
    }
  };

  // 카카오 우편번호 레이어 임베딩
  useEffect(() => {
    if (!isPostcodeModalOpen) return;

    const timer = setTimeout(() => {
      if (window.daum && window.daum.Postcode && postcodeContainerRef.current) {
        postcodeContainerRef.current.innerHTML = '';
        new window.daum.Postcode({
          oncomplete: function(data) {
            let fullAddr = data.roadAddress || data.jibunAddress;
            let extraAddr = '';

            if (data.addressType === 'R') {
              if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraAddr += data.bname;
              }
              if (data.buildingName !== '') {
                extraAddr += (extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName);
              }
              if (extraAddr !== '') {
                extraAddr = ` (${extraAddr})`;
              }
            }

            const completeAddress = fullAddr + extraAddr;
            const zonecode = data.zonecode;

            if (postcodeTarget === 'owner') {
              setFormData(prev => ({
                ...prev,
                postalCode: zonecode,
                address: completeAddress,
              }));
              setIsPostcodeModalOpen(false);
              setTimeout(() => {
                addressDetailRef.current?.focus();
              }, 150);
            } else {
              setFormData(prev => ({
                ...prev,
                shippingPostalCode: zonecode,
                shippingAddress: completeAddress,
              }));
              setIsPostcodeModalOpen(false);
              setTimeout(() => {
                shippingAddressDetailRef.current?.focus();
              }, 150);
            }
          },
          width: '100%',
          height: '100%'
        }).embed(postcodeContainerRef.current);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [isPostcodeModalOpen, postcodeTarget]);

  // 반려동물 사진 업로드 핸들러 (고화질 사진 자동 압축 최적화)
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('사진 용량은 15MB 이하만 등록 가능합니다.');
      return;
    }

    try {
      // 800x800 해상도 및 JPEG 0.8 압축 -> 약 40~80KB로 경량화하여 Convex DB 저장 보장
      const compressedDataUrl = await compressImage(file, 800, 800, 0.8);
      setFormData(prev => ({
        ...prev,
        petPhoto: compressedDataUrl
      }));
    } catch (err) {
      console.warn('이미지 압축 중 대체 로직 실행:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          petPhoto: event.target?.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      if (!formData.ownerName.trim()) {
        alert('보호자 성명을 입력해 주세요.');
        return;
      }
      if (!formData.birthDate.trim()) {
        alert('생년월일 6자리를 입력해 주세요. (예: 950315)');
        return;
      }
      if (formData.birthDate.length < 6) {
        alert('생년월일은 6자리 숫자로 입력해 주세요.');
        return;
      }
      if (!formData.phone.trim()) {
        alert('휴대폰 번호를 입력해 주세요.');
        return;
      }
      if (formData.phone.length < 12) {
        alert('휴대폰 번호 11자리를 정확히 입력해 주세요. (예: 010-1234-5678)');
        return;
      }
    }
    if (step === 2) {
      if (!formData.address.trim()) {
        alert('보호자 주민등록상 주소지를 입력해 주세요 (우편번호 검색을 이용해 주세요).');
        return;
      }
    }
    if (step === 3 && !formData.petName.trim()) {
      alert('반려동물의 이름을 입력해 주세요.');
      return;
    }
    if (step === 4) {
      // 5단계(수령 정보) 진입 시 배송지 정보가 비어있으면 앞서 입력한 보호자 정보로 연동
      setFormData(prev => ({
        ...prev,
        recipient: prev.recipient || prev.ownerName,
        shippingPostalCode: prev.shippingPostalCode || prev.postalCode,
        shippingAddress: prev.shippingAddress || prev.address,
        shippingAddressDetail: prev.shippingAddressDetail || prev.addressDetail,
      }));
    }
    if (step === 5 && formData.regType === 'external') {
      if (!formData.recipient.trim()) {
        alert('인식표를 수령하실 분의 성명을 입력해 주세요.');
        return;
      }
      if (!formData.shippingAddress.trim() && !formData.address.trim()) {
        alert('배송받으실 주소를 입력해 주세요.');
        return;
      }
    }
    if (step === 6) {
      const newRegId = `REG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedNumber(newRegId);
      
      const fullOwnerAddress = `${formData.postalCode ? `(${formData.postalCode}) ` : ''}${formData.address}${formData.addressDetail ? ` ${formData.addressDetail}` : ''}`.trim();
      const fullShippingAddress = `${formData.shippingPostalCode ? `(${formData.shippingPostalCode}) ` : (formData.postalCode ? `(${formData.postalCode}) ` : '')}${formData.shippingAddress || formData.address}${formData.shippingAddressDetail ? ` ${formData.shippingAddressDetail}` : (formData.addressDetail ? ` ${formData.addressDetail}` : '')}`.trim();

      const newApp = {
        id: newRegId,
        petName: formData.petName || '우리 아이',
        petPhoto: formData.petPhoto || '',
        ownerName: formData.ownerName,
        phone: formData.phone,
        ownerEmail: user?.email || '',
        address: fullOwnerAddress,
        shippingAddress: fullShippingAddress,
        type: formData.regType === 'external' ? '외장형 안심 목걸이 칩' : '내장형 마이크로칩 시술권',
        appliedDate: new Date().toLocaleString('ko-KR'),
        statusCode: 'SUBMITTED',
        statusLabel: '접수 완료 (검수 대기)',
        trackingNumber: '검수 후 발송 준비 예정',
        history: [
          { date: '방금 전', title: '온라인 신청서 접수', desc: '담당자 검수 대기 중입니다.' }
        ]
      };
      
      onApplySuccess(newApp, {
        name: formData.petName,
        breed: formData.breed || '믹스/기타',
        gender: formData.gender,
        birth: formData.petBirth || '2024-01-01',
        neutered: formData.neutered,
        regNumber: '발급 심사 진행 중',
        status: '등록 신청 중',
        photoUrl: formData.petPhoto || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80'
      });
      setStep(7);
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const stepsTitle = [
    '1. 본인 확인',
    '2. 보호자 정보',
    '3. 반려동물 정보',
    '4. 등록 방식 선택',
    '5. 수령 정보',
    '6. 최종 확인 및 동의',
    '7. 접수 완료'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#DDD5C7]">
        
        {/* Header */}
        <div className="bg-[#144A42] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PawIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A880]" />
            <span className="font-bold text-sm sm:text-base">모바일 동물등록 간편 신청</span>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white hover:bg-white/10">
            <XIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 7 && (
          <div className="bg-[#F8F6F1] px-4 sm:px-6 py-2 sm:py-3 border-b border-[#EFECE6]">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[#144A42] mb-1">
              <span>{stepsTitle[step - 1]}</span>
              <span className="text-[#88948F]">{step} / 6 단계</span>
            </div>
            <div className="w-full bg-[#E5E0D4] h-1 sm:h-1.5 overflow-hidden">
              <div 
                className="bg-[#144A42] h-full transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 flex-1 text-xs sm:text-sm text-[#26312D]">
          
          {/* Step 1: 본인확인 */}
          {step === 1 && (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-[#EBF4F2] p-3 sm:p-4 border border-[#D5E8E4] flex items-start gap-2.5 sm:gap-3">
                <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#144A42] mt-0.5 shrink-0" />
                <p className="text-[11px] sm:text-xs text-[#204941] leading-relaxed">
                  동물보호법에 의거하여 정확한 지자체 전산망 등록을 위해 보호자 본인 인증 정보를 확인합니다.
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-1">보호자 성명 (실명)</label>
                <input 
                  type="text" 
                  value={formData.ownerName} 
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#144A42]"
                  placeholder="보호자 실명 입력"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">생년월일 (6자리)</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={formData.birthDate} 
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                    setFormData({...formData, birthDate: digits});
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#144A42]"
                  placeholder="예: 920518"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">휴대폰 번호</label>
                <input 
                  type="tel" 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={13}
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: formatPhoneNumber(e.target.value)})}
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#144A42]"
                  placeholder="010-0000-0000"
                />
              </div>
            </div>
          )}

          {/* Step 2: 보호자 상세 주소 */}
          {step === 2 && (
            <div className="space-y-4">
              {/* 우편번호 */}
              <div>
                <label className="block font-semibold mb-1 text-xs text-[#2C3833]">
                  우편번호 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly
                    value={formData.postalCode} 
                    onClick={() => handleOpenPostcode('owner')}
                    placeholder="우편번호 5자리"
                    className="w-36 px-4 py-2.5 border border-gray-300 bg-gray-50 focus:outline-none focus:border-[#144A42] font-mono text-sm cursor-pointer"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleOpenPostcode('owner')}
                    className="px-4 py-2.5 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                  >
                    <SearchIcon className="w-3.5 h-3.5" />
                    <span>우편번호 검색</span>
                  </button>
                </div>
              </div>

              {/* 기본 주소 (조회 시 도로명 + 건물명 + 동 전체 자동 입력) */}
              <div>
                <label className="block font-semibold mb-1 text-xs text-[#2C3833]">
                  보호자 주민등록상 기본 주소지 <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  onClick={() => {
                    if (!formData.address) handleOpenPostcode('owner');
                  }}
                  placeholder="우편번호 검색 시 도로명/지번 및 건물 상세 주소가 자동 입력됩니다"
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#144A42] text-xs sm:text-sm"
                />
              </div>

              {/* 추가 상세 주소 (동, 호수, 층수 등) */}
              <div>
                <label className="block font-semibold mb-1 text-xs text-[#2C3833] flex items-center justify-between">
                  <span>추가 상세 주소 (동, 호수 등)</span>
                  <span className="text-[11px] text-gray-400 font-normal">직접 입력</span>
                </label>
                <input 
                  ref={addressDetailRef}
                  type="text" 
                  value={formData.addressDetail || ''} 
                  onChange={(e) => setFormData({...formData, addressDetail: e.target.value})}
                  placeholder="예: 101동 1204호, 2층, 상가 B01호 등"
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#144A42] text-xs sm:text-sm font-medium"
                />
                <p className="text-[11px] text-[#7A8580] mt-1.5 leading-relaxed">
                  * 동물등록증 발급 및 관할 지자체 행정 전산망 등록을 위한 공식 법정 주소지입니다.
                </p>
              </div>

              {/* 주소 전체 조합 실시간 미리보기 카드 */}
              {(formData.address || formData.postalCode) && (
                <div className="p-3.5 bg-[#FAF8F5] border border-[#E7DFD1] text-xs space-y-1">
                  <span className="font-bold text-[#144A42] block text-[11px] flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5 text-[#144A42]" />
                    <span>등록될 전체 주소 미리보기:</span>
                  </span>
                  <p className="text-[#2C3B35] font-semibold text-xs leading-relaxed break-all">
                    {formData.postalCode ? `[${formData.postalCode}] ` : ''}
                    {formData.address}
                    {formData.addressDetail ? ` ${formData.addressDetail}` : ''}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: 반려동물 정보 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">우리 아이 이름 <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.petName} 
                  onChange={(e) => setFormData({...formData, petName: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#144A42] font-semibold text-base"
                  placeholder="예: 뭉치, 초코, 루루"
                  autoFocus
                />
              </div>

              {/* 반려동물 사진 등록 */}
              <div>
                <label className="block font-semibold mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-[#204941]">
                    <CameraIcon className="w-4 h-4 text-[#144A42]" />
                    <span>우리 아이 사진 등록 (동물등록증 카드 발급용)</span>
                  </span>
                  <span className="text-[10px] font-medium text-[#144A42] bg-[#EAF5F2] px-2 py-0.5 border border-[#CBE5DE]">
                    선택 사항
                  </span>
                </label>
                
                <div className="flex items-center gap-4 p-3.5 bg-[#FAF8F5] border border-[#DDD5C7]">
                  {/* Photo Preview Thumbnail */}
                  <div className="w-20 h-20 bg-white border-2 border-[#144A42] flex items-center justify-center overflow-hidden shrink-0 relative shadow-inner">
                    {formData.petPhoto ? (
                      <img 
                        src={formData.petPhoto} 
                        alt="반려동물 사진 미리보기" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-gray-400 flex flex-col items-center">
                        <PawIcon className="w-6 h-6 text-[#C5A880] mb-1" />
                        <span className="text-[10px] text-gray-400 font-medium">사진 미등록</span>
                      </div>
                    )}
                  </div>

                  {/* Actions & Instructions */}
                  <div className="flex-1 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <label className="px-3.5 py-1.5 bg-[#144A42] text-white font-bold cursor-pointer hover:bg-[#0D3832] transition flex items-center gap-1.5 shadow-sm text-xs">
                        <CameraIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>{formData.petPhoto ? '사진 변경하기' : '사진 등록하기'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload}
                          className="hidden" 
                        />
                      </label>
                      {formData.petPhoto && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, petPhoto: '' }))}
                          className="px-2.5 py-1.5 border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition text-xs font-semibold"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6B7973] leading-snug">
                      모바일 갤러리 또는 카메라로 정면 얼굴 사진을 등록하시면 공식 동물등록증 카드에 인쇄됩니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">축종</label>
                  <select 
                    value={formData.petType}
                    onChange={(e) => setFormData({...formData, petType: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-300 focus:outline-none"
                  >
                    <option value="dog">반려견 (개)</option>
                    <option value="cat">반려묘 (고양이)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">품종</label>
                  <input 
                    type="text" 
                    value={formData.breed} 
                    onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-300 focus:outline-none"
                    placeholder="예: 말티푸, 포메라니안"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">성별</label>
                  <div className="flex gap-2">
                    {['남아', '여아'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({...formData, gender: g})}
                        className={`flex-1 py-2 text-xs font-semibold border ${
                          formData.gender === g ? 'bg-[#144A42] text-white border-[#144A42]' : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">중성화 여부</label>
                  <div className="flex gap-2">
                    {['완료', '미완료'].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setFormData({...formData, neutered: n})}
                        className={`flex-1 py-2 text-xs font-semibold border ${
                          formData.neutered === n ? 'bg-[#144A42] text-white border-[#144A42]' : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">생년월일 (추정 가능)</label>
                <input 
                  type="date" 
                  value={formData.petBirth} 
                  onChange={(e) => setFormData({...formData, petBirth: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 4: 등록 방식 선택 */}
          {step === 4 && (
            <div className="space-y-3">
              <label className="block font-semibold">등록 방식 선택</label>
              
              <div 
                onClick={() => setFormData({...formData, regType: 'external'})}
                className={`p-4 border-2 cursor-pointer transition ${
                  formData.regType === 'external' ? 'border-[#144A42] bg-[#F3F9F7]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#144A42] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#144A42]"></span>
                    외장형 안심 목걸이 인식표 패키지 (가장 인기)
                  </span>
                  <span className="text-xs font-bold text-[#144A42] bg-[#E1F3EE] px-2.5 py-0.5">
                    수수료 무료
                  </span>
                </div>
                <p className="text-xs text-[#52605A] leading-relaxed">
                  가볍고 예쁜 생활방수 전자태그 펜던트와 공식 동물등록증 카드가 택배로 배송됩니다.
                </p>
              </div>

              <div 
                onClick={() => setFormData({...formData, regType: 'internal'})}
                className={`p-4 border-2 cursor-pointer transition ${
                  formData.regType === 'internal' ? 'border-[#144A42] bg-[#F3F9F7]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#144A42] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#C5A880]"></span>
                    내장형 마이크로칩 제휴병원 시술권
                  </span>
                  <span className="text-xs font-bold text-[#8D6836] bg-[#FAF2E5] px-2.5 py-0.5">
                    협력 병원 지원
                  </span>
                </div>
                <p className="text-xs text-[#52605A] leading-relaxed">
                  피하에 쌀알 크기의 칩을 주입하는 방식으로 분실 위험이 전혀 없으며, 슬반생 제휴 병원에서 전문 수의사가 안전하게 시술합니다.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: 수령 정보 */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1 text-xs text-[#2C3833]">
                  받는 사람 성명 <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.recipient || formData.ownerName} 
                  onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                  placeholder="수령인 성명"
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#144A42] text-xs sm:text-sm"
                />
              </div>

              {/* 배송지 주소 섹션 */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-xs text-[#2C3833]">
                    인식표 배송지 주소 <span className="text-red-500">*</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#144A42] font-semibold cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={isSameAsOwnerAddress}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsSameAsOwnerAddress(checked);
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            shippingPostalCode: prev.postalCode,
                            shippingAddress: prev.address,
                            shippingAddressDetail: prev.addressDetail || ''
                          }));
                        }
                      }}
                      className="w-3.5 h-3.5 text-[#144A42] focus:ring-0"
                    />
                    <span>보호자 등록 주소와 동일</span>
                  </label>
                </div>

                {/* 배송지 우편번호 & 검색 */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly
                    value={formData.shippingPostalCode || ''} 
                    onClick={() => handleOpenPostcode('shipping')}
                    placeholder="우편번호"
                    className="w-32 px-3 py-2 border border-gray-300 bg-gray-50 text-xs font-mono cursor-pointer"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleOpenPostcode('shipping')}
                    className="px-3.5 py-2 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition flex items-center gap-1 shrink-0 shadow-xs"
                  >
                    <SearchIcon className="w-3 h-3" />
                    <span>우편번호 검색</span>
                  </button>
                </div>

                {/* 배송지 기본 주소 */}
                <input 
                  type="text" 
                  value={formData.shippingAddress || ''} 
                  onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                  onClick={() => {
                    if (!formData.shippingAddress) handleOpenPostcode('shipping');
                  }}
                  placeholder="도로명 주소 (우편번호 검색 시 자동 입력)"
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#144A42] text-xs sm:text-sm"
                />

                {/* 배송지 추가 상세 주소 */}
                <input 
                  ref={shippingAddressDetailRef}
                  type="text" 
                  value={formData.shippingAddressDetail || ''} 
                  onChange={(e) => setFormData({...formData, shippingAddressDetail: e.target.value})}
                  placeholder="추가 상세 주소 (동, 호수, 층수 등 직접 입력)"
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#144A42] text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-xs text-[#2C3833]">배송 메모</label>
                <input 
                  type="text" 
                  value={formData.shippingMemo} 
                  onChange={(e) => setFormData({...formData, shippingMemo: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#144A42] text-xs sm:text-sm"
                  placeholder="예: 부재 시 경비실 또는 문 앞 보관 부탁드립니다"
                />
              </div>
            </div>
          )}

          {/* Step 6: 동의 및 요약 */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="bg-[#FAF8F5] p-5 border border-[#EAE3D5] space-y-2 text-xs">
                <p className="font-bold text-[#144A42] text-sm mb-2">신청 내용 요약</p>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-gray-500">보호자 / 연락처</span>
                  <span className="font-semibold">{formData.ownerName} ({formData.phone})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFECE6]">
                  <span className="text-gray-500 shrink-0">주민등록상 주소지</span>
                  <span className="font-semibold text-right break-all max-w-[280px]">
                    {formData.postalCode ? `(${formData.postalCode}) ` : ''}{formData.address} {formData.addressDetail || ''}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#EFECE6]">
                  <span className="text-gray-500">반려동물</span>
                  <div className="flex items-center gap-2">
                    {formData.petPhoto ? (
                      <img 
                        src={formData.petPhoto} 
                        alt="아이 사진" 
                        className="w-7 h-7 object-cover border border-[#144A42] shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <PawIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <span className="font-semibold">{formData.petName} ({formData.breed || '믹스/기타'}, {formData.gender})</span>
                  </div>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-gray-500">등록 방식</span>
                  <span className="font-semibold">{formData.regType === 'external' ? '외장형 목걸이 인식표 패키지' : '내장형 마이크로칩 시술권'}</span>
                </div>
                {formData.regType === 'external' && (
                  <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                    <span className="text-gray-500 shrink-0">배송 수령지</span>
                    <span className="font-semibold text-right break-all max-w-[280px]">
                      {formData.recipient || formData.ownerName} / {formData.shippingPostalCode ? `(${formData.shippingPostalCode}) ` : ''}{formData.shippingAddress || formData.address} {formData.shippingAddressDetail || formData.addressDetail || ''}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">신청 수수료</span>
                  <span className="font-bold text-[#144A42]">0원 (슬반생 대행 지원)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.agreeTerms} 
                    onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                    className="w-4 h-4 text-[#144A42] focus:ring-0"
                  />
                  <span className="text-xs font-semibold">[필수] 동물보호법에 따른 동물등록 업무 대행 위임 동의</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.agreeAgency} 
                    onChange={(e) => setFormData({...formData, agreeAgency: e.target.checked})}
                    className="w-4 h-4 text-[#144A42] focus:ring-0"
                  />
                  <span className="text-xs font-semibold">[필수] 개인정보 수집 및 지자체 전산망 등록 제공 동의</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 7: 접수 완료 */}
          {step === 7 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-[#E5F5F0] text-[#144A42] flex items-center justify-center mx-auto shadow-inner border border-[#144A42]">
                <CheckIcon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-[#144A42]">동물등록 신청이 접수되었습니다!</h4>
                <p className="text-xs text-[#62706A]">
                  정부 동물보호관리시스템 검수 및 승인 절차가 신속히 진행됩니다.
                </p>
              </div>

              <div className="bg-[#FAF8F5] p-5 border border-[#ECE5D8] max-w-sm mx-auto text-xs space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-500">접수번호</span>
                  <span className="font-bold text-[#144A42]">{submittedNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">반려동물</span>
                  <span className="font-semibold">{formData.petName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">현재 상태</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5">접수 완료 (검수 중)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">예상 등록완료일</span>
                  <span className="font-semibold">영업일 기준 2~3일 이내</span>
                </div>
              </div>

              <p className="text-[11px] text-[#838F8A]">
                진행 상황은 상단 [MY 슬반생] 메뉴에서 언제든 실시간 확인하실 수 있습니다.
              </p>
            </div>
          )}

        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-[#FAF9F6] border-t border-[#EAE4D7] flex items-center justify-between">
          {step < 7 ? (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  이전 단계
                </button>
              ) : <div></div>}
              
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#144A42] text-white text-xs font-bold hover:bg-[#0D3832] transition flex items-center gap-1.5 shadow-md"
              >
                <span>{step === 6 ? '동물등록 신청 완료하기' : '다음 단계'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-[#144A42] text-white text-sm font-bold hover:bg-[#0D3832] transition"
            >
              확인 및 닫기
            </button>
          )}
        </div>

      </div>

      {/* 카카오 우편번호 검색 레이어 모달 */}
      {isPostcodeModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden flex flex-col border border-[#144A42]">
            <div className="bg-[#144A42] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SearchIcon className="w-4 h-4 text-[#C5A880]" />
                <span className="font-bold text-sm">
                  {postcodeTarget === 'owner' ? '보호자 주소지 우편번호 검색' : '배송지 주소 우편번호 검색'}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsPostcodeModalOpen(false)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10"
                aria-label="우편번호 검색창 닫기"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Daum Postcode Embed Container */}
            <div 
              ref={postcodeContainerRef} 
              className="w-full h-[450px] relative bg-white"
            />
            
            <div className="p-3 bg-[#FAF8F5] border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
              <span>도로명 주소, 건물명, 지번을 검색 후 주소를 클릭하세요.</span>
              <button
                type="button"
                onClick={() => setIsPostcodeModalOpen(false)}
                className="font-bold text-[#144A42] hover:underline"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. 멤버십 혜택 & 사전신청 모달 (MEM-001 & MEM-002)
export function MembershipModal({ isOpen, onClose, onLeadSubmit }) {
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    petBreed: '',
    interest: '병원비 할인',
    agree: true,
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      alert('성함과 연락처를 입력해 주세요.');
      return;
    }
    onLeadSubmit(leadForm);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white text-[#1D2522] w-full max-w-2xl shadow-2xl border border-[#DDD5C7] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top */}
        <div className="px-4 sm:px-6 py-3 sm:py-5 bg-[#144A42] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#E6CAA4]" />
            <span className="font-bold text-sm sm:text-lg text-white">슬반생 프리미엄 멤버십 사전신청</span>
          </div>
          <button onClick={onClose} className="p-1 text-white/70 hover:text-white transition">
            <XIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-xs sm:text-sm text-[#2D3734] bg-white">
          
          {/* Header Copy */}
          <div className="bg-[#FAF8F5] p-3.5 sm:p-5 border border-[#ECE5DA]">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#9C7A4E] uppercase">SEULBAN VIP CLUB</span>
            <h3 className="text-base sm:text-2xl font-bold text-[#144A42] mt-0.5 sm:mt-1 leading-snug">
              반려생활의 부담은 가볍게,<br className="hidden sm:inline" />혜택은 더 든든하게
            </h3>
            <p className="text-[11px] sm:text-xs text-[#5E6D67] mt-1 sm:mt-2 leading-relaxed">
              정식 론칭 전 사전신청자 분들께만 평생 월회비 40% 할인 혜택 및 웰컴 스타터 패키지를 선물합니다.
            </p>
          </div>

          {/* Perks Comparison Table */}
          <div className="bg-white border border-[#E3DDD1] overflow-hidden shadow-xs">
            <div className="grid grid-cols-3 bg-[#F4F1EB] px-4 py-3 text-xs font-bold text-[#144A42] border-b border-[#E3DDD1]">
              <span>혜택 항목</span>
              <span className="text-center text-gray-500">일반 회원</span>
              <span className="text-center text-[#9C7A4E] font-extrabold">★ 슬반생 멤버십</span>
            </div>
            <div className="divide-y divide-[#EFECE6] text-xs">
              <div className="grid grid-cols-3 px-4 py-3 items-center">
                <span className="font-semibold text-gray-800">동물등록비</span>
                <span className="text-center text-gray-500">대행 수수료만 지원</span>
                <span className="text-center text-[#144A42] font-bold bg-[#EBF5F2] py-1">인식표 키트 전액 지원</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-3 items-center">
                <span className="font-semibold text-gray-800">제휴 동물병원</span>
                <span className="text-center text-gray-500">기본 상담</span>
                <span className="text-center text-[#144A42] font-bold bg-[#EBF5F2] py-1">진료비 10~20% 즉시할인</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-3 items-center">
                <span className="font-semibold text-gray-800">반려동물 숙소</span>
                <span className="text-center text-gray-500">정가 이용</span>
                <span className="text-center text-[#144A42] font-bold bg-[#EBF5F2] py-1">주중 최대 30% 우대</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-3 items-center">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-800">슬반생몰 쇼핑</span>
                  <span className="text-[10px] bg-[#EAE4D7] text-[#144A42] px-1 py-0.5 rounded font-bold">준비중</span>
                </div>
                <span className="text-center text-gray-500">첫구매 3,000원</span>
                <span className="text-center text-[#144A42] font-bold bg-[#EBF5F2] py-1">매월 50,000원 쿠폰팩</span>
              </div>
            </div>
          </div>

          {/* Lead Submission Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="bg-[#FAF8F5] p-5 border border-[#ECE5DA] space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#ECE5DA] pb-2.5">
                <p className="font-bold text-[#144A42] text-sm">사전 예약 신청서</p>
                <span className="text-xs font-semibold text-[#9C7A4E] bg-[#F2EDE2] px-2 py-0.5">비용 발생 없음</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">성함 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={leadForm.name} 
                    onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                    placeholder="홍길동"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 text-gray-900 text-xs focus:border-[#144A42] focus:ring-1 focus:ring-[#144A42] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">연락처 <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={13}
                    value={leadForm.phone} 
                    onChange={(e) => setLeadForm({...leadForm, phone: formatPhoneNumber(e.target.value)})}
                    placeholder="010-0000-0000"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 text-gray-900 text-xs focus:border-[#144A42] focus:ring-1 focus:ring-[#144A42] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">반려견/묘 품종</label>
                  <input 
                    type="text" 
                    value={leadForm.petBreed} 
                    onChange={(e) => setLeadForm({...leadForm, petBreed: e.target.value})}
                    placeholder="예: 푸들, 말티즈, 코숏"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 text-gray-900 text-xs focus:border-[#144A42] focus:ring-1 focus:ring-[#144A42] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">가장 기대되는 혜택</label>
                  <select 
                    value={leadForm.interest} 
                    onChange={(e) => setLeadForm({...leadForm, interest: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 text-gray-900 text-xs focus:border-[#144A42] focus:ring-1 focus:ring-[#144A42] focus:outline-none"
                  >
                    <option value="동물병원비 할인">동물병원비 할인</option>
                    <option value="반려동물 숙소 우대">반려동물 숙소 우대</option>
                    <option value="동물등록 지원">동물등록 지원</option>
                    <option value="쇼핑몰 쿠폰">쇼핑몰 정기 할인쿠폰</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={leadForm.agree} 
                  onChange={(e) => setLeadForm({...leadForm, agree: e.target.checked})}
                  className="accent-[#144A42] w-4 h-4"
                  required
                />
                <span className="text-xs text-gray-600">[필수] 사전 예약 혜택 안내 및 출시 알림 수신 동의</span>
              </label>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#144A42] hover:bg-[#0E352F] text-white font-bold text-sm transition shadow-md mt-2 flex items-center justify-center gap-2"
              >
                <span>사전신청 완료하고 혜택 찜하기</span>
                <span>→</span>
              </button>
            </form>
          ) : (
            <div className="bg-[#FAF8F5] p-8 border border-[#ECE5DA] text-center space-y-3">
              <div className="w-14 h-14 bg-[#EAF5F2] text-[#144A42] flex items-center justify-center mx-auto rounded-full mb-1">
                <CheckIcon className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#144A42]">사전예약 신청이 완료되었습니다!</h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                정식 출시 시 신청해주신 연락처로 가장 먼저 우대 혜택 및 알림톡을 발송해 드리겠습니다. 감사합니다.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// 3. 제휴처 상세 모달 (PAR-002)
export function PartnerModal({ partner, isOpen, onClose, onToggleBookmark, isBookmarked }) {
  if (!isOpen || !partner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#DDD5C7]">
        
        {/* Header with category tag */}
        <div className="p-6 bg-[#FAF8F5] border-b border-[#ECE6DA] flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-[#144A42] bg-[#E1F1ED] px-2.5 py-1">
              {partner.categoryName} • {partner.tag}
            </span>
            <h3 className="text-xl font-bold text-[#144A42] mt-2">{partner.name}</h3>
            <p className="text-xs text-[#717E78] flex items-center gap-1 mt-1">
              <MapPinIcon className="w-3.5 h-3.5 text-[#889891]" />
              {partner.location}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Optional Photo Banner */}
        {partner.imageUrl && (
          <div className="w-full h-48 sm:h-56 bg-gray-100 overflow-hidden shrink-0 border-b border-[#ECE6DA]">
            <img
              src={partner.imageUrl}
              alt={partner.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-[#26312D] overflow-y-auto">
          {/* Benefit box */}
          <div className="p-4 bg-[#EAF5F2] border border-[#CDE5DF] space-y-1">
            <span className="text-[11px] font-bold text-[#144A42] tracking-wider uppercase">슬반생 단독 제휴 혜택</span>
            <p className="font-bold text-[#144A42] text-sm">{partner.benefit}</p>
          </div>

          <div>
            <h5 className="font-semibold text-xs text-gray-500 mb-1">시설 소개 및 특징</h5>
            <p className="text-xs text-[#525E59] leading-relaxed">{partner.desc}</p>
          </div>

          <div className="bg-[#FAF9F6] p-4 space-y-2 text-xs border border-[#ECE6D8]">
            <div className="flex justify-between">
              <span className="text-gray-500">영업 시간</span>
              <span className="font-semibold">연중무휴 (24시간 응급진료 가능)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">반려동물 동반조건</span>
              <span className="font-semibold">모든 견종/묘종 가능 (예방접종 완료 권장)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">전화번호</span>
              <span className="font-bold text-[#144A42]">{partner.phone}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#ECE6DA] flex items-center gap-3">
          <button
            onClick={() => onToggleBookmark(partner.id)}
            className={`px-5 py-2.5 border flex items-center gap-1.5 text-xs font-semibold transition ${
              isBookmarked ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            <HeartIcon className="w-4 h-4" filled={isBookmarked} />
            <span>{isBookmarked ? '찜 완료' : '찜하기'}</span>
          </button>
          
          <a
            href={`tel:${partner.phone}`}
            className="flex-1 py-2.5 bg-[#144A42] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#0D3832] transition shadow-xs"
          >
            <PhoneIcon className="w-3.5 h-3.5" />
            <span>전화 문의 및 예약하기</span>
          </a>
        </div>

      </div>
    </div>
  );
}

// 4. 회원가입/로그인 모달 (이메일 가입/로그인 전용)
export function LoginModal({ isOpen, onClose, onLogin, initialMode = 'login' }) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSignUp(initialMode === 'signup');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      setName('');
      setPhone('');
      setError('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // 이메일 회원가입 / 로그인 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!name.trim()) {
        setError('이름을 입력해 주세요.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('올바른 이메일 주소를 입력해 주세요.');
        return;
      }
      if (password.length < 6) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
      }
      if (password !== passwordConfirm) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }

      setIsLoading(true);
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        provider: 'email',
        password,
        isNewUser: true,
        isMember: true,
        membershipLevel: 'VIP 회원',
      };
      
      setTimeout(() => {
        setIsLoading(false);
        onLogin(userData);
        onClose();
      }, 200);
    } else {
      if (!email.trim()) {
        setError('이메일을 입력해 주세요.');
        return;
      }
      if (!password) {
        setError('비밀번호를 입력해 주세요.');
        return;
      }

      setIsLoading(true);
      const userData = {
        name: email.split('@')[0] || '보호자',
        email: email.trim().toLowerCase(),
        phone: '',
        provider: 'email',
        password,
        isNewUser: false,
        isMember: true,
        membershipLevel: 'VIP 회원',
      };

      setTimeout(() => {
        setIsLoading(false);
        onLogin(userData);
        onClose();
      }, 200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md shadow-2xl p-6 sm:p-7 border border-[#ECE5D8] max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-5 pb-3 border-b border-[#F0EBE0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#144A42] tracking-tight">슬반생</span>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-[#FAF8F5] border border-[#DDD6C8] text-[#144A42]">
                {isSignUp ? '이메일 회원가입' : '이메일 로그인'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isSignUp 
                ? '이메일로 간편 가입하시고 실시간 동물등록 및 멤버십 혜택을 이용하세요.' 
                : '가입하신 이메일 계정으로 로그인하여 마이페이지를 이용하세요.'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <span className="font-bold">!</span>
            <span>{error}</span>
          </div>
        )}

        {/* Email Sign Up / Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isSignUp && (
            <div>
              <label className="block font-bold mb-1 text-gray-700">이름 (보호자 실명) <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                required
                autoFocus
              />
            </div>
          )}

          <div>
            <label className="block font-bold mb-1 text-gray-700">이메일 주소 <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
              required
              {...(!isSignUp ? { autoFocus: true } : {})}
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block font-bold mb-1 text-gray-700">휴대폰 번호 <span className="font-normal text-gray-400">(선택)</span></label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                placeholder="010-0000-0000"
                maxLength={13}
                className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block font-bold mb-1 text-gray-700">비밀번호 {isSignUp && <span className="font-normal text-gray-400">(6자 이상)</span>} <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block font-bold mb-1 text-gray-700">비밀번호 확인 <span className="text-red-500">*</span></label>
              <input 
                type="password" 
                value={passwordConfirm} 
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-gray-300 focus:border-[#144A42] focus:outline-none"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#144A42] text-white font-bold hover:bg-[#0D3832] transition shadow-sm mt-3 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span>처리 중...</span>
            ) : (
              <span>{isSignUp ? '이메일 회원가입 완료' : '이메일 로그인'}</span>
            )}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }} 
            className="text-[#144A42] font-bold underline hover:text-[#0D3832] cursor-pointer"
          >
            {isSignUp ? '이미 계정이 있으신가요? 이메일 로그인' : '아직 계정이 없으신가요? 이메일 회원가입'}
          </button>
          <button
            type="button"
            onClick={() => {
              onLogin({
                name: '체험 보호자',
                email: 'guest@seulbanlife.com',
                phone: '010-0000-0000',
                provider: 'demo',
                isMember: true,
                membershipLevel: '일반 회원'
              });
              onClose();
            }}
            className="text-[11px] text-gray-400 hover:text-gray-600 underline cursor-pointer"
          >
            체험 계정 둘러보기
          </button>
        </div>

      </div>
    </div>
  );
}

// 5. 관리자 시스템 모달 (기획서 13장 ADM-001 ~ ADM-130)
export function AdminModal({ isOpen, onClose, applications, onUpdateAppStatus }) {
  if (!isOpen) return null;

  const statuses = [
    { code: 'SUBMITTED', label: '접수 완료' },
    { code: 'REVIEWING', label: '서류 검수 중' },
    { code: 'ACCEPTED', label: '처리 승인' },
    { code: 'REGISTERED', label: '등록번호 발급' },
    { code: 'SHIPPING', label: '배송 출발' },
    { code: 'COMPLETED', label: '처리 완료' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#DDD5C7]">
        
        {/* Admin Header */}
        <div className="bg-[#111716] text-white px-6 py-4 flex items-center justify-between border-b border-[#23312E]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-emerald-400 animate-pulse"></span>
            <div>
              <h3 className="font-bold text-base">슬반생 통합 관리자 콘솔 (ADM-001)</h3>
              <p className="text-[11px] text-gray-400">개발기획서 13장: 동물등록 검수 & 상태 제어 CRM</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard KPIs */}
        <div className="grid grid-cols-4 gap-3 p-5 bg-[#FAF9F6] border-b border-gray-200 text-xs">
          <div className="bg-white p-3.5 border border-gray-200 shadow-xs">
            <span className="text-gray-500 font-medium">오늘 접수건</span>
            <p className="text-xl font-extrabold text-[#144A42] mt-1">{applications.length}건</p>
          </div>
          <div className="bg-white p-3.5 border border-gray-200 shadow-xs">
            <span className="text-gray-500 font-medium">검수 대기</span>
            <p className="text-xl font-extrabold text-amber-600 mt-1">
              {applications.filter(a => a.statusCode === 'SUBMITTED' || a.statusCode === 'REVIEWING').length}건
            </p>
          </div>
          <div className="bg-white p-3.5 border border-gray-200 shadow-xs">
            <span className="text-gray-500 font-medium">배송 중</span>
            <p className="text-xl font-extrabold text-blue-600 mt-1">
              {applications.filter(a => a.statusCode === 'SHIPPING').length}건
            </p>
          </div>
          <div className="bg-white p-3.5 border border-gray-200 shadow-xs">
            <span className="text-gray-500 font-medium">완료율</span>
            <p className="text-xl font-extrabold text-emerald-700 mt-1">98.4%</p>
          </div>
        </div>

        {/* Application Table */}
        <div className="p-5 overflow-y-auto flex-1">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
            동물등록 신청 목록 (실시간 연동)
          </h4>
          <div className="border border-gray-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                <tr>
                  <th className="p-3">접수번호</th>
                  <th className="p-3">보호자 / 반려동물</th>
                  <th className="p-3">등록 유형</th>
                  <th className="p-3">신청일시</th>
                  <th className="p-3">현재 상태</th>
                  <th className="p-3 text-right">상태 변경 액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3 font-mono font-bold text-[#144A42]">{app.id}</td>
                    <td className="p-3">
                      <span className="font-semibold text-gray-800">{app.ownerName}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-emerald-800 font-bold">{app.petName}</span>
                    </td>
                    <td className="p-3 text-gray-600">{app.type}</td>
                    <td className="p-3 text-gray-500">{app.appliedDate}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-0.5 font-bold text-[11px] ${
                        app.statusCode === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        app.statusCode === 'SHIPPING' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {app.statusLabel}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={app.statusCode}
                        onChange={(e) => onUpdateAppStatus(app.id, e.target.value)}
                        className="text-xs font-semibold px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-[#144A42]"
                      >
                        {statuses.map((s) => (
                          <option key={s.code} value={s.code}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <span>* 상태를 변경하면 사용자 마이페이지(MY)에 실시간으로 즉시 반영됩니다.</span>
          <button onClick={onClose} className="px-5 py-2.5 bg-[#144A42] text-white font-bold">
            관리자 닫기
          </button>
        </div>

      </div>
    </div>
  );
}

// 6. 메인 3:4 이미지 팝업 모달 (복수 팝업 지원, 7일간 보지 않기, 다크 백드롭, 링크 연결 지원)
export function MainPopupModal({ popups = [], onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 활성화된 팝업만 필터링
  const activePopups = popups.filter(p => p.active !== false && p.imageUrl);

  useEffect(() => {
    if (activePopups.length === 0) {
      setIsOpen(false);
      return;
    }

    // 7일간 보지 않기 만료 시간 확인
    const hideUntil = localStorage.getItem('seulban_hide_popup_until');
    if (hideUntil) {
      const now = new Date().getTime();
      if (now < parseInt(hideUntil, 10)) {
        setIsOpen(false);
        return;
      } else {
        localStorage.removeItem('seulban_hide_popup_until');
      }
    }

    setIsOpen(true);
  }, [popups.length]);

  if (!isOpen || activePopups.length === 0) return null;

  const currentPopup = activePopups[currentIndex] || activePopups[0];

  // 7일간 보지 않기 클릭 핸들러
  const handleHide7Days = () => {
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const expireTime = new Date().getTime() + sevenDaysInMs;
    localStorage.setItem('seulban_hide_popup_until', expireTime.toString());
    setIsOpen(false);
  };

  // 팝업 이미지 클릭 시 동작 (연결 링크가 있는 경우 이동, 없으면 순수 이미지)
  const handlePopupClick = () => {
    if (!currentPopup.linkUrl && !currentPopup.internalTab) {
      // 링크 값이 없으면 그냥 이미지 팝업으로 동작
      return;
    }

    setIsOpen(false);

    if (currentPopup.linkUrl) {
      if (currentPopup.linkUrl.startsWith('http')) {
        window.open(currentPopup.linkUrl, '_blank', 'noopener,noreferrer');
      } else if (currentPopup.linkUrl.startsWith('/')) {
        window.location.href = currentPopup.linkUrl;
      }
    } else if (currentPopup.internalTab && onNavigate) {
      onNavigate(currentPopup.internalTab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-[340px] sm:max-w-[380px] bg-[#111716] shadow-2xl overflow-hidden flex flex-col border border-[#2E3F3B]">
        
        {/* 상단: 복수 팝업 인디케이터 (2개 이상인 경우) & 닫기 버튼 */}
        <div className="px-3.5 py-2.5 bg-[#142C27] text-white flex items-center justify-between border-b border-[#23443D]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E8DEC8]">
            <SparklesIcon className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>슬반생 안내</span>
            {activePopups.length > 1 && (
              <span className="ml-1 text-[11px] px-1.5 py-0.2 bg-[#0C1F1B] text-[#C5A880] border border-[#2E4E46]">
                {currentIndex + 1} / {activePopups.length}
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-300 hover:text-white transition"
            aria-label="팝업 닫기"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* 3:4 비율 이미지 영역 */}
        <div className="relative w-full aspect-[3/4] bg-[#0E1513] overflow-hidden group">
          <img
            src={currentPopup.imageUrl}
            alt={currentPopup.title || "슬반생 이벤트 팝업"}
            onClick={handlePopupClick}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              (currentPopup.linkUrl || currentPopup.internalTab) ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'
            }`}
          />

          {/* 여러 개 팝업이 있을 때 좌우 이동 화살표 */}
          {activePopups.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activePopups.length - 1));
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition shadow-md"
                aria-label="이전 팝업"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev < activePopups.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition shadow-md"
                aria-label="다음 팝업"
              >
                ›
              </button>

              {/* 하단 점형 페이지네이션 인디케이터 */}
              <div className="absolute bottom-2.5 left-0 right-0 flex justify-center items-center gap-1.5 pointer-events-none">
                {activePopups.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 transition-all rounded-full ${
                      idx === currentIndex ? 'w-5 bg-[#C5A880]' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* 링크 연결 힌트 뱃지 (링크가 있을 때만 노출) */}
          {(currentPopup.linkUrl || currentPopup.internalTab) && (
            <div 
              onClick={handlePopupClick}
              className="absolute top-2 right-2 bg-[#144A42]/90 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm cursor-pointer hover:bg-[#144A42] flex items-center gap-1"
            >
              <span>자세히 보기</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </div>
          )}
        </div>

        {/* 팝업 하단: 7일간 보지 않기 & 닫기 바 */}
        <div className="bg-[#111716] px-4 py-2.5 flex items-center justify-between text-xs text-gray-300 border-t border-[#23332E]">
          <button
            type="button"
            onClick={handleHide7Days}
            className="hover:text-white transition flex items-center gap-1 text-[11px] text-[#A6B4AF] hover:underline"
          >
            <span>7일 동안 보이지 않기</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="font-bold text-white hover:text-[#C5A880] transition text-xs"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
}

// 7. 슬반생몰 오픈 준비 중 프리미엄 모달
export function MallPreparingModal({ isOpen, onClose, user, onNavigate }) {
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsNotified(false);
      if (user?.phone) {
        setPhone(user.phone);
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!phone || phone.replace(/[^0-9]/g, '').length < 10) {
      alert('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsNotified(true);
      try {
        const savedList = JSON.parse(localStorage.getItem('seulban_mall_notify_leads') || '[]');
        savedList.push({
          phone,
          userName: user?.name || '비회원',
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('seulban_mall_notify_leads', JSON.stringify(savedList));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-[#EAE4D7] relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 비주얼 이미지 & 로고 배너 */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#144A42]">
          <img 
            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80" 
            alt="슬반생몰 오픈 준비 중"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-700 brightness-95"
          />
          {/* 어두운 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#144A42] via-[#144A42]/40 to-black/30" />

          {/* 상단 로고 & 닫기 버튼 */}
          <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-10">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/50">
              <LogoEmblem className="h-6 w-auto" />
              <span className="text-[11px] font-bold text-[#144A42] tracking-tight">슬반생 공식몰</span>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition backdrop-blur-xs"
              aria-label="닫기"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 중앙/하단 오픈 예정 뱃지 & 쇼핑백 아이콘 */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-10 text-white">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A880] text-[#144A42] shadow-sm mb-1.5">
                <SparklesIcon className="w-3 h-3 text-[#144A42]" />
                COMING SOON
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md tracking-tight">
                슬반생몰 오픈 준비 중
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg text-[#E8DEC8]">
              <ShoppingBagIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 본문 콘텐츠 영역 */}
        <div className="p-5 sm:p-6 space-y-4 text-center">
          
          {/* 설명 문구 */}
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-[#C5A880] tracking-wide">
              우리 아이를 위한 프리미엄 큐레이션 쇼핑몰
            </p>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
              영양 전문가가 엄선한 안전한 프리미엄 먹거리와 케어 용품, 슬반생 등록 회원만을 위한 특별한 혜택을 정성껏 준비하고 있습니다.
            </p>
          </div>

          {/* 오픈 혜택 프리뷰 3개 카드 */}
          <div className="grid grid-cols-3 gap-2 text-left pt-1">
            <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EAE4D7]/80 flex flex-col justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#EBF5F2] text-[#144A42] flex items-center justify-center mb-1.5">
                <GiftIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-900 leading-tight">5만원 쿠폰</p>
                <p className="text-[9px] text-gray-500 mt-0.5">신규 가입 즉시</p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EAE4D7]/80 flex flex-col justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#F8F2E8] text-[#C5A880] flex items-center justify-center mb-1.5">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-900 leading-tight">무료 배송</p>
                <p className="text-[9px] text-gray-500 mt-0.5">전 상품 무조건</p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EAE4D7]/80 flex flex-col justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#EBF5F2] text-[#144A42] flex items-center justify-center mb-1.5">
                <PawIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-900 leading-tight">최대 20%</p>
                <p className="text-[9px] text-gray-500 mt-0.5">슬반생 등록 회원</p>
              </div>
            </div>
          </div>

          {/* 오픈 알림 신청 폼 */}
          <div className="bg-[#F4F8F6] p-3.5 rounded-xl border border-[#D1E6DF] text-left">
            {!isNotified ? (
              <form onSubmit={handleNotifySubmit} className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#144A42]">
                  <BellIcon className="w-3.5 h-3.5 text-[#144A42]" />
                  <span>오픈 알림 & 쿠폰팩 사전 신청</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  휴대폰 번호를 남겨주시면 런칭 당일 가장 먼저 시크릿 쿠폰을 보내드립니다.
                </p>
                <div className="flex gap-2 pt-0.5">
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    maxLength={13}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#BCD9CF] rounded-lg focus:outline-none focus:border-[#144A42] font-medium"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3.5 py-1.5 bg-[#144A42] text-white text-xs font-bold rounded-lg hover:bg-[#0E352F] transition shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? '신청 중...' : '알림 신청'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-2 space-y-1">
                <p className="text-xs font-bold text-[#144A42] flex items-center justify-center gap-1">
                  <CheckIcon className="w-4 h-4 text-[#144A42]" />
                  오픈 알림 신청이 완료되었습니다!
                </p>
                <p className="text-[11px] text-gray-600">
                  그랜드 오픈 시 <span className="font-semibold text-[#144A42]">{phone}</span> 번호로 가장 먼저 쿠폰과 함께 안내해 드릴게요.
                </p>
              </div>
            )}
          </div>

          {/* 하단 버튼 액션 */}
          <div className="pt-1 space-y-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-[#144A42] hover:bg-[#0E352F] text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>확인했습니다</span>
            </button>

            {onNavigate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate('membership');
                }}
                className="text-xs text-gray-500 hover:text-[#144A42] underline transition"
              >
                슬반생 멤버십 혜택 먼저 둘러보기 →
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

