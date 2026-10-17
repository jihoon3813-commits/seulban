import React, { useState, useEffect, useRef } from 'react';
import {
  XIcon,
  CheckIcon,
  SparklesIcon,
  SearchIcon,
  ShoppingBagIcon,
  TruckIcon,
} from '../components/Icons';
import { BRAND_INFO, PARTNER_LIST, REDPUPPY_PRODUCTS } from '../data/mockData';
import { formatPhoneNumber } from '../components/Modals';

export default function MallPage({
  partner,
  onOrderSubmit,
  user,
  brandInfo,
}) {
  const defaultRedpuppy = PARTNER_LIST.find((p) => p.id === 'p_redpuppy') || {
    id: 'p_redpuppy',
    name: '레드퍼피 (RedPuppy) 공식 회원몰',
    discountRate: 20,
    products: REDPUPPY_PRODUCTS,
  };

  const activePartner = partner || defaultRedpuppy;

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderStep, setOrderStep] = useState('browse'); // 'browse' | 'checkout' | 'success'
  const [lastOrder, setLastOrder] = useState(null);

  const [orderForm, setOrderForm] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    zonecode: '',
    address: '',
    extraAddress: '',
    detailAddress: '',
    jibunAddress: '',
    deliveryMemo: '문 앞에 놔주세요.',
  });

  const [isPostcodeModalOpen, setIsPostcodeModalOpen] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const postcodeContainerRef = useRef(null);

  // 무통장 입금 정보 (설정된 값 우선, 미설정 시 기본값)
  const bankInfoData = {
    bankName: brandInfo?.bankName || BRAND_INFO.bankName || '국민은행',
    accountNumber: brandInfo?.accountNumber || BRAND_INFO.accountNumber || '293801-01-209384',
    accountHolder: brandInfo?.accountHolder || BRAND_INFO.accountHolder || '(주)슬기로운반려생활',
    depositNotice:
      brandInfo?.depositNotice ||
      BRAND_INFO.depositNotice ||
      '주문 접수 후 24시간 이내 입금 확인 시 당일 출고되며, 미입금 시 자동 취소됩니다.',
  };

  const handleCopyAccount = () => {
    const textToCopy = `${bankInfoData.bankName} ${bankInfoData.accountNumber} ${bankInfoData.accountHolder}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedBank(true);
        setTimeout(() => setCopiedBank(false), 2000);
      });
    } else {
      alert(`입금 계좌: ${textToCopy}`);
    }
  };

  // 카카오/다음 우편번호 검색 열기
  const handleOpenPostcode = () => {
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
          oncomplete: function (data) {
            let fullAddr = data.roadAddress || data.jibunAddress;
            let extraAddr = '';

            if (data.addressType === 'R') {
              if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraAddr += data.bname;
              }
              if (data.buildingName !== '') {
                extraAddr += extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
              }
              if (extraAddr !== '') {
                extraAddr = ` (${extraAddr})`;
              }
            }

            setOrderForm((prev) => ({
              ...prev,
              zonecode: data.zonecode || '',
              address: fullAddr,
              extraAddress: extraAddr,
              jibunAddress: data.jibunAddress || '',
            }));
            setIsPostcodeModalOpen(false);
          },
          width: '100%',
          height: '100%',
        }).embed(postcodeContainerRef.current);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [isPostcodeModalOpen]);

  useEffect(() => {
    if (user) {
      setOrderForm((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || '',
        customerPhone: prev.customerPhone || user.phone || '',
      }));
    }
  }, [user]);

  const [showDetailImages, setShowDetailImages] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setVisibleCount(24);
  }, [activeCategory, searchQuery]);

  const products =
    activePartner.products && activePartner.products.length > 0
      ? activePartner.products
      : REDPUPPY_PRODUCTS;
  const visibleProducts = products.filter((p) => p.isVisible !== false);

  const categories = [
    { id: 'all', label: '전체 상품' },
    { id: 'cat', label: '고양이·스크래쳐(네코야)' },
    { id: 'carrier', label: '이동가방/백팩' },
    { id: 'living', label: '스텝/방석/하우스' },
    { id: 'car', label: '카시트/안전' },
    { id: 'food', label: '식기/간식' },
    { id: 'care', label: '산책/위생' },
  ];

  const filteredProducts = visibleProducts.filter((item) => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.modelNo && item.modelNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const visibleProductsList = filteredProducts.slice(0, visibleCount);

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setSelectedOption(
      prod.options && prod.options.length > 0 ? prod.options[0] : '기본 단일 옵션'
    );
    setQuantity(1);
    setShowDetailImages(false);
    setOrderStep('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (
      !orderForm.customerName.trim() ||
      !orderForm.customerPhone.trim() ||
      !orderForm.address.trim()
    ) {
      alert('주문자 성함, 연락처, 배송지 주소를 모두 입력해주세요.');
      return;
    }

    const orderId = `ORD-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = selectedProduct.salePrice * quantity;

    const fullShippingAddress = [
      orderForm.zonecode ? `[우:${orderForm.zonecode}]` : '',
      orderForm.address.trim(),
      orderForm.extraAddress ? orderForm.extraAddress.trim() : '',
      orderForm.detailAddress.trim(),
    ]
      .filter(Boolean)
      .join(' ');

    const newOrder = {
      id: orderId,
      partnerId: activePartner.id || 'p_redpuppy',
      partnerName: activePartner.name || '레드퍼피 (RedPuppy) 공식 회원몰',
      customerName: orderForm.customerName.trim(),
      customerPhone: orderForm.customerPhone.trim(),
      address: fullShippingAddress,
      postalCode: orderForm.zonecode || '',
      baseAddress: orderForm.address || '',
      extraAddress: orderForm.extraAddress || '',
      detailAddress: orderForm.detailAddress || '',
      productName: selectedProduct.name,
      modelNo: selectedProduct.modelNo || 'RP-STD',
      option: selectedOption,
      quantity: Number(quantity),
      unitPrice: selectedProduct.salePrice,
      totalAmount,
      paymentMethod: '무통장 입금',
      bankInfo: `${bankInfoData.bankName} ${bankInfoData.accountNumber} (${bankInfoData.accountHolder})`,
      status: 'ORDERED',
      statusLabel: '입금 대기',
      courier: '',
      trackingNumber: '',
      orderedAt: new Date().toLocaleString('ko-KR', { hour12: false }),
      memo: orderForm.deliveryMemo || '',
    };

    if (onOrderSubmit) {
      onOrderSubmit(newOrder);
    }
    setLastOrder(newOrder);
    setOrderStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full py-6 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white w-full flex flex-col shadow-xs border border-[#DCD5C5] overflow-hidden">
        {/* Subpage Top Header Banner */}
        <div className="p-5 sm:p-8 bg-[#144A42] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E5D53]">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/10 rounded-sm flex items-center justify-center text-[#E8DEC8] shrink-0">
              <ShoppingBagIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-extrabold text-lg sm:text-2xl tracking-tight">
                  슬반생 회원 특가몰
                </h1>
                <span className="bg-[#E11D48] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 uppercase tracking-wider">
                  회원 전용 단독 혜택
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#BED2CC] mt-1">
                슬반생 정회원 인증 단독 혜택 · 최대 {activePartner.discountRate || 20}% 즉시할인
              </p>
            </div>
          </div>

          {orderStep !== 'browse' && (
            <button
              type="button"
              onClick={() => {
                setOrderStep('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="self-start sm:self-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 cursor-pointer"
            >
              ← 전체 상품 목록 보기
            </button>
          )}
        </div>

        {/* Member Benefit Notification Bar */}
        <div className="bg-[#FAF6EC] px-4 py-3 sm:px-8 border-b border-[#EAE3D4] flex items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-[#6D4C1D] font-semibold">
            <SparklesIcon className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
            <span>
              <strong>[슬반생 회원 혜택 인증 완료]</strong> 주문 시 정가 대비{' '}
              <strong>{activePartner.discountRate || 20}% 특별 우대가</strong>로 주문 및 배송 접수됩니다.
            </span>
          </div>
        </div>

        {/* Subpage Body Switch by Step */}
        <div className="p-4 sm:p-8 bg-[#FAF9F6]">
          {/* STEP 1: Product Browse */}
          {orderStep === 'browse' && (
            <div className="space-y-6">
              {/* Filter and Search */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-3.5 sm:p-4 border border-[#EBE5D8] shadow-xs">
                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCategory(c.id)}
                      className={`px-3.5 py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                        activeCategory === c.id
                          ? 'bg-[#144A42] text-white shadow-xs'
                          : 'bg-[#F2EFE8] text-[#55635D] hover:bg-[#E7E2D6]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative md:w-72">
                  <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="상품명, 모델명 검색..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 bg-[#FAF8F5] focus:outline-none focus:border-[#144A42]"
                  />
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white border border-[#EAE3D6] space-y-2">
                  <ShoppingBagIcon className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-700">해당 조건의 상품이 없습니다.</p>
                  <p className="text-xs text-gray-400">다른 카테고리나 검색어로 확인해보세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs text-gray-500 px-1 font-medium">
                    <span>
                      총 <strong className="text-[#144A42]">{filteredProducts.length}</strong>개 상품
                    </span>
                    {filteredProducts.length > visibleCount && (
                      <span>
                        현재 {Math.min(visibleCount, filteredProducts.length)}개 표시 중
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {visibleProductsList.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod)}
                        className="bg-white border border-[#ECE5D8] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden cursor-pointer"
                      >
                        <div>
                          {/* Image */}
                          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden border-b border-[#ECE5D8]">
                            <img
                              src={prod.thumbUrl}
                              alt={prod.name}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                              <span className="bg-[#E11D48] text-white text-[10px] font-extrabold px-2 py-0.5 shadow-xs">
                                {prod.discountPercent || activePartner.discountRate || 20}% OFF
                              </span>
                              {prod.modelNo && (
                                <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5">
                                  {prod.modelNo}
                                </span>
                              )}
                              {prod.detailImages && prod.detailImages.length > 0 && (
                                <span className="bg-[#144A42]/90 backdrop-blur-xs text-[#FDE68A] text-[9px] font-bold px-1.5 py-0.5 shadow-xs">
                                  상세컷 {prod.detailImages.length}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-4 space-y-2">
                            <div className="text-[10px] font-bold text-[#8E764D] uppercase">
                              {prod.categoryName || '반려용품'}
                            </div>
                            <h4 className="font-bold text-sm text-[#142C27] line-clamp-1 group-hover:text-[#144A42] transition">
                              {prod.name}
                            </h4>
                            <p className="text-[11px] text-[#697872] line-clamp-2 leading-relaxed">
                              {prod.desc}
                            </p>

                            {/* Options pills */}
                            {prod.options && prod.options.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {prod.options.slice(0, 3).map((opt, i) => (
                                  <span
                                    key={i}
                                    className="text-[9px] bg-[#F4F1EA] text-[#55635D] px-1.5 py-0.5"
                                  >
                                    {opt}
                                  </span>
                                ))}
                                {prod.options.length > 3 && (
                                  <span className="text-[9px] text-gray-400">
                                    +{prod.options.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Pricing & CTA */}
                        <div className="p-4 pt-0">
                          <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between mb-3">
                            <span className="text-xs text-gray-400 line-through">
                              {prod.originalPrice.toLocaleString()}원
                            </span>
                            <div className="text-right">
                              <span className="text-[10px] text-[#E11D48] font-bold block leading-none">
                                슬반생 회원가
                              </span>
                              <span className="text-base sm:text-lg font-extrabold text-[#144A42]">
                                {prod.salePrice.toLocaleString()}원
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectProduct(prod);
                            }}
                            className="w-full py-2.5 bg-[#144A42] hover:bg-[#0D3832] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                          >
                            <ShoppingBagIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>상세보기 & 회원특가 주문</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {filteredProducts.length > visibleCount && (
                    <div className="text-center pt-4 pb-2">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + 24)}
                        className="px-8 py-3 bg-white border border-[#D5CDBD] text-[#144A42] hover:bg-[#FAF8F5] text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
                      >
                        상품 24개 더 보기 (전체 {filteredProducts.length}개 중{' '}
                        {Math.min(visibleCount, filteredProducts.length)}개 표시)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Checkout / Order Form */}
          {orderStep === 'checkout' && selectedProduct && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Back to browse button */}
              <button
                type="button"
                onClick={() => {
                  setOrderStep('browse');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs sm:text-sm text-gray-600 hover:text-[#144A42] flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>← 상품 목록으로 돌아가기</span>
              </button>

              {/* Selected Product Card */}
              <div className="bg-white p-4 sm:p-6 border border-[#E8E1D3] shadow-xs flex flex-col sm:flex-row gap-5 items-center">
                <img
                  src={selectedProduct.thumbUrl}
                  alt={selectedProduct.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xs border border-gray-200 flex-shrink-0"
                />
                <div className="flex-1 space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="bg-[#E11D48] text-white text-[10px] font-bold px-2 py-0.5">
                      {selectedProduct.discountPercent || activePartner.discountRate || 20}% OFF
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {selectedProduct.modelNo}
                    </span>
                    {selectedProduct.categoryName && (
                      <span className="text-xs text-[#8E764D] font-semibold">
                        [{selectedProduct.categoryName}]
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-base sm:text-lg text-[#142C27]">
                    {selectedProduct.name}
                  </h4>
                  <div className="flex items-baseline justify-center sm:justify-start gap-2.5 pt-1">
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      정가 {selectedProduct.originalPrice.toLocaleString()}원
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-[#144A42]">
                      회원가 {selectedProduct.salePrice.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Detail Images */}
              {selectedProduct.detailImages && selectedProduct.detailImages.length > 0 && (
                <div className="space-y-3">
                  {!showDetailImages ? (
                    <button
                      type="button"
                      onClick={() => setShowDetailImages(true)}
                      className="w-full py-3.5 bg-white hover:bg-[#FAF8F5] border border-[#D5CDBD] text-[#144A42] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <span>상세 이미지 더보기 ▼</span>
                    </button>
                  ) : (
                    <div className="bg-white border border-[#E8E1D3] shadow-xs overflow-hidden">
                      <div className="p-2 sm:p-6 space-y-4 bg-gray-50/40 text-center">
                        {selectedProduct.detailImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-gray-200 shadow-xs max-w-2xl mx-auto overflow-hidden"
                          >
                            <img
                              src={imgUrl}
                              alt={`${selectedProduct.name} 상세컷 ${idx + 1}`}
                              className="w-full h-auto object-contain mx-auto"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-[#FAF8F5] border-t border-[#EAE3D4] text-center">
                        <button
                          type="button"
                          onClick={() => setShowDetailImages(false)}
                          className="px-6 py-2 bg-white border border-[#D5CDBD] hover:bg-gray-100 text-[#144A42] font-bold text-xs transition cursor-pointer"
                        >
                          상세 이미지 접기 ▲
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Options & Quantity Selector */}
              <div className="bg-white p-4 sm:p-6 border border-[#E8E1D3] shadow-xs space-y-4">
                <h4 className="font-bold text-xs sm:text-sm text-[#142C27] border-b border-gray-100 pb-2">
                  주문 옵션 및 수량 선택
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option */}
                  {selectedProduct.options && selectedProduct.options.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        옵션 선택 *
                      </label>
                      <select
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 text-xs focus:border-[#144A42] focus:outline-none"
                      >
                        {selectedProduct.options.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      주문 수량
                    </label>
                    <div className="flex items-center border border-gray-300 w-32">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 py-1.5 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-xs">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-9 py-1.5 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total Calc */}
                <div className="pt-3 border-t border-dashed border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">총 결제 예정 금액:</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-[#144A42]">
                      {(selectedProduct.salePrice * quantity).toLocaleString()}원
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      (배송비 무료 · 슬반생 정회원 특가)
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping & Order Form */}
              <form
                onSubmit={handleCheckoutSubmit}
                className="bg-white p-4 sm:p-6 border border-[#E8E1D3] shadow-xs space-y-4"
              >
                <h4 className="font-bold text-xs sm:text-sm text-[#142C27] border-b border-gray-100 pb-2 flex items-center gap-1.5">
                  <TruckIcon className="w-4 h-4 text-[#144A42]" />
                  <span>배송지 및 주문자 정보 입력</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      주문자 성함 *
                    </label>
                    <input
                      type="text"
                      value={orderForm.customerName}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, customerName: e.target.value })
                      }
                      placeholder="홍길동"
                      className="w-full px-3 py-2 border border-gray-300 text-xs focus:border-[#144A42] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      휴대폰 번호 *
                    </label>
                    <input
                      type="tel"
                      value={orderForm.customerPhone}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          customerPhone: formatPhoneNumber(e.target.value),
                        })
                      }
                      placeholder="010-0000-0000"
                      className="w-full px-3 py-2 border border-gray-300 text-xs focus:border-[#144A42] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* 배송지 주소 검색 및 상세 정보 */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    배송지 주소 <span className="text-red-500">*</span>
                  </label>

                  {/* 1. 우편번호 & 주소검색 버튼 */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={orderForm.zonecode}
                      onClick={handleOpenPostcode}
                      placeholder="우편번호 5자리"
                      className="w-36 px-3 py-2 border border-gray-300 bg-gray-50 text-xs font-mono font-bold text-gray-800 cursor-pointer focus:border-[#144A42] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleOpenPostcode}
                      className="px-4 py-2 bg-[#144A42] hover:bg-[#0D3832] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                    >
                      <SearchIcon className="w-3.5 h-3.5" />
                      <span>우편번호 검색</span>
                    </button>
                  </div>

                  {/* 2. 도로명 기본 주소 */}
                  <div>
                    <input
                      type="text"
                      readOnly
                      value={orderForm.address}
                      onClick={handleOpenPostcode}
                      placeholder="우편번호 검색 버튼을 눌러 도로명 주소를 선택하세요"
                      className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-xs text-gray-900 cursor-pointer focus:border-[#144A42] focus:outline-none"
                      required
                    />
                  </div>

                  {/* 3. 건물명 / 참고항목 / 지번 표시 */}
                  {(orderForm.extraAddress || orderForm.jibunAddress) && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF8F5] border border-[#EAE3D4] text-[11px] text-gray-600">
                      <span className="font-semibold text-[#144A42] shrink-0">[참고/지번]</span>
                      <span className="truncate">
                        {orderForm.extraAddress && (
                          <span className="font-medium mr-1.5 text-gray-700">
                            {orderForm.extraAddress}
                          </span>
                        )}
                        {orderForm.jibunAddress && (
                          <span className="text-gray-400">지번: {orderForm.jibunAddress}</span>
                        )}
                      </span>
                    </div>
                  )}

                  {/* 4. 상세 주소 */}
                  <div>
                    <input
                      type="text"
                      value={orderForm.detailAddress}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, detailAddress: e.target.value })
                      }
                      placeholder="상세 주소를 입력해 주세요 (예: 101동 502호, 단독주택 등)"
                      className="w-full px-3 py-2 border border-gray-300 text-xs focus:border-[#144A42] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    배송 요청사항
                  </label>
                  <input
                    type="text"
                    value={orderForm.deliveryMemo}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, deliveryMemo: e.target.value })
                    }
                    placeholder="배송 기사님께 전달할 메시지 (예: 문 앞에 놔주세요)"
                    className="w-full px-3 py-2 border border-gray-300 text-xs focus:border-[#144A42] focus:outline-none"
                  />
                </div>

                {/* 무통장 입금 안내 카드 */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-gray-700">결제 방식</label>
                    <span className="text-[10px] bg-[#EAF5F2] text-[#144A42] font-bold px-2 py-0.5">
                      무통장 입금 전용
                    </span>
                  </div>

                  <div className="p-4 bg-[#FAF9F5] border border-[#DDD5C7] rounded-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-4 border-[#144A42] bg-white flex-shrink-0" />
                        <span className="font-bold text-xs text-[#144A42]">
                          무통장 입금 (계좌이체)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="px-2.5 py-1 bg-white border border-[#DDD5C7] hover:bg-gray-50 text-[11px] font-bold text-gray-700 flex items-center gap-1 transition shadow-2xs cursor-pointer"
                      >
                        {copiedBank ? (
                          <>
                            <CheckIcon className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">복사 완료!</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-3.5 h-3.5 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            <span>계좌 복사</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-white p-3 border border-gray-200 text-xs space-y-1.5 font-sans">
                      <div className="flex justify-between items-center text-gray-600">
                        <span>입금 은행</span>
                        <strong className="text-gray-900">{bankInfoData.bankName}</strong>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>입금 계좌번호</span>
                        <strong className="text-sm sm:text-base font-mono font-extrabold text-[#144A42]">
                          {bankInfoData.accountNumber}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>예금주</span>
                        <strong className="text-gray-900">{bankInfoData.accountHolder}</strong>
                      </div>
                      <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
                        <span>입금 예정 금액</span>
                        <strong className="text-base font-extrabold text-[#E11D48]">
                          {(selectedProduct.salePrice * quantity).toLocaleString()}원
                        </strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#63726C] leading-relaxed">
                      • {bankInfoData.depositNotice}
                      <br />• 주문자 성함과 입금자명이 다를 경우 &apos;배송 요청사항&apos;란에
                      입금자명을 기재해 주세요.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#144A42] hover:bg-[#0D3832] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <CheckIcon className="w-4 h-4 text-[#C5A880]" />
                  <span>
                    총 {(selectedProduct.salePrice * quantity).toLocaleString()}원 회원특가 주문
                    접수
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Order Completed */}
          {orderStep === 'success' && lastOrder && (
            <div className="max-w-md mx-auto py-8 text-center space-y-5 bg-white p-6 sm:p-8 border border-[#E8E1D3] shadow-md">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckIcon className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#142C27]">
                  회원 특가 주문 접수 완료!
                </h3>
                <p className="text-xs text-gray-500">
                  주문이 정상적으로 접수되었습니다. 아래 계좌로 입금해 주시면 확인 즉시 출고됩니다.
                </p>
              </div>

              {/* 무통장 입금 계좌 안내 카드 */}
              <div className="bg-[#FAF9F5] p-4 sm:p-5 border-2 border-[#144A42]/30 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="font-bold text-xs text-[#144A42] flex items-center gap-1.5">
                    <span>💳 입금하실 무통장 계좌</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="px-2.5 py-1 bg-[#144A42] hover:bg-[#0D3832] text-white text-[11px] font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
                  >
                    {copiedBank ? (
                      <>
                        <CheckIcon className="w-3 h-3 text-[#C5A880]" />
                        <span>복사 완료!</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-3 h-3 text-[#C5A880]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span>계좌 복사</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-white p-3.5 border border-gray-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>은행명</span>
                    <strong className="text-gray-900">{bankInfoData.bankName}</strong>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>계좌번호</span>
                    <strong className="text-base font-mono font-black text-[#144A42]">
                      {bankInfoData.accountNumber}
                    </strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>예금주</span>
                    <strong className="text-gray-900">{bankInfoData.accountHolder}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100 items-baseline">
                    <span className="font-bold text-gray-700">입금하실 금액</span>
                    <strong className="text-lg font-black text-[#E11D48]">
                      {lastOrder.totalAmount.toLocaleString()}원
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-[#63726C] leading-relaxed">
                  • 입금 확인 시 {activePartner.name} 공식 물류센터에서 안전하게 당일/익일 택배
                  출고됩니다.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="bg-[#FAF8F5] p-4 text-left border border-gray-200 text-xs space-y-2">
                <div className="flex justify-between pb-1.5 border-b border-gray-200">
                  <span className="text-gray-500">주문번호</span>
                  <strong className="text-[#144A42] font-mono">{lastOrder.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">주문상품</span>
                  <span className="font-bold text-gray-800">
                    {lastOrder.productName} ({lastOrder.option})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">수량 / 결제금액</span>
                  <span className="font-bold text-[#E11D48]">
                    {lastOrder.quantity}개 / {lastOrder.totalAmount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-gray-200">
                  <span className="text-gray-500">배송지</span>
                  <span className="text-gray-700 text-right max-w-[200px] truncate">
                    {lastOrder.address}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOrderStep('browse');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-3 bg-[#144A42] hover:bg-[#0D3832] text-white font-bold text-xs transition cursor-pointer"
                >
                  다른 상품 둘러보기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daum Postcode Search Modal Layer */}
      {isPostcodeModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg shadow-2xl border border-gray-300 overflow-hidden flex flex-col h-[520px] max-h-[85vh]">
            <div className="p-3.5 bg-[#144A42] text-white flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm">배송지 주소 우편번호 검색</span>
              <button
                type="button"
                onClick={() => setIsPostcodeModalOpen(false)}
                className="p-1 hover:bg-white/15 rounded-full transition"
              >
                <XIcon className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1 w-full bg-white relative">
              <div ref={postcodeContainerRef} className="w-full h-full" />
            </div>
            <div className="p-2.5 bg-gray-100 border-t border-gray-200 text-center">
              <button
                type="button"
                onClick={() => setIsPostcodeModalOpen(false)}
                className="px-5 py-1.5 bg-white border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
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
